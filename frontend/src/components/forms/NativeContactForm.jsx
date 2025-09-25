import React, { useState, useMemo, useCallback } from "react";
import { Send, User, Mail, MessageSquare, AlertCircle } from "lucide-react";
import Button from "../common/Button";
import "./NativeContactForm.css";

const NativeContactForm = React.memo(() => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationRules = useMemo(
    () => ({
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      subject: {
        required: true,
        minLength: 5,
        maxLength: 100,
      },
      message: {
        required: true,
        minLength: 10,
        maxLength: 500,
      },
    }),
    []
  );

  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return "";

      if (rules.required && !value.trim()) {
        return `${
          name === "name"
            ? "Nombre"
            : name === "email"
            ? "Email"
            : name === "subject"
            ? "Asunto"
            : "Mensaje"
        } es obligatorio`;
      }

      if (rules.minLength && value.length < rules.minLength) {
        return `Debe tener al menos ${rules.minLength} caracteres`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `No puede exceder ${rules.maxLength} caracteres`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        if (name === "email") {
          return "Email no válido";
        }
        if (name === "name") {
          return "Solo se permiten letras y espacios";
        }
      }

      return "";
    },
    [validationRules]
  );

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField]
  );

  const handleInputBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField, validationRules]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Formulario enviado:", formData);

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setErrors({});
        setIsSubmitted(true);

        setTimeout(() => setIsSubmitted(false), 5000);
      } catch (error) {
        console.error("Error enviando formulario:", error);
        setErrors({
          submit: "Error al enviar el formulario. Inténtalo de nuevo.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm]
  );

  const isFormValid = useMemo(() => {
    return Object.keys(validationRules).every(
      (field) => formData[field].trim() && !errors[field]
    );
  }, [formData, errors, validationRules]);

  if (isSubmitted) {
    return (
      <div className="native-form__success">
        <div className="native-form__success-content">
          <div className="native-form__success-icon">✨</div>
          <h3>¡Mensaje Enviado Ninja!</h3>
          <p>
            Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto
            contigo pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="native-form">
      <div className="native-form__header">
        <h2 className="native-form__title">
          <MessageSquare className="native-form__title-icon" />
          Contacto Ninja
        </h2>
        <p className="native-form__subtitle">
          Envíanos un mensaje y nos pondremos en contacto contigo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="native-form__form" noValidate>
        <div className="native-form__field">
          <label htmlFor="name" className="native-form__label">
            <User className="native-form__label-icon" />
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`native-form__input ${
              errors.name ? "native-form__input--error" : ""
            }`}
            placeholder="Tu nombre ninja"
            maxLength={50}
          />
          {errors.name && (
            <div className="native-form__error">
              <AlertCircle className="native-form__error-icon" />
              {errors.name}
            </div>
          )}
          <div className="native-form__character-count">
            {formData.name.length}/50
          </div>
        </div>

        <div className="native-form__field">
          <label htmlFor="email" className="native-form__label">
            <Mail className="native-form__label-icon" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`native-form__input ${
              errors.email ? "native-form__input--error" : ""
            }`}
            placeholder="tu.email@aldea.com"
          />
          {errors.email && (
            <div className="native-form__error">
              <AlertCircle className="native-form__error-icon" />
              {errors.email}
            </div>
          )}
        </div>

        <div className="native-form__field">
          <label htmlFor="subject" className="native-form__label">
            <MessageSquare className="native-form__label-icon" />
            Asunto *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`native-form__input ${
              errors.subject ? "native-form__input--error" : ""
            }`}
            placeholder="Asunto de tu mensaje"
            maxLength={100}
          />
          {errors.subject && (
            <div className="native-form__error">
              <AlertCircle className="native-form__error-icon" />
              {errors.subject}
            </div>
          )}
          <div className="native-form__character-count">
            {formData.subject.length}/100
          </div>
        </div>

        <div className="native-form__field">
          <label htmlFor="message" className="native-form__label">
            <MessageSquare className="native-form__label-icon" />
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`native-form__textarea ${
              errors.message ? "native-form__textarea--error" : ""
            }`}
            placeholder="Escribe tu mensaje aquí..."
            rows={6}
            maxLength={500}
          />
          {errors.message && (
            <div className="native-form__error">
              <AlertCircle className="native-form__error-icon" />
              {errors.message}
            </div>
          )}
          <div className="native-form__character-count">
            {formData.message.length}/500
          </div>
        </div>

        {errors.submit && (
          <div className="native-form__error native-form__error--general">
            <AlertCircle className="native-form__error-icon" />
            {errors.submit}
          </div>
        )}

        <div className="native-form__actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            disabled={!isFormValid}
            icon={Send}
            chakraGlow={isFormValid}
            className="native-form__submit"
          >
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          </Button>
        </div>
      </form>
    </div>
  );
});

NativeContactForm.displayName = "NativeContactForm";

export default NativeContactForm;
