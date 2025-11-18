import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("user_role");

    if (!token) return <Navigate to="/login" />;
    
   
    if (!allowedRoles.includes(userRole)) return <Navigate to="/login" />;

    return children;
};

export default ProtectedRoute;
