import mongoose from 'mongoose';

const BoughtSchema = new mongoose.Schema({
  items: [
    {
      productId: { 
        type: String,      // or mongoose.Schema.Types.ObjectId if you’re referencing a Products collection
        required: true 
      },
      qty: { 
        type: Number, 
        required: true 
      },
      name: { 
        type: String, 
        required: true 
      },
      price: { 
        type: Number, 
        required: true 
      },
      image: { 
        type: String, 
        default: '' 
      }
    }
  ],
  coins: {
    totalGecko: { type: Number, default: 0 },
    totalCanopy: { type: Number, default: 0 }
  },
  cost: { 
    type: Number, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Bought', BoughtSchema);
