import mongoose from 'mongoose';

// Composition embeds material name, footprint, and ratio directly
const compositionSchema = new mongoose.Schema({
  name:      { type: String, required: true },              // material name
  footprint: { type: Number, required: true, min: 0, max: 1 }, // environmental footprint
  ratio:     { type: Number, required: true, min: 0, max: 1 },  // proportion in product
  isRecycled: { type: Boolean, default: false },            // whether material is recycled
  isBiodegradable: { type: Boolean, default: false }        // whether material is biodegradable
}, { _id: false });

// Certification details schema
const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true, min: 0, max: 1 }
}, { _id: false });

// Eco metrics, computed in controller and stored
const ecoSchema = new mongoose.Schema({
  // Original fields
  matScore:   { type: Number, required: true, min: 0, max: 1 },
  manufScore: { type: Number, required: true, min: 0, max: 1 },
  transScore: { type: Number, required: true, min: 0, max: 1 },
  pkgScore:   { type: Number, required: true, min: 0, max: 1 },
  bonusScore: { type: Number, required: true, min: 0},
  baseScore:  { type: Number, required: true, min: 0, max: 1 },
  certBonus:  { type: Number, required: true, min: 0 },
  ecoScore:   { type: Number, required: true, min: 0, max: 100 },
  ecoGrade:   { type: String, required: true },

}, { _id: false });

// Main product schema
const productSchema = new mongoose.Schema({
  // Original fields
  name:                 { type: String, required: true },
  description:          { type: String, default: '' },
  image:                { type: String, required: true },
  price:                { type: Number, required: true, min: 0 },
  countInStock:         { type: Number, required: true, min: 0 },
  category:             { type: String, required: true },
  brand:                { type: String },
  rating:               { type: Number, min: 0, max: 5, default: 0 }, // Added for recommendations

  // Raw inputs - original
  materialComposition:  { type: [compositionSchema], required: true },
  recycledContentRatio: { type: Number, required: true, min: 0, max: 1 },
  transportDistance:    { type: Number, default: 100 },       // tkm
  packagingWeight:      { type: Number, default: 0.5 },       // kg
  bonusFeaturesScore:   { type: Number, default: 0, min: 0, max: 1 },
  certifications:       { type: [certificationSchema], default: [] }, // Enhanced with weights

  // New fields for recommendation system
  image_url:            { type: String, required: true }, // Alternative to image field
  manufacturer_sustainability: { type: Number, min: 0, max: 100, default: 50 },
  transportation_impact: { type: Number, min: 0, max: 1, default: 0.5 },
  packaging_score:      { type: Number, min: 0, max: 100, default: 50 },
  materials:            { type: String, required: true }, // Comma-separated string for easy processing
  biodegradability:     { type: Boolean, default: false },
  
  // New fields for recommendation system
  sustainability_score: { type: Number, required: true, min: 0, max: 100 },
  carbon_emission_kg: { type: Number, required: true, min: 0 },
  water_usage_liters: { type: Number, required: true, min: 0 },
  recyclability_percentage: { type: Number, required: true, min: 0, max: 100 },
  product_lifespan_days: { type: Number, required: true, min: 1 },
  repairability_score: { type: Number, required: true, min: 0, max: 100 },
  is_green_alternative: { type: Boolean, required: true, default: false },

  // Computed Eco fields
  eco:                  { type: ecoSchema, required: true },
  
  // Text search fields
  searchKeywords:       { type: [String], default: [] }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for simplified materials list
productSchema.virtual('materialList').get(function() {
  return this.materials.split(',').map(m => m.trim());
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', searchKeywords: 'text' });
productSchema.index({ category: 1, is_green_alternative: 1 });
productSchema.index({ 'eco.ecoScore': -1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

// Pre-save hook to ensure consistency
productSchema.pre('save', function(next) {
  // Ensure materials string matches composition
  if (this.isModified('materialComposition')) {
    this.materials = this.materialComposition.map(c => c.name).join(', ');
  }
  
  // Calculate simple biodegradability flag
  if (this.isModified('materialComposition')) {
    this.biodegradability = this.materialComposition.every(c => c.isBiodegradable);
  }
  
  next();
});

export default mongoose.model('Product', productSchema);