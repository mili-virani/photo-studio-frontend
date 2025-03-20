import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email) {
      toast.error("Email is required!", { position: "top-center" });
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/otp/send-otp`,
        { email }
      );
  
      toast.success("OTP sent successfully!", { position: "top-center" });
  
      // Store email and OTP token from response (Modify backend if needed)
      localStorage.setItem("userEmail", email);
      localStorage.setItem("otpToken", response.data.otpToken); // Assuming backend sends this
  
      setTimeout(() => {
        navigate(`/otp-verification`);
      }, 2000);
    } catch (error) {
      console.error("Error in forgot password:", error);
      toast.error("Something went wrong. Try again.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div>
      <Toaster />
      <main className="wrapper">
        <section>
          <div className="container">
            <div className="wptb-login-form">
              <div className="wptb-form--wrapper">
                <div className="row">
                  <div className="col-lg-6 col-md-10 offset-lg-3 offset-md-1">
                    <div className="wptb-heading">
                      <h1 className="wptb-item--title" style={{ textAlign: "center" }}>
                        Forgot Password
                      </h1>
                      <p className="wptb-item--description">
                        Please enter the email address you'd like your password reset information sent to.
                      </p>
                    </div>
                    <form className="wptb-form" onSubmit={handleSubmit}>
                      <div className="wptb-form--inner">
                        <div className="row">
                          <div className="col-lg-12 col-md-12 mb-4">
                            {/* <div className="form-group"> */}
                              <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            {/* </div> */}
                          </div>
                          <div className="col-lg-12 text-center">
                            <button className="btn white-opacity creative" type="submit" disabled={loading}>
                              <span className="btn-wrap">
                                <span className="text-first">{loading ? "Sending OTP..." : "Send OTP"}</span>
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
      </main>
    </div>
  );
};

export default ForgotPassword;

