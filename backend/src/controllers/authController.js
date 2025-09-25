import Usuario from "../models/Usuario.js";
import { generarToken } from "../utils/jwt.js";
import { validationResult } from "express-validator";

export const registrarUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con este email",
      });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
    });

    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario._id);

    console.log("✅ Usuario registrado:", {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
    });
    console.log("🔑 Token generado:", token ? "Sí" : "No");

    const responseData = {
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        usuario: nuevoUsuario,
        token,
      },
    };

    console.log(
      "📤 Enviando respuesta:",
      JSON.stringify(responseData, null, 2)
    );

    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    const token = generarToken(usuario._id);

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        usuario,
        token,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id)
      .populate("eventosCreados", "titulo fecha ubicacion")
      .populate("eventosAsistidos", "titulo fecha ubicacion");

    res.json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre } = req.body;
    const avatar = req.file ? req.file.filename : undefined;

    const datosActualizacion = {};
    if (nombre) datosActualizacion.nombre = nombre;
    if (avatar) datosActualizacion.avatar = avatar;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      datosActualizacion,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      data: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
