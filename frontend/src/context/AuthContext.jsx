import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verificarAuth = async () => {
      const token = localStorage.getItem("token");
      const usuarioGuardado = localStorage.getItem("usuario");

      if (token && usuarioGuardado) {
        try {
          const response = await authService.perfil();
          setUsuario(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    verificarAuth();
  }, []);

  const login = async (credenciales) => {
    try {
      setLoading(true);
      const response = await authService.login(credenciales);

      const { usuario: usuarioData, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuarioData));

      setUsuario(usuarioData);
      setIsAuthenticated(true);

      toast.success(response.message || "Inicio de sesión exitoso");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Error en el inicio de sesión");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const registro = async (datosUsuario) => {
    try {
      setLoading(true);
      console.log("🔄 Iniciando registro con datos:", datosUsuario);

      const response = await authService.registro(datosUsuario);
      console.log("✅ Respuesta del servidor:", response);

      const { usuario: usuarioData, token } = response.data;
      console.log("👤 Datos del usuario:", usuarioData);
      console.log("🔑 Token recibido:", token ? "Sí" : "No");

      if (!token || !usuarioData) {
        throw new Error("Respuesta del servidor incompleta");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuarioData));
      console.log("💾 Datos guardados en localStorage");

      setUsuario(usuarioData);
      setIsAuthenticated(true);
      console.log("🔓 Estado de autenticación actualizado");

      toast.success(response.message || "Registro exitoso");
      return { success: true };
    } catch (error) {
      console.error("❌ Error en registro:", error);
      toast.error(error.message || "Error en el registro");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setIsAuthenticated(false);
    toast.success("Sesión cerrada exitosamente");
  };

  const actualizarPerfil = async (datos) => {
    try {
      setLoading(true);
      const response = await authService.actualizarPerfil(datos);

      const usuarioActualizado = response.data;

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      setUsuario(usuarioActualizado);

      toast.success(response.message || "Perfil actualizado exitosamente");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Error actualizando el perfil");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    usuario,
    loading,
    isAuthenticated,
    login,
    registro,
    logout,
    actualizarPerfil,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
