import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "../assets/css/NotificationDropdown.css"; // Import CSS file
import { IoMdNotifications } from "react-icons/io";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const socket = io(BACKEND_URL); // Connect to backend WebSocket

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications
    socket.on("newNotification", (notification) => {
      console.log("New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/notifications");
      console.log("Fetched notifications:", res.data);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="notification-container">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell"
      >
        <IoMdNotifications color="white" size={32} />
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="notification-dropdown">
          <h3 className="notification-title">Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif._id} className="notification-item">
                <p>{notif.message}</p>
                <span className="notification-time">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="no-notifications">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
