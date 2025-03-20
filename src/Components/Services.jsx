import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

import "../assets/css/header.css";
import "../assets/css/global.css";
import "../assets/css/components.css";
import Navbar from "./Navbar";

import headerBg from "../assets/img/background/page-header-bg-6.jpg";
import circleImg from "../assets/img/more/circle.png";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Services = () => {
  const [categories, setCategories] = useState([]); // Ensure state is an array
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
        console.log("API Response:", response.data); // Debugging API response

        // Extract correct array path (update if API format changes)
        const categoryData = response.data?.data || response.data || [];

        if (!Array.isArray(categoryData)) {
          console.error("Invalid category data format:", categoryData);
          throw new Error("Invalid category data format");
        }

        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
        setCategories([]); // Prevents undefined errors
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleCategoryClick = (categoryId) => {
    console.log("Navigating with category:", categoryId); // Debugging
    localStorage.setItem("categoryId", categoryId);
    navigate(`/pages?category=${categoryId}`);
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
      <section>
        <div className="container">
          <div className="wptb-service--inner">
            <div className="row">
              {/* Debugging: Show categories in console */}
              {console.log("Categories in state:", categories)}

              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <div
                    key={category._id || category.id || index} // Ensure unique key
                    className="col-lg-3 col-md-6 col-sm-6 ps-0 wow fadeInLeft"
                    onClick={() => handleCategoryClick(category._id || category.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="wptb-icon-box5 mb-3">
                      <div className="wptb-item--inner text-center">
                        <h4 className="wptb-item--title mb-0" style={{color:"white"}}>{category.name || "Unnamed Category"}</h4>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  No categories available.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
