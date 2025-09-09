import express from "express";
import {
  obtenerEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  confirmarAsistencia,
  cancelarAsistencia,
} from "../controllers/eventosController.js";
import { verificarToken } from "../middleware/auth.js";
import { validarEvento } from "../middleware/validaciones.js";
import { upload, manejarErrorMulter } from "../utils/upload.js";

const router = express.Router();

// Rutas públicas
router.get("/", obtenerEventos);
router.get("/:id", obtenerEventoPorId);

// Rutas protegidas
router.post(
  "/",
  verificarToken,
  upload.single("cartel"),
  manejarErrorMulter,
  validarEvento,
  crearEvento
);

router.put(
  "/:id",
  verificarToken,
  upload.single("cartel"),
  manejarErrorMulter,
  actualizarEvento
);

router.delete("/:id", verificarToken, eliminarEvento);

// Rutas de asistencia
router.post("/:id/asistir", verificarToken, confirmarAsistencia);
router.delete("/:id/asistir", verificarToken, cancelarAsistencia);

export default router;
