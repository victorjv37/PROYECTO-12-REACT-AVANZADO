import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  User,
  Heart,
  Share2,
  Edit2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEventos } from "../../context/EventosContext";
import { useFavoritesContext } from "../../context/FavoritesContext";
import Button from "../common/Button";
import Card from "../common/Card";
import EventModal from "./EventModal";
import "./EventCard.css";

const EventCard = React.memo(({ evento, onEditEvent }) => {
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();
  const { confirmarAsistencia, cancelarAsistencia, eliminarEvento, loading } =
    useEventos();
  const { toggleFavorite, isFavorite } = useFavoritesContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOrigin, setModalOrigin] = useState({ x: 0, y: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const detailButtonRef = useRef(null);

  const dateInfo = useMemo(
    () => ({
      fechaFormateada: format(new Date(evento.fecha), "dd MMM", { locale: es }),
      horaFormateada: format(new Date(evento.fecha), "HH:mm", { locale: es }),
      fechaCompleta: format(new Date(evento.fecha), "PPP", { locale: es }),
    }),
    [evento.fecha]
  );

  const eventState = useMemo(
    () => ({
      yaEstaInscrito:
        isAuthenticated &&
        evento.asistentes.some((asistente) => asistente._id === usuario?._id),
      esCreador: isAuthenticated && evento.creador._id === usuario?._id,
      estaLleno:
        evento.capacidadMaxima &&
        evento.asistentes.length >= evento.capacidadMaxima,
      esFavorito: isAuthenticated && isFavorite(evento._id),
    }),
    [
      isAuthenticated,
      evento.asistentes,
      evento.capacidadMaxima,
      evento.creador._id,
      evento._id,
      usuario?._id,
      isFavorite,
    ]
  );

  const handleAsistencia = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (eventState.yaEstaInscrito) {
        await cancelarAsistencia(evento._id);
      } else {
        await confirmarAsistencia(evento._id);
      }
    },
    [
      eventState.yaEstaInscrito,
      cancelarAsistencia,
      confirmarAsistencia,
      evento._id,
    ]
  );

  const handleFavorite = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(evento);
    },
    [toggleFavorite, evento]
  );

  const handleVerDetalles = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (detailButtonRef.current) {
      const rect = detailButtonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setModalOrigin({ x: centerX, y: centerY });
    }

    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleEditEvent = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (onEditEvent) {
        onEditEvent(evento);
      }
    },
    [onEditEvent, evento]
  );

  const handleDeleteEvent = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (showDeleteConfirm) {
        try {
          await eliminarEvento(evento._id);
        } catch (error) {
          console.error("Error al eliminar evento:", error);
        }
        setShowDeleteConfirm(false);
      } else {
        setShowDeleteConfirm(true);
        setTimeout(() => {
          setShowDeleteConfirm(false);
        }, 3000);
      }
    },
    [showDeleteConfirm, eliminarEvento, evento._id]
  );

  const categoriaInfo = useMemo(() => {
    const categorias = {
      conferencia: { color: "blue", emoji: "🎤", label: "Conferencia" },
      taller: { color: "green", emoji: "🛠️", label: "Taller" },
      networking: { color: "purple", emoji: "🤝", label: "Networking" },
      social: { color: "pink", emoji: "🎉", label: "Social" },
      deportivo: { color: "orange", emoji: "⚽", label: "Deportivo" },
      cultural: { color: "indigo", emoji: "🎭", label: "Cultural" },
      otro: { color: "gray", emoji: "📅", label: "Otro" },
    };
    return categorias[evento.categoria] || categorias.otro;
  }, [evento.categoria]);

  const porcentajeOcupacion = useMemo(() => {
    return evento.capacidadMaxima
      ? (evento.asistentes.length / evento.capacidadMaxima) * 100
      : 0;
  }, [evento.capacidadMaxima, evento.asistentes.length]);

  return (
    <Card
      className="event-card"
      hover={true}
      shadow="md"
      padding="none"
      onClick={handleVerDetalles}
    >
      <div className="event-card__container">
        {/* Imagen y fecha lateral */}
        <div className="event-card__image-section">
          <div className="event-card__image">
            {evento.cartel ? (
              <img
                src={
                  evento.cartel.startsWith("http")
                    ? evento.cartel
                    : `http://localhost:5000/uploads/${evento.cartel}`
                }
                alt={evento.titulo}
                className="event-card__img"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="event-card__image-fallback"
              style={{ display: evento.cartel ? "none" : "flex" }}
            >
              <span className="event-card__fallback-emoji">
                {categoriaInfo.emoji}
              </span>
            </div>
          </div>

          {/* Fecha destacada */}
          <div className="event-card__date-badge">
            <span className="event-card__date-day">
              {dateInfo.fechaFormateada}
            </span>
            <span className="event-card__date-time">
              {dateInfo.horaFormateada}
            </span>
          </div>

          {/* Precio */}
          {evento.precio > 0 ? (
            <div className="event-card__price event-card__price--paid">
              €{evento.precio}
            </div>
          ) : (
            <div className="event-card__price event-card__price--free">
              GRATIS
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div className="event-card__content">
          {/* Header con categoría y favorito */}
          <div className="event-card__header">
            <div
              className={`event-card__category event-card__category--${categoriaInfo.color}`}
            >
              <span className="event-card__category-emoji">
                {categoriaInfo.emoji}
              </span>
              <span className="event-card__category-text">
                {categoriaInfo.label}
              </span>
            </div>

            <div className="event-card__header-actions">
              {isAuthenticated && (
                <button
                  onClick={handleFavorite}
                  className={`event-card__favorite-btn ${
                    eventState.esFavorito
                      ? "event-card__favorite-btn--active"
                      : ""
                  }`}
                  aria-label={
                    eventState.esFavorito
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"
                  }
                >
                  <Heart className="event-card__favorite-icon" />
                </button>
              )}

              {eventState.esCreador && (
                <div className="event-card__owner-badge">
                  <Star className="event-card__owner-icon" />
                  <span>Tu evento</span>
                </div>
              )}
            </div>
          </div>

          {/* Título y descripción */}
          <div className="event-card__info">
            <h3 className="event-card__title">{evento.titulo}</h3>
            <p className="event-card__description">{evento.descripcion}</p>
          </div>

          {/* Detalles del evento */}
          <div className="event-card__details">
            <div className="event-card__detail">
              <Calendar className="event-card__detail-icon" />
              <span>{dateInfo.fechaCompleta}</span>
            </div>
            <div className="event-card__detail">
              <MapPin className="event-card__detail-icon" />
              <span>{evento.ubicacion}</span>
            </div>
            <div className="event-card__detail">
              <User className="event-card__detail-icon" />
              <span>Por {evento.creador.nombre}</span>
            </div>
          </div>

          {/* Estadísticas y progreso */}
          <div className="event-card__stats">
            <div className="event-card__attendees">
              <Users className="event-card__attendees-icon" />
              <span className="event-card__attendees-count">
                {evento.asistentes.length}
                {evento.capacidadMaxima && ` / ${evento.capacidadMaxima}`}
              </span>
              {evento.capacidadMaxima && (
                <div className="event-card__progress">
                  <div
                    className="event-card__progress-bar"
                    style={{ width: `${Math.min(porcentajeOcupacion, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="event-card__actions">
          <div className="event-card__action-buttons">
            <Button
              ref={detailButtonRef}
              variant="outline"
              size="sm"
              onClick={handleVerDetalles}
              className="event-card__detail-btn"
            >
              Ver Detalles
            </Button>

            {isAuthenticated && !eventState.esCreador && (
              <Button
                variant={eventState.yaEstaInscrito ? "secondary" : "primary"}
                size="sm"
                loading={loading}
                disabled={!eventState.yaEstaInscrito && eventState.estaLleno}
                onClick={handleAsistencia}
                className="event-card__attend-btn"
                chakraGlow={!eventState.yaEstaInscrito && !eventState.estaLleno}
              >
                {eventState.yaEstaInscrito
                  ? "✓ Inscrito"
                  : eventState.estaLleno
                  ? "Completo"
                  : "Unirme"}
              </Button>
            )}

            {eventState.esCreador && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditEvent}
                  className="event-card__edit-btn"
                  icon={Edit2}
                >
                  Editar
                </Button>
                <Button
                  variant={showDeleteConfirm ? "danger" : "outline"}
                  size="sm"
                  onClick={handleDeleteEvent}
                  className="event-card__delete-btn"
                  icon={Trash2}
                  loading={loading}
                >
                  {showDeleteConfirm ? "¿Confirmar?" : "Eliminar"}
                </Button>
              </>
            )}
          </div>

          {/* Indicadores de estado */}
          <div className="event-card__status">
            {eventState.estaLleno && (
              <span className="event-card__status-badge event-card__status-badge--full">
                Completo
              </span>
            )}
            {eventState.yaEstaInscrito && (
              <span className="event-card__status-badge event-card__status-badge--joined">
                Te has unido
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      <EventModal
        evento={evento}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        originPosition={modalOrigin}
        onEditEvent={onEditEvent}
      />
    </Card>
  );
});

EventCard.displayName = "EventCard";

export default EventCard;
