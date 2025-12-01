"use client"

/* Updated to use pure CSS classes */
import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { useData } from "../contexts/data-context"
import { useNotifications } from "../contexts/notifications-context"
import { Navigation } from "../components/navigation"
import "../styles/pages.css"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { fetchUsers } = useData()
  const { addNotification } = useNotifications()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      await signup(email, name, password)
      await fetchUsers()
      addNotification("¡Cuenta creada exitosamente!", "success")
      navigate("/")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al registrarse"
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
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Únete a EventHub para descubrir eventos increíbles</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="input-field"
                required
              />
            </div>

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
              <small className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Al menos 6 caracteres
              </small>
            </div>

            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="auth-link">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </div>
      </main>
    </>
  )
}
