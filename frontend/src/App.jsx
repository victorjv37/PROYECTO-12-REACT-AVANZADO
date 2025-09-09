import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EventosProvider } from "./context/EventosContext";
import Layout from "./components/layout/Layout";
import EventsPage from "./pages/EventsPage";
import DevPage from "./pages/DevPage";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import CreateEventForm from "./components/events/CreateEventForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <EventosProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Layout />}>
              <Route index element={<EventsPage />} />
            </Route>

            {/* Rutas de autenticación (solo para usuarios no autenticados) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />
            <Route
              path="/registro"
              element={
                <PublicRoute>
                  <RegisterForm />
                </PublicRoute>
              }
            />

            {/* Rutas protegidas */}
            <Route
              path="/eventos/crear"
              element={
                <ProtectedRoute>
                  <CreateEventForm />
                </ProtectedRoute>
              }
            />

            {/* Rutas en desarrollo - redirigen a DevPage */}
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <DevPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracion"
              element={
                <ProtectedRoute>
                  <DevPage />
                </ProtectedRoute>
              }
            />
            <Route path="/eventos/:id" element={<DevPage />} />
            <Route path="/dev" element={<DevPage />} />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </EventosProvider>
    </AuthProvider>
  );
}

export default App;
