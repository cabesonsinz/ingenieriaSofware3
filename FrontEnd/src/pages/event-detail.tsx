"use client"

/* Updated to use pure CSS classes */
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useData } from "../contexts/data-context"
import { useAuth } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notifications-context"
import { Navigation } from "../components/navigation"
import { BookingForm } from "../components/booking-form"
import "../styles/pages.css"

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { events, addReservation } = useData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const [isBooking, setIsBooking] = useState(false)

  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <>
        <Navigation />
        <main className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="page-title">Evento no encontrado</h1>
            <button onClick={() => navigate("/")} className="btn btn-primary">
              Volver a Eventos
            </button>
          </div>
        </main>
      </>
    )
  }

  const availableTickets = event.capacity - event.registeredCount
  const isAvailable = availableTickets > 0

  const handleBooking = (ticketCount: number) => {
    if (!user) {
      navigate("/login")
      return
    }

    setIsBooking(true)

    try {
      const reservation = addReservation(user.id, event.id, ticketCount)
      sessionStorage.setItem("reservationData", JSON.stringify({ event, reservation, ticketCount }))
      addNotification("¡Reserva confirmada!", "success")
      navigate("/confirmation")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al reservar"
      addNotification(errorMessage, "error")
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="page-container">
        <div className="event-detail-container">
          <div className="event-hero">
            <img src={event.image || "/placeholder.svg"} alt={event.title} />
          </div>

          <div className="event-detail-layout">
            <div className="event-detail-main">
              <div className="event-detail-header">
                <span className="event-detail-category">{event.category}</span>
                <h1 className="event-detail-title">{event.title}</h1>
                <p className="event-detail-description">{event.description}</p>
              </div>

              <div className="card">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                  <div>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                      Fecha
                    </p>
                    <p className="text-lg" style={{ fontWeight: "600" }}>
                      {event.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                      Hora
                    </p>
                    <p className="text-lg" style={{ fontWeight: "600" }}>
                      {event.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                      Ubicación
                    </p>
                    <p className="text-lg" style={{ fontWeight: "600" }}>
                      {event.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                      Organizador
                    </p>
                    <p className="text-lg" style={{ fontWeight: "600" }}>
                      {event.organizer}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>
                  Disponibilidad de Entradas
                </p>
                <div style={{ marginBottom: "1rem" }}>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600" }}>
                    {event.registeredCount} de {event.capacity} vendidas
                  </span>
                  <span style={{ fontWeight: "600", color: isAvailable ? "var(--accent)" : "var(--destructive)" }}>
                    {availableTickets} {availableTickets === 1 ? "entrada" : "entradas"} restantes
                  </span>
                </div>
              </div>
            </div>

            <div className="event-detail-sidebar">
              <div className="event-sidebar-card">
                <div>
                  <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                    Precio por entrada
                  </p>
                  <p className="event-price">${event.price}</p>
                </div>

                {isAvailable ? (
                  <BookingForm event={event} onBook={handleBooking} isLoading={isBooking} />
                ) : (
                  <div
                    style={{
                      padding: "1rem",
                      borderRadius: "var(--radius)",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      color: "var(--destructive)",
                      textAlign: "center",
                      fontWeight: "500",
                    }}
                  >
                    El evento está completamente reservado
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
