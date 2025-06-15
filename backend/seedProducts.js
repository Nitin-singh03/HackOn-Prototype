// backend/seedProducts.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './Models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Eco-Friendly Water Bottle",
    description: "A reusable water bottle made from 80% recycled stainless steel and 20% bamboo.",
    image: "https://thebamboobae.com/cdn/shop/products/IMG_5681.jpg?v=1675664424&width=1946",
    price: 25.99,
    countInStock: 100,
    category: "Kitchen",
    brand: "GreenHome",
    materialComposition: [
      { name: "Stainless Steel", footprint: 0.65, ratio: 0.8 },
      { name: "Bamboo",           footprint: 0.25, ratio: 0.2 }
    ],
    recycledContentRatio: 0.5,
    transportDistance: 200,
    packagingWeight: 0.3,
    bonusFeaturesScore: 0.2,
    certifications: ["ISO 14001", "Forest Stewardship Council"],
    eco: {
      matScore:   0.62,
      manufScore: 0.75,
      transScore: 0.80,
      pkgScore:   0.40,
      bonusScore: 0.20,
      baseScore:  0.59,
      certBonus:  9,
      ecoScore:   68.00,
      ecoGrade:   "B"
    }
  },
  {
    name: "Recycled Cotton T‑Shirt",
    description: "Soft T‑shirt made from 100% recycled cotton.",
    image: "https://ecolineclothing.com/cdn/shop/files/H-01_70d14d1d-db49-452a-a4d7-3d4e20854997_1024x.png?v=1735103429",
    price: 19.50,
    countInStock: 250,
    category: "Apparel",
    brand: "EcoWear",
    materialComposition: [
      { name: "Cotton", footprint: 0.35, ratio: 1.0 }
    ],
    recycledContentRatio: 1.0,
    transportDistance: 500,
    packagingWeight: 0.1,
    bonusFeaturesScore: 0.1,
    certifications: ["Fair Trade", "Oeko‑Tex"],
    eco: {
      matScore:   0.58,
      manufScore: 0.75,
      transScore: 0.50,
      pkgScore:   0.80,
      bonusScore: 0.10,
      baseScore:  0.62,
      certBonus:  4,
      ecoScore:   66.00,
      ecoGrade:   "B"
    }
  },
  {
    name: "Solar Powered Lantern",
    description: "Portable lantern powered by integrated solar panels and rechargeable battery.",
    image: "https://www.engineeringforchange.org/wp-content/uploads/2018/07/renewit_solar.jpg",
    price: 45.00,
    countInStock: 75,
    category: "Outdoors",
    brand: "SunLite",
    materialComposition: [
      { name: "Aluminum",      footprint: 0.70, ratio: 0.5 },
      { name: "Plastic (PET)", footprint: 0.90, ratio: 0.3 },
      { name: "Glass",         footprint: 0.40, ratio: 0.2 }
    ],
    recycledContentRatio: 0.3,
    transportDistance: 1000,
    packagingWeight: 0.8,
    bonusFeaturesScore: 0.3,
    certifications: ["Energy Star", "CarbonNeutral®"],
    eco: {
      matScore:   0.46,
      manufScore: 0.75,
      transScore: 0.00,
      pkgScore:   0.20,
      bonusScore: 0.30,
      baseScore:  0.39,
      certBonus:  6,
      ecoScore:   45.00,
      ecoGrade:   "C"
    }
  },
  {
    name: "Bamboo Cutting Board",
    description: "Durable cutting board made from sustainably harvested bamboo.",
    image: "https://www.ikea.com/in/en/images/products/aptitlig-chopping-board-bamboo__1196326_pe902926_s5.jpg",
    price: 29.99,
    countInStock: 150,
    category: "Kitchen",
    brand: "EcoChef",
    materialComposition: [
      { name: "Bamboo", footprint: 0.25, ratio: 1.0 }
    ],
    recycledContentRatio: 0.0,
    transportDistance: 300,
    packagingWeight: 0.2,
    bonusFeaturesScore: 0.0,
    certifications: ["Forest Stewardship Council", "Rainforest Alliance"],
    eco: {
      matScore:   0.25,
      manufScore: 0.75,
      transScore: 0.70,
      pkgScore:   0.60,
      bonusScore: 0.00,
      baseScore:  0.51,
      certBonus:  7,
      ecoScore:   58.00,
      ecoGrade:   "B"
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected to MongoDB');

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} products`);
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
