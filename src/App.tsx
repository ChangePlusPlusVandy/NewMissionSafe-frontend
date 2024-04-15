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
import CreateEvent from "./pages/Events/CreateEvent";
import EventInfo from "./pages/Events/EventInfo";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Events from "./pages/Events/Events";
import Youth from "./pages/Youth/Youth";
import Staff from "./pages/Staff";
import RegisterYouth from "./pages/Auth/RegisterYouth";
import RegisterStaff from "./pages/Auth/RegisterStaff";
import Unauthorized from "./pages/Auth/Unauthorized";

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
      <Route
        path="/register-staff"
        element={<PrivateRoute element={<RegisterStaff />} />}
      />
      <Route
        path="/register-youth"
        element={<PrivateRoute element={<RegisterYouth />} />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/events" element={<PrivateRoute element={<Events />} />} />
      <Route path="/view-event/:eventCode" element={<PrivateRoute element={<EventInfo />} />} />
      <Route path="/youth" element={<PrivateRoute element={<Youth />} />} />
      <Route path="/staff" element={<PrivateRoute element={<Staff />} />} />
      <Route path="/unauthorized" element={<PrivateRoute element={<Unauthorized />} />} />
    </>
  )
);

const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
