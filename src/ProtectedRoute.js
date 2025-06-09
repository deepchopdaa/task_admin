
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth"; // Import your auth checker

const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;