
import { Navigate } from "react-router-dom";

//private route logic
const PrivateRoute = ({ children }) => {
  const data = localStorage.getItem("token");

  if (data && data !== "null") return children;

  return <Navigate to="/" />;
};

export default PrivateRoute;
