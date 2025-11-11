"use client"

/* Updated to use pure CSS classes */
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { useData } from "../contexts/data-context"
import { useNotifications } from "../contexts/notifications-context"
import { Navigation } from "../components/navigation"
import "../styles/pages.css"

export default function ReservationsPage() {
  const { user } = useAuth()
  const { reservations, events, cancelReservation } = useData()
  const { addNotification } = useNotifications()

  const userReservations = reservations.filter((r) => r.userId === user?.id && r.status === "confirmed")

  const handleCancel = (reservationId: string) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      try {
        cancelReservation(reservationId)
        addNotification("Reserva cancelada", "info")
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error al cancelar la reserva"
        addNotification(errorMessage, "error")
      }
    }
  }

  return (
    <>
      <Navigation />
      <main className="page-container">
        <div className="reservations-container">
          <div className="page-header mb-8">
            <h1 className="page-title">Mis Reservas</h1>
            <p className="page-subtitle">Gestiona tus reservas de eventos</p>
          </div>

          <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Información de Cuenta</h2>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1.5rem" }}
            >
              <div>
                <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                  Nombre
                </p>
                <p style={{ fontWeight: "600" }}>{user?.name}</p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                  Correo Electrónico
                </p>
                <p style={{ fontWeight: "600" }}>{user?.email}</p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                  Tipo de Cuenta
                </p>
                <p style={{ fontWeight: "600", textTransform: "capitalize" }}>{user?.role}</p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                  Miembro Desde
                </p>
                <p style={{ fontWeight: "600" }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Próximos Eventos</h2>

            {userReservations.length === 0 ? (
              <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <p style={{ color: "var(--muted-foreground)", marginBottom: "1rem" }}>Aún no tienes reservas</p>
                <Link to="/" className="btn btn-primary">
                  Explorar Eventos
                </Link>
              </div>
            ) : (
              <div className="reservations-list">
                {userReservations.map((reservation) => {
                  const event = events.find((e) => e.id === reservation.eventId)
                  if (!event) return null

                  return (
                    <div key={reservation.id} className="reservation-card">
                      <div className="reservation-info">
                        <h3 className="reservation-title">{event.title}</h3>
                        <div className="reservation-details">
                          <div className="reservation-detail-item">
                            <span className="reservation-detail-label">Fecha</span>
                            <span className="reservation-detail-value">{event.date}</span>
                          </div>
                          <div className="reservation-detail-item">
                            <span className="reservation-detail-label">Hora</span>
                            <span className="reservation-detail-value">{event.time}</span>
                          </div>
                          <div className="reservation-detail-item">
                            <span className="reservation-detail-label">Entradas</span>
                            <span className="reservation-detail-value">{reservation.ticketCount}</span>
                          </div>
                          <div className="reservation-detail-item">
                            <span className="reservation-detail-label">Precio Total</span>
                            <span className="reservation-detail-value" style={{ color: "var(--primary)" }}>
                              ${reservation.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="reservation-actions">
                        <Link to={`/events/${event.id}`} className="reservation-action-btn">
                          Ver Evento
                        </Link>
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          className="reservation-action-btn reservation-cancel-btn"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
