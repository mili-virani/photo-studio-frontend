import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import bgImage from "../assets/img/background/page-header-bg-10.jpg";
import circleImage from "../assets/img/more/circle.png";
import Navbar from "./Navbar";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required!", { position: "top-center" });
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number!", {
        position: "top-center",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Registration Successful! Redirecting...", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(
        "Registration Error:",
        error.response?.data || error.message
      );
      toast.error("Something went wrong. Try again!", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <Toaster />
      <main className="wrapper">
        {/* Background Header Section */}
        <div className="wptb-page-heading">
          <div
            className="wptb-item--inner"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="wptb-item-layer wptb-item-layer-one">
              <img src={circleImage} alt="Circle decoration" />
            </div>
            <h2 className="wptb-item--title">Register</h2>
          </div>
        </div>

        {/* Registration Form Section */}
        <section>
          <div className="container">
            <div className="wptb-login-form">
              <div className="wptb-form--wrapper">
                <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-8">
                    <div className="wptb-heading text-center">
                      <h1 className="wptb-item--title">Sign Up</h1>
                      <p className="wptb-item--description">
                        Join us for an amazing experience
                      </p>
                    </div>

                    {/* Form Card */}
                    <div className="form-card p-4">
                      <form className="wptb-form" onSubmit={handleSubmit}>
                        <div className="wptb-form--inner">
                          <div className="row">
                            <div className="col-lg-12 mb-3">
                              <input
                                type="text"
                                name="username"
                                className="form-control"
                                placeholder="Username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-lg-12 mb-3">
                              <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="E-mail Address"
                                required
                                value={formData.email}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-lg-12 mb-3">
                              <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                placeholder="Phone Number"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength="10"
                              />
                            </div>
                            <div className="col-lg-12 mb-3 position-relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                style={{ paddingRight: "40px" }} // Space for eye icon
                              />
                              <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                  color: "#aaa",
                                  fontSize: "18px",
                                }}
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </span>
                            </div>

                            <div className="col-lg-12 mb-3 position-relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Confirm Password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{ paddingRight: "40px" }} // Space for eye icon
                              />
                              <span
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                  color: "#aaa",
                                  fontSize: "18px",
                                }}
                              >
                                {showConfirmPassword ? (
                                  <FaEyeSlash />
                                ) : (
                                  <FaEye />
                                )}
                              </span>
                            </div>

                            <div className="col-lg-12 text-center mt-3">
                            <button className="btn white-opacity creative" type="submit" style={{marginTop:"5px"}}>
                              <span className="btn-wrap">
                                <span className="text-first">Register</span>
                              </span>
                            </button>
                          </div>
                          <div className="mt-4 text-center" >
                            <p style={{color: "white"}}>
                              Already have an account? <Link to={`${BACKEND_URL}/login`} style={{ color: "yellow", fontWeight: "bold" }}>Log in here</Link>
                            </p>
                          </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
