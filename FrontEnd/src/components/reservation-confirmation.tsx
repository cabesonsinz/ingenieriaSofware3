import { Link } from "react-router-dom"

interface ConfirmationData {
  event: any
  reservation: any
  ticketCount: number
}

interface ReservationConfirmationProps {
  confirmationData: ConfirmationData
}

export function ReservationConfirmation({ confirmationData }: ReservationConfirmationProps) {
  const { event, reservation, ticketCount } = confirmationData

  return (
    <div className="card p-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-3xl">✓</span>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">¡Reserva Confirmada!</h1>
        <p className="text-muted-foreground">Tus entradas han sido reservadas exitosamente</p>
      </div>

      <div className="bg-secondary rounded-lg p-6 text-left space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Evento</p>
          <p className="font-semibold text-lg">{event.title}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Fecha y Hora</p>
            <p className="font-semibold">
              {event.date} a las {event.time}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Número de Entradas</p>
            <p className="font-semibold">{ticketCount}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Ubicación</p>
          <p className="font-semibold">{event.location}</p>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Precio Total</span>
            <span className="text-2xl font-bold text-primary">${Number(reservation.totalPrice).toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-accent/20 rounded p-3 text-sm">
          <p className="font-semibold mb-1">Número de Confirmación</p>
          <p className="font-mono text-primary">{reservation.id}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/reservations" className="btn-primary">
          Ver Mis Reservas
        </Link>
        <Link to="/" className="btn-outline">
          Explorar Más Eventos
        </Link>
      </div>
    </div>
  )
}
