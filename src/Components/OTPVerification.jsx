import React, { useState, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);  // ✅ 5-digit OTP
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // ✅ Handle OTP input change
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {  // Only allow digits
      const newOtp = [...otp];
      newOtp[index] = value.trim();  // ✅ Trim spaces
      setOtp(newOtp);

      if (value && index < 4) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // ✅ Handle Backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!newOtp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // ✅ Updated Resend OTP API Call
  const handleResendOTP = async () => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      toast.error("Email not found! Please request OTP again.", { position: "top-center" });
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/otp/resend-otp`, {  // ✅ Updated URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("New OTP sent to your email!", { position: "top-center" });
      } else {
        toast.error(data.message || "Failed to resend OTP!", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Error sending OTP! Try again.", { position: "top-center" });
    }
  };

  // ✅ Updated OTP Verification API Call
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const email = localStorage.getItem("userEmail");

  //   if (!email) {
  //     toast.error("Email not found! Please request OTP again.");
  //     return;
  //   }

  //   const trimmedOtp = otp.map((digit) => digit.trim()).join("");

  //   if (trimmedOtp.length !== 5) {
  //     toast.error("Please enter a valid 5-digit OTP.");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await axios.post("${BACKEND_URL}/api/otp/verify-otp", {  // ✅ Updated URL
  //       email,
  //       otp: trimmedOtp,
  //     });

  //     if (response.data.success) {
  //       toast.success("OTP Verified! Redirecting...");
  //       const token = response.data.token; 
  //       console.log("token: ",token);

  //       setTimeout(() => {
  //         navigate(`/reset-password/${token}`);
  //       }, 2000);
  //     } else {
  //       toast.error("Invalid OTP. Try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error verifying OTP:", error.response?.data || error.message);
  //     toast.error(error.response?.data?.message || "OTP verification failed.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const email = localStorage.getItem("userEmail");

    if (!email) {
        toast.error("Email not found! Please request OTP again.", { position: "top-center" });
        return;
    }

    // Convert OTP array to string
    const trimmedOtp = otp.join("");

    if (trimmedOtp.length !== 5) {
        toast.error("Please enter a valid 5-digit OTP.", { position: "top-center" });
        return;
    }

    setLoading(true);

    try {
        const response = await axios.post(`${BACKEND_URL}/api/otp/verify-otp`, {
            email,
            otp: trimmedOtp  // Ensure OTP is sent as a string
        });

        toast.success("OTP verified successfully!", { position: "top-center" });

        // Store reset token received from backend
        localStorage.setItem("resetToken", response.data.resetToken);

        setTimeout(() => {
            navigate(`/reset-password`);
        }, 2000);
    } catch (error) {
        console.error("Error in OTP verification:", error);
        toast.error("Invalid OTP. Try again.", { position: "top-center" });
    } finally {
        setLoading(false);
    }
};



  return (
    <div>
      <Toaster />
      <main className="wrapper">
        <section>
          <div
            className="container"
            style={{
              maxWidth: "450px",
              margin: "80px auto",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              color: "white",
              boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="wptb-login-form">
              <div className="wptb-form--wrapper">
                <div className="wptb-heading">
                  <h1 className="wptb-item--title">OTP Verification</h1>
                  <p className="wptb-item--description">
                    Enter the 5-digit code sent to your email.
                  </p>
                </div>

                <form className="wptb-form" onSubmit={handleSubmit}>
                  <div className="wptb-form--inner">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          className="form-control otp-input"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleChange(index, e)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          ref={(el) => (inputRefs.current[index] = el)}
                          style={{
                            width: "45px",
                            height: "45px",
                            textAlign: "center",
                            fontSize: "18px",
                            borderRadius: "6px",
                            border: "2px solid #ccc",
                            backgroundColor: "#fff",
                            color: "#333",
                            outline: "none",
                            fontWeight: "bold",
                          }}
                        />
                      ))}
                    </div>

                    <p style={{ color: "white", marginBottom: "15px" }}>
                      Didn't receive the OTP?{" "}
                      <span
                        style={{
                          color: "yellow",
                          fontWeight: "bold",
                          cursor: "pointer",
                          marginTop: "5px",
                        }}
                        onClick={handleResendOTP}
                      >
                        Resend
                      </span>
                    </p>

                    <div>
                      <button
                        className="btn white-opacity creative"
                        type="submit"
                        disabled={loading}  // ✅ Disable button while verifying
                        style={{
                          background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                          color: "white",
                          padding: "12px 20px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          fontWeight: "bold",
                          border: "none",
                          cursor: "pointer",
                          width: "100%",
                          transition: "0.3s",
                          marginTop: "10px",
                        }}
                      >
                        {loading ? "Verifying..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OTPVerification;
