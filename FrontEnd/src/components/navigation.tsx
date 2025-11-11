"use client"

/* Updated to use pure CSS instead of Tailwind */
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import "../styles/navigation.css"

export function Navigation() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="nav-bar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">E</div>
            <span>EventHub</span>
          </Link>

          <div className="nav-links">
            {user ? (
              <>
                <Link to="/reservations" className="nav-link">
                  Mis Reservas
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="nav-link">
                    Panel de Administración
                  </Link>
                )}
                <div className="nav-user">
                  <div className="nav-user-info">
                    <p className="nav-user-name">{user.name}</p>
                    <p className="nav-user-role">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="btn btn-destructive btn-sm">
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Iniciar Sesión
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
