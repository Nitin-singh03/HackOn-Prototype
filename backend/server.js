import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';
import userRoutes    from './routes/userRoutes.js';
import optionRoutes  from './routes/optionRoutes.js';
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/options', optionRoutes);
app.use("/api/cart", cartRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`))
  )
  .catch(err => console.error(err));
