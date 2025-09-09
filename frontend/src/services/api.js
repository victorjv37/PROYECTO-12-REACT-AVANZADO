import axios from "axios";

// Configuración base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Si el token expiró, limpiar localStorage y redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }

    // Extraer mensaje de error más legible
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      "Error de conexión";

    return Promise.reject(new Error(errorMessage));
  }
);

// Función genérica para hacer peticiones API
export const apiRequest = async (
  method,
  endpoint,
  data = null,
  options = {}
) => {
  try {
    const config = {
      method,
      url: endpoint,
      ...options,
    };

    // Si hay datos y no es GET/DELETE, agregarlos
    if (data && !["GET", "DELETE"].includes(method.toUpperCase())) {
      if (data instanceof FormData) {
        config.data = data;
        config.headers = {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        };
      } else {
        config.data = data;
      }
    }

    // Si es GET y hay datos, agregarlos como params
    if (method.toUpperCase() === "GET" && data) {
      config.params = data;
    }

    const response = await api(config);
    return response;
  } catch (error) {
    throw error;
  }
};

// Métodos específicos para mayor comodidad
export const apiGet = (endpoint, params = null) =>
  apiRequest("GET", endpoint, params);

export const apiPost = (endpoint, data = null) =>
  apiRequest("POST", endpoint, data);

export const apiPut = (endpoint, data = null) =>
  apiRequest("PUT", endpoint, data);

export const apiDelete = (endpoint) => apiRequest("DELETE", endpoint);

// Servicios específicos de autenticación
export const authService = {
  registro: (datos) => apiPost("/auth/registro", datos),
  login: (datos) => apiPost("/auth/login", datos),
  perfil: () => apiGet("/auth/perfil"),
  actualizarPerfil: (datos) => apiPut("/auth/perfil", datos),
};

// Servicios específicos de eventos
export const eventosService = {
  obtenerEventos: (filtros = {}) => apiGet("/eventos", filtros),
  obtenerEvento: (id) => apiGet(`/eventos/${id}`),
  crearEvento: (datos) => apiPost("/eventos", datos),
  actualizarEvento: (id, datos) => apiPut(`/eventos/${id}`, datos),
  eliminarEvento: (id) => apiDelete(`/eventos/${id}`),
  confirmarAsistencia: (id) => apiPost(`/eventos/${id}/asistir`),
  cancelarAsistencia: (id) => apiDelete(`/eventos/${id}/asistir`),
};

export default api;
