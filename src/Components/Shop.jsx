import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast"; // Toast notifications
import headerBg from "../assets/img/background/page-header-bg-12.jpg";
import circleImg from "../assets/img/more/circle.png";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Shop = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("grid");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // State to store products
   
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to access this page. Please log in first.", {
        position: "top-center",
        duration: 3000,
      });
      setTimeout(() => navigate(`${BACKEND_URL}/login`), 3000);
    }
  }, [navigate]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Try again later.");
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!Array.isArray(cart)) {
      cart = [];
    }

    const existingProductIndex = cart.findIndex((item) => item._id === product._id);

    if (existingProductIndex !== -1) {
      // If the product already exists in the cart, increase its quantity
      cart[existingProductIndex].quantity += 1;
    } else {
      // If the product is not in the cart, add it with a quantity of 1
      cart.push({ ...product, quantity: 1 });
    }

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update the cart state
    setCart([...cart]);

    // Show success message
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <main className="wrapper">
      <Toaster /> {/* Toast notifications */}

      <div className="wptb-page-heading">
        <div className="wptb-item--inner" style={{ backgroundImage: `url(${headerBg})` }}>
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src={circleImg} alt="Decorative Circle" />
          </div>
          <h2 className="wptb-item--title">Shop</h2>
        </div>
      </div>

      <section className="wptb-shop">
        <div className="container">
          <div className="shop_filtering_method d-flex align-items-center flex-wrap">
            {/* View Type Selection */}
            <div className="view_type_wrapper d-flex align-items-center">
              <ul className="nav view_type d-flex align-items-center">
                <li>
                  <button
                    className={`icon-grid ${viewType === "grid" ? "active" : ""}`}
                    onClick={() => setViewType("grid")}
                  >
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                  </button>
                </li>
                <li>
                  <button
                    className={`icon-list ${viewType === "list" ? "active" : ""}`}
                    onClick={() => setViewType("list")}
                  >
                    <i className="bi bi-list-task"></i>
                  </button>
                </li>
              </ul>
              <div className="showing_results">Showing {products.length} results</div>
            </div>
          </div>

          {/* Conditional Rendering of Product Views */}
          <div className="tab-content">
            {viewType === "grid" && (
              <div className="tab-pane fade show active">
                <div className="product_view_grid product_col_4">
                  {products.map((product) => (
                    <div className="product_item" key={product.id}>
                      <div className="product_thumb">
                        <div className="product_imagebox">
                          <img className="primary_img" src={BACKEND_URL+ product.image} alt={product.name} />
                          <div className="cart_button">
                            <button onClick={() => addToCart(product)} className="btn" type="button">
                              Add to Cart
                            </button>
                          </div>
                        </div>
                        <div className="product_item_inner">
                          <div className="label_text">
                            <h2 className="product_item_name d-flex align-items-center justify-content-between gap-1 flex-wrap">
                              <a href="shop-product.html">{product.name}</a>
                              <span className="product_item_price">
                                ₹{product.price}{" "}
                                {product.oldPrice && (
                                  <del className="old_price">${product.oldPrice}</del>
                                )}
                              </span>
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewType === "list" && (
              <div className="tab-pane fade show active">
                <div className="product_view_list">
                  {products.map((product) => (
                    <div className="product_item" key={product.id}>
                      <div className="product_thumb">
                        <div className="product_imagebox">
                          <img className="primary_img" src={BACKEND_URL + product.image} alt={product.name} />
                        </div>
                        <div className="product_item_inner">
                          <div className="label_text">
                            <h2 className="product_item_name d-flex align-items-center justify-content-between gap-1 flex-wrap">
                              <a href="shop-product.html">{product.name}</a>
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Shop;