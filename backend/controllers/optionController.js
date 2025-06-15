import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Helper to load JSON from project’s `backend/` folder
async function loadJSON(filename) {
  const filePath = path.join(__dirname, '..', filename);
  const content  = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

// GET /api/options/materials
export const getMaterials = async (req, res) => {
  const materials = await loadJSON('materials.json');
  res.json(materials);
};

// GET /api/options/certifications
export const getCertifications = async (req, res) => {
  const certs = await loadJSON('certifications.json');
  // Only return the names for dropdowns
  res.json(certs.map(c => c.name));
};
