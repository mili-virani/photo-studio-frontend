import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import '../assets/css/profile.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  // Generate user avatar from initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(part => part[0]).join("").toUpperCase();
  };

  return (
    <div className="profile-wrapper dark-theme">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff'
          }
        }}
      />
      <main className="wrapper">
        <section className="profile-section" style={{ marginTop: "40px" }}>
          <div className="container">
            <div className="profile-content">
              <div className="row-profile justify-content-center">
                <div className="profile-card-container">
                  {isLoading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <p>Loading your profile...</p>
                    </div>
                  ) : user ? (
                    <div className="profile-card">
                      <div className="profile-header">
                        <div className="avatar">
                          <div className="avatar-circle">
                            {getInitials(user.username)}
                          </div>
                        </div>
                        <h1 className="profile-title">{user.username}</h1>
                      </div>

                      <div className="profile-info">
                        <div className="info-item">
                          <div className="info-icon">
                            <i className="fa fa-user"></i>
                          </div>
                          <div className="info-content">
                            <h3>Username</h3>
                            <p>{user.username}</p>
                          </div>
                        </div>

                        <div className="info-item">
                          <div className="info-icon">
                            <i className="fa fa-envelope"></i>
                          </div>
                          <div className="info-content">
                            <h3>Email</h3>
                            <p>{user.email}</p>
                          </div>
                        </div>

                        <div className="info-item">
                          <div className="info-icon">
                            <i className="fa fa-phone"></i>
                          </div>
                          <div className="info-content">
                            <h3>Phone</h3>
                            <p>{user.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="profile-actions">
                        <button
                          className="edit-profile-btn"
                          onClick={() => setIsModalOpen(true)}
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="error-message">
                      <p>Unable to load profile data. Please try again later.</p>
                    </div>
                  )}
                </div>

                <button className="styled-button secondary " onClick={() => navigate("/mybookings")}>
                  My Bookings
                </button>

                <button className="styled-button secondary " onClick={() => navigate("/mybookings")}>
                  My Orders
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button
                  className="close-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    style={{ color: "black" }}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    style={{ color: "black" }}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    style={{ color: "black" }}
                  />
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="save-button">Save Changes</button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
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