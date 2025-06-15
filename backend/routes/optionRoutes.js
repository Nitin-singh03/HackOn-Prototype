import express from 'express';
import { getMaterials, getCertifications } from '../controllers/optionController.js';
const router = express.Router();
router.get('/materials', getMaterials);
router.get('/certifications', getCertifications);
export default router;
