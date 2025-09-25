import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingrese un email válido",
      ],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    avatar: {
      type: String,
      default: null,
    },
    eventosCreados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evento",
      },
    ],
    eventosAsistidos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evento",
      },
    ],
  },
  {
    timestamps: true,
  }
);

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

usuarioSchema.methods.compararPassword = async function (passwordCandidato) {
  return await bcryptjs.compare(passwordCandidato, this.password);
};

usuarioSchema.methods.toJSON = function () {
  const usuario = this.toObject();
  delete usuario.password;
  return usuario;
};

export default mongoose.model("Usuario", usuarioSchema);
