import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import circleImage from "../assets/img/more/circle.png";
import bgImage from "../assets/img/background/page-header-bg-8.jpg";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");

    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("All fields are required!", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Login API call
      const response = await axios.post(`${BACKEND_URL}/api/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, userId } = response.data; // Get userId

      // Step 2: Store token and userId
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Step 3: Fetch full name using userId
      const userResponse = await axios.get(`${BACKEND_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Username", userResponse);

      const fullName = userResponse.data.fullName; // Extract fullName

      // Step 4: Store full name in localStorage
      localStorage.setItem("fullName", fullName);

      toast.success("Login Successful! Redirecting...", { position: "top-center", autoClose: 2000 });

      setTimeout(() => {
        navigate("/"); // Redirect to home
        window.scrollTo(0, 0);
      }, 2000);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong. Try again!", { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) return <p>Loading...</p>;

  return (
    <div className="wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="wptb-page-heading">
               <div
                 className="wptb-item--inner"
                 style={{ backgroundImage: `url(${bgImage})` }}
               >
                 <div className="wptb-item-layer wptb-item-layer-one">
                   <img src={circleImage} alt="Circle decoration" />
                 </div>
                 <h2 className="wptb-item--title">Login</h2>
               </div>
             </div>

      <section>
        <div className="container">
          <div className="wptb-login-form">
            <div className="wptb-form--wrapper">
              <div className="row">
                <div className="col-lg-6 col-md-10 offset-lg-3 offset-md-1">
                  <div className="wptb-heading text-center">
                    <h1 className="wptb-item--title">Log In</h1>
                    <p className="wptb-item--description">We value your presence</p>
                  </div>

                  <form className="wptb-form" onSubmit={handleSubmit}>
                    <div className="wptb-form--inner">
                      <div className="row">
                        {/* Email Field */}
                        <div className="col-lg-12 mb-4">
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="E-mail Address*"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        {/* Password Field */}
                        <div className="col-lg-12 col-md-12 mb-4" style={{ position: "relative" }}>
                          <input type={showPassword ? "text" : "password"} name="password" className="form-control" placeholder="Password" required value={formData.password} onChange={handleChange} style={{ paddingRight: "40px" }} />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: "absolute",
                              right: "16px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "30px",
                              height: "30px",
                            }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>

                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="col-lg-12 d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              id="remember"
                              className="form-check-input"
                              style={{ width: "10px", height: "10px", accentColor: "#ff4f8b" }}
                            />
                            <label
                              htmlFor="remember"
                              className="mb-0 ms-2 fw-bold"
                            >
                              Remember Password
                            </label>
                          </div>
                          <Link to={`/forgotPassword`} className="text-white fw-bold">
                            Forgot Password?
                          </Link>
                        </div>

                        {/* Submit Button */}
                        <div className="col-lg-12 text-center mt-4">
                          <button className="btn white-opacity creative" type="submit" disabled={isSubmitting}>
                            <span className="btn-wrap">
                              <span className="text-first">{isSubmitting ? "Logging In..." : "LOG IN"}</span>
                            </span>
                          </button>
                        </div>

                        <div className="mt-3 text-center text-white">
                          <p style={{ color: "white" }}>
                           Don't have an account? <Link to = {`/register`} style={{ color: "yellow", fontWeight: "bold" }}>Register</Link>
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
      </section>
    </div>

  );
};

export default Login;