import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import '../assets/css/profile.css'
import bgImage from "../assets/img/background/page-header-bg-10.jpg";
import circleImage from "../assets/img/more/circle.png";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BACKEND_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data.");
      }
    };

    fetchUserData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Update Profile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${BACKEND_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      toast.success("Profile updated successfully!");
      setIsModalOpen(false); // Close modal after successful update
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div>
     
      <Toaster />
      <main className="wrapper">
        {/* Background Header Section */}
        <div className="wptb-page-heading">
          <div
            className="wptb-item--inner"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="wptb-item-layer wptb-item-layer-one">
              <img src={circleImage} alt="Circle decoration" />
            </div>
            <h2 className="wptb-item--title">My Profile</h2>
          </div>
        </div>

        {/* Profile Display Section */}
        <section>
          <div className="container">
            <div className="wptb-login-form">
              <div className="wptb-form--wrapper">
                <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-8">
                    <div className="wptb-heading text-center">
                      <h1 className="wptb-item--title">User Profile</h1>
                      <p className="wptb-item--description">
                        Your personal information
                      </p>
                    </div>

                    {/* Profile Details Card */}
                    <div className="form-card p-4">
                      {user ? (
                        <div>
                          <p>
                            <strong>Username:</strong> {user.username}
                          </p>
                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {user.phone}
                          </p>
                          <button className="btn btn-primary mt-3" onClick={() => setIsModalOpen(true)}>
                            Edit Profile
                          </button>
                        </div>
                      ) : (
                        <p>Loading user data...</p>
                      )}
                    </div>
                    {/* End Profile Details Card */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="btn btn-success">Save Changes</button>
                  <button type="button" className="btn btn-danger" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
     
    </div>
  );
};

export default Profile;
