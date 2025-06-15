import mongoose from 'mongoose';

// Composition embeds material name, footprint, and ratio directly
const compositionSchema = new mongoose.Schema({
  name:      { type: String, required: true },              // material name
  footprint: { type: Number, required: true, min: 0, max: 1 }, // environmental footprint
  ratio:     { type: Number, required: true, min: 0, max: 1 }  // proportion in product
}, { _id: false });

// Eco metrics, computed in controller and stored
const ecoSchema = new mongoose.Schema({
  matScore:   { type: Number, required: true, min: 0, max: 1 },
  manufScore: { type: Number, required: true, min: 0, max: 1 },
  transScore: { type: Number, required: true, min: 0, max: 1 },
  pkgScore:   { type: Number, required: true, min: 0, max: 1 },
  bonusScore: { type: Number, required: true, min: 0},
  baseScore:  { type: Number, required: true, min: 0, max: 1 },
  certBonus:  { type: Number, required: true, min: 0 },
  ecoScore:   { type: Number, required: true, min: 0, max: 100 },
  ecoGrade:   { type: String, required: true }
}, { _id: false });

// Main product schema
const productSchema = new mongoose.Schema({
  name:                 { type: String, required: true },
  description:          { type: String, default: '' },
  image:                { type: String, required: true },
  price:                { type: Number, required: true, min: 0 },
  countInStock:         { type: Number, required: true, min: 0 },
  category:             { type: String, required: true },
  brand:                { type: String },

  // Raw inputs
  materialComposition:  { type: [compositionSchema], required: true },
  recycledContentRatio: { type: Number, required: true, min: 0, max: 1 },
  transportDistance:    { type: Number, default: 100 },       // tkm
  packagingWeight:      { type: Number, default: 0.5 },       // kg
  bonusFeaturesScore:   { type: Number, default: 0, min: 0, max: 1 },
  certifications:       { type: [String], default: [] },      // list of certificate names

  // Computed Eco fields
  eco:                  { type: ecoSchema, required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
