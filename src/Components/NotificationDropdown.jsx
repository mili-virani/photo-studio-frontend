import { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/notifications`); // Adjust API route
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-gray-200 rounded-full hover:bg-gray-300"
      >
        🔔 {/* Bell Icon */}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif._id} className="border-b py-2">
                <p className="text-sm">{notif.message}</p>
                <span className="text-xs text-gray-500">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
