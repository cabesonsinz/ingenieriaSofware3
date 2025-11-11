"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ReservationConfirmationProps {
  eventTitle: string
  ticketsCount: number
  totalPrice: number
  reservationId: string
}

export function ReservationConfirmation({
  eventTitle,
  ticketsCount,
  totalPrice,
  reservationId,
}: ReservationConfirmationProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Reserva Confirmada</h2>
        <p className="text-center text-muted-foreground mb-6">Tus entradas han sido reservadas exitosamente</p>

        {/* Reservation Details */}
        <Card className="bg-secondary p-4 mb-6 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Evento</p>
            <p className="font-semibold">{eventTitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Entradas</p>
              <p className="font-semibold">{ticketsCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Precio Total</p>
              <p className="font-semibold text-accent">${totalPrice}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">ID de Reserva</p>
            <p className="font-mono text-xs">{reservationId}</p>
          </div>
        </Card>

        {/* Confirmation Message */}
        <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6">
          <p className="text-sm text-accent font-medium">
            Se ha enviado un correo de confirmación a tu dirección de correo registrada
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/reservations" className="block">
            <Button className="w-full">Ver Mis Reservas</Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              Explorar Más Eventos
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 text-sm text-primary hover:underline text-center"
        >
          {showDetails ? "Ocultar" : "Mostrar"} Información Importante
        </button>

        {showDetails && (
          <Card className="mt-4 p-4 bg-secondary">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Puedes cancelar tu reserva hasta 24 horas antes del evento</li>
              <li>• Se ha enviado un correo de confirmación con los detalles de tus entradas</li>
              <li>• Por favor revisa tu bandeja de entrada y carpeta de spam si no ves el correo</li>
              <li>• Necesitarás presentar tu ID de reserva en el evento</li>
            </ul>
          </Card>
        )}
      </Card>
    </div>
  )
}
