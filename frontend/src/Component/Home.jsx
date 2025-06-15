// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/Home.css";
import Product from "./Product";
import ImageSlider from "./Imageslider"; // keep your existing slider component
// import Productbutton/Productbutton1 if still needed elsewhere

// Utility: chunk array into subarrays of given size
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  // Chunk into rows of 3 items
  const rows = chunkArray(products, 3);

  return (
    <div className="home">
      <div className="home__container">
        {/* Keep the ImageSlider at top */}
        <ImageSlider />

        {loading ? (
          <div className="home__loading">Loading products...</div>
        ) : error ? (
          <div className="home__error text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="home__no-products">No products found.</div>
        ) : (
          rows.map((rowProducts, rowIndex) => (
            <div key={rowIndex} className="home__row">
              {rowProducts.map((product) => (
                <div key={product._id} className="home__product-card">
                  {/* Basic product display */}
                  <Product
                    id={product._id}
                    title={product.name}
                    price={product.price}
                    rating={product.rating ?? 0}
                    image={product.image}
                    badge_id={0}
                  />
                  {/* Detailed info */}
                  <div className="product-details p-2 bg-white border rounded mt-2">
                    {product.description && (
                      <p className="text-sm mb-1">
                        <strong>Description:</strong> {product.description}
                      </p>
                    )}
                    <p className="text-sm mb-1">
                      <strong>Category:</strong> {product.category || "-"}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Brand:</strong> {product.brand || "-"}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>In Stock:</strong> {product.countInStock}
                    </p>
                    {Array.isArray(product.materialComposition) &&
                      product.materialComposition.length > 0 && (
                        <div className="text-sm mb-1">
                          <strong>Material Composition:</strong>
                          <ul className="list-disc list-inside">
                            {product.materialComposition.map((mc, idx) => (
                              <li key={idx}>
                                {mc.name}: {mc.ratio}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {product.eco && (
                      <div className="text-sm mb-1">
                        <strong>Eco Score:</strong> {product.eco.ecoScore} (
                        Grade: {product.eco.ecoGrade})
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Material Score: {product.eco.matScore}</li>
                          <li>Manufacturing Score: {product.eco.manufScore}</li>
                          <li>Transport Score: {product.eco.transScore}</li>
                          <li>Packaging Score: {product.eco.pkgScore}</li>
                          <li>Bonus Score: {product.eco.bonusScore}</li>
                          <li>Base Score: {product.eco.baseScore}</li>
                          <li>Cert Bonus (raw): {product.eco.certBonus}</li>
                        </ul>
                      </div>
                    )}
                    <p className="text-sm mb-1">
                      <strong>Recycled Content Ratio:</strong>{" "}
                      {product.recycledContentRatio}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Transport Distance:</strong>{" "}
                      {product.transportDistance}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Packaging Weight:</strong> {product.packagingWeight}
                    </p>
                    {Array.isArray(product.certifications) &&
                      product.certifications.length > 0 && (
                        <div className="text-sm mb-1">
                          <strong>Certifications:</strong>{" "}
                          {product.certifications.join(", ")}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
