import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast"; // Import Toaster
import "../assets/css/components.css";
import "../assets/css/contact.css";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ResetPassword = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Both fields are required!", { position: "top-center" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long!", { position: "top-center" });
      return;
    }

    handlePasswordReset();
  };

  const handlePasswordReset = async () => {
    const storedEmail = localStorage.getItem("userEmail");
    console.log("storedEmail:",storedEmail);

    try {
      const payload = {
        email: storedEmail,
        newPassword: formData.password,
      };

      const response = await fetch(`${BACKEND_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successful! Redirecting to login...", { position: "top-center" });

        localStorage.removeItem("userEmail");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Something went wrong!", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error resetting password. Please try again.", { position: "top-center" });
    }
  };

  return (
    <div className="wrapper">
      <Toaster /> {/* Toaster component for showing notifications */}
      <div className="wptb-page-heading">
        <div className="wptb-item--inner">
          <h2 className="wptb-item--title">Reset Password</h2>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="wptb-login-form">
            <div className="wptb-form--wrapper">
              <div className="row">
                <div className="col-lg-6 col-md-10 offset-lg-3 offset-md-1">
                  <div className="wptb-heading text-center">
                    <h1 className="wptb-item--title">Reset Password</h1>
                  </div>
                  <form className="wptb-form" onSubmit={handleSubmit}>
                    <div className="wptb-form--inner">
                      <div className="row">
                        <div className="col-lg-12 mb-4">
                          <div className="input-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className="form-control"
                              placeholder="New Password*"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-12 mb-4">
                          <div className="input-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              className="form-control"
                              placeholder="Confirm Password*"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-12 text-center">
                          <button className="btn white-opacity creative" type="submit">
                            <span className="btn-wrap">
                              <span className="text-first">Reset Password</span>
                            </span>
                          </button>
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

export default ResetPassword;
