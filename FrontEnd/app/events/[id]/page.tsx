"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getEventById, addReservation } = useData()
  const { user } = useAuth()
  const event = getEventById(params.id as string)

  const [ticketsCount, setTicketsCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  if (!event) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Evento no encontrado</h1>
              <Link href="/">
                <Button>Volver a Eventos</Button>
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  const availableTickets = event.capacity - event.registeredCount
  const totalPrice = event.price * ticketsCount

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push("/login")
      return
    }

    if (ticketsCount > availableTickets) {
      setError("No hay suficientes entradas disponibles")
      return
    }

    setLoading(true)
    setError("")

    try {
      const reservation = {
        id: `res_${Date.now()}`,
        userId: user.id,
        eventId: event.id,
        eventTitle: event.title,
        reservationDate: new Date().toISOString().split("T")[0],
        status: "confirmed" as const,
        ticketsCount,
        totalPrice,
      }

      addReservation(reservation)
      setSuccess(true)

      setTimeout(() => {
        router.push("/reservations")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reservar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="text-primary hover:underline text-sm mb-6 inline-block">
            ← Volver a Eventos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden mb-6">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-96 object-cover" />
              </div>

              <Card className="p-6 mb-6">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">{event.category}</span>
                </div>

                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha</p>
                    <p className="font-semibold">{event.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hora</p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ubicación</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Organizador</p>
                    <p className="font-semibold">{event.organizer}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-3">Acerca de este evento</h2>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </div>

                <div className="border-t mt-6 pt-6">
                  <h3 className="font-semibold mb-3">Disponibilidad</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entradas vendidas</span>
                      <span className="font-medium">
                        {event.registeredCount} de {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="bg-accent rounded-full h-3 transition-all"
                        style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{availableTickets} entradas restantes</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Reservation Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h3 className="font-semibold text-lg mb-6">Reservar Entradas</h3>

                {success ? (
                  <div className="p-4 bg-accent/10 border border-accent rounded-lg mb-4">
                    <p className="text-sm font-medium text-accent">¡Reserva confirmada! Redirigiendo...</p>
                  </div>
                ) : (
                  <form onSubmit={handleReserve} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Número de Entradas</label>
                      <Input
                        type="number"
                        min="1"
                        max={availableTickets}
                        value={ticketsCount}
                        onChange={(e) => setTicketsCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                        disabled={availableTickets === 0 || loading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Hasta {availableTickets} disponibles</p>
                    </div>

                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Precio unitario</span>
                        <span className="font-medium">${event.price}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-accent">${totalPrice}</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={availableTickets === 0 || loading}>
                      {availableTickets === 0 ? "Agotado" : loading ? "Procesando..." : "Reservar Ahora"}
                    </Button>

                    {!user && (
                      <p className="text-center text-xs text-muted-foreground">
                        <Link href="/login" className="text-primary hover:underline">
                          Inicia sesión
                        </Link>{" "}
                        para reservar entradas
                      </p>
                    )}
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
