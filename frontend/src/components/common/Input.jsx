import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      error,
      type = "text",
      placeholder,
      icon: Icon,
      className = "",
      containerClassName = "",
      required = false,
      size = "md",
      helpText,
      ...props
    },
    ref
  ) => {
    // Construir clases CSS
    const containerClasses = ["ichiraku-input-container", containerClassName]
      .filter(Boolean)
      .join(" ");

    const labelClasses = [
      "ichiraku-input-label",
      required && "ichiraku-input-label--required",
    ]
      .filter(Boolean)
      .join(" ");

    const inputClasses = [
      "ichiraku-input",
      `ichiraku-input--${size}`,
      Icon && "ichiraku-input--with-icon",
      error && "ichiraku-input--error",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const iconClasses = ["ichiraku-input-icon", `ichiraku-input-icon--${size}`]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        {label && <label className={labelClasses}>{label}</label>}

        <div className="ichiraku-input-wrapper">
          {Icon && <Icon className={iconClasses} />}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />

          {error && (
            <div className="ichiraku-input-error-icon">
              <AlertCircle className="ichiraku-input-error-icon-small" />
            </div>
          )}
        </div>

        {error && (
          <div className="ichiraku-input-error">
            <AlertCircle className="ichiraku-input-error-icon-small" />
            {error}
          </div>
        )}

        {helpText && !error && (
          <div className="ichiraku-input-help">{helpText}</div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
