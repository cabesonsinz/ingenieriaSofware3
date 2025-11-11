"use client"

import type React from "react"

/* Updated to use pure CSS classes */
import { useState } from "react"
import { Link } from "react-router-dom"
import { useData } from "../contexts/data-context"
import { Navigation } from "../components/navigation"
import "../styles/pages.css"

type Tab = "overview" | "events" | "reservations" | "create-event"

export default function AdminPage() {
  const { events, reservations, addEvent } = useData()
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    price: "",
    capacity: "",
    image: "",
    organizer: "",
  })
  const [formMessage, setFormMessage] = useState("")

  const confirmedReservations = reservations.filter((r) => r.status === "confirmed")
  const totalRevenue = confirmedReservations.reduce((sum, r) => sum + r.totalPrice, 0)
  const totalAttendees = confirmedReservations.reduce((sum, r) => sum + r.ticketCount, 0)

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.price || !formData.capacity) {
      setFormMessage("Por favor completa todos los campos requeridos")
      return
    }

    try {
      addEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category,
        price: Number.parseFloat(formData.price),
        capacity: Number.parseInt(formData.capacity),
        image: formData.image || "/community-event.png",
        organizer: formData.organizer,
      })

      setFormMessage("¡Evento creado exitosamente!")
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        price: "",
        capacity: "",
        image: "",
        organizer: "",
      })

      setTimeout(() => {
        setFormMessage("")
        setActiveTab("events")
      }, 2000)
    } catch (error) {
      setFormMessage("Error al crear el evento. Por favor intenta de nuevo.")
    }
  }

  return (
    <>
      <Navigation />
      <main className="page-container">
        <div className="admin-container">
          <div className="page-header mb-8">
            <h1 className="page-title">Panel de Administración</h1>
            <p className="page-subtitle">Gestiona eventos y reservas</p>
          </div>

          <div className="admin-tabs">
            {(["overview", "events", "create-event", "reservations"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`admin-tab ${activeTab === tab ? "active" : ""}`}
              >
                {tab === "overview" ? "Resumen" : tab === "create-event" ? "Crear Evento" : tab === "events" ? "Eventos" : "Reservas"}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="admin-metrics">
                <div className="admin-metric-card">
                  <p className="admin-metric-label">Total de Eventos</p>
                  <p className="admin-metric-value">{events.length}</p>
                </div>
                <div className="admin-metric-card">
                  <p className="admin-metric-label">Total de Reservas</p>
                  <p className="admin-metric-value">{confirmedReservations.length}</p>
                </div>
                <div className="admin-metric-card">
                  <p className="admin-metric-label">Total de Asistentes</p>
                  <p className="admin-metric-value">{totalAttendees}</p>
                </div>
                <div className="admin-metric-card">
                  <p className="admin-metric-label">Ingresos Totales</p>
                  <p className="admin-metric-value">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>

              <div className="card" style={{ padding: "1.5rem" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Comunicaciones por Correo</h2>
                <p style={{ color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                  Ver todos los correos y confirmaciones del sistema
                </p>
                <Link to="/admin/emails" className="btn btn-primary">
                  Ver Historial de Correos
                </Link>
              </div>
            </div>
          )}

          {activeTab === "create-event" && (
            <div className="create-event-container">
              <div className="card" style={{ padding: "2rem", maxWidth: "56rem", margin: "0 auto" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem" }}>Crear Nuevo Evento</h2>

                {formMessage && (
                  <div
                    style={{
                      padding: "1rem",
                      marginBottom: "1.5rem",
                      borderRadius: "var(--radius)",
                      backgroundColor: formMessage.includes("éxito") || formMessage.includes("exitosamente")
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                      color: formMessage.includes("éxito") || formMessage.includes("exitosamente") ? "var(--accent)" : "var(--destructive)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {formMessage}
                  </div>
                )}

                <form onSubmit={handleCreateEvent} className="create-event-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Título del Evento *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="ej., Conferencia de Tecnología 2025"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Categoría *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Selecciona una categoría</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Diseño">Diseño</option>
                        <option value="Networking">Networking</option>
                        <option value="Educación">Educación</option>
                        <option value="Negocios">Negocios</option>
                        <option value="Entretenimiento">Entretenimiento</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe tu evento"
                      rows={4}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha *</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Hora *</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Ubicación</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="ej., Centro de Convenciones, San Francisco, CA"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Precio (USD) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="99"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Capacidad (asientos) *</label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="100"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>URL de Imagen</label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Organizador</label>
                      <input
                        type="text"
                        value={formData.organizer}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        placeholder="Nombre de tu organización"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                    Crear Evento
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {events.map((event) => {
                const occupancy = (event.registeredCount / event.capacity) * 100
                return (
                  <div key={event.id} className="card" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                          {event.title}
                        </h3>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                            gap: "1rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          <div>
                            <p style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Fecha</p>
                            <p style={{ fontWeight: "500" }}>{event.date}</p>
                          </div>
                          <div>
                            <p style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Categoría</p>
                            <p style={{ fontWeight: "500" }}>{event.category}</p>
                          </div>
                          <div>
                            <p style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Precio</p>
                            <p style={{ fontWeight: "500" }}>${event.price}</p>
                          </div>
                          <div>
                            <p style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Ocupación</p>
                            <p style={{ fontWeight: "500" }}>{occupancy.toFixed(0)}%</p>
                          </div>
                        </div>
                        <div style={{ marginTop: "0.75rem" }}>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${occupancy}%` }} />
                          </div>
                          <p className="event-card-availability" style={{ marginTop: "0.25rem" }}>
                            {event.registeredCount} de {event.capacity} asientos
                          </p>
                        </div>
                      </div>
                      <Link to={`/events/${event.id}`} className="btn btn-outline">
                        Ver Evento
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === "reservations" && (
            <div>
              {confirmedReservations.length === 0 ? (
                <div
                  className="card"
                  style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}
                >
                  Aún no hay reservas
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="admin-events-table">
                    <thead>
                      <tr>
                        <th>Evento</th>
                        <th>Entradas</th>
                        <th>Precio</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confirmedReservations.map((reservation) => {
                        const event = events.find((e) => e.id === reservation.eventId)
                        return (
                          <tr key={reservation.id}>
                            <td>{event?.title || "Evento Desconocido"}</td>
                            <td>{reservation.ticketCount}</td>
                            <td style={{ fontWeight: "600", color: "var(--primary)" }}>
                              ${reservation.totalPrice.toFixed(2)}
                            </td>
                            <td style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{event?.date}</td>
                            <td>
                              <span className="status-badge">Confirmado</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
