import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  Home,
  UserPlus,
  Heart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, usuario, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  const navigationLinks = [
    {
      to: "/",
      label: "Eventos",
      icon: Calendar,
      public: true,
    },
    {
      to: "/favoritos",
      label: "Favoritos",
      icon: Heart,
      public: false,
    },
    {
      to: "/perfil",
      label: "Mi Perfil",
      icon: User,
      public: false,
    },
  ];

  return (
    <nav className="ichiraku-navbar">
      <div className="ichiraku-navbar__container">
        <Link to="/" className="ichiraku-navbar__brand">
          <div className="ichiraku-navbar__logo">🍜</div>
          <div>
            <h1 className="ichiraku-navbar__title ichiraku-brand">
              Ichiraku's Events
            </h1>
            <p className="ichiraku-navbar__subtitle">
              Eventos ninja para toda la aldea
            </p>
          </div>
        </Link>

        <div className="ichiraku-navbar__nav">
          {navigationLinks.map((link) => {
            if (!link.public && !isAuthenticated) return null;

            const Icon = link.icon;
            const isActive = isActiveRoute(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`ichiraku-navbar__nav-link ${
                  isActive ? "ichiraku-navbar__nav-link--active" : ""
                }`}
              >
                <Icon className="ichiraku-navbar__nav-icon" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="ichiraku-navbar__user">
          {isAuthenticated ? (
            <>
              <div className="ichiraku-navbar__user-info">
                <p className="ichiraku-navbar__user-name">{usuario?.nombre}</p>
                <p className="ichiraku-navbar__user-role">Ninja de la aldea</p>
              </div>

              <div className="ichiraku-navbar__dropdown" ref={dropdownRef}>
                <button
                  className="ichiraku-navbar__avatar"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {usuario?.avatar ? (
                    <img
                      src={`/api/uploads/${usuario.avatar}`}
                      alt={usuario.nombre}
                    />
                  ) : (
                    getInitials(usuario?.nombre)
                  )}
                </button>

                <div
                  className={`ichiraku-navbar__dropdown-menu ${
                    isDropdownOpen ? "ichiraku-navbar__dropdown-menu--open" : ""
                  }`}
                >
                  <Link to="/perfil" className="ichiraku-navbar__dropdown-item">
                    <User className="ichiraku-navbar__dropdown-icon" />
                    Mi Perfil
                  </Link>
                  <Link
                    to="/configuracion"
                    className="ichiraku-navbar__dropdown-item"
                  >
                    <Settings className="ichiraku-navbar__dropdown-icon" />
                    Configuración
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ichiraku-navbar__dropdown-item ichiraku-navbar__dropdown-item--danger"
                  >
                    <LogOut className="ichiraku-navbar__dropdown-icon" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`ichiraku-navbar__nav-link ${
                  isActiveRoute("/login")
                    ? "ichiraku-navbar__nav-link--active"
                    : ""
                }`}
              >
                <User className="ichiraku-navbar__nav-icon" />
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                className={`ichiraku-navbar__nav-link ${
                  isActiveRoute("/registro")
                    ? "ichiraku-navbar__nav-link--active"
                    : ""
                }`}
              >
                <UserPlus className="ichiraku-navbar__nav-icon" />
                Registrarse
              </Link>
            </>
          )}

          <button
            className="ichiraku-navbar__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="ichiraku-navbar__mobile-toggle-icon" />
            ) : (
              <Menu className="ichiraku-navbar__mobile-toggle-icon" />
            )}
          </button>
        </div>

        <div
          className={`ichiraku-navbar__mobile-menu ${
            isMobileMenuOpen ? "ichiraku-navbar__mobile-menu--open" : ""
          }`}
        >
          <div className="ichiraku-navbar__mobile-nav">
            {navigationLinks.map((link) => {
              if (!link.public && !isAuthenticated) return null;

              const Icon = link.icon;
              const isActive = isActiveRoute(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`ichiraku-navbar__mobile-nav-link ${
                    isActive ? "ichiraku-navbar__mobile-nav-link--active" : ""
                  }`}
                >
                  <Icon className="ichiraku-navbar__nav-icon" />
                  {link.label}
                </Link>
              );
            })}

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className={`ichiraku-navbar__mobile-nav-link ${
                    isActiveRoute("/login")
                      ? "ichiraku-navbar__mobile-nav-link--active"
                      : ""
                  }`}
                >
                  <User className="ichiraku-navbar__nav-icon" />
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className={`ichiraku-navbar__mobile-nav-link ${
                    isActiveRoute("/registro")
                      ? "ichiraku-navbar__mobile-nav-link--active"
                      : ""
                  }`}
                >
                  <UserPlus className="ichiraku-navbar__nav-icon" />
                  Registrarse
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link
                  to="/configuracion"
                  className="ichiraku-navbar__mobile-nav-link"
                >
                  <Settings className="ichiraku-navbar__nav-icon" />
                  Configuración
                </Link>
                <button
                  onClick={handleLogout}
                  className="ichiraku-navbar__mobile-nav-link"
                  style={{
                    background: "none",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    color: "var(--error-red)",
                  }}
                >
                  <LogOut className="ichiraku-navbar__nav-icon" />
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
