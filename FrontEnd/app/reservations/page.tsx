"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ReservationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { getUserReservations, cancelReservation } = useData()

  if (!user) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Inicio de Sesión Requerido</h2>
            <p className="text-muted-foreground mb-6">Por favor inicia sesión para ver tus reservas</p>
            <Link href="/login">
              <Button className="w-full">Iniciar Sesión</Button>
            </Link>
          </Card>
        </main>
      </>
    )
  }

  const reservations = getUserReservations(user.id)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Mis Reservas</h1>
            <p className="text-muted-foreground">Ver y gestionar todas tus reservas de eventos</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reservations.length === 0 ? (
              <Card className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">Aún no tienes reservas</h3>
                <p className="text-muted-foreground mb-6">Comienza explorando y reservando entradas para eventos próximos</p>
                <Link href="/">
                  <Button>Explorar Eventos</Button>
                </Link>
              </Card>
            ) : (
              reservations.map((reservation) => (
                <Card key={reservation.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{reservation.eventTitle}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Fecha de Reserva</p>
                          <p className="font-medium">{reservation.reservationDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Entradas</p>
                          <p className="font-medium">{reservation.ticketsCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Precio Total</p>
                          <p className="font-medium text-accent">${reservation.totalPrice}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Estado</p>
                          <p className="font-medium text-accent capitalize">{reservation.status}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelReservation(reservation.id)}
                        className="flex-1 sm:flex-none"
                      >
                        Cancelar
                      </Button>
                      <Link href="/" className="flex-1 sm:flex-none">
                        <Button variant="secondary" size="sm" className="w-full">
                          Explorar Más
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Configuración de Cuenta</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
                  <p className="font-semibold text-lg">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Correo Electrónico</p>
                  <p className="font-semibold text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tipo de Cuenta</p>
                  <p className="font-semibold text-lg capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ID de Usuario</p>
                  <p className="font-semibold text-lg font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
