import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
} from "../controllers/authController.js";
import { verificarToken } from "../middleware/auth.js";
import { validarRegistro, validarLogin } from "../middleware/validaciones.js";
import { upload, manejarErrorMulter } from "../utils/upload.js";

const router = express.Router();

// Rutas públicas
router.post("/registro", validarRegistro, registrarUsuario);
router.post("/login", validarLogin, loginUsuario);

// Rutas protegidas
router.get("/perfil", verificarToken, obtenerPerfil);
router.put(
  "/perfil",
  verificarToken,
  upload.single("avatar"),
  manejarErrorMulter,
  actualizarPerfil
);

export default router;
