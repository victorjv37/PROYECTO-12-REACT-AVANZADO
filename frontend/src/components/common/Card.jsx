import PropTypes from "prop-types";
import "./Card.css";

const Card = ({
  children,
  variant = "default",
  padding = "md",
  shadow = "md",
  hover = false,
  className = "",
  decorative = false,
  ...props
}) => {
  const cardClasses = [
    "ninja-card",
    `ninja-card--${variant}`,
    `ninja-card--padding-${padding}`,
    `ninja-card--shadow-${shadow}`,
    hover && "ninja-card--hover",
    decorative && "ninja-card--decorative",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses} {...props}>
      {decorative && (
        <div className="ninja-card__decoration">
          <span className="ninja-card__decoration-icon">🍜</span>
        </div>
      )}
      <div className="ninja-card__content">{children}</div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
  ]),
  padding: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  shadow: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  hover: PropTypes.bool,
  className: PropTypes.string,
  decorative: PropTypes.bool,
};

export default Card;
