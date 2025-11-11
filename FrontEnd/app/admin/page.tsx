"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useData, type Event } from "@/contexts/data-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AdminPage() {
  const { user } = useAuth()
  const { events, reservations } = useData()
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "reservations">("overview")
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  if (!user || user.role !== "admin") {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-6">No tienes permiso para acceder al panel de administración</p>
            <Link href="/">
              <Button className="w-full">Volver al Inicio</Button>
            </Link>
          </Card>
        </main>
      </>
    )
  }

  const totalRevenue = reservations.reduce((sum, res) => sum + (res.status === "confirmed" ? res.totalPrice : 0), 0)
  const totalReservations = reservations.filter((r) => r.status === "confirmed").length
  const totalAttendees = reservations.reduce((sum, res) => sum + (res.status === "confirmed" ? res.ticketsCount : 0), 0)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona eventos, reservas y visualiza estadísticas</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b">
            {(["overview", "events", "reservations"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "overview" ? "Resumen" : tab === "events" ? "Eventos" : "Reservas"}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Ingresos Totales</p>
                <p className="text-3xl font-bold text-accent">${totalRevenue}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total de Reservas</p>
                <p className="text-3xl font-bold text-primary">{totalReservations}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total de Asistentes</p>
                <p className="text-3xl font-bold text-primary">{totalAttendees}</p>
              </Card>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-4">
              {events.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No se encontraron eventos</p>
                </Card>
              ) : (
                events.map((event) => (
                  <Card key={event.id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Categoría</p>
                            <p className="font-medium">{event.category}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fecha</p>
                            <p className="font-medium">{event.date}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Entradas</p>
                            <p className="font-medium">
                              {event.registeredCount}/{event.capacity}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Precio</p>
                            <p className="font-medium">${event.price}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEvent(event)}
                          className="flex-1 sm:flex-none"
                        >
                          Editar
                        </Button>
                        <Link href={`/events/${event.id}`} className="flex-1 sm:flex-none">
                          <Button variant="secondary" size="sm" className="w-full">
                            Ver
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No se encontraron reservas</p>
                </Card>
              ) : (
                reservations.map((reservation) => (
                  <Card key={reservation.id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{reservation.eventTitle}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">ID de Reserva</p>
                            <p className="font-medium font-mono text-xs">{reservation.id}</p>
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
                            <p className="text-muted-foreground">Fecha</p>
                            <p className="font-medium">{reservation.reservationDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Estado</p>
                            <p
                              className={`font-medium capitalize ${reservation.status === "confirmed" ? "text-accent" : "text-destructive"}`}
                            >
                              {reservation.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
