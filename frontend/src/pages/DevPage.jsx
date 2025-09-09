import { useNavigate } from "react-router-dom";
import { Construction, ArrowLeft, Coffee, Code, Calendar } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import NinjaDecorations from "../components/common/NinjaDecorations";
import "./DevPage.css";

const DevPage = () => {
  const navigate = useNavigate();

  const features = [
    "Gestión de perfil avanzada",
    "Configuración personalizable",
    "Notificaciones ninja",
    "Sistema de favoritos",
    "Dashboard personalizado",
    "Y mucho más...",
  ];

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="dev-page">
      <Card
        variant="primary"
        padding="xl"
        shadow="xl"
        hover={true}
        decorative={true}
        className="dev-page__container"
      >
        {/* Decoraciones ninja */}
        <NinjaDecorations
          variant="ramen"
          position="corner-top-right"
          size="lg"
        />
        <NinjaDecorations
          variant="leaf"
          position="corner-bottom-left"
          size="md"
        />

        {/* Icono principal */}
        <div className="dev-page__icon">
          <Construction />
        </div>

        {/* Contenido principal */}
        <h1 className="dev-page__title">🍜 Técnica en Desarrollo</h1>

        <p className="dev-page__subtitle">
          Esta funcionalidad ninja está siendo perfeccionada en el dojo. ¡Pronto
          estará lista para toda la aldea!
        </p>

        {/* Estado del desarrollo */}
        <Card variant="warning" padding="lg" className="dev-page__status">
          <div className="dev-page__status-primary">
            <Code />
            <span>Estado: En desarrollo activo</span>
          </div>
          <div className="dev-page__status-secondary">
            <Coffee />
            <span>Nuestros ninjas están trabajando duro</span>
          </div>
        </Card>

        {/* Funcionalidades futuras */}
        <div className="dev-page__features">
          <h3 className="dev-page__features-title">
            <Calendar />
            Próximamente:
          </h3>
          <ul className="dev-page__features-list">
            {features.map((feature, index) => (
              <li key={index} className="dev-page__features-item">
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Acción principal */}
        <div className="dev-page__action">
          <Button
            onClick={handleGoBack}
            className="w-full"
            size="lg"
            variant="primary"
            chakraGlow={true}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a los Eventos
          </Button>
        </div>

        {/* Mensaje motivacional */}
        <Card
          variant="secondary"
          padding="md"
          className="dev-page__motivational"
        >
          "La paciencia es la virtud de un verdadero ninja" - Ichiraku Sensei
        </Card>
      </Card>
    </div>
  );
};

export default DevPage;
