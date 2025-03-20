import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SliderSection from "./Components/SliderSection"; // Example page component
import About from "./Components/About"; // Example page component
import ContactForm from "./Components/ContactForm";
import Pages from "./Components/Pages";
import Booking from "./Components/Booking";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Services from "./Components/Services"
import Shop from "./Components/Shop";
import Shopcart from "./Components/Shopcart";
import Checkout from "./Components/Checkout";
import Footer from "./Components/Footer";
import FeedbackForm from "./Components/Feedback";
import Gallery from "./Components/Gallery";
import Payment from "./Components/Payment";
import Logout from "./Components/Logout";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import OTPVerification from "./Components/OTPVerification";
import OrderSuccess from "./Components/OrderSuccess";
import Profile from "./Components/Profile";
import NotificationDropdown from "./Components/NotificationDropdown";

// import Gallery from './pages/Gallery'; // Example page component

// import Blog from './pages/Blog'; // Example page component

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SliderSection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/pages" element={<Pages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shopcart" element={<Shopcart />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route path="profile" element={<Profile/>}/>
        <Route path="/notifications" element={<NotificationDropdown/>}/>
        {/* <Route path="/gallery" element={<Gallery />} />
    
  <Route path="/blog" element={<Blog />} /> */}
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App; 
