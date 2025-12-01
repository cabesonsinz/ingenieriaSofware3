"use client"

import type React from "react"

/* Updated to use pure CSS classes */
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useData } from "../contexts/data-context"
import { Navigation } from "../components/navigation"
import "../styles/pages.css"

type Tab = "overview" | "events" | "reservations" | "create-event" | "users" | "user-reservations"

export default function AdminPage() {
  const { events, reservations, addEvent, updateEvent, deleteEvent, users, deleteUser, updateUser, cancelReservation } = useData()
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "visitor",
  })
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
  const [searchTerm, setSearchTerm] = useState("")

  // Clear search term when changing tabs
  useEffect(() => {
    setSearchTerm("")
  }, [activeTab])

  const confirmedReservations = reservations.filter((r) => r.status === "confirmed")
  const totalRevenue = confirmedReservations.reduce((sum, r) => sum + Number(r.totalPrice), 0)
  const totalAttendees = confirmedReservations.reduce((sum, r) => sum + r.ticketCount, 0)

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.price || !formData.capacity) {
      setFormMessage("Por favor completa todos los campos requeridos")
      return
    }

    try {
      const eventData = {
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
      }

      if (editingEventId) {
        await updateEvent(editingEventId, eventData)
        setFormMessage("¡Evento actualizado exitosamente!")
      } else {
        await addEvent(eventData)
        setFormMessage("¡Evento creado exitosamente!")
      }

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
      setEditingEventId(null)

      setTimeout(() => {
        setFormMessage("")
        setActiveTab("events")
      }, 2000)
    } catch (error) {
      setFormMessage("Error al guardar el evento. Por favor intenta de nuevo.")
    }
  }

  const handleEditEvent = (event: any) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      price: String(event.price),
      capacity: String(event.capacity),
      image: event.image,
      organizer: event.organizer,
    })
    setEditingEventId(event.id)
    setActiveTab("create-event")
  }

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      try {
        await deleteEvent(id)
      } catch (error) {
        alert("Error al eliminar el evento")
      }
    }
  }

  const handleEditUser = (user: any) => {
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setEditingUserId(user.id)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUserId) return

    try {
      await updateUser(editingUserId, userFormData as any)
      setEditingUserId(null)
      setFormMessage("Usuario actualizado exitosamente")
      setTimeout(() => setFormMessage(""), 2000)
    } catch (error) {
      alert("Error al actualizar usuario")
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
            {(["overview", "events", "create-event", "reservations", "users", "user-reservations"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`admin-tab ${activeTab === tab ? "active" : ""}`}
              >
                {tab === "overview"
                  ? "Resumen"
                  : tab === "create-event"
                    ? editingEventId
                      ? "Editar Evento"
                      : "Crear Evento"
                    : tab === "events"
                      ? "Eventos"
                      : tab === "reservations"
                        ? "Reservas"
                        : tab === "users"
                          ? "Usuarios"
                          : "Reservas por Usuario"}
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
              <div className="card" style={{ padding: "2rem", width: "100%", margin: "0 auto" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem" }}>
                  {editingEventId ? "Editar Evento" : "Crear Nuevo Evento"}
                </h2>

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
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Título del Evento *</label>
                    <input
                      type="text"
                      name="title"
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

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Descripción</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe tu evento"
                      rows={4}
                    />
                  </div>

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

                  <div className="form-group">
                    <label>Ubicación</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="ej., Centro de Convenciones"
                    />
                  </div>

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
                    <label>Capacidad *</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="100"
                      min="1"
                      required
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

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>URL de Imagen</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                      {editingEventId ? "Guardar Cambios" : "Crear Evento"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="card" style={{ padding: "1rem" }}>
                <input
                  type="text"
                  placeholder="Buscar eventos por título o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                />
              </div>
              {events
                .filter(
                  (event) =>
                    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.category.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((event) => {
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
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Link to={`/events/${event.id}`} className="btn btn-outline" style={{ flex: 1 }}>
                            Ver
                          </Link>
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="btn btn-outline"
                            style={{ flex: 1, borderColor: "var(--primary)", color: "var(--primary)" }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="btn btn-outline"
                            style={{ flex: 1, borderColor: "var(--destructive)", color: "var(--destructive)" }}
                          >
                            Eliminar
                          </button>
                        </div>
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
                              ${Number(reservation.totalPrice).toFixed(2)}
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

          {activeTab === "users" && (
            <div>
              <div className="card" style={{ padding: "1rem", marginBottom: "1.5rem" }}>
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                />
              </div>

              {editingUserId && (
                <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Editar Usuario</h3>
                  <form onSubmit={handleUpdateUser} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                    <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={userFormData.name}
                        onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
                      <label>Email</label>
                      <input
                        type="email"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: "150px" }}>
                      <label>Rol</label>
                      <select
                        value={userFormData.role}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                      >
                        <option value="visitor">Visitante</option>
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button type="submit" className="btn btn-primary">Guardar</button>
                      <button type="button" onClick={() => setEditingUserId(null)} className="btn btn-outline">Cancelar</button>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ overflowX: "auto" }}>
                <table className="admin-events-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(
                        (user) =>
                          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td style={{ textTransform: "capitalize" }}>{user.role}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="btn btn-outline"
                                style={{ borderColor: "var(--primary)", color: "var(--primary)", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                              >
                                Editar
                              </button>
                              <button
                                onClick={async () => {
                                  if (window.confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) {
                                    try {
                                      await deleteUser(user.id)
                                    } catch (error) {
                                      alert("Error al eliminar usuario")
                                    }
                                  }
                                }}
                                className="btn btn-outline"
                                style={{ borderColor: "var(--destructive)", color: "var(--destructive)", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "user-reservations" && (
            <div>
              <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Seleccionar Usuario</label>
                <div style={{ marginBottom: "1rem" }}>
                  <input
                    type="text"
                    placeholder="Filtrar lista de usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", marginBottom: "0.5rem" }}
                  />
                </div>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                >
                  <option value="">-- Selecciona un usuario --</option>
                  {users
                    .filter(
                      (user) =>
                        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </select>
              </div>

              {selectedUserId && (
                <div>
                  {reservations.filter((r) => String(r.userId) === String(selectedUserId) && r.status === "confirmed").length === 0 ? (
                    <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                      Este usuario no tiene reservas activas.
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table className="admin-events-table">
                        <thead>
                          <tr>
                            <th>Evento</th>
                            <th>Entradas</th>
                            <th>Total</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations
                            .filter((r) => String(r.userId) === String(selectedUserId) && r.status === "confirmed")
                            .map((reservation) => {
                              const event = events.find((e) => e.id === reservation.eventId)
                              return (
                                <tr key={reservation.id}>
                                  <td>{event?.title || "Evento Desconocido"}</td>
                                  <td>{reservation.ticketCount}</td>
                                  <td>${Number(reservation.totalPrice).toFixed(2)}</td>
                                  <td>{event?.date}</td>
                                  <td>
                                    <button
                                      onClick={async () => {
                                        if (window.confirm("¿Cancelar esta reserva?")) {
                                          try {
                                            await cancelReservation(reservation.id)
                                          } catch (error) {
                                            alert("Error al cancelar reserva")
                                          }
                                        }
                                      }}
                                      className="btn btn-outline"
                                      style={{ borderColor: "var(--destructive)", color: "var(--destructive)", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                                    >
                                      Cancelar
                                    </button>
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
          )}
        </div>
      </main>
    </>
  )
}
