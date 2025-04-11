import React, { useState, useEffect } from "react";
import headerBg from "../assets/img/background/page-header-bg-12.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/shopcart.css";
import "../assets/css/components.css";
import { loadStripe } from "@stripe/stripe-js";
import { FaInfoCircle } from "react-icons/fa";
import Common from "./Common";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Checkout = () => {
  const navigate = useNavigate();

  // Retrieve cart data from local storage
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    company: "",
    address: "",
    zip: "",
    phone: "",
    email: "",
    notes: "",
    shipping: "cash",
    paymethod: "cash",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 699 ? 0 : 30;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate required fields
    if (!formData.fname) {
      newErrors.fname = (
        <span style={{ color: "red", fontWeight: "bolder" }}>
          <FaInfoCircle /> required
        </span>
      );
    }
    if (!formData.lname) {
      newErrors.lname = (<span style={{ color: "red", fontWeight: "bolder" }}>
        <FaInfoCircle /> required
      </span>);
    }
    if (!formData.address) {
      newErrors.address = (
        <span style={{ color: "red", fontWeight: "bolder" }}>
          <FaInfoCircle /> required
        </span>
      );
    }

    if (!formData.zip) {
      newErrors.zip = (
        <span style={{ color: "red", fontWeight: "bolder" }}>
          <FaInfoCircle /> required
        </span>
      );
    }

    if (!formData.phone) {
      newErrors.phone = (
        <span style={{ color: "red", fontWeight: "bolder" }}>
          <FaInfoCircle /> required
        </span>
      );
    }

    if (!formData.email) {
      newErrors.email = (
        <span style={{ color: "red", fontWeight: "bolder" }}>
          <FaInfoCircle /> required
        </span>
      );
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop form submission if errors exist
    }

    const userId = localStorage.getItem("userId");

    const orderData = {
      user_id: userId,
      products: cart.map((item) => ({
        product_id: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      billing_details: {
        first_name: formData.fname,
        last_name: formData.lname,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        company: formData.company,
        zip: formData.zip,
      },
      subtotal,
      shipping_fee: shipping,
      total,
    };

    try {
      console.log("Order Data:", orderData);
      const response = await axios.post(`${BACKEND_URL}/api/orders`, orderData);

      if (response.status === 201) {
        const orderId = response.data.order._id;
        localStorage.setItem("orderId", orderId);
        await makepayment(orderId);
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const makepayment = async (orderId) => {
    const stripe = await loadStripe("pk_test_51R27VaRr1DGBjnZ20WbPXqRSDWpW8PIRWjcIpvkyM5SI0evdtoXRbn9kBYi2kB7KRPI8ylQtoynAq9Dgs4IMCrtM00pLaQPIVi");

    try {
      const response = await axios.post(`${BACKEND_URL}/api/create-checkout-session`, {
        products: cart.map((item) => ({
          product_id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        order_id: orderId,
        user_id: localStorage.getItem("userId"),
      });

      const session = response.data;
      if (!session.id) throw new Error("Invalid session ID received.");

      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error(result.error);
        alert("Payment failed. Please try again.");
      } else {
        navigate(`/PaymentSuccess`);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to initiate payment.");
    }
  };

  return (
    <main className="wrapper">
      <Common title="Shop Checkout" pageHeaderBg={headerBg} />

      <section className="checkout_cart">
        <div className="container">
          <form onSubmit={handlePlaceOrder}>
            <div className="row-checkout">
              {/* Billing section */}
              <div className="billing-section">
                <h4 className="billing-title">Billing Address</h4>
                <div className="billing-form">
                  <div className="form-row">
                    <div className="form-group-checkout half-width">
                      <div className="together">
                        <label>First Name *</label>
                        {errors.fname && <p className="text-red-500 error-checkout">{errors.fname}</p>}
                      </div>
                      <input type="text" name="fname" value={formData.fname} onChange={handleChange} placeholder="First Name" />
                    </div>
                    <div className="form-group-checkout half-width">
                      <div className="together">
                        <label>Last Name *</label>
                        {errors.lname && <p className="text-red-500 error-checkout">{errors.lname}</p>}
                      </div>
                      <input type="text" name="lname" value={formData.lname} onChange={handleChange} placeholder="Last Name" />
                    </div>
                  </div>

                  <div className="form-group-checkout">
                    <label>Company Name (Optional)</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" />
                  </div>

                  <div className="form-group-checkout">
                    <div className="together">
                      <label>Street Address *</label>
                      {errors.address && <p className="text-red-500 error-checkout">{errors.address}</p>}
                    </div>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" />
                  </div>

                  <div className="form-group-checkout">
                    <div className="together">
                      <label>Post Code / Zip *</label>
                      {errors.zip && <p className="text-red-500 error-checkout">{errors.zip}</p>}
                    </div>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="Postal Code" />
                  </div>

                  <div className="form-group-checkout">
                    <div className="together">
                      <label>Phone *</label>
                      {errors.phone && <p className="text-red-500 error-checkout">{errors.phone}</p>}
                    </div>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
                  </div>

                  <div className="form-group-checkout">
                    <div className="together">
                      <label>Email *</label>
                      {errors.email && <p className="text-red-500 error-checkout">{errors.email}</p>}
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" />
                  </div>

                  <h4 className="additional-info-title">Additional Information</h4>
                  <div className="form-group-checkout">
                    <label>Order Notes (Optional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes about your order & delivery"></textarea>
                  </div>
                  <button className="btn white-opacity creative" type="submit" style={{ marginTop: "15px" }}>
                    Place Order
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="cart-summary">
                <div className="order-summary">
                  <h4>Order Summary:</h4>
                  {cart.length > 0 ? (
                    <ul>
                      {cart.map((item, index) => (
                        <li key={index} className="order-item">
                          <div className="order-item-details">
                            <strong>{item.name} x {item.quantity}</strong>
                            <span className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Your cart is empty.</p>
                  )}

                  <div className="summary-item">
                    <span className="summary-label"><h5>Subtotal:</h5></span>
                    <span className="summary-value"><h5 style={{ color: "yellow" }}>₹{subtotal.toFixed(2)}</h5></span>
                  </div>

                  <div className="summary-item">
                    <span className="summary-label"><h5>Shipping Fee:</h5></span>
                    <span className="summary-value">
                      <h5 style={{ color: "#e0b4b4" }}>{shipping === 0 ? "FREE" : `₹${shipping}`}</h5>
                    </span>
                  </div>

                  <div className="summary-item">
                    <span className="summary-label"><h5>Total:</h5></span>
                    <span className="summary-value">
                      <h5 style={{ color: "yellow" }}>₹{total.toFixed(2)}</h5>
                    </span>
                  </div>

                  {/* <button type="submit" className="btn btn-success" onClick={makepayment}>Place Order</button> */}
                </div>
              </div>



            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
