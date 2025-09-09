import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import Evento from "../models/Evento.js";

export const verificarToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. Token no proporcionado.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Token inválido. Usuario no encontrado.",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error("Error en verificación de token:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token inválido.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

export const esCreadorEvento = async (req, res, next) => {
  try {
    const { eventoId } = req.params;
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado.",
      });
    }

    if (evento.creador.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para modificar este evento.",
      });
    }

    req.evento = evento;
    next();
  } catch (error) {
    console.error("Error verificando creador:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};
