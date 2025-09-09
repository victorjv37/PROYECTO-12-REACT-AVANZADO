import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Input from "../common/Input";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { registro, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (datos) => {
    const { confirmPassword, ...datosRegistro } = datos;
    console.log("📝 Datos del formulario:", datosRegistro);

    const resultado = await registro(datosRegistro);
    console.log("📊 Resultado del registro:", resultado);

    if (resultado.success) {
      console.log("🎉 Registro exitoso, navegando a home...");
      // Auto-login después del registro exitoso
      navigate("/");
    } else {
      console.log("❌ Error en registro:", resultado.error);
      // Manejar errores específicos
      if (resultado.error.includes("email")) {
        setError("email", { message: resultado.error });
      } else if (resultado.error.includes("nombre")) {
        setError("nombre", { message: resultado.error });
      } else if (
        resultado.error.includes("contraseña") ||
        resultado.error.includes("password")
      ) {
        setError("password", { message: resultado.error });
      } else {
        setError("root", { message: resultado.error });
      }
    }
  };

  return (
    <div className="ichiraku-login-page">
      <div
        className={`ichiraku-login-container ${
          loading ? "ichiraku-login-container--loading" : ""
        }`}
      >
        {/* Header */}
        <div className="ichiraku-login-header">
          <div className="ichiraku-login-logo">🍜</div>
          <h2 className="ichiraku-login-title">Crea tu cuenta</h2>
          <p className="ichiraku-login-subtitle">
            O <Link to="/login">inicia sesión si ya tienes cuenta</Link>
          </p>
        </div>

        {/* Formulario */}
        <form
          className="ichiraku-login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="ichiraku-login-fields">
            <Input
              label="Nombre completo"
              type="text"
              icon={User}
              placeholder="Tu nombre completo"
              required
              size="md"
              error={errors.nombre?.message}
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El nombre no puede exceder 50 caracteres",
                },
              })}
            />

            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="tu@email.com"
              required
              size="md"
              error={errors.email?.message}
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Ingresa un email válido",
                },
              })}
            />

            <div className="ichiraku-login-password-field">
              <Input
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                placeholder="Mínimo 6 caracteres"
                required
                size="md"
                error={errors.password?.message}
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
              />

              <button
                type="button"
                className="ichiraku-login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff className="ichiraku-login-password-toggle-icon" />
                ) : (
                  <Eye className="ichiraku-login-password-toggle-icon" />
                )}
              </button>
            </div>

            <Input
              label="Confirmar contraseña"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              placeholder="Confirma tu contraseña"
              required
              size="md"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
            />
          </div>

          {/* Error general */}
          {errors.root && (
            <div className="ichiraku-login-error">
              <AlertCircle className="ichiraku-login-error-icon" />
              <p className="ichiraku-login-error-text">{errors.root.message}</p>
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            className="ichiraku-login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="ichiraku-spinner ichiraku-spinner--sm" />
                Creando cuenta...
              </>
            ) : (
              <>
                <User className="ichiraku-login-submit-icon" />
                Crear cuenta
              </>
            )}
          </button>

          <p
            className="text-xs text-gray-500 text-center"
            style={{
              marginTop: "1rem",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            Al registrarte, iniciarás sesión automáticamente para ahorrarte un
            paso innecesario.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
