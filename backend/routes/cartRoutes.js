import express from "express";
import { addCartItem, getCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", addCartItem);

router.get("/", getCart);

export default router;
