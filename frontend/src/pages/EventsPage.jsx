import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEventos } from "../context/EventosContext";
import EventsFilter from "../components/events/EventsFilter";
import EventCard from "../components/events/EventCard";
import CreateEventForm from "../components/events/CreateEventForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/common/Button";
import { Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const { isAuthenticated } = useAuth();
  const { eventos, loading, paginacion, obtenerEventos } = useEventos();
  const navigate = useNavigate();
  const [eventoParaEditar, setEventoParaEditar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  useEffect(() => {
    obtenerEventos();
  }, []);

  const handlePaginaAnterior = () => {
    if (paginacion.paginaActual > 1) {
      obtenerEventos(undefined, paginacion.paginaActual - 1);
    }
  };

  const handlePaginaSiguiente = () => {
    if (paginacion.paginaActual < paginacion.totalPaginas) {
      obtenerEventos(undefined, paginacion.paginaActual + 1);
    }
  };

  const handlePaginaEspecifica = (pagina) => {
    obtenerEventos(undefined, pagina);
  };

  const handleEditEvent = (evento) => {
    setEventoParaEditar(evento);
    setMostrarModalEdicion(true);
  };

  const handleCloseEditModal = () => {
    setMostrarModalEdicion(false);
    setEventoParaEditar(null);
  };

  const handleEventUpdated = () => {
    handleCloseEditModal();
    obtenerEventos(); // Recargar la lista de eventos
  };

  return (
    <div className="ichiraku-events-page">
      <div className="ichiraku-events-page__container">
        {/* Header */}
        <header className="ichiraku-events-page__header">
          <div className="ichiraku-events-page__header-top">
            <h1 className="ichiraku-events-page__title">
              <Calendar className="ichiraku-events-page__title-icon" />
              Eventos Disponibles
            </h1>
            <p className="ichiraku-events-page__subtitle">
              Descubre y participa en eventos para todos los Shinobi
            </p>
          </div>

          {isAuthenticated && (
            <div className="ichiraku-events-page__actions">
              <button
                className="ichiraku-events-page__create-button"
                onClick={() => navigate("/eventos/crear")}
              >
                <Plus className="ichiraku-events-page__create-icon" />
                Crea tu Evento
              </button>
            </div>
          )}
        </header>

        {/* Filtros */}
        <EventsFilter />

        {/* Contenido principal */}
        <main className="ichiraku-events-page__content">
          {loading ? (
            <div className="ichiraku-events-page__loading">
              <LoadingSpinner
                size="lg"
                text="Cargando eventos ninja..."
                variant="rasengan"
                theme="ramen"
              />
            </div>
          ) : eventos.length === 0 ? (
            <div className="ichiraku-events-page__empty">
              <Calendar className="ichiraku-events-page__empty-icon" />
              <h3 className="ichiraku-events-page__empty-title">
                No hay eventos disponibles
              </h3>
              <p className="ichiraku-events-page__empty-text">
                No se encontraron ninjaeventos que coincidan con tus criterios
                de búsqueda. ¡Sé el primero en crear un evento para la aldea!
              </p>
              {isAuthenticated && (
                <Button
                  icon={Plus}
                  onClick={() => navigate("/eventos/crear")}
                  size="md"
                  variant="primary"
                >
                  Crear el primer evento
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Grid de eventos */}
              <div className="ichiraku-events-page__grid">
                {eventos.map((evento) => (
                  <EventCard
                    key={evento._id}
                    evento={evento}
                    onEditEvent={handleEditEvent}
                  />
                ))}
              </div>

              {/* Paginación */}
              {paginacion.totalPaginas > 1 && (
                <div className="ichiraku-events-page__pagination">
                  <div className="ichiraku-events-page__pagination-info">
                    Mostrando {eventos.length} de {paginacion.totalEventos}{" "}
                    eventos ninja
                  </div>

                  <div className="ichiraku-events-page__pagination-controls">
                    <button
                      className="ichiraku-events-page__pagination-button"
                      onClick={handlePaginaAnterior}
                      disabled={paginacion.paginaActual === 1}
                    >
                      Anterior
                    </button>

                    {/* Números de página */}
                    <div className="ichiraku-events-page__pagination-numbers">
                      {[...Array(paginacion.totalPaginas)].map((_, index) => {
                        const numeroPagina = index + 1;
                        return (
                          <button
                            key={numeroPagina}
                            onClick={() => handlePaginaEspecifica(numeroPagina)}
                            className={`ichiraku-events-page__pagination-button ${
                              numeroPagina === paginacion.paginaActual
                                ? "ichiraku-events-page__pagination-button--active"
                                : ""
                            }`}
                          >
                            {numeroPagina}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      className="ichiraku-events-page__pagination-button"
                      onClick={handlePaginaSiguiente}
                      disabled={
                        paginacion.paginaActual === paginacion.totalPaginas
                      }
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal de edición de evento */}
      {mostrarModalEdicion && eventoParaEditar && (
        <CreateEventForm
          isOpen={mostrarModalEdicion}
          onClose={handleCloseEditModal}
          onEventCreated={handleEventUpdated}
          eventoParaEditar={eventoParaEditar}
        />
      )}
    </div>
  );
};

export default EventsPage;
