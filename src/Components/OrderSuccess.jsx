import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="success-container">
      <h2>🎉 Order Placed Successfully! 🎉</h2>
      <p>Thank you for shopping with us. Your order will be processed soon.</p>
      <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );
};

export default OrderSuccess;
