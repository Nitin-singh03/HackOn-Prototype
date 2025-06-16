import express from 'express';
import { createProduct, getProducts, getProductById } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', createProduct);
router.get('/', getProducts);
router.get("/:id", getProductById);

export default router;
