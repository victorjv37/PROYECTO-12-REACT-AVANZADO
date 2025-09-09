import PropTypes from "prop-types";
import "./NinjaDecorations.css";

const NinjaDecorations = ({
  variant = "ramen",
  size = "md",
  position = "floating",
  className = "",
}) => {
  const decorationClasses = [
    "ninja-decoration",
    `ninja-decoration--${variant}`,
    `ninja-decoration--${size}`,
    `ninja-decoration--${position}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const getDecorationContent = () => {
    switch (variant) {
      case "ramen":
        return "🍜";
      case "leaf":
        return "🍃";
      case "shuriken":
        return "⭐";
      case "chakra":
        return "💨";
      case "fire":
        return "🔥";
      default:
        return "🍜";
    }
  };

  return (
    <div className={decorationClasses}>
      <span className="ninja-decoration__icon">{getDecorationContent()}</span>
    </div>
  );
};

NinjaDecorations.propTypes = {
  variant: PropTypes.oneOf(["ramen", "leaf", "shuriken", "chakra", "fire"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  position: PropTypes.oneOf([
    "floating",
    "corner-top-left",
    "corner-top-right",
    "corner-bottom-left",
    "corner-bottom-right",
  ]),
  className: PropTypes.string,
};

export default NinjaDecorations;
