import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';
import userRoutes    from './routes/userRoutes.js';
import optionRoutes  from './routes/optionRoutes.js';
import cartRoutes from "./routes/cartRoutes.js";
import boughtRoutes from "./routes/boughtRoutes.js";


dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const app = express();
app.use(cors({
  origin: '*',
  credentials: true
}));app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/options', optionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/bought", boughtRoutes);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // ⏳ 10 seconds
})  .then(() => app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`))
  )
  .catch(err => console.error(err));
