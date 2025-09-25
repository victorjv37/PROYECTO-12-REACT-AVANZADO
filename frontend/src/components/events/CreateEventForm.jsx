import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Image,
  Tag,
  FileText,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useEventos } from "../../context/EventosContext";
import Input from "../common/Input";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";

const CreateEventForm = ({
  isOpen = true,
  onClose = null,
  onEventCreated = null,
  eventoParaEditar = null,
}) => {
  const [cartelPreview, setCartelPreview] = useState(null);
  const { crearEvento, actualizarEvento, loading } = useEventos();
  const navigate = useNavigate();
  const esEdicion = Boolean(eventoParaEditar);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset,
    setValue,
  } = useForm();

  const watchCartel = watch("cartel");

  useEffect(() => {
    if (esEdicion && eventoParaEditar) {
      const fechaFormateada = new Date(eventoParaEditar.fecha)
        .toISOString()
        .slice(0, 16);

      reset({
        titulo: eventoParaEditar.titulo,
        descripcion: eventoParaEditar.descripcion,
        fecha: fechaFormateada,
        ubicacion: eventoParaEditar.ubicacion,
        categoria: eventoParaEditar.categoria,
        precio: eventoParaEditar.precio || 0,
        capacidadMaxima: eventoParaEditar.capacidadMaxima || "",
      });

      if (eventoParaEditar.cartel) {
        setCartelPreview(
          eventoParaEditar.cartel.startsWith("http")
            ? eventoParaEditar.cartel
            : `http://localhost:5000/uploads/${eventoParaEditar.cartel}`
        );
      }
    }
  }, [esEdicion, eventoParaEditar, reset]);

  const handleCartelChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCartelPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCartelPreview(null);
    }
  };

  const onSubmit = async (datos) => {
    try {
      const formData = new FormData();

      formData.append("titulo", datos.titulo.trim());
      formData.append("descripcion", datos.descripcion.trim());
      formData.append("fecha", datos.fecha);
      formData.append("ubicacion", datos.ubicacion.trim());
      formData.append("categoria", datos.categoria);

      if (
        datos.capacidadMaxima &&
        datos.capacidadMaxima.toString().trim() !== ""
      ) {
        formData.append("capacidadMaxima", parseInt(datos.capacidadMaxima));
      }
      if (datos.precio && datos.precio.toString().trim() !== "") {
        formData.append("precio", parseFloat(datos.precio));
      }

      if (datos.cartel && datos.cartel[0]) {
        formData.append("cartel", datos.cartel[0]);
      }

      console.log("Enviando datos:", {
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        fecha: datos.fecha,
        ubicacion: datos.ubicacion,
        categoria: datos.categoria,
        capacidadMaxima: datos.capacidadMaxima,
        precio: datos.precio,
        cartel: datos.cartel?.[0]?.name,
      });

      let resultado;

      if (esEdicion) {
        resultado = await actualizarEvento(eventoParaEditar._id, formData);
      } else {
        resultado = await crearEvento(formData);
      }

      if (resultado.success) {
        if (onEventCreated) {
          onEventCreated();
        } else {
          navigate("/");
        }
      } else {
        console.error(
          `Error ${esEdicion ? "actualizando" : "creando"} evento:`,
          resultado.error
        );
        if (resultado.error.includes("titulo")) {
          setError("titulo", { message: resultado.error });
        } else if (resultado.error.includes("fecha")) {
          setError("fecha", { message: resultado.error });
        } else {
          setError("root", { message: resultado.error });
        }
      }
    } catch (error) {
      console.error("Error en onSubmit:", error);
      setError("root", {
        message: `Error inesperado al ${
          esEdicion ? "actualizar" : "crear"
        } el evento`,
      });
    }
  };

  const categorias = [
    { value: "conferencia", label: "🎤 Conferencia" },
    { value: "taller", label: "🔧 Taller" },
    { value: "networking", label: "🤝 Networking" },
    { value: "social", label: "🎉 Social" },
    { value: "deportivo", label: "⚽ Deportivo" },
    { value: "cultural", label: "🎭 Cultural" },
    { value: "otro", label: "📦 Otro" },
  ];

  if (loading) {
    return (
      <div className="ichiraku-create-event__loading">
        <LoadingSpinner
          size="lg"
          text={`${esEdicion ? "Actualizando" : "Creando"} evento ninja...`}
          variant="rasengan"
          theme="ninja"
        />
      </div>
    );
  }

  const containerClasses = onClose
    ? "ichiraku-create-event ichiraku-create-event--modal"
    : "ichiraku-create-event";

  return (
    <div className={containerClasses}>
      {onClose && (
        <div className="ichiraku-create-event__overlay" onClick={onClose} />
      )}
      <div className="ichiraku-create-event__container">
        {/* Header */}
        <div className="ichiraku-create-event__header">
          <Button
            variant="ghost"
            size="md"
            icon={ArrowLeft}
            onClick={onClose ? onClose : () => navigate("/")}
            className="ichiraku-create-event__back"
          >
            {onClose ? "Cerrar" : "Volver"}
          </Button>

          <div className="ichiraku-create-event__title-section">
            <h1 className="ichiraku-create-event__title">
              <Plus className="ichiraku-create-event__title-icon" />
              {esEdicion ? "Editar Evento Ninja" : "Crear Evento Ninja"}
            </h1>
            <p className="ichiraku-create-event__subtitle">
              Organiza un evento increíble para la aldea
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="ichiraku-create-event__form"
        >
          <div className="ichiraku-create-event__sections">
            {/* Información básica */}
            <div className="ichiraku-create-event__section">
              <h3 className="ichiraku-create-event__section-title">
                <FileText className="ichiraku-create-event__section-icon" />
                Información Básica
              </h3>

              <div className="ichiraku-create-event__fields">
                <Input
                  label="Título del Evento"
                  type="text"
                  icon={Tag}
                  placeholder="Ej: Torneo de Kunais de Primavera"
                  required
                  size="md"
                  error={errors.titulo?.message}
                  {...register("titulo", {
                    required: "El título es obligatorio",
                    minLength: {
                      value: 3,
                      message: "El título debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 100,
                      message: "El título no puede exceder 100 caracteres",
                    },
                  })}
                />

                <div className="ichiraku-create-event__textarea-field">
                  <label className="ichiraku-input-label">
                    Descripción
                    <span className="ichiraku-input-label--required">*</span>
                  </label>
                  <textarea
                    className={`ichiraku-input ichiraku-input--textarea ${
                      errors.descripcion ? "ichiraku-input--error" : ""
                    }`}
                    placeholder="Describe tu evento ninja con todos los detalles..."
                    rows="4"
                    {...register("descripcion", {
                      required: "La descripción es obligatoria",
                      minLength: {
                        value: 10,
                        message:
                          "La descripción debe tener al menos 10 caracteres",
                      },
                      maxLength: {
                        value: 1000,
                        message:
                          "La descripción no puede exceder 1000 caracteres",
                      },
                    })}
                  />
                  {errors.descripcion && (
                    <div className="ichiraku-input-error">
                      {errors.descripcion.message}
                    </div>
                  )}
                </div>

                <div className="ichiraku-create-event__row">
                  <Input
                    label="Fecha y Hora"
                    type="datetime-local"
                    icon={Calendar}
                    required
                    size="md"
                    error={errors.fecha?.message}
                    {...register("fecha", {
                      required: "La fecha es obligatoria",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const now = new Date();
                        return (
                          selectedDate > now || "La fecha debe ser en el futuro"
                        );
                      },
                    })}
                  />

                  <div className="ichiraku-create-event__select-field">
                    <label className="ichiraku-input-label">
                      Categoría
                      <span className="ichiraku-input-label--required">*</span>
                    </label>
                    <select
                      className={`ichiraku-input ${
                        errors.categoria ? "ichiraku-input--error" : ""
                      }`}
                      {...register("categoria", {
                        required: "La categoría es obligatoria",
                      })}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {errors.categoria && (
                      <div className="ichiraku-input-error">
                        {errors.categoria.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicación y detalles */}
            <div className="ichiraku-create-event__section">
              <h3 className="ichiraku-create-event__section-title">
                <MapPin className="ichiraku-create-event__section-icon" />
                Ubicación y Detalles
              </h3>

              <div className="ichiraku-create-event__fields">
                <Input
                  label="Ubicación"
                  type="text"
                  icon={MapPin}
                  placeholder="Ej: Parque Central de Konoha, Sector 7"
                  required
                  size="md"
                  error={errors.ubicacion?.message}
                  {...register("ubicacion", {
                    required: "La ubicación es obligatoria",
                    minLength: {
                      value: 5,
                      message: "La ubicación debe tener al menos 5 caracteres",
                    },
                    maxLength: {
                      value: 200,
                      message: "La ubicación no puede exceder 200 caracteres",
                    },
                  })}
                />

                <div className="ichiraku-create-event__row">
                  <Input
                    label="Capacidad Máxima"
                    type="number"
                    icon={Users}
                    placeholder="Ej: 50"
                    size="md"
                    helpText="Opcional - Deja vacío para capacidad ilimitada"
                    error={errors.capacidadMaxima?.message}
                    {...register("capacidadMaxima", {
                      min: {
                        value: 1,
                        message: "La capacidad debe ser al menos 1",
                      },
                      max: {
                        value: 10000,
                        message: "La capacidad no puede exceder 10,000",
                      },
                    })}
                  />

                  <Input
                    label="Precio"
                    type="number"
                    icon={DollarSign}
                    placeholder="0"
                    size="md"
                    helpText="En euros - 0 para eventos gratuitos"
                    error={errors.precio?.message}
                    {...register("precio", {
                      min: {
                        value: 0,
                        message: "El precio no puede ser negativo",
                      },
                      max: {
                        value: 999999,
                        message: "El precio es demasiado alto",
                      },
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Cartel del evento */}
            <div className="ichiraku-create-event__section">
              <h3 className="ichiraku-create-event__section-title">
                <Image className="ichiraku-create-event__section-icon" />
                Cartel del Evento
              </h3>

              <div className="ichiraku-create-event__upload">
                <input
                  type="file"
                  accept="image/*"
                  className="ichiraku-create-event__file-input"
                  id="cartel"
                  {...register("cartel", {
                    onChange: handleCartelChange,
                  })}
                />
                <label
                  htmlFor="cartel"
                  className="ichiraku-create-event__file-label"
                >
                  <Image className="ichiraku-create-event__upload-icon" />
                  <span>Seleccionar imagen del cartel</span>
                  <span className="ichiraku-create-event__upload-hint">
                    JPG, PNG o WebP (máx. 5MB)
                  </span>
                </label>

                {cartelPreview && (
                  <div className="ichiraku-create-event__preview">
                    <img
                      src={cartelPreview}
                      alt="Preview"
                      className="ichiraku-create-event__preview-image"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error general */}
          {errors.root && (
            <div className="ichiraku-create-event__error">
              {errors.root.message}
            </div>
          )}

          {/* Acciones */}
          <div className="ichiraku-create-event__actions">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose ? onClose : () => navigate("/")}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Plus}
              loading={loading}
              chakraGlow
            >
              {loading
                ? esEdicion
                  ? "Actualizando..."
                  : "Creando..."
                : esEdicion
                ? "Actualizar Evento"
                : "Crear Evento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;
