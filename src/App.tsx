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
import ProgramSupplyRequest from "./pages/Forms/ProgramSupplyRequest";
import ProgressLog from "./pages/Forms/ProgressLog";
import VanLog from "./pages/Forms/VanLog";
import PartnershipsResourcesInternshipsForm from "./pages/Forms/PartnershipsResourcesInternshipsForm";
import CheckRequestForm from "./pages/Forms/CheckRequestForm";
import IncidentReport from "./pages/Forms/IncidentReport";
import FormLanding from "./pages/Forms/FormLanding";
import Forms from "./pages/Forms";
import ExpenseForm from "./pages/Forms/ExpenseForm";
import HorizonForm from "./pages/Forms/HorizonForm";
import YouthInfoPage from "./pages/YouthInfo";
import StaffInfoPage from "./pages/StaffInfo";
import Unauthorized from "./pages/Auth/Unauthorized";
import FormInfo from "./pages/Forms/FormInfo";

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
      <Route
        path="/view-event/:eventCode"
        element={<PrivateRoute element={<EventInfo />} />}
      />
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
      <Route
        path="/forms/:formID"
        element={<PrivateRoute element={<FormLanding />} />}
      />
      <Route
        path="/forms/:formID/:responseID"
        element={<PrivateRoute element={<FormInfo />} />}
      />
      <Route path="/forms" element={<PrivateRoute element={<Forms />} />} />

      <Route
        path="/forms/expense-form"
        element={<PrivateRoute element={<ExpenseForm formID="0002" />} />}
      />
      <Route
        path="/forms/horizon-form"
        element={<PrivateRoute element={<HorizonForm formID="0003" />} />}
      />
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
