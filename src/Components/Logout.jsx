import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove session data
    sessionStorage.removeItem("email");

    // Show logout success toast
    toast.success("Logged out successfully!", {
      position: "top-right",
      duration: 3000, // Toast disappears after 3 seconds
    });

    // Redirect to login page after a short delay
    setTimeout(() => {
      navigate("/");
    }, 1500); // Delay navigation to allow the toast to be visible
  }, [navigate]);

  return null;
};

export default Logout;
