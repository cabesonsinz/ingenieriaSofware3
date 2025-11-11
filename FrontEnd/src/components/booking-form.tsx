"use client"

/* Updated to use pure CSS classes */
import { useState } from "react"
import type { Event } from "../contexts/data-context"

interface BookingFormProps {
  event: Event
  onBook: (ticketCount: number) => void
  isLoading?: boolean
}

export function BookingForm({ event, onBook, isLoading = false }: BookingFormProps) {
  const [ticketCount, setTicketCount] = useState(1)

  const totalPrice = event.price * ticketCount
  const maxTickets = Math.min(10, event.capacity - event.registeredCount)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
          Número de Entradas
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            −
          </button>
          <span style={{ fontSize: "1.125rem", fontWeight: "600", width: "2rem", textAlign: "center" }}>
            {ticketCount}
          </span>
          <button
            onClick={() => setTicketCount(Math.min(maxTickets, ticketCount + 1))}
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            +
          </button>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.5rem" }}>
          Máximo {maxTickets} entradas por reserva
        </p>
      </div>

      <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ color: "var(--muted-foreground)" }}>Subtotal</span>
          <span style={{ fontWeight: "600" }}>${(event.price * ticketCount).toFixed(2)}</span>
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--primary)" }}>${totalPrice.toFixed(2)}</div>
      </div>

      <button onClick={() => onBook(ticketCount)} disabled={isLoading} className="btn btn-primary w-full">
        {isLoading ? "Reservando..." : "Reservar Ahora"}
      </button>
    </div>
  )
}
