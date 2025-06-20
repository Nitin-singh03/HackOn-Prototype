import axios from 'axios';

const API_URL = 'https://your-service-name.onrender.com';

export const getRecommendations = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/recommend`, {
      params: {
        product_id: productId,
        num_recommendations: 3
      }
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    
    // Mock data for development/demo purposes
    return {
      base_product: {
        product_id: productId,
        name: "Current Product",
        rating: 4.2,
        price: 29.99,
        green_score: 0.5,
        sustainability_score: 60,
        carbon_emission_kg: 2.5
      },
      alternatives: [
        {
          product_id: "eco456",
          name: "Eco-Friendly Bamboo Alternative",
          rating: 4.8,
          price: 34.99,
          green_score: 0.95,
          sustainability_score: 92,
          carbon_emission_kg: 0.3,
          image: "https://images.pexels.com/photos/4792489/pexels-photo-4792489.jpeg?auto=compress&cs=tinysrgb&w=300",
          savings: "85% less carbon footprint"
        },
        {
          product_id: "green789",
          name: "Recycled Materials Version",
          rating: 4.6,
          price: 31.50,
          green_score: 0.88,
          sustainability_score: 87,
          carbon_emission_kg: 0.8,
          image: "https://images.pexels.com/photos/4792489/pexels-photo-4792489.jpeg?auto=compress&cs=tinysrgb&w=300",
          savings: "68% less carbon footprint"
        },
        {
          product_id: "sustain101",
          name: "Organic Cotton Sustainable Option",
          rating: 4.7,
          price: 36.99,
          green_score: 0.91,
          sustainability_score: 89,
          carbon_emission_kg: 0.5,
          image: "https://images.pexels.com/photos/4792489/pexels-photo-4792489.jpeg?auto=compress&cs=tinysrgb&w=300",
          savings: "80% less carbon footprint"
        }
      ],
      gecko_coins_earned: 120
    };
  }
};