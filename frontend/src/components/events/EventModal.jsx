import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  User,
  X,
  Star,
  Share2,
  Heart,
  Euro,
  Edit2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../../context/AuthContext";
import { useEventos } from "../../context/EventosContext";
import Button from "../common/Button";
import Card from "../common/Card";
import Portal from "../common/Portal";
import "./EventModal.css";

const EventModal = ({
  evento,
  isOpen,
  onClose,
  originPosition = { x: 0, y: 0 },
  onEditEvent = null,
}) => {
  const { isAuthenticated, usuario } = useAuth();
  const { confirmarAsistencia, cancelarAsistencia, eliminarEvento, loading } =
    useEventos();
  const [asistentes, setAsistentes] = useState(evento?.asistentes || []);
  const [isAttending, setIsAttending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (evento && usuario) {
      setAsistentes(evento.asistentes);
      setIsAttending(
        evento.asistentes.some((asistente) => asistente._id === usuario._id)
      );
    }
  }, [evento, usuario]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !evento) return null;

  const fechaCompleta = format(
    new Date(evento.fecha),
    "EEEE dd 'de' MMMM 'de' yyyy",
    { locale: es }
  );
  const horaCompleta = format(new Date(evento.fecha), "HH:mm", { locale: es });
  const esCreador = isAuthenticated && evento.creador._id === usuario?._id;
  const estaLleno =
    evento.capacidadMaxima && asistentes.length >= evento.capacidadMaxima;
  const porcentajeOcupacion = evento.capacidadMaxima
    ? (asistentes.length / evento.capacidadMaxima) * 100
    : 0;

  const getCategoriaInfo = (categoria) => {
    const categorias = {
      conferencia: { color: "blue", emoji: "🎤", label: "Conferencia" },
      taller: { color: "green", emoji: "🛠️", label: "Taller" },
      networking: { color: "purple", emoji: "🤝", label: "Networking" },
      social: { color: "pink", emoji: "🎉", label: "Social" },
      deportivo: { color: "orange", emoji: "⚽", label: "Deportivo" },
      cultural: { color: "indigo", emoji: "🎭", label: "Cultural" },
      otro: { color: "gray", emoji: "📅", label: "Otro" },
    };
    return categorias[categoria] || categorias.otro;
  };

  const categoriaInfo = getCategoriaInfo(evento.categoria);

  const handleAsistir = async () => {
    try {
      if (isAttending) {
        const result = await cancelarAsistencia(evento._id);
        if (result.success) {
          setAsistentes((prev) =>
            prev.filter((asistente) => asistente._id !== usuario._id)
          );
          setIsAttending(false);
        }
      } else {
        const result = await confirmarAsistencia(evento._id);
        if (result.success) {
          setAsistentes((prev) => [
            ...prev,
            { _id: usuario._id, nombre: usuario.nombre },
          ]);
          setIsAttending(true);
        }
      }
    } catch (error) {
      console.error("Error al manejar asistencia:", error);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Duración de la animación de cierre
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleEditEvent = () => {
    if (onEditEvent) {
      onEditEvent(evento);
      handleClose();
    }
  };

  const handleDeleteEvent = async () => {
    if (showDeleteConfirm) {
      try {
        await eliminarEvento(evento._id);
        handleClose();
      } catch (error) {
        console.error("Error al eliminar evento:", error);
      }
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-ocultar después de 3 segundos
      setTimeout(() => {
        setShowDeleteConfirm(false);
      }, 3000);
    }
  };

  return (
    <Portal>
      <div className="event-modal-backdrop" onClick={handleBackdropClick}>
        <div
          className={`event-modal ${isClosing ? "event-modal--closing" : ""}`}
          style={{
            "--origin-x": `${originPosition.x}px`,
            "--origin-y": `${originPosition.y}px`,
          }}
        >
          <div className="event-modal__container">
            {/* Header del modal */}
            <div className="event-modal__header">
              <div className="event-modal__header-content">
                <div
                  className={`event-modal__category event-modal__category--${categoriaInfo.color}`}
                >
                  <span className="event-modal__category-emoji">
                    {categoriaInfo.emoji}
                  </span>
                  <span className="event-modal__category-text">
                    {categoriaInfo.label}
                  </span>
                </div>

                {esCreador && (
                  <div className="event-modal__owner-badge">
                    <Star className="event-modal__owner-icon" />
                    <span>Tu evento</span>
                  </div>
                )}
              </div>

              <button
                className="event-modal__close-btn"
                onClick={handleClose}
                aria-label="Cerrar modal"
              >
                <X />
              </button>
            </div>

            {/* Imagen del evento */}
            <div className="event-modal__image">
              {evento.cartel ? (
                <img
                  src={
                    evento.cartel.startsWith("http")
                      ? evento.cartel
                      : `http://localhost:5000/uploads/${evento.cartel}`
                  }
                  alt={evento.titulo}
                  className="event-modal__img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="event-modal__image-fallback"
                style={{ display: evento.cartel ? "none" : "flex" }}
              >
                <span className="event-modal__fallback-emoji">
                  {categoriaInfo.emoji}
                </span>
              </div>

              {/* Precio overlay */}
              {evento.precio > 0 ? (
                <div className="event-modal__price event-modal__price--paid">
                  <Euro className="event-modal__price-icon" />
                  <span>{evento.precio}</span>
                </div>
              ) : (
                <div className="event-modal__price event-modal__price--free">
                  GRATIS
                </div>
              )}
            </div>

            {/* Contenido principal */}
            <div className="event-modal__content">
              {/* Título */}
              <h2 className="event-modal__title">{evento.titulo}</h2>

              {/* Información básica */}
              <div className="event-modal__info-grid">
                <div className="event-modal__info-item">
                  <Calendar className="event-modal__info-icon" />
                  <div>
                    <div className="event-modal__info-label">Fecha</div>
                    <div className="event-modal__info-value">
                      {fechaCompleta}
                    </div>
                  </div>
                </div>

                <div className="event-modal__info-item">
                  <Clock className="event-modal__info-icon" />
                  <div>
                    <div className="event-modal__info-label">Hora</div>
                    <div className="event-modal__info-value">
                      {horaCompleta}
                    </div>
                  </div>
                </div>

                <div className="event-modal__info-item">
                  <MapPin className="event-modal__info-icon" />
                  <div>
                    <div className="event-modal__info-label">Ubicación</div>
                    <div className="event-modal__info-value">
                      {evento.ubicacion}
                    </div>
                  </div>
                </div>

                <div className="event-modal__info-item">
                  <User className="event-modal__info-icon" />
                  <div>
                    <div className="event-modal__info-label">Organizador</div>
                    <div className="event-modal__info-value">
                      {evento.creador.nombre}
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="event-modal__description">
                <h3 className="event-modal__description-title">Descripción</h3>
                <p className="event-modal__description-text">
                  {evento.descripcion}
                </p>
              </div>

              {/* Estadísticas de asistencia */}
              <div className="event-modal__attendance">
                <div className="event-modal__attendance-header">
                  <h3 className="event-modal__attendance-title">
                    <Users className="event-modal__attendance-icon" />
                    Asistencia
                  </h3>
                  <div className="event-modal__attendance-count">
                    {asistentes.length}
                    {evento.capacidadMaxima &&
                      ` / ${evento.capacidadMaxima}`}{" "}
                    personas
                  </div>
                </div>

                {evento.capacidadMaxima && (
                  <div className="event-modal__progress-container">
                    <div className="event-modal__progress">
                      <div
                        className="event-modal__progress-bar"
                        style={{
                          width: `${Math.min(porcentajeOcupacion, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="event-modal__progress-text">
                      {Math.round(porcentajeOcupacion)}% completo
                    </div>
                  </div>
                )}

                {estaLleno && (
                  <div className="event-modal__full-notice">
                    🔴 Evento completo - No hay más plazas disponibles
                  </div>
                )}
              </div>

              {/* Lista de asistentes */}
              {asistentes.length > 0 && (
                <div className="event-modal__attendees">
                  <h3 className="event-modal__attendees-title">
                    Asistentes confirmados
                  </h3>
                  <div className="event-modal__attendees-list">
                    {asistentes.slice(0, 6).map((asistente, index) => (
                      <div
                        key={asistente._id}
                        className="event-modal__attendee"
                      >
                        <div className="event-modal__attendee-avatar">
                          {asistente.nombre?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="event-modal__attendee-name">
                          {asistente.nombre}
                        </span>
                      </div>
                    ))}
                    {asistentes.length > 6 && (
                      <div className="event-modal__attendee-more">
                        +{asistentes.length - 6} más
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones del modal */}
            <div className="event-modal__actions">
              {isAuthenticated && !esCreador && (
                <Button
                  variant={isAttending ? "secondary" : "primary"}
                  size="lg"
                  loading={loading}
                  disabled={!isAttending && estaLleno}
                  onClick={handleAsistir}
                  className="event-modal__attend-btn"
                  chakraGlow={!isAttending && !estaLleno}
                  fullWidth={true}
                >
                  {isAttending
                    ? "✓ Cancelar Asistencia"
                    : estaLleno
                    ? "🔴 Evento Completo"
                    : "🥷 Confirmar Asistencia"}
                </Button>
              )}

              {!isAuthenticated && (
                <div className="event-modal__auth-notice">
                  <p>Inicia sesión para confirmar tu asistencia al evento</p>
                  <Button variant="outline" size="lg" onClick={onClose}>
                    Iniciar Sesión
                  </Button>
                </div>
              )}

              {esCreador && (
                <div className="event-modal__creator-actions">
                  <Button
                    variant={showDeleteConfirm ? "danger" : "outline"}
                    size="lg"
                    className="event-modal__action-btn"
                    icon={Trash2}
                    onClick={handleDeleteEvent}
                    loading={loading}
                  >
                    {showDeleteConfirm ? "¿Confirmar?" : "Eliminar"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="event-modal__action-btn"
                    icon={Edit2}
                    onClick={handleEditEvent}
                  >
                    Editar Evento
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default EventModal;
