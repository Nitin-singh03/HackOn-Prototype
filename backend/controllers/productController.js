// backend/controllers/productController.js

import asyncHandler from 'express-async-handler';
import Product from '../Models/Product.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Utility to load JSON file (materials.json, certifications.json)
async function loadJSON(filename) {
  const filePath = path.join(__dirname, '..', filename);
  const content  = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

// Compute Eco metrics with clamping to ensure minimum 0 (and clamp maxima where appropriate)
function computeEco(comp, recycledRatio, transportDist, packWeight, certNames, certList) {
  // comp: [ { name, footprint, ratio: Number } ]
  // recycledRatio: Number (expected >= 0)
  // transportDist: Number (expected >= 0)
  // packWeight: Number (expected >= 0)
  // certNames: [String]
  // certList: [ { name: String, points: Number } ]

  // 1. Material score
  // Sum of ratios (should be validated earlier to sum ~1). Use fallback 1 to avoid division by zero.
  const totalRatio = comp.reduce((s, c) => s + c.ratio, 0) || 1;
  let matScore = 0;
  comp.forEach(({ name, footprint, ratio }) => {
    // Clamp footprint to [0,1]
    const fp = typeof footprint === 'number' ? Math.min(Math.max(footprint, 0), 1) : 0;
    // Clamp recycledRatio to [0,1]
    const rr = typeof recycledRatio === 'number' ? Math.min(Math.max(recycledRatio, 0), 1) : 0;

    // Base formula for material component score; adjust weights/formula as needed
    let scoreComp = 0.6 * (1 - fp) + 0.4 * rr;
    // Clamp to [0,1]
    scoreComp = Math.min(Math.max(scoreComp, 0), 1);
    // Weighted by ratio fraction
    matScore += scoreComp * (ratio / totalRatio);
  });
  // Clamp matScore to [0,1]
  matScore = Math.min(Math.max(matScore, 0), 1);

  // 2. Manufacturing score (example constant formula; clamp to [0,1])
  // Original example: 1 - ((100 * 0.5) / 200) => 1 - 0.25 = 0.75
  let manufScore = 1 - ((100 * 0.5) / 200);
  manufScore = Math.min(Math.max(manufScore, 0), 1);

  // 3. Transportation score: 1 - ((transportDist * 0.1) / 10), clamp >= 0
  let transScore = 1 - ((transportDist * 0.1) / 10);
  transScore = Math.max(transScore, 0);
  // Optionally clamp at 1 if desired:
  // transScore = Math.min(Math.max(transScore, 0), 1);

  // 4. Packaging score: 1 - ((packWeight * 2) / 1), clamp >= 0
  let pkgScore = 1 - ((packWeight * 2) / 1);
  pkgScore = Math.max(pkgScore, 0);
  // Optionally clamp at 1:
  // pkgScore = Math.min(Math.max(pkgScore, 0), 1);

  // 5. Certification bonus: sum raw points, then bonusScore = certBonus/10, clamp >= 0
  const certBonus = certNames
    .map(n => {
      const certObj = certList.find(c => c.name === n);
      return certObj && typeof certObj.points === 'number' ? certObj.points : 0;
    })
    .reduce((s, p) => s + p, 0);
  let bonusScore = certBonus / 10;
  bonusScore = Math.max(bonusScore, 0);
  // Optionally cap at 1:
  // bonusScore = Math.min(bonusScore, 1);

  // 6. Base score: weighted sum of sub-scores; since each sub-score >=0, baseScore >=0
  let baseScore = 0.3 * matScore
                + 0.25 * manufScore
                + 0.2 * transScore
                + 0.15 * pkgScore
                + 0.1 * bonusScore;
  baseScore = Math.max(baseScore, 0);
  // Optionally clamp at 1:
  // baseScore = Math.min(baseScore, 1);

  // 7. ecoScore: scale baseScore to [0,100]. Here we omit adding raw certBonus to avoid exceeding 100.
  let ecoScore = baseScore * 100;
  ecoScore = Math.max(ecoScore, 0);
  ecoScore = Math.min(ecoScore, 100);

  // 8. ecoGrade based on ecoScore
  let ecoGrade;
  if (ecoScore >= 90) ecoGrade = 'A+';
  else if (ecoScore >= 75) ecoGrade = 'A';
  else if (ecoScore >= 60) ecoGrade = 'B';
  else if (ecoScore >= 40) ecoGrade = 'C';
  else ecoGrade = 'D';

  return {
    matScore,
    manufScore,
    transScore,
    pkgScore,
    bonusScore,
    baseScore,
    certBonus,
    ecoScore,
    ecoGrade
  };
}

// POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  console.log('createProduct called. req.body:', req.body);

  const {
    name,
    description,
    image,
    price,
    countInStock,
    category,
    brand,
    materialComposition,    // expected: [ { name, ratio } ]
    recycledContentRatio,
    transportDistance,
    packagingWeight,
    certifications         // expected: [ 'ISO 14001', … ]
  } = req.body;

  // 1. Basic validation: name
  if (!name || name.trim() === '') {
    res.status(400);
    throw new Error('Product name is required');
  }

  // 2. Parse & validate numeric fields: price, countInStock
  const parsedPrice = parseFloat(price);
  const parsedCount = parseInt(countInStock, 10);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    res.status(400);
    throw new Error('Price must be a non-negative number');
  }
  if (isNaN(parsedCount) || parsedCount < 0) {
    res.status(400);
    throw new Error('countInStock must be a non-negative integer');
  }

  // 3. Validate materialComposition array
  if (!Array.isArray(materialComposition) || materialComposition.length === 0) {
    res.status(400);
    throw new Error('Material composition must be a non-empty array');
  }
  // Parse ratios and names
  const parsedComp = materialComposition.map((entry, idx) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`Material composition entry at index ${idx} is invalid`);
    }
    const { name: matName, ratio } = entry;
    if (!matName || matName.trim() === '') {
      throw new Error(`Material composition entry at index ${idx} missing material name`);
    }
    const parsedRatio = parseFloat(ratio);
    if (isNaN(parsedRatio) || parsedRatio < 0) {
      throw new Error(`Material composition ratio for "${matName}" must be a non-negative number`);
    }
    return { name: matName, ratio: parsedRatio };
  });
  // Validate sum = 1
  const totalRatio = parsedComp.reduce((sum, c) => sum + c.ratio, 0);
  if (Math.abs(totalRatio - 1) > 1e-6) {
    res.status(400);
    throw new Error(`Total material composition ratios must sum to 1. Got sum = ${totalRatio}`);
  }

  // 4. Parse other numeric inputs: recycledContentRatio, transportDistance, packagingWeight
  const parsedRecycled = parseFloat(recycledContentRatio);
  const parsedTransport = parseFloat(transportDistance);
  const parsedPackaging = parseFloat(packagingWeight);
  if (isNaN(parsedRecycled) || parsedRecycled < 0) {
    res.status(400);
    throw new Error('recycledContentRatio must be a non-negative number');
  }
  if (isNaN(parsedTransport) || parsedTransport < 0) {
    res.status(400);
    throw new Error('transportDistance must be a non-negative number');
  }
  if (isNaN(parsedPackaging) || parsedPackaging < 0) {
    res.status(400);
    throw new Error('packagingWeight must be a non-negative number');
  }

  // 5. Certifications: ensure array
  const certNames = Array.isArray(certifications) ? certifications : [];

  // 6. Load JSON option lists
  let materialsList, certificationsList;
  try {
    materialsList      = await loadJSON('materials.json');
    certificationsList = await loadJSON('certifications.json');
  } catch (err) {
    console.error('Error loading JSON files:', err);
    res.status(500);
    throw new Error('Server error loading option lists');
  }

  // 7. Enrich material entries: find footprint from materialsList
  const enrichedComp = parsedComp.map(({ name: matName, ratio: matRatio }) => {
    const mat = materialsList.find(m => m.name === matName);
    const footprint = (mat && typeof mat.footprint === 'number') ? mat.footprint : 0;
    return { name: matName, footprint, ratio: matRatio };
  });

  // 8. Compute eco subdocument
  let eco;
  try {
    eco = computeEco(
      enrichedComp,
      parsedRecycled,
      parsedTransport,
      parsedPackaging,
      certNames,
      certificationsList
    );
  } catch (err) {
    console.error('Error computing eco metrics:', err);
    res.status(500);
    throw new Error('Server error computing eco metrics');
  }

  // 9. Build product data object
  const productData = {
    name: name.trim(),
    description: description || '',
    image: image || '',
    price: parsedPrice,
    countInStock: parsedCount,
    category: category || '',
    brand: brand || '',
    materialComposition: enrichedComp,
    recycledContentRatio: parsedRecycled,
    transportDistance: parsedTransport,
    packagingWeight: parsedPackaging,
    certifications: certNames,
    eco
  };

  console.log('Creating Product with data:', productData);

  // 10. Save to MongoDB
  const created = await Product.create(productData);
  console.log('Product saved:', created._id);

  res.status(201).json(created);
});

export const getProducts = asyncHandler(async (req, res) => {
  // You can implement pagination/filtering here if desired.
  // For a simple “get all”, do:
  const products = await Product.find({});
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export const getProductsList = asyncHandler(async (req, res) => {
  const { keyword } = req.query

  // build a case‑insensitive OR query on three fields
  const filter = keyword
    ? {
        $or: [
          { name:        { $regex: keyword, $options: 'i' } },
          { category:    { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      }
    : {}

  const products = await Product.find(filter)
  res.json(products)
})
