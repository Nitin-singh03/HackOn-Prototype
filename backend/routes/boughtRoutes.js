import express from "express";
const router = express.Router();
import { createBoughtRecord } from "../controllers/boughtController.js";


// Protect route with authentication
router.post('/', createBoughtRecord);

export default router;
