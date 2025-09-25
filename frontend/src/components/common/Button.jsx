import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      type = "button",
      onClick,
      className = "",
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      chakraGlow = false,
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      "ichiraku-button",
      `ichiraku-button--${variant}`,
      `ichiraku-button--${size}`,
      fullWidth && "ichiraku-button--full",
      loading && "ichiraku-button--loading",
      chakraGlow && "ichiraku-button--chakra-glow",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const iconClasses = [
      "ichiraku-button__icon",
      `ichiraku-button__icon--${size}`,
    ]
      .filter(Boolean)
      .join(" ");

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {loading && (
          <Loader2 className="loading-spinner ichiraku-button__icon" />
        )}

        {!loading && Icon && iconPosition === "left" && (
          <Icon className={iconClasses} />
        )}

        {!loading && children}

        {!loading && Icon && iconPosition === "right" && (
          <Icon className={iconClasses} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
