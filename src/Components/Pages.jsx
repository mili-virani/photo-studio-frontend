import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import "../assets/css/header.css";
import headerBg from "../assets/img/background/bg-14.jpg";
import circleImg from "../assets/img/more/circle.png";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Pages = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to access this page.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (!categoryId) {
      toast.error("No category selected.");
      navigate(`/services`);
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/services?category_id=${categoryId}`);
        setPackages(response.data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to fetch services.");
      }
    };

    fetchServices();
  }, [navigate, categoryId]);

  // const handleBooking = (serviceId) => {
  //   const userId = localStorage.getItem("userId");
  //   localStorage.setItem("serviceId", serviceId); 
  //   localStorage.setItem("categoryId", categoryId); 
  //   localStorage.setItem("userId", userId);
  //   navigate(`/booking?service=${serviceId}`); 
  // };

  const handleBooking = (serviceId, price) => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      toast.error("User not found. Please log in.");
      return;
    }
  
    localStorage.setItem("packageId", serviceId);
    localStorage.setItem("categoryId", categoryId);
    localStorage.setItem("userId", userId);
    localStorage.setItem("servicePrice", price); // ✅ Price સાચી રીતે store કરો
  
    setTimeout(() => {
      navigate(`/booking?service=${serviceId}`);
    }, 100); // Ensure storage is updated before navigating
  };
  
  
  return (
    <div>
    
      <Toaster />
      <main className="wrapper">
        <div className="wptb-page-heading">
                <div className="wptb-item--inner" style={{ backgroundImage: `url(${headerBg})` }}>
                  <div className="wptb-item-layer wptb-item-layer-one">
                    <img src={circleImg} alt="Decorative Circle" />
                  </div>
                  <h2 className="wptb-item--title">Our Services</h2>
                </div>
              </div>
        <div className="container">
          <h2 className="text-white text-center my-4">Selected Category Packages</h2>
          <div className="row">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <div key={pkg._id} className="col-12 mb-4">
                  <div className="card bg-transparent border-0 shadow-lg p-4">
                    <div className="row g-0 align-items-center">
                      <div className="col-md-6">
                        <img src={BACKEND_URL + pkg.image_url} alt={pkg.service_name} className="img-fluid rounded" style={{ width: "100%", height: "100%", objectFit: "cover"}}  />
                      </div>
                      <div className="col-md-6 ps-4">
                        <div className="card-body text-white bg-transparent p-4 rounded">
                          <h3 className="card-title mb-3" style={{ fontSize: "3.2rem",lineHeight:"57px" }}>{pkg.service_name}</h3>
                          <p className="mb-3 mt-3">{pkg.description}</p>
                          <h5 className="mb-3 mt-3"><strong>Price:</strong> ₹{pkg.price}</h5>
                          <h5 className="mb-3 mt-3"><strong>Duration:</strong> {pkg.duration}</h5>
                          <button className="btn btn-danger mt-3" onClick={() => handleBooking(pkg._id,pkg.price)}>
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white">No packages available.</p>
            )}
          </div>
        </div>
      </main>
 
    </div>
  );
};

export default Pages;
