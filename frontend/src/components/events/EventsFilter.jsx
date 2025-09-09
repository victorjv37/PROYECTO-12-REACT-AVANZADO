import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Tags,
  X,
  Calendar,
  TrendingUp,
  DollarSign,
  Tag,
} from "lucide-react";
import { useEventos } from "../../context/EventosContext";
import Button from "../common/Button";
import Input from "../common/Input";

const EventsFilter = () => {
  const {
    filtros,
    buscarEventos,
    filtrarPorCategoria,
    ordenarEventos,
    limpiarFiltros: limpiarFiltrosContexto,
  } = useEventos();
  const [busqueda, setBusqueda] = useState(filtros.busqueda || "");
  const [showFilters, setShowFilters] = useState(false);

  // Sincronizar estado local con filtros del contexto
  useEffect(() => {
    setBusqueda(filtros.busqueda || "");
  }, [filtros.busqueda]);

  const categorias = [
    { value: "all", label: "Todas", emoji: "📋" },
    { value: "conferencia", label: "Conferencia", emoji: "🎤" },
    { value: "taller", label: "Taller", emoji: "🔧" },
    { value: "networking", label: "Networking", emoji: "🤝" },
    { value: "social", label: "Social", emoji: "🎉" },
    { value: "deportivo", label: "Deportivo", emoji: "⚽" },
    { value: "cultural", label: "Cultural", emoji: "🎭" },
    { value: "otro", label: "Otro", emoji: "📦" },
  ];

  const opcionesOrden = [
    {
      ordenPor: "fecha",
      orden: "asc",
      label: "Fecha (más próxima)",
      icon: Calendar,
    },
    {
      ordenPor: "fecha",
      orden: "desc",
      label: "Fecha (más lejana)",
      icon: Calendar,
    },
    { ordenPor: "titulo", orden: "asc", label: "Título (A-Z)", icon: Tag },
    { ordenPor: "titulo", orden: "desc", label: "Título (Z-A)", icon: Tag },
    {
      ordenPor: "precio",
      orden: "asc",
      label: "Precio (menor)",
      icon: DollarSign,
    },
    {
      ordenPor: "precio",
      orden: "desc",
      label: "Precio (mayor)",
      icon: TrendingUp,
    },
  ];

  const handleBusqueda = (e) => {
    e.preventDefault();
    buscarEventos(busqueda);
  };

  const handleCategoriaChange = (categoria) => {
    filtrarPorCategoria(categoria);
  };

  const handleOrdenChange = (ordenPor, orden) => {
    ordenarEventos(ordenPor, orden);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    limpiarFiltrosContexto();
  };

  const tienesFiltrosActivos =
    filtros.categoria !== "all" ||
    filtros.busqueda ||
    filtros.ordenPor !== "fecha" ||
    filtros.orden !== "asc";

  return (
    <div
      className={`ichiraku-events-filter ${
        tienesFiltrosActivos ? "has-active-filters" : ""
      }`}
    >
      {tienesFiltrosActivos && (
        <div className="ichiraku-events-filter__active-indicator" />
      )}

      {/* Búsqueda principal */}
      <div className="ichiraku-events-filter__search">
        <form
          onSubmit={handleBusqueda}
          className="ichiraku-events-filter__search-form"
        >
          <div className="ichiraku-events-filter__search-input">
            <Input
              type="text"
              placeholder="Buscar eventos ninja por título o descripción..."
              icon={Search}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              size="md"
            />
          </div>
          <div className="ichiraku-events-filter__search-buttons">
            <Button type="submit" icon={Search} size="md" variant="primary">
              Buscar
            </Button>
            <Button
              type="button"
              variant="outline"
              icon={Filter}
              size="md"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>
          </div>
        </form>
      </div>

      {/* Filtros expandibles */}
      <div
        className={`ichiraku-events-filter__filters ${
          showFilters ? "ichiraku-events-filter__filters--open" : ""
        }`}
      >
        {/* Filtro por categoría */}
        <div className="ichiraku-events-filter__section">
          <h3 className="ichiraku-events-filter__section-title">
            <Tags className="ichiraku-events-filter__section-icon" />
            Categoría de Evento
          </h3>
          <div className="ichiraku-events-filter__categories">
            {categorias.map((categoria) => (
              <button
                key={categoria.value}
                onClick={() => handleCategoriaChange(categoria.value)}
                className={`ichiraku-events-filter__category ${
                  filtros.categoria === categoria.value
                    ? "ichiraku-events-filter__category--active"
                    : ""
                }`}
              >
                <span>{categoria.emoji}</span>
                {categoria.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro de ordenamiento */}
        <div className="ichiraku-events-filter__section">
          <h3 className="ichiraku-events-filter__section-title">
            <ArrowUpDown className="ichiraku-events-filter__section-icon" />
            Ordenar Eventos
          </h3>
          <div className="ichiraku-events-filter__sort-options">
            {opcionesOrden.map((opcion) => {
              const Icon = opcion.icon;
              const isActive =
                filtros.ordenPor === opcion.ordenPor &&
                filtros.orden === opcion.orden;

              return (
                <button
                  key={`${opcion.ordenPor}-${opcion.orden}`}
                  onClick={() =>
                    handleOrdenChange(opcion.ordenPor, opcion.orden)
                  }
                  className={`ichiraku-events-filter__sort-option ${
                    isActive
                      ? "ichiraku-events-filter__sort-option--active"
                      : ""
                  }`}
                >
                  <Icon className="ichiraku-events-filter__sort-icon" />
                  {opcion.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Acciones y resumen */}
      {(showFilters || tienesFiltrosActivos) && (
        <div className="ichiraku-events-filter__actions">
          <div className="ichiraku-events-filter__results">
            {tienesFiltrosActivos ? "Filtros aplicados" : "Sin filtros activos"}
          </div>

          {tienesFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="ichiraku-events-filter__clear"
            >
              <X className="ichiraku-events-filter__clear-icon" />
              Limpiar Filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsFilter;
