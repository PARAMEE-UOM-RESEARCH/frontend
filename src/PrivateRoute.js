import { Navigate } from "react-router-dom";

// Private route logic
const PrivateRoute = ({ children, adminOnly = false }) => {
  const userData = localStorage.getItem("profile");
  const isAdmin = localStorage.getItem("admin");

  // If the route is for admin-only, check if the user is an admin
  if (adminOnly && isAdmin) return children;

  // If the route is for both users and admins, allow access if profile data is present
  if (userData && userData !== "null") return children;

  // Redirect if no valid session data is found or the route requires admin and the user isn't an admin
  return <Navigate to="/" />;
};

export default PrivateRoute;
