import React from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./AuthContext";
// Routes
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import Register from "./pages/Auth/Register";
import RegisterYouth from "./pages/Auth/RegisterYouth";
import RegisterStaff from "./pages/Auth/RegisterStaff";


import CreateEvent from "./pages/CreateEvent";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Youth from "./pages/Youth/Youth";
import StaffInfoPage from "./pages/StaffInfoPage";
import YouthInfoPage from "./pages/YouthInfoPage";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PrivateRoute element={<Home />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route
        path="/create-event"
        element={<PrivateRoute element={<CreateEvent />} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-youth" element={<RegisterYouth />} />
      <Route path="/register-staff" element={<RegisterStaff />} />
      <Route path="/staff/:firebaseUID" element={<PrivateRoute element={<StaffInfoPage />} />} />
      <Route path="/youth/:firebaseUID" element={<PrivateRoute element={<YouthInfoPage />} />} />


      
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/events" element={<PrivateRoute element={<Events />} />} />
      <Route path="/youth" element={<PrivateRoute element={<Youth />} />} />
    </>
  )
);

const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
