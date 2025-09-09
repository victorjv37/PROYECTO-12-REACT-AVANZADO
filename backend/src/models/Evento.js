import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [3, "El título debe tener al menos 3 caracteres"],
      maxlength: [100, "El título no puede exceder 100 caracteres"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      minlength: [10, "La descripción debe tener al menos 10 caracteres"],
      maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "La fecha del evento debe ser futura",
      },
    },
    ubicacion: {
      type: String,
      required: [true, "La ubicación es obligatoria"],
      trim: true,
      minlength: [5, "La ubicación debe tener al menos 5 caracteres"],
      maxlength: [200, "La ubicación no puede exceder 200 caracteres"],
    },
    cartel: {
      type: String,
      default: null,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El creador es obligatorio"],
    },
    asistentes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
    capacidadMaxima: {
      type: Number,
      default: null,
      min: [1, "La capacidad máxima debe ser al menos 1"],
    },
    precio: {
      type: Number,
      default: 0,
      min: [0, "El precio no puede ser negativo"],
    },
    categoria: {
      type: String,
      enum: [
        "conferencia",
        "taller",
        "networking",
        "social",
        "deportivo",
        "cultural",
        "otro",
      ],
      default: "otro",
    },
    estado: {
      type: String,
      enum: ["activo", "cancelado", "finalizado"],
      default: "activo",
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas eficientes
eventoSchema.index({ fecha: 1 });
eventoSchema.index({ categoria: 1 });
eventoSchema.index({ creador: 1 });
eventoSchema.index({ titulo: "text", descripcion: "text" });

// Virtual para obtener el número de asistentes
eventoSchema.virtual("numeroAsistentes").get(function () {
  return this.asistentes.length;
});

// Virtual para verificar si está lleno
eventoSchema.virtual("estaLleno").get(function () {
  return this.capacidadMaxima && this.asistentes.length >= this.capacidadMaxima;
});

// Configurar virtuals en JSON
eventoSchema.set("toJSON", { virtuals: true });
eventoSchema.set("toObject", { virtuals: true });

export default mongoose.model("Evento", eventoSchema);
