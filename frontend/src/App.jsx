import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EventosProvider } from "./context/EventosContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Layout from "./components/layout/Layout";
import EventsPage from "./pages/EventsPage";
import FavoritesPage from "./pages/FavoritesPage";
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
        <FavoritesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<EventsPage />} />
                <Route path="/favoritos" element={<FavoritesPage />} />
                <Route path="/perfil" element={<DevPage />} />
                <Route path="/configuracion" element={<DevPage />} />
                <Route path="/eventos/:id" element={<DevPage />} />
                <Route path="/dev" element={<DevPage />} />
              </Route>

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

              <Route
                path="/eventos/crear"
                element={
                  <ProtectedRoute>
                    <CreateEventForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favoritos"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />

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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </FavoritesProvider>
      </EventosProvider>
    </AuthProvider>
  );
}

export default App;
