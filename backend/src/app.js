import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.js";
import eventosRoutes from "./routes/eventos.js";

import { conectarBD } from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

conectarBD();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://tu-frontend-en-vercel.vercel.app"]
        : [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5000",
            "http://127.0.0.1:5000",
          ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/eventos", eventosRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Ya existe un registro con esos datos",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "ID inválido",
    });
  }

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
});
