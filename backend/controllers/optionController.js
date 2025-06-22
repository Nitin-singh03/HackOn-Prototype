import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

async function loadJSON(filename) {
  const filePath = path.join(__dirname, '..', filename);
  const content  = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

export const getMaterials = async (req, res) => {
  const materials = await loadJSON('materials.json');
  res.json(materials);
};

export const getCertifications = async (req, res) => {
  const certs = await loadJSON('certifications.json');
  res.json(certs.map(c => c.name));
};
