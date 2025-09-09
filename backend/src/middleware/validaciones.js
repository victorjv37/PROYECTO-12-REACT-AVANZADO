import { body } from "express-validator";

export const validarRegistro = [
  body("nombre")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Debe proporcionar un email válido"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const validarLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Debe proporcionar un email válido"),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

export const validarEvento = [
  body("titulo")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 3 y 100 caracteres"),

  body("descripcion")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("La descripción debe tener entre 10 y 1000 caracteres"),

  body("fecha")
    .isISO8601()
    .withMessage("Debe proporcionar una fecha válida")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("La fecha del evento debe ser futura");
      }
      return true;
    }),

  body("ubicacion")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("La ubicación debe tener entre 5 y 200 caracteres"),

  body("capacidadMaxima")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacidad máxima debe ser un número positivo"),

  body("precio")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio no puede ser negativo"),

  body("categoria")
    .optional()
    .isIn([
      "conferencia",
      "taller",
      "networking",
      "social",
      "deportivo",
      "cultural",
      "otro",
    ])
    .withMessage("Categoría inválida"),
];
