import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/css/Mybooking.css"; // Import CSS file
import { toast, Toaster } from "react-hot-toast";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Mybooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    document.title = "My Orders | Candid Creations"; 

    const fetchUserBookings = async () => {
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/order/user/${userId}`);
        console.log("Res booking", response.data.data);

        if (response.data.success) {
          // setBookings(response.data.data);
          const sortedBookings = response.data.data.sort(
            (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate)
          );
          setBookings(sortedBookings);
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

  const cancelBooking = async (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${BACKEND_URL}/api/booking/${bookingId}`);

          if (response.data.success) {
            toast.success("Booking cancelled successfully!");
            setBookings((prev) => prev.filter(b => b._id !== bookingId)); // Update UI
          } else {
            toast.error("Failed to cancel booking.");
          }
        } catch (error) {
          console.error("Error canceling booking:", error);
          toast.error("Something went wrong while cancelling.");
        }
      }
    });
  };

  const rescheduleBooking = async (bookingId) => {
    Swal.fire({
      title: "Reschedule Booking",
      html: `
        <label for="swal-input1">New Date (YYYY-MM-DD)</label>
        <input type="date" id="swal-input1" class="swal2-input">
        <label for="swal-input2">New Time (HH:MM)</label>
        <input type="time" id="swal-input2" class="swal2-input">
      `,
      showCancelButton: true,
      confirmButtonText: "Reschedule",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const newDate = document.getElementById("swal-input1").value;
        const newTime = document.getElementById("swal-input2").value;

        if (!newDate || !newTime) {
          Swal.showValidationMessage("Both date and time are required!");
        }
        return { newDate, newTime };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { newDate, newTime } = result.value;

        try {
          const response = await axios.put(`${BACKEND_URL}/api/booking/${bookingId}`, {
            bookingDate: newDate,
            bookingTime: newTime,
          });

          if (response.data.success) {
            toast.success("Booking rescheduled successfully!");
            setBookings((prev) =>
              prev.map((b) =>
                b._id === bookingId
                  ? { ...b, bookingDate: newDate, bookingTime: newTime }
                  : b
              )
            );
          } else {
            toast.error("Failed to reschedule.");
          }
        } catch (error) {
          console.error("Error rescheduling booking:", error);
          toast.error("Something went wrong while rescheduling.");
        }
      }
    });
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div>
      <Toaster />
      <div className="booking-container">
        <h2 className="booking-title">📸 Your Booking Details</h2>
        {bookings.length > 0 ? (
          <div className="table-container">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>Category</th>
                  <th>Booking Date</th>
                  <th>Booking Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              
                {[...bookings].sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate)).map((booking, index) => (
                  <tr key={booking._id}>
                    <td>{index + 1}</td>
                    <td>{booking.categoryId?.name || "N/A"}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}</td>
                    <td>{booking.bookingTime}</td>
                    <td className={`status ${booking.status.toLowerCase()}`}>
                      {booking.status || "Pending"}
                    </td>
                    <td>
                      <button className="btn-cancel" onClick={() => cancelBooking(booking._id)}>Cancel</button>
                      <button className="btn-reschedule" onClick={() => rescheduleBooking(booking._id)}>Reschedule</button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-bookings">No bookings found 😔</p>
        )}
      </div>
    </div>
  );
};

export default Mybooking;
