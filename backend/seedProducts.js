// backend/seedProducts.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './Models/Product.js';
import products_sample from "./products_sample.json" with { type: "json" };


dotenv.config();

const sampleProducts = products_sample;

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 5s
      retryWrites: true,
      w: 'majority'
    });
    console.log('🔌 Connected to MongoDB');

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} products`);
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();