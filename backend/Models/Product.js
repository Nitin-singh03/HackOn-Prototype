import mongoose from 'mongoose';

const compositionSchema = new mongoose.Schema({
  name:      { type: String, required: true },             
  footprint: { type: Number, required: true, min: 0, max: 1 }, 
  ratio:     { type: Number, required: true, min: 0, max: 1 },  
  isRecycled: { type: Boolean, default: false },            
  isBiodegradable: { type: Boolean, default: false }        
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true, min: 0, max: 1 }
}, { _id: false });

const ecoSchema = new mongoose.Schema({
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

const productSchema = new mongoose.Schema({
  name:                 { type: String, required: true },
  description:          { type: String, default: '' },
  image:                { type: String, required: true },
  price:                { type: Number, required: true, min: 0 },
  countInStock:         { type: Number, required: true, min: 0 },
  category:             { type: String, required: true },
  brand:                { type: String },
  rating:               { type: Number, min: 0, max: 5, default: 0 }, 
  materialComposition:  { type: [compositionSchema], required: true },
  recycledContentRatio: { type: Number, required: true, min: 0, max: 1 },
  transportDistance:    { type: Number, default: 100 },       
  packagingWeight:      { type: Number, default: 0.5 },       
  bonusFeaturesScore:   { type: Number, default: 0, min: 0, max: 1 },
  certifications:       { type: [certificationSchema], default: [] }, 

  image_url:            { type: String, required: true }, 
  manufacturer_sustainability: { type: Number, min: 0, max: 100, default: 50 },
  transportation_impact: { type: Number, min: 0, max: 1, default: 0.5 },
  packaging_score:      { type: Number, min: 0, max: 100, default: 50 },
  materials:            { type: String, required: true }, 
  biodegradability:     { type: Boolean, default: false },
  
  sustainability_score: { type: Number, required: true, min: 0, max: 100 },
  carbon_emission_kg: { type: Number, required: true, min: 0 },
  water_usage_liters: { type: Number, required: true, min: 0 },
  recyclability_percentage: { type: Number, required: true, min: 0, max: 100 },
  product_lifespan_days: { type: Number, required: true, min: 1 },
  repairability_score: { type: Number, required: true, min: 0, max: 100 },
  is_green_alternative: { type: Boolean, required: true, default: false },

  eco:                  { type: ecoSchema, required: true },
  
  searchKeywords:       { type: [String], default: [] }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('materialList').get(function() {
  return this.materials.split(',').map(m => m.trim());
});

productSchema.index({ name: 'text', description: 'text', searchKeywords: 'text' });
productSchema.index({ category: 1, is_green_alternative: 1 });
productSchema.index({ 'eco.ecoScore': -1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

productSchema.pre('save', function(next) {
  if (this.isModified('materialComposition')) {
    this.materials = this.materialComposition.map(c => c.name).join(', ');
  }
  
  if (this.isModified('materialComposition')) {
    this.biodegradability = this.materialComposition.every(c => c.isBiodegradable);
  }
  
  next();
});

export default mongoose.model('Product', productSchema);