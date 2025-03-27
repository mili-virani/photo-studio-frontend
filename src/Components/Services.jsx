import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Portfolio from "../assets/img/services/portfolio.png";
import Maternity from "../assets/img/services/ma.jpg";
import Cakesmash from "../assets/img/services/cakesmash.png";
import Newborn from "../assets/img/services/newborn.jpg";
import Prewedding from "../assets/img/services/prewedding.png";
import Family from "../assets/img/services/family.jpeg";
import Babygirl from "../assets/img/services/babygirl.jpeg";
import Wedding from "../assets/img/services/wedding.avif";

import "../assets/css/header.css";
import "../assets/css/global.css";
import "../assets/css/components.css";
import Navbar from "./Navbar";

import headerBg from "../assets/img/background/page-header-bg-6.jpg";
import circleImg from "../assets/img/more/circle.png";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Services = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to access this page. Please log in first.", {
        position: "top-center",
        duration: 3000,
      });
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/category`);
        console.log("API Response:", response.data);

        const categoryData = response.data?.data || response.data || [];

        if (!Array.isArray(categoryData)) {
          console.error("Invalid category data format:", categoryData);
          throw new Error("Invalid category data format");
        }

        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
        setCategories([]);
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleCategoryClick = (categoryId) => {
    console.log("Navigating with category:", categoryId);
    localStorage.setItem("categoryId", categoryId);
    navigate(`/pages?category=${categoryId}`);
  };

  // Hardcoded image mapping
  const imageMap = {
    "Personal portfolio shoot": Portfolio,
    "Maternity": Maternity ,
    "Toddler cake smash": Cakesmash,
    "New born baby": Newborn,
    "Pre-wedding": Prewedding,
    "Family": Family,
    "Toddler baby girl": Babygirl,
    "Wedding": Wedding,
  };

  return (
    <main className="wrapper">
      <Navbar />
      <Toaster />

      {/* Page Header */}
      <div className="wptb-page-heading">
        <div className="wptb-item--inner" style={{ backgroundImage: `url(${headerBg})` }}>
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src={circleImg} alt="Circle Design" />
          </div>
          <h2 className="wptb-item--title">Our Services</h2>
        </div>
      </div>

      {/* Our Services Section */}
      <section style={{ padding: "50px 0", backgroundColor: "#121212" }}>
        <div style={{ width: "85%", margin: "auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)", // 4 cards per row
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {categories.length > 0 ? (
              categories.map((category, index) => {
                const imageUrl = imageMap[category.name] // Default image fallback

                return (
                  <div
                    key={category._id || category.id || index}
                    onClick={() => handleCategoryClick(category._id || category.id)}
                    style={{
                      height: "300px",
                      backgroundColor: "#8dadb8",
                      borderRadius: "15px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, background-color 0.3s ease",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: "20px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5e7d88")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8dadb8")}
                  >
                    {/* Image for each category */}
                    <img
                      src={imageUrl}
                      alt={category.name || "Category Image"}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                        marginBottom: "10px",
                        borderRadius: "50%",
                        // backgroundColor: "white", // Adds contrast
                        padding: "5px",
                      }}
                    />
                    <h4 style={{ margin: 0 }}>{category.name || "Unnamed Category"}</h4>
                  </div>
                );
              })
            ) : (
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff", textAlign: "center" }}>
                No categories available.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
