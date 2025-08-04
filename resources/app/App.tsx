import "@/css/app.css";

import { Toaster, toast } from "sonner";
import UsersPage from "./pages/Users";
import MainLayout from "./layout/MainLayout";
import { HeroUIProvider } from "@heroui/react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { setupApiInterceptor } from "./services/apiConfig";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import PatientsPage from "./pages/Patients";
import AppointmentsPage from "./pages/Appointments";
import { useNavigate, Navigate } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import Login from "./pages/Login";
import EventsPage from "./pages/Events";
import AccidentsPage from "./pages/Accidents";
import InspectionsPage from "./pages/Inspections";
import OccupationalExamsPage from "./pages/OccupationalExams";
import EppDeliveriesPage from "@/pages/EppDeliveries";
import EnvironmentalMonitoringsPage from "@/pages/EnvironmentalMonitorings";
import CommitteeMinutesPage from "./pages/CommitteeMinutes";

function App () {
  const navigate = useNavigate();
  const { resetAuth, user } = useAuthStore();

  useEffect(() => {
    setupApiInterceptor(() => {
      resetAuth();
      toast.error("Sesión expirada, inicie sesión nuevamente", {
        id: "toast",
        duration: 1500
      });
    });
  }, []);

  return (
    <HeroUIProvider navigate={navigate} validationBehavior="aria">
      <Toaster richColors position="top-right" />
      <Routes>

        <Route
          path="/"
          element={
            user
              ? <Navigate to="/dashboard" />
              : <Login />
          }
        />

        <Route
          element={
            <PrivateRoute roles={[__ADMIN_ROLE_ID__]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="/usuarios"
            element={<UsersPage />} />
        </Route>

        <Route
          element={
            <PrivateRoute roles={[__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__]}>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<DashboardPage />} />
          <Route
            path="/pacientes"
            element={<PatientsPage />} />
          <Route
            path="/citas"
            element={<AppointmentsPage />} />
          <Route
            path="/eventos"
            element={<EventsPage />} />
          <Route
            path="/accidentes"
            element={<AccidentsPage />} />
          <Route
            path="/inspecciones"
            element={<InspectionsPage />} />
          <Route
            path="/examenes-ocupacionales"
            element={<OccupationalExamsPage />} />
          <Route
            path="/entregas-epp"
            element={<EppDeliveriesPage />} />
          <Route
            path="/monitoreos-ambientales"
            element={<EnvironmentalMonitoringsPage />} />
          <Route
            path="/actas-comite"
            element={<CommitteeMinutesPage />} />
        </Route>

        <Route
          path="*"
          element={
            user
              ? <Navigate to="/dashboard" />
              : <Login />
          }
        />

      </Routes>

    </HeroUIProvider>
  );
}

export default App;
