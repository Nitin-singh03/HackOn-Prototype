import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
}, { _id: false });

const CartSchema = new Schema({
  items: {
    type: [CartItemSchema],
    default: []
  }
}, {
  timestamps: true
});

export default model('Cart', CartSchema);
