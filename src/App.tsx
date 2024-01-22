import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
// Routes
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import Register from "./pages/Auth/Register";
import RegisterYouth from "./pages/Auth/RegisterYouth"; 
import RegisterStaff from "./pages/Auth/RegisterStaff"; 
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import DisplayYouthTest from "./pages/DisplayYouthTest"; 


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PrivateRoute element={<Home />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-youth" element={<RegisterYouth />} /> 
      <Route path="/register-staff" element={<RegisterStaff />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/user-profile" element={<PrivateRoute element={<DisplayYouthTest />} />} />

    </>
  )
);

const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
