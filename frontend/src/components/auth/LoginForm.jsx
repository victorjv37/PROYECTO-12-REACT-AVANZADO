import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Input from "../common/Input";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (datos) => {
    console.log("🔑 Iniciando login con datos:", datos);
    const resultado = await login(datos);
    console.log("📊 Resultado del login:", resultado);

    if (resultado.success) {
      console.log("🎉 Login exitoso, navegando a home...");
      navigate("/");
    } else {
      console.log("❌ Error en login:", resultado.error);
      if (resultado.error.includes("email")) {
        setError("email", { message: resultado.error });
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
          <h2 className="ichiraku-login-title">Inicia sesión ninja</h2>
          <p className="ichiraku-login-subtitle">
            O <Link to="/registro">crea una cuenta nueva para la aldea</Link>
          </p>
        </div>

        {/* Formulario */}
        <form
          className="ichiraku-login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="ichiraku-login-fields">
            {/* Email */}
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

            {/* Contraseña */}
            <div className="ichiraku-login-password-field">
              <Input
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                placeholder="Tu contraseña"
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
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="ichiraku-login-submit-icon" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
