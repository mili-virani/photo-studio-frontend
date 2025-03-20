  import React, { useEffect, useState } from "react";
  import Navbar from "./Navbar";
  import headerBg from "../assets/img/background/page-header-bg-12.jpg";
  import circleImg from "../assets/img/more/circle.png";
  import Flatpickr from "react-flatpickr";
  import "flatpickr/dist/themes/material_blue.css";
  import { toast, Toaster } from "react-hot-toast";
  import { useLocation } from "react-router-dom";
  import "../assets/css/components.css";
  import "../assets/css/contact.css";
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const Booking = () => {
    const [formData, setFormData] = useState({
      bookingDate: "",
      bookingTime: "",
      address: "",
      price: "",
      userId: "",
      categoryId: "",
      packageId: "",
    });

    const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const categoryId = localStorage.getItem("categoryId");
    const queryParams = new URLSearchParams(location.search);
    const serviceId = queryParams.get("service") || localStorage.getItem("serviceId");
    const servicePrice = localStorage.getItem("servicePrice"); 

    if (!userId || !categoryId || !serviceId) {
      toast.error("Missing required data.");
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      userId,
      categoryId,
      packageId: serviceId,
      price: servicePrice || "", // Price auto-set થવું જોઈએ
    }));
  }, [location]);


    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User not authenticated");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            bookingDate: new Date(formData.bookingDate).toISOString(),
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Booking Successful!");
          setFormData({
            bookingDate: "",
            bookingTime: "",
            address: "",
            price: "",
            userId: "",
            categoryId: "",
            packageId: "",
          });
          localStorage.removeItem("serviceId");
        } else {
          toast.error(data.message || "Booking Failed!");
        }
      } catch (error) {
        console.error("Error submitting booking:", error);
        toast.error("Something went wrong.");
      }
    };

    return (
      <div>
        <Navbar />
        <main className="wrapper">
          <Toaster position="top-center" reverseOrder={false} />
          <div className="wptb-page-heading">
                      <div className="wptb-item--inner" style={{ backgroundImage: `url(${headerBg})` }}>
                        <div className="wptb-item-layer wptb-item-layer-one">
                          <img src={circleImg} alt="Decorative Circle" />
                        </div>
                        <h2 className="wptb-item--title">Booking Form</h2>
                      </div>
                    </div>
          <div className="container">
            <div className="wptb-login-form">
              <div className="wptb-form--wrapper">
                <div className="row">
                  <div className="col-lg-6 col-md-10 offset-lg-3 offset-md-1">
                    <div className="wptb-heading text-center">
                      <h1 className="wptb-item--title">Book Your Appointment</h1>
                      <p className="wptb-item--description">Fill in the details below</p>
                    </div>
                    <form className="wptb-form" onSubmit={handleSubmit}>
                      <div className="wptb-form--inner">
                        <div className="row">
                          <div className="col-lg-12 mb-4">
                            <Flatpickr
                              className="form-control"
                              value={formData.bookingDate}
                              onChange={(date) => setFormData({ ...formData, bookingDate: date[0] })}
                              options={{ dateFormat: "Y-m-d", enableTime: false }}
                              placeholder="Select Date"
                              required
                            />
                          </div>

                          <div className="col-lg-12 mb-4">
                            <input
                              type="time"
                              name="bookingTime"
                              className="form-control"
                              value={formData.bookingTime}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <div className="col-lg-12 mb-4">
                            <input
                              type="text"
                              name="address"
                              className="form-control"
                              placeholder="Enter Address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          {/* <div className="col-lg-12 mb-4">
                            <input
                              type="number"
                              name="price"
                              className="form-control"
                              placeholder="Enter Price"
                              value={formData.price}
                              onChange={handleInputChange}
                              required
                            />
                          </div> */}

                          <div className="col-lg-12 text-center">
                            <button className="btn white-opacity creative" type="submit">
                              <span className="btn-wrap">
                                <span className="text-first">Book Appointment</span>
                              </span>
                            </button>
                          </div>

                          <div className="text-white text-center mt-3 hide">
                            <strong>User ID:</strong> {formData.userId} <br />
                            <strong>Category ID:</strong> {formData.categoryId} <br />
                            <strong>Service ID:</strong> {formData.packageId}
                            <strong>Service ID:</strong> {formData.packageId.price}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  export default Booking;
