import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import emptyCart from "../assets/img/empty-cart.png";
import toast from "react-hot-toast";
import "../assets/css/shopcart.css";
import Common from "./Common";
import headerBg from "../assets/img/background/page-header-bg-4.jpg";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Shopcart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to access this page. Please log in first.", {
        position: "top-center",
        duration: 3000,
      });
      setTimeout(() => navigate(`/login`), 3000);
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Store updated cart
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Store updated cart
  };

  return (
    <main className="wrapper">
      {/* Page Header */}
      <Common title="Shop Cart" pageHeaderBg={headerBg} />

      {/* Shopping Cart */}
      <section className="shopping_cart">
        <div className="container">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <img src={emptyCart} alt="emptyCart" />
              <h3>
                Your cart is empty!{" "}
                <Link to="/shop" className="go-to-products">
                  Go to products
                </Link>
              </h3>
            </div>
          ) : (

            <form>
              <table className="cart_table">
                <thead>
                  <tr className="cart_header">
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>SubTotal</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((item) => (
                    <tr className="cart_content" key={item._id}>
                      <td className="cart_image">
                        <img src={BACKEND_URL + item.image} alt={item.name} />
                      </td>
                      <td className="cart_title">{item.name}</td>
                      <td className="cart_price">₹{item.price}</td>
                      <td className="cart_quantity">
                        <div className="product_quantity_inner">
                          <button className="qty_btn" onClick={() => updateQuantity(item._id, -1)}>
                            <i className="bi bi-dash-lg"></i>
                          </button>
                          <input type="text" value={item.quantity} readOnly />
                          <button className="qty_btn" onClick={() => updateQuantity(item._id, 1)}>
                            <i className="bi bi-plus-lg"></i>
                          </button>
                        </div>
                      </td>
                      <td className="cart_total">₹{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="cart_removal">
                        <button onClick={() => removeItem(item._id)}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button type="button" className="styled-button secondary button-border" style={{ marginTop: "40px" }}>
                <Link to="/checkout" style={{ textDecoration: "none", color: "inherit" }}>
                  Proceed To Checkout
                </Link>
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Shopcart;