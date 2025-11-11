"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Navigation } from "../components/navigation"
import { ReservationConfirmation } from "../components/reservation-confirmation"

interface ConfirmationData {
  event: any
  reservation: any
  ticketCount: number
}

export default function ConfirmationPage() {
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const data = sessionStorage.getItem("reservationData")
    if (data) {
      setConfirmationData(JSON.parse(data))
      sessionStorage.removeItem("reservationData")
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando confirmación...</p>
          </div>
        </div>
      </>
    )
  }

  if (!confirmationData) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">No se Encontró Reserva</h1>
            <p className="text-muted-foreground mb-6">Por favor realiza una reserva primero</p>
            <Link to="/" className="btn-primary">
              Explorar Eventos
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ReservationConfirmation confirmationData={confirmationData} />
        </div>
      </main>
    </>
  )
}
