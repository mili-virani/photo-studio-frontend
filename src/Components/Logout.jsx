import { useEffect } from "react";
import toast from "react-hot-toast";

const Logout = () => {
  useEffect(() => {
    // Show toast notification
    toast.success("Logged out successfully!", {
      position: "top-right",
      duration: 2000, // Show toast for 2 seconds
    });

    // Remove session data
    sessionStorage.removeItem("email");

    // Ensure the toast is visible before refreshing
    setTimeout(() => {
      window.location.href = "/"; // Full page reload, ensuring complete logout
    }, 1500); // Adjust delay to let toast be visible
  }, []);

  return null;
};

export default Logout;
