import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const updatePaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        console.error("Session ID missing!");
        navigate("/"); // Redirect to home if session_id is missing
        return;
      }

      try {
        await axios.post(`${BACKEND_URL}/api/update-payment-status`, { session_id: sessionId });
        console.log("Payment status updated successfully");
        localStorage.removeItem("cart"); // Clear cart after successful payment
        localStorage.removeItem("orderId");
        navigate(`/order-successfully`); // Redirect to order success page
      } catch (error) {
        console.error("Failed to update payment status", error);
        navigate(`/order-failed`);
      }
    };

    updatePaymentStatus();
  }, [navigate]);

  return (
    <div>
      <h2>Processing Payment...</h2>
    </div>
  );
};

export default PaymentSuccess;
