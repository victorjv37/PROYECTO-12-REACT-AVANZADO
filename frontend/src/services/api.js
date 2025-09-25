import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      "Error de conexión";

    return Promise.reject(new Error(errorMessage));
  }
);

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

    if (method.toUpperCase() === "GET" && data) {
      config.params = data;
    }

    const response = await api(config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiGet = (endpoint, params = null) =>
  apiRequest("GET", endpoint, params);

export const apiPost = (endpoint, data = null) =>
  apiRequest("POST", endpoint, data);

export const apiPut = (endpoint, data = null) =>
  apiRequest("PUT", endpoint, data);

export const apiDelete = (endpoint) => apiRequest("DELETE", endpoint);

export const authService = {
  registro: (datos) => apiPost("/auth/registro", datos),
  login: (datos) => apiPost("/auth/login", datos),
  perfil: () => apiGet("/auth/perfil"),
  actualizarPerfil: (datos) => apiPut("/auth/perfil", datos),
};

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
