import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  size = "md",
  text = "Cargando...",
  fullScreen = false,
  className = "",
  variant = "rasengan", // rasengan, kunai, leaf, bars
  theme = "default", // default, ramen, ninja
}) => {
  const containerClasses = [
    "ichiraku-loading",
    fullScreen && "ichiraku-loading--fullscreen",
    theme === "ramen" && "ichiraku-loading--ramen",
    theme === "ninja" && "ichiraku-loading--ninja",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinnerClasses = [
    variant === "rasengan" && "ichiraku-spinner",
    variant === "kunai" && "ichiraku-spinner ichiraku-spinner--kunai",
    variant === "leaf" && "ichiraku-spinner ichiraku-spinner--leaf",
    `ichiraku-spinner--${size}`,
  ]
    .filter(Boolean)
    .join(" ");

  const textClasses = [
    "ichiraku-loading-text",
    `ichiraku-loading-text--${size}`,
  ]
    .filter(Boolean)
    .join(" ");

  const renderSpinner = () => {
    if (variant === "bars") {
      return (
        <div className="ichiraku-bars">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="ichiraku-bar" />
          ))}
        </div>
      );
    }

    return <div className={spinnerClasses} />;
  };

  return (
    <div className={containerClasses}>
      {renderSpinner()}
      {text && <p className={textClasses}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
