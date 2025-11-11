"use client"

/* Updated to use pure CSS classes */
import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notifications-context"
import { Navigation } from "../components/navigation"
import "../styles/pages.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addNotification } = useNotifications()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      addNotification("¡Inicio de sesión exitoso!", "success")
      navigate("/")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión"
      setError(errorMessage)
      addNotification(errorMessage, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setError("")
    setIsLoading(true)

    try {
      await login("admin@example.com", "admin123")
      addNotification("¡Inicio de sesión demo exitoso!", "success")
      navigate("/")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error en el inicio de sesión demo"
      setError(errorMessage)
      addNotification(errorMessage, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Bienvenido de Nuevo</h1>
          <p className="auth-subtitle">Inicia sesión en tu cuenta de EventHub</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">O</span>
            <div className="auth-divider-line"></div>
          </div>

          <button onClick={handleDemoLogin} disabled={isLoading} className="btn btn-outline w-full">
            Probar Cuenta Demo
          </button>

          <div className="auth-link">
            ¿No tienes una cuenta? <Link to="/signup">Regístrate</Link>
          </div>
        </div>
      </main>
    </>
  )
}
