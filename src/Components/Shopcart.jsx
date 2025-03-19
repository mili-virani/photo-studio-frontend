import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import emptyCart from "../assets/img/empty-cart.png";
import circleImg from "../assets/img/more/circle.png";
import "../assets/css/shopcart.css";
import headerBg from "../assets/img/background/page-header-bg-4.jpg";

const Shopcart = () => {
  const [cart, setCart] = useState([]);

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
     <div className="wptb-page-heading">
            <div className="wptb-item--inner" style={{ backgroundImage: `url(${headerBg})` }}>
              <div className="wptb-item-layer wptb-item-layer-one">
                <img src={circleImg} alt="Decorative Circle" />
              </div>
              <h2 className="wptb-item--title">Shop Cart</h2>
            </div>
          </div>
      {/* Shopping Cart */}
      <section className="shopping_cart">
        <div className="container">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <img src={emptyCart} alt="emptyCart"/>
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
                        <img src={item.image} alt={item.name} />
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

              <button type="button" className="btn">
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