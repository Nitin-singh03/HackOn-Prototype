import React from "react";
import "./App.css";

// Core components
import Header from "./Component/Header.jsx";
import Home from "./Component/Home.jsx";
import NavBar from "./Component/NavBar.jsx";
import Checkout from "./Component/Checkout.jsx";
import Login from "./Component/Login.jsx";

// Green theme components
import Headergreen from "./Component/Headergreen.jsx";
import Homegreen from "./Component/Homegreen.jsx";
import NavBarg from "./Component/NavBargreen.jsx";

// Pages & Sections
import EducationSection from "./Component/Educationsection.jsx";
import SustainabilityReportsSection from "./Component/Sustainability.jsx";
import SellerSection from "./Component/SellerSection.jsx";

// Utility & Feedback
import Footer from "./Component/Footer.jsx";
import Orders from "./Component/Orders.jsx";
import Thanks from "./Component/thanks.jsx";
import Submitted from "./Component/Submitted.jsx";
import Dashboard from "./Component/Dashboard.jsx";
import Feedback from "./Component/feedback.jsx";
import FSubmitted from "./Component/Feedbacksubmitted.jsx";
import BuyOptions from "./Component/BuyOptions.jsx";
import JoinGroup from "./Component/JoinGroup.jsx";
import CreateGroup from "./Component/CreateGroup.jsx";
import GroupPurchase from "./Component/CreateGroup.jsx";

import ProductDetails from "./Component/ProductDetails.jsx";
import ProductDetails1 from "./Component/ProductDetails1.jsx";
import ProductForm from "./pages/ProductForm.jsx";
import SearchResults from "./Component/SearchResults.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/feedbacksubmitted"
            element={
              <>
                <Headergreen />
                <NavBarg />
                <FSubmitted />
              </>
            }
          />
          <Route
            path="/productform"
            element={
              <ProductForm/>
            }
          />
          <Route
            path="/feedback"
            element={
              <>
                <Headergreen />
                <NavBarg />
                <Feedback />
                <Footer />
              </>
            }
          />
          <Route
            path="/group-purchase"
            element={
              <>
                <Headergreen />
                <NavBarg />
                <GroupPurchase />
                <Footer />
              </>
            }
          />
          <Route
            path="/join-group"
            element={
              <>
                <Headergreen />
                <NavBarg />
                < JoinGroup/>
                <Footer />
              </>
            }
          />
          
          <Route
            path="/create-group"
            element={
              <>
                <Headergreen />
                <NavBarg />
                <CreateGroup />
                <Footer />
              </>
            }
          />

          {/* Submission & Seller */}
          <Route
            path="/submitted"
            element={
              <>
                <Headergreen />
                <Submitted />
              </>
            }
          />
          <Route
            path="/seller"
            element={
              <>
                <Headergreen />
                <NavBarg />
                <SellerSection />
                <Footer />
              </>
            }
          />

          {/* Thank you & Orders */}
          <Route
            path="/thanks"
            element={
              <>
                <Header />
                <Thanks />
              </>
            }
          />
          <Route
            path="/orders"
            element={
              <>
                <Header />
                <Orders />
                <Footer />
              </>
            }
          />

          {/* Informational Sections */}
          <Route
            path="/sustainability"
            element={
              <>
                <Headergreen />
                <NavBarg />
                <SustainabilityReportsSection />
                <Footer />
              </>
            }
          />
          <Route
            path="/education"
            element={
              <>
                <Headergreen />
                <NavBarg />
                <EducationSection />
                <Footer />
              </>
            }
          />
          <Route
            path="/buyOptions"
            element={
              <>
                <Headergreen />
                <NavBarg />
                <BuyOptions />
                <Footer />
              </>
            }
          />
          <Route
            path="/green"
            element={
              <>
                <Header />
                <NavBarg />
                <Homegreen />
                <Footer />
              </>
            }
          />

          {/* Auth & Checkout */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/checkout"
            element={
              <>
                <Header />
                <Checkout />
                <Footer />
              </>
            }
          />

          {/* Main & Dashboard */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <NavBar />
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Header />
                <NavBarg />
                <Dashboard />
              </>
            }
          />

          {/* Product Details */}
          <Route
            path="/product/:id"
            element={
              <>
                <Header />
                <NavBarg />
                <ProductDetails />
                <Footer />
              </>
            }
          />

          <Route
            path="/search" 
            element={
              <>
                <Header />
                <NavBarg />
                <SearchResults />
                <Footer />
              </>
            } 
          />
          <Route
            path="/product1"
            element={
              <>
                <Headergreen />
                <NavBarg />
                <ProductDetails1 />
                <Footer />
              </>
            }
          />

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  404 - Page Not Found
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
