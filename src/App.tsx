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
import CreateEvent from "./pages/CreateEvent";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Youth from "./pages/Youth/Youth";
import RegisterYouth from "./pages/Auth/RegisterYouth";
import RegisterStaff from "./pages/Auth/RegisterStaff";
import ProgramSupplyRequest from "./pages/Forms/ProgramSupplyRequest";
import ProgressLog from "./pages/Forms/ProgressLog";
import VanLog from "./pages/Forms/VanLog";
import PartnershipsResourcesInternshipsForm from "./pages/Forms/PartnershipsResourcesInternshipsForm";
import CheckRequestForm from "./pages/Forms/CheckRequestForm";
import IncidentReport from "./pages/Forms/IncidentReport";
import FormLanding from "./pages/Forms/FormLanding";

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
      <Route path="/youth" element={<PrivateRoute element={<Youth />} />} />
      <Route
        path="/forms/partnerships-resources-internships"
        element={
          <PrivateRoute
            element={<PartnershipsResourcesInternshipsForm formID="10" />}
          />
        }
      />
      <Route
        path="/forms/program-supply-request"
        element={<PrivateRoute element={<ProgramSupplyRequest formID="5" />} />}
      />
      <Route
        path="/forms/progress-log"
        element={<PrivateRoute element={<ProgressLog formID="19" />} />}
      />
      <Route
        path="/forms/van-log"
        element={<PrivateRoute element={<VanLog formID="0015" />} />}
      />
      <Route
        path="/forms/check-request-form"
        element={<PrivateRoute element={<CheckRequestForm formID="0012" />} />}
      />
      <Route
        path="/forms/incident-report"
        element={<PrivateRoute element={<IncidentReport formID="00124" />} />}
      />
      <Route path="/forms/:formID" element={<PrivateRoute element={<FormLanding />} />} />
    </>
  )
);

const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
