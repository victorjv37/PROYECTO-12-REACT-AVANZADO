import Evento from "../models/Evento.js";
import Usuario from "../models/Usuario.js";
import { validationResult } from "express-validator";

export const obtenerEventos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoria,
      ordenPor = "fecha",
      orden = "asc",
      busqueda,
    } = req.query;

    const filtros = { estado: "activo" };

    // Filtrar por categoría si se proporciona
    if (categoria && categoria !== "all") {
      filtros.categoria = categoria;
    }

    // Buscar por texto si se proporciona
    if (busqueda) {
      filtros.$text = { $search: busqueda };
    }

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[ordenPor] = orden === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const eventos = await Evento.find(filtros)
      .populate("creador", "nombre email avatar")
      .populate("asistentes", "nombre email avatar")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalEventos = await Evento.countDocuments(filtros);
    const totalPaginas = Math.ceil(totalEventos / parseInt(limit));

    res.json({
      success: true,
      data: {
        eventos,
        paginacion: {
          paginaActual: parseInt(page),
          totalPaginas,
          totalEventos,
          eventosEnPagina: eventos.length,
        },
      },
    });
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const obtenerEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findById(id)
      .populate("creador", "nombre email avatar")
      .populate("asistentes", "nombre email avatar");

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado",
      });
    }

    res.json({
      success: true,
      data: evento,
    });
  } catch (error) {
    console.error("Error obteniendo evento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const crearEvento = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const {
      titulo,
      descripcion,
      fecha,
      ubicacion,
      capacidadMaxima,
      precio,
      categoria,
    } = req.body;
    const cartel = req.file ? req.file.filename : null;

    const nuevoEvento = new Evento({
      titulo,
      descripcion,
      fecha: new Date(fecha),
      ubicacion,
      capacidadMaxima: capacidadMaxima || null,
      precio: precio || 0,
      categoria: categoria || "otro",
      cartel,
      creador: req.usuario._id,
    });

    await nuevoEvento.save();

    // Agregar evento a la lista de eventos creados del usuario
    await Usuario.findByIdAndUpdate(req.usuario._id, {
      $push: { eventosCreados: nuevoEvento._id },
    });

    // Poblar datos para la respuesta
    await nuevoEvento.populate("creador", "nombre email avatar");

    res.status(201).json({
      success: true,
      message: "Evento creado exitosamente",
      data: nuevoEvento,
    });
  } catch (error) {
    console.error("Error creando evento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      fecha,
      ubicacion,
      capacidadMaxima,
      precio,
      categoria,
    } = req.body;
    const cartel = req.file ? req.file.filename : undefined;

    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado",
      });
    }

    // Verificar que el usuario es el creador
    if (evento.creador.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para modificar este evento",
      });
    }

    const datosActualizacion = {};
    if (titulo) datosActualizacion.titulo = titulo;
    if (descripcion) datosActualizacion.descripcion = descripcion;
    if (fecha) datosActualizacion.fecha = new Date(fecha);
    if (ubicacion) datosActualizacion.ubicacion = ubicacion;
    if (capacidadMaxima !== undefined)
      datosActualizacion.capacidadMaxima = capacidadMaxima || null;
    if (precio !== undefined) datosActualizacion.precio = precio;
    if (categoria) datosActualizacion.categoria = categoria;
    if (cartel) datosActualizacion.cartel = cartel;

    const eventoActualizado = await Evento.findByIdAndUpdate(
      id,
      datosActualizacion,
      { new: true, runValidators: true }
    )
      .populate("creador", "nombre email avatar")
      .populate("asistentes", "nombre email avatar");

    res.json({
      success: true,
      message: "Evento actualizado exitosamente",
      data: eventoActualizado,
    });
  } catch (error) {
    console.error("Error actualizando evento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado",
      });
    }

    // Verificar que el usuario es el creador
    if (evento.creador.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para eliminar este evento",
      });
    }

    await Evento.findByIdAndDelete(id);

    // Remover evento de las listas de usuarios
    await Usuario.updateMany(
      { $or: [{ eventosCreados: id }, { eventosAsistidos: id }] },
      {
        $pull: {
          eventosCreados: id,
          eventosAsistidos: id,
        },
      }
    );

    res.json({
      success: true,
      message: "Evento eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error eliminando evento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const confirmarAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario._id;

    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado",
      });
    }

    // Verificar si el evento está lleno
    if (evento.estaLleno) {
      return res.status(400).json({
        success: false,
        message: "El evento ha alcanzado su capacidad máxima",
      });
    }

    // Verificar si ya está confirmado
    if (evento.asistentes.includes(usuarioId)) {
      return res.status(400).json({
        success: false,
        message: "Ya has confirmado tu asistencia a este evento",
      });
    }

    // Agregar usuario a la lista de asistentes
    evento.asistentes.push(usuarioId);
    await evento.save();

    // Agregar evento a la lista de eventos asistidos del usuario
    await Usuario.findByIdAndUpdate(usuarioId, {
      $push: { eventosAsistidos: id },
    });

    await evento.populate("asistentes", "nombre email avatar");

    res.json({
      success: true,
      message: "Asistencia confirmada exitosamente",
      data: evento,
    });
  } catch (error) {
    console.error("Error confirmando asistencia:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const cancelarAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario._id;

    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado",
      });
    }

    // Verificar si está en la lista de asistentes
    if (!evento.asistentes.includes(usuarioId)) {
      return res.status(400).json({
        success: false,
        message: "No tienes confirmada la asistencia a este evento",
      });
    }

    // Remover usuario de la lista de asistentes
    evento.asistentes = evento.asistentes.filter(
      (asistente) => asistente.toString() !== usuarioId.toString()
    );
    await evento.save();

    // Remover evento de la lista de eventos asistidos del usuario
    await Usuario.findByIdAndUpdate(usuarioId, {
      $pull: { eventosAsistidos: id },
    });

    await evento.populate("asistentes", "nombre email avatar");

    res.json({
      success: true,
      message: "Asistencia cancelada exitosamente",
      data: evento,
    });
  } catch (error) {
    console.error("Error cancelando asistencia:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
