import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "../assets/css/components.css";
import "../assets/css/contact.css";
import headerBg from "../assets/img/background/page-header-bg-2.jpg";
import circleImg from "../assets/img/more/circle.png";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "", // ✅ Added subject field
    message: "",
    rating: 0,
  });

  const [loading, setLoading] = useState(false);
  const ratingLabels = ["Terrible", "Bad", "Ok", "Good", "Amazing"];

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Rating Selection
  const handleRating = (ratingValue) => {
    setFormData({ ...formData, rating: ratingValue });
  };

  // Form Validation
  const validateForm = () => {
    const { name, email, subject, message, rating } = formData;
    if (!name || !email || !subject || !message) {
      toast.error("All fields are required!");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email format!");
      return false;
    }
    if (rating === 0) {
      toast.error("Please select a rating!");
      return false;
    }
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Feedback submitted successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          rating: 0,
        }); // Reset form
      } else {
        toast.error(data.message || "Failed to submit feedback");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error("Error submitting feedback:", error);
    }

    setLoading(false);
  };

  return (
    <div className="wrapper">
      <div className="wptb-page-heading">
        <div
          className="wptb-item--inner"
          style={{ backgroundImage: `url(${headerBg})` }}
        >
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src={circleImg} alt="Decorative Circle" />
          </div>
          <h2 className="wptb-item--title">Feedback</h2>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
      {/* <div className="wptb-page-heading">
        <div className="wptb-item--inner">
          <h2 className="wptb-item--title">Feedback Form</h2>
        </div>
      </div> */}
      <section>
        <div className="container">
          <div className="wptb-login-form">
            <div className="wptb-form--wrapper">
              <div className="row">
                <div className="col-lg-6 col-md-10 offset-lg-3 offset-md-1">
                  <div className="wptb-heading text-center">
                    <h1 className="wptb-item--title">Feedback</h1>
                    <p className="wptb-item--description">
                      We value your feedback
                    </p>
                  </div>
                  <form className="wptb-form" onSubmit={handleSubmit}>
                    <div className="wptb-form--inner">
                      <div className="row">
                        <div className="col-lg-12 mb-4">
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Name*"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-lg-12 mb-4">
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email*"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-lg-12 mb-4">
                          <input
                            type="text"
                            name="subject"
                            className="form-control"
                            placeholder="Subject*"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-lg-12 mb-4">
                          <textarea
                            name="message"
                            className="form-control"
                            placeholder="Message*"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                        <div className="col-lg-12 text-center mb-4 wptb-item--description text-white">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={30}
                              className={`mx-1 cursor-pointer ${
                                formData.rating >= star
                                  ? "text-warning"
                                  : "text-secondary"
                              }`}
                              onClick={() => handleRating(star)}
                            />
                          ))}
                          <div className="mt-2 fw-bolder text-white">
                            {formData.rating > 0
                              ? ratingLabels[formData.rating - 1]
                              : "Click to rate"}
                          </div>
                        </div>
                        <div className="col-lg-12 text-center">
                          <button
                            className="btn white-opacity creative"
                            type="submit"
                            disabled={loading}
                          >
                            <span className="btn-wrap">
                              <span className="text-first">
                                {loading ? "Submitting..." : "Submit"}
                              </span>
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

export default FeedbackForm;
