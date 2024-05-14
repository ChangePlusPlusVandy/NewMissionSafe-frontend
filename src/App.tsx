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
import YouthInfoPage from "./pages/YouthInfo";
import StaffInfoPage from "./pages/StaffInfo";
import Unauthorized from "./pages/Auth/Unauthorized";
import Attendance from "./pages/Attendance/Attendance";
import AttendanceReport from "./pages/Attendance/AttendanceReport";
import DropIn from "./pages/Attendance/DropIn";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PrivateRoute element={<Home />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route
        path="/attendance"
        element={<PrivateRoute element={<Attendance />} />}
      />
      <Route
        path="/attendance/report"
        element={<PrivateRoute element={<AttendanceReport />} />}
      />
      <Route
        path="/attendance/drop-in"
        element={<PrivateRoute element={<DropIn />} />}
      />
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
      <Route
        path="/view-event/:eventCode"
        element={<PrivateRoute element={<EventInfo />} />}
      />
      <Route path="/youth" element={<PrivateRoute element={<Youth />} />} />
      <Route path="/staff" element={<PrivateRoute element={<Staff />} />} />
      <Route
        path="/unauthorized"
        element={<PrivateRoute element={<Unauthorized />} />}
      />
      <Route
        path="/staff/:firebaseUID"
        element={<PrivateRoute element={<StaffInfoPage />} />}
      />
      <Route
        path="/youth/:firebaseUID"
        element={<PrivateRoute element={<YouthInfoPage />} />}
      />
    </>
  )
);

const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
