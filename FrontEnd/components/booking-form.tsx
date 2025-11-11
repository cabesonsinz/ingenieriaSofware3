"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import type { Event } from "@/contexts/data-context"

interface BookingFormProps {
  event: Event
  onSuccess?: () => void
}

export function BookingForm({ event, onSuccess }: BookingFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { addReservation } = useData()
  const [ticketsCount, setTicketsCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const availableTickets = event.capacity - event.registeredCount
  const totalPrice = event.price * ticketsCount

  const handleSubmit = async (e: React.FormEvent) => {
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
      const reservationId = `res_${Date.now()}`
      const reservation = {
        id: reservationId,
        userId: user.id,
        eventId: event.id,
        eventTitle: event.title,
        reservationDate: new Date().toISOString().split("T")[0],
        status: "confirmed" as const,
        ticketsCount,
        totalPrice,
      }

      addReservation(reservation)

      // Store confirmation data and redirect
      sessionStorage.setItem(
        "reservation_confirmation",
        JSON.stringify({
          eventTitle: event.title,
          ticketsCount,
          totalPrice,
          reservationId,
        }),
      )

      if (onSuccess) {
        onSuccess()
      }

      // Redirect to confirmation page
      router.push("/confirmation")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reservar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 sticky top-4">
      <h3 className="font-semibold text-lg mb-6">Reservar Entradas</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            <button type="button" onClick={() => router.push("/login")} className="text-primary hover:underline">
              Inicia sesión
            </button>{" "}
            para reservar entradas
          </p>
        )}
      </form>
    </Card>
  )
}
