import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
// Routes
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import Register from "./pages/Auth/Register";
import RegisterYouth from "./pages/Auth/RegisterYouth"; // Import the new component
import RegisterStaff from "./pages/Auth/RegisterStaff"; // Import the new component
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PrivateRoute element={<Home />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-youth" element={<RegisterYouth />} /> {/* New Route */}
      <Route path="/register-staff" element={<RegisterStaff />} /> {/* New Route */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </>
  )
);

const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
