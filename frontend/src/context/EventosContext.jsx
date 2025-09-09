import { createContext, useContext, useState, useCallback } from "react";
import { eventosService } from "../services/api";
import toast from "react-hot-toast";

const EventosContext = createContext();

export const useEventos = () => {
  const context = useContext(EventosContext);
  if (!context) {
    throw new Error("useEventos debe ser usado dentro de EventosProvider");
  }
  return context;
};

export const EventosProvider = ({ children }) => {
  const [eventos, setEventos] = useState([]);
  const [eventoActual, setEventoActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    categoria: "all",
    ordenPor: "fecha",
    orden: "asc",
    busqueda: "",
  });
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    totalEventos: 0,
    eventosEnPagina: 0,
  });

  const obtenerEventos = useCallback(
    async (nuevosFiltros = filtros, pagina = 1) => {
      try {
        setLoading(true);
        const params = {
          ...nuevosFiltros,
          page: pagina,
          limit: 12,
        };

        const response = await eventosService.obtenerEventos(params);

        setEventos(response.data.eventos);
        setPaginacion(response.data.paginacion);
        setFiltros(nuevosFiltros);

        return { success: true };
      } catch (error) {
        toast.error(error.message || "Error obteniendo eventos");
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [filtros]
  );

  const obtenerEvento = async (id) => {
    try {
      setLoading(true);
      const response = await eventosService.obtenerEvento(id);
      setEventoActual(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.message || "Error obteniendo evento");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const crearEvento = async (datosEvento) => {
    try {
      setLoading(true);
      const response = await eventosService.crearEvento(datosEvento);

      // Actualizar lista de eventos
      await obtenerEventos();

      toast.success(response.message || "Evento creado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.message || "Error creando evento");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarEvento = async (id, datosEvento) => {
    try {
      setLoading(true);
      const response = await eventosService.actualizarEvento(id, datosEvento);

      // Actualizar evento actual si es el mismo
      if (eventoActual && eventoActual._id === id) {
        setEventoActual(response.data);
      }

      // Actualizar lista de eventos
      await obtenerEventos();

      toast.success(response.message || "Evento actualizado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.message || "Error actualizando evento");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarEvento = async (id) => {
    try {
      setLoading(true);
      const response = await eventosService.eliminarEvento(id);

      // Actualizar lista de eventos
      await obtenerEventos();

      toast.success(response.message || "Evento eliminado exitosamente");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Error eliminando evento");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const confirmarAsistencia = async (id) => {
    try {
      setLoading(true);
      const response = await eventosService.confirmarAsistencia(id);

      // Actualizar evento actual
      if (eventoActual && eventoActual._id === id) {
        setEventoActual(response.data);
      }

      // Actualizar lista de eventos
      await obtenerEventos();

      toast.success(response.message || "Asistencia confirmada");
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.message || "Error confirmando asistencia");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelarAsistencia = async (id) => {
    try {
      setLoading(true);
      const response = await eventosService.cancelarAsistencia(id);

      // Actualizar evento actual
      if (eventoActual && eventoActual._id === id) {
        setEventoActual(response.data);
      }

      // Actualizar lista de eventos
      await obtenerEventos();

      toast.success(response.message || "Asistencia cancelada");
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.message || "Error cancelando asistencia");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarEventos = (textoBusqueda) => {
    const nuevosFiltros = {
      ...filtros,
      busqueda: textoBusqueda,
    };
    obtenerEventos(nuevosFiltros, 1);
  };

  const filtrarPorCategoria = (categoria) => {
    const nuevosFiltros = {
      ...filtros,
      categoria,
    };
    obtenerEventos(nuevosFiltros, 1);
  };

  const ordenarEventos = (ordenPor, orden) => {
    const nuevosFiltros = {
      ...filtros,
      ordenPor,
      orden,
    };
    obtenerEventos(nuevosFiltros, 1);
  };

  const limpiarEventoActual = () => {
    setEventoActual(null);
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = {
      categoria: "all",
      ordenPor: "fecha",
      orden: "asc",
      busqueda: "",
    };
    obtenerEventos(filtrosLimpios, 1);
  };

  const value = {
    eventos,
    eventoActual,
    loading,
    filtros,
    paginacion,
    obtenerEventos,
    obtenerEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    confirmarAsistencia,
    cancelarAsistencia,
    buscarEventos,
    filtrarPorCategoria,
    ordenarEventos,
    limpiarEventoActual,
    limpiarFiltros,
  };

  return (
    <EventosContext.Provider value={value}>{children}</EventosContext.Provider>
  );
};
