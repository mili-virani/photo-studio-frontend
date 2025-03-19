import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PaymentPage = () => {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Payment Details:", { name, cardNumber, expiryDate, cvv });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 mt-5 pt-5">
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent white
          backdropFilter: "blur(10px)", // Glass effect
          border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border
          borderRadius: "15px", // Rounded corners
          color: "#fff", // White text for contrast
        }}
      >
        <h2 className="text-center mb-4">Payment Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name on Card</label>
            <input
              type="text"
              id="name"
              className="form-control bg-transparent text-white border-light"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cardNumber" className="form-label">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              className="form-control bg-transparent text-white border-light"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                className="form-control bg-transparent text-white border-light"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="cvv" className="form-label">CVV</label>
              <input
                type="text"
                id="cvv"
                className="form-control bg-transparent text-white border-light"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-light w-100 fw-bold">
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
