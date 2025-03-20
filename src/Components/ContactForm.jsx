import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import "../assets/css/components.css";
import "../assets/css/contact.css";
import headerBg from "../assets/img/background/page-header-bg-10.jpg";
import circleImg from "../assets/img/more/circle.png";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileno: "",
    text: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, mobileno, text } = formData;
    if (!username || !email || !mobileno || !text) {
      toast.error("All fields are required!");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email format!");
      return false;
    }
    if (!/^\d{10}$/.test(mobileno)) {
      toast.error("Invalid mobile number!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ username: "", email: "", mobileno: "", text: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error("Error submitting contact form:", error);
    }

    setLoading(false);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Toaster position="top-center" />
     <div className="wptb-page-heading">
             <div className="wptb-item--inner" style={{ backgroundImage: `url(${headerBg})` }}>
               <div className="wptb-item-layer wptb-item-layer-one">
                 <img src={circleImg} alt="Decorative Circle" />
               </div>
               <h2 className="wptb-item--title">Contact us</h2>
             </div>
           </div>
      <section>
        <div className="container">
          <div className="wptb-login-form">
            <div className="wptb-form--wrapper">
              <div className="row">
                <div className="col-lg-6 col-md-10 offset-lg-3 offset-md-1">
                  <div className="wptb-heading text-center">
                    <h1 className="wptb-item--title">Get In Touch</h1>
                    <p className="wptb-item--description">Contact us for a great photography session & beautifully captured moments</p>
                  </div>
                  <form className="wptb-form" onSubmit={handleSubmit}>
                    <div className="wptb-form--inner">
                      <div className="row">
                        <div className="col-lg-12 mb-4">
                          <input type="text" name="username" className="form-control" placeholder="Name*" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="col-lg-12 mb-4">
                          <input type="email" name="email" className="form-control" placeholder="E-mail*" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="col-lg-12 mb-4">
                          <input type="text" name="mobileno" className="form-control" placeholder="Mobile No*" value={formData.mobileno} onChange={handleChange} required />
                        </div>
                        <div className="col-lg-12 mb-4">
                          <textarea name="text" className="form-control" placeholder="Message*" rows="4" value={formData.text} onChange={handleChange} required></textarea>
                        </div>
                        <div className="col-lg-12 text-center">
                          <button className="btn white-opacity creative" type="submit" disabled={loading}>
                            <span className="btn-wrap">
                              <span className="text-first">{loading ? "Sending..." : "Send"}</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactForm;
