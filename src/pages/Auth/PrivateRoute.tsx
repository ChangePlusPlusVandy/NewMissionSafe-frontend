import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Navbar from "../../components/Navbar";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <Navbar>{element}</Navbar>;
};

export default PrivateRoute;