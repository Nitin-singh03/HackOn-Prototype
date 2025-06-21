import express from "express";
const router = express.Router();
import { createBoughtRecord, getFullBoughtList } from "../controllers/boughtController.js";


router.post('/', createBoughtRecord);
router.get("/full", getFullBoughtList);

export default router;
