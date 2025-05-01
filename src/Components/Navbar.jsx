import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { IoMdNotifications } from "react-icons/io";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/img/logo.png";
import "../assets/css/header.css";
import "../assets/css/navbar.css";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const socket = io(BACKEND_URL);

const Navbar = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [userFullName, setUserFullName] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Function to update cart count
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    setTotalItems(count);
  };

  useEffect(() => {
    updateCartCount();
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName");

    if (token && fullName) {
      setUserFullName(fullName);
    } else {
      setUserFullName(null);
    }

    // Listen for localStorage updates
    window.addEventListener("storage", updateCartCount);

    // Listen for new notifications
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [...prev, notification]);
      toast.info(notification.message, { position: "top-right" });
    });

    return () => {
      window.removeEventListener("storage", updateCartCount);
      socket.off("newNotification");
    };

  }, []);

  useEffect(() => {
    updateCartCount();
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName");

    if (token && fullName) {
      setUserFullName(fullName);
    } else {
      setUserFullName(null);
    }

    // Listen for localStorage updates
    window.addEventListener("storage", updateCartCount);

    // Listen for new notifications
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [...prev, notification]);
      toast.info(notification.message, { position: "top-right" });
    });

    return () => {
      window.removeEventListener("storage", updateCartCount);
      socket.off("newNotification");
    };

  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    setUserFullName(null);
    navigate(`/login`);
    window.location.reload(); // Force full page refresh
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) // Checks if click is outside
      ) {
        console.log("Clicked outside"); // Debugging
        setIsDropdownOpen(false);
      } else {
        console.log("Clicked inside");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <header className="header">
      <div className="header-inner">
        <div className="container-fluid pe-0">
          <div className="d-flex align-items-center justify-content-between text-light">

            {/* Left Section: Logo */}
            <div className="header_left_part d-flex align-items-center">
              <div className="logo">
                <Link to="/" className="light_logo">
                  <img src={logo} alt="logo" style={{ height: "86px", width: "100px" }} />
                </Link>
              </div>
            </div>

            {/* Center Section: Navigation */}
            <div className="header_center_part d-none d-xl-block">
              <nav className="mainnav">
                <ul className="main-menu">
                  <li className="menu-item"><Link to="/">Home</Link></li>
                  <li className="menu-item"><Link to="/gallery">Gallery</Link></li>
                  <li className="menu-item"><Link to="/services">Services</Link></li>
                  <li className="menu-item"><Link to="/shop">Shop</Link></li>
                  <li className="menu-item"><Link to="/about">About Us</Link></li>
                  <li className="menu-item"><Link to="/feedback">Feedback</Link></li>
                  <li className="menu-item"><Link to="/contact">Contact</Link></li>

                  {/* User Dropdown */}
                  {userFullName ? (
                    <li className="menu-item menu-item-has-children">
                      <Link to="#">{userFullName}</Link>
                      <ul className="sub-menu">
                        <li className="menu-item"><Link to="/profile">Profile</Link></li>
                        <li className="menu-item"><Link to="#" onClick={handleLogout}>Logout</Link></li>
                      </ul>
                    </li>
                  ) : (
                    <ul>
                      <li className="menu-item" style={{ marginLeft: "20px" }}><Link to="/register">Register</Link></li>
                      <li className="menu-item" style={{ marginLeft: "50px" }}><Link to="/login">Login</Link></li>
                    </ul>
                  )}
                </ul>
              </nav>
            </div>

            {/* Right Section: Search, Notifications, & Cart */}
            <div className="header_right_part d-flex align-items-center">

              {/* Notification Bell */}
              <div
                className="notification-container position-relative mx-3"
                ref={dropdownRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle on click
              >
                <NotificationDropdown isOpen={isDropdownOpen} />
              </div>


              {/* Cart Button */}
              <div className="cart-container position-relative">
                <Link to="/shopcart" className="cart-button position-relative">
                  <i className="bi bi-cart3" style={{ fontSize: "30px", color: "white" }}></i>
                  {localStorage.getItem("token") && totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button type="button" className="mr_menu_toggle wptb-element d-xl-none">
                <i className="bi bi-list"></i>
              </button>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
