import React, { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Mybooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");// Remove ':' if it exists
// Get User ID from localStorage

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
            `${BACKEND_URL}/api/booking/user/${userId}` // Correct route
          );
          

        if (response.data.success) {
          setBookings(response.data.data);
        } else {
          console.warn("No booking data found");
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching user booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>📸 Your Booking Details</h2>
      {bookings.length > 0 ? (
        <table border="1" width="100%" style={{marginTop:"100px"}}> 
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Category</th>
              <th>Booking Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>{booking.categoryId?.name || "N/A"}</td>
                <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                <td>
                  <span
                    style={{
                      color:
                        booking.status === "Success"
                          ? "green"
                          : booking.status === "Pending"
                          ? "orange"
                          : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {booking.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings found 😔</p>
      )}
    </div>
  );
};

export default Mybooking;
