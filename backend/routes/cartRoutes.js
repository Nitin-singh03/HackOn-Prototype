import express from "express";
import { addCartItem, getCart } from "../controllers/cartController.js";

const router = express.Router();

// Add or update an item
router.post("/", addCartItem);

// Fetch the cart
router.get("/", getCart);

export default router;
