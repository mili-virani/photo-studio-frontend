import React, { useState, useEffect } from "react";
import headerBg from "../assets/img/background/page-header-bg-12.jpg";
import circleImg from "../assets/img/more/circle.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/shopcart.css";
import "../assets/css/components.css";
import {loadStripe} from '@stripe/stripe-js';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 699 ? 0 : 30;
  const total = subtotal + shipping;

  const validateForm = () => {
    const requiredFields = ["fname", "lname", "address", "zip", "phone", "email"];
    return requiredFields.every((field) => formData[field].trim() !== "");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        alert("Please fill in all required fields.");
        return;
    }

    const userId = localStorage.getItem("userId");
console.log(userId,"useris");

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
        console.log("Order stored successfully", response.data.order );

        if (response.status === 201) {
            const orderId = response.data.order._id; // Backend thi return thayela order ID store karo
            localStorage.setItem("orderId", orderId);
            console.log("orderid:",orderId);
            
            
            // Order store thai gaya pachi payment process start karo
            await makepayment(orderId);
        }
    } catch (error) {
        console.error("Order placement failed:", error);
        alert("Failed to place order. Please try again.");
    }
};

// Payment Integration
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
            order_id: orderId,// Order ID backend ma moklo
            user_id: localStorage.getItem("userId"),
        });

      
        const session = response.data;

        if (!session.id) {
            throw new Error("Invalid session ID received.");
        }

        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
            console.error(result.error);
            alert("Payment failed. Please try again.");
        }
      else {
          // Payment successful → Navigate to success page
          navigate(`/PaymentSuccess`);
      }

    } catch (error) {
        console.error("Payment Error:", error);
        alert("Failed to initiate payment.");
    }
};

  

  return (
    <main className="wrapper">
      <div className="wptb-page-heading">
        <div className="wptb-item--inner" style={{ backgroundImage: `url(${headerBg})` }}>
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src={circleImg} alt="Decorative Circle" />
          </div>
          <h2 className="wptb-item--title">Shop Checkout</h2>
        </div>
      </div>

      <section className="checkout_cart">
        <div className="container">
          <form onSubmit={handlePlaceOrder}>
            <div className="row">
              {/* Billing Address */}
              <div className="billing-section">
                <h4 className="billing-title">Billing Address</h4>
                <div className="billing-form">
                  <div className="form-row">
                    <div className="form-group half-width">
                      <label>First Name *</label>
                      <input type="text" name="fname" value={formData.fname} onChange={handleChange} placeholder="First Name" required />
                    </div>
                    <div className="form-group half-width">
                      <label>Last Name *</label>
                      <input type="text" name="lname" value={formData.lname} onChange={handleChange} placeholder="Last Name" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Company Name (Optional)</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" />
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" required />
                  </div>

                  <div className="form-group">
                    <label>Post Code / Zip *</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="Postal Code" required />
                  </div>

                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" required />
                  </div>

                  <h4 className="additional-info-title">Additional Information</h4>
                  <div className="form-group">
                    <label>Order Notes (Optional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes about your order & delivery"></textarea>
                  </div>
                  <button type="submit" className="btn btn-success" onClick={handlePlaceOrder}>Place Order</button>
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
