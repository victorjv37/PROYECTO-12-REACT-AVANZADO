import React, { useMemo } from "react";
import { Heart, Star, Trash2 } from "lucide-react";
import { useFavoritesContext } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/common/StarRating";
import Button from "../components/common/Button";
import NativeContactForm from "../components/forms/NativeContactForm";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const {
    favorites,
    ratings,
    favoritesCount,
    removeFromFavorites,
    rateEvent,
    clearFavorites,
    getEventRating,
  } = useFavoritesContext();

  const { isAuthenticated } = useAuth();

  const sortedFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => {
      const ratingA = getEventRating(a._id) || 0;
      const ratingB = getEventRating(b._id) || 0;
      return ratingB - ratingA;
    });
  }, [favorites, getEventRating]);

  const stats = useMemo(() => {
    const totalRatings = Object.values(ratings).filter(
      (rating) => rating > 0
    ).length;
    const averageRating =
      totalRatings > 0
        ? Object.values(ratings).reduce(
            (sum, rating) => sum + (rating || 0),
            0
          ) / totalRatings
        : 0;

    return {
      totalEvents: favoritesCount,
      totalRatings,
      averageRating: averageRating.toFixed(1),
    };
  }, [favoritesCount, ratings]);

  const handleRating = (eventoId, rating) => {
    rateEvent(eventoId, rating);
  };

  const handleRemoveFavorite = (eventoId) => {
    removeFromFavorites(eventoId);
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar todos los favoritos?"
      )
    ) {
      clearFavorites();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__container">
          <div className="favorites-page__auth-required">
            <Heart className="favorites-page__auth-icon" />
            <h2>Inicia sesión para ver tus favoritos</h2>
            <p>
              Necesitas estar autenticado para gestionar tus eventos favoritos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-page__container">
        {/* Header con estadísticas */}
        <div className="favorites-page__header">
          <div className="favorites-page__title-section">
            <h1 className="favorites-page__title">
              <Heart className="favorites-page__title-icon" />
              Eventos Favoritos
            </h1>
            <p className="favorites-page__subtitle">
              Gestiona y califica tus eventos ninja favoritos
            </p>
          </div>

          {favoritesCount > 0 && (
            <div className="favorites-page__stats">
              <div className="favorites-page__stat">
                <span className="favorites-page__stat-number">
                  {stats.totalEvents}
                </span>
                <span className="favorites-page__stat-label">Favoritos</span>
              </div>
              <div className="favorites-page__stat">
                <span className="favorites-page__stat-number">
                  {stats.totalRatings}
                </span>
                <span className="favorites-page__stat-label">Calificados</span>
              </div>
              <div className="favorites-page__stat">
                <span className="favorites-page__stat-number">
                  {stats.averageRating}
                </span>
                <span className="favorites-page__stat-label">Promedio</span>
              </div>
            </div>
          )}
        </div>

        {favoritesCount === 0 ? (
          <div className="favorites-page__empty">
            <div className="favorites-page__empty-content">
              <Heart className="favorites-page__empty-icon" />
              <h3>No tienes eventos favoritos</h3>
              <p>
                Agrega eventos a favoritos para verlos aquí y poder calificarlos
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="favorites-page__actions">
              <Button
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={handleClearAll}
                className="favorites-page__clear-btn"
              >
                Limpiar Todo
              </Button>
            </div>

            <div className="favorites-page__grid">
              {sortedFavorites.map((evento) => (
                <FavoriteEventCard
                  key={evento._id}
                  evento={evento}
                  rating={getEventRating(evento._id)}
                  onRate={handleRating}
                  onRemove={handleRemoveFavorite}
                />
              ))}
            </div>
          </>
        )}

        <div className="favorites-page__contact-section">
          <div className="favorites-page__contact-header">
            <h2>¿Tienes alguna sugerencia?</h2>
            <p>Envíanos tus comentarios sobre los eventos o la plataforma</p>
          </div>
          <NativeContactForm />
        </div>
      </div>
    </div>
  );
};

const FavoriteEventCard = React.memo(({ evento, rating, onRate, onRemove }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="favorite-card">
      <div className="favorite-card__image">
        {evento.cartel ? (
          <img
            src={
              evento.cartel.startsWith("http")
                ? evento.cartel
                : `http://localhost:5000/uploads/${evento.cartel}`
            }
            alt={evento.titulo}
            className="favorite-card__img"
          />
        ) : (
          <div className="favorite-card__image-fallback">
            <Star className="favorite-card__fallback-icon" />
          </div>
        )}
      </div>

      <div className="favorite-card__content">
        <h3 className="favorite-card__title">{evento.titulo}</h3>
        <p className="favorite-card__description">{evento.descripcion}</p>

        <div className="favorite-card__details">
          <div className="favorite-card__detail">
            📅 {formatDate(evento.fecha)}
          </div>
          <div className="favorite-card__detail">📍 {evento.ubicacion}</div>
          {evento.precio > 0 && (
            <div className="favorite-card__detail">💰 €{evento.precio}</div>
          )}
        </div>

        <div className="favorite-card__rating-section">
          <label className="favorite-card__rating-label">
            Mi calificación:
          </label>
          <StarRating
            rating={rating}
            onRatingChange={(newRating) => onRate(evento._id, newRating)}
            size="md"
            showValue={rating > 0}
          />
        </div>

        <div className="favorite-card__actions">
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={() => onRemove(evento._id)}
            className="favorite-card__remove-btn"
          >
            Quitar
          </Button>
        </div>
      </div>
    </div>
  );
});

FavoriteEventCard.displayName = "FavoriteEventCard";

export default FavoritesPage;
