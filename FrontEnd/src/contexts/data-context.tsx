"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { EmailService } from "../services/email-service"

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  price: number
  capacity: number
  registeredCount: number
  image: string
  organizer: string
  createdAt: string
}

export interface Reservation {
  id: string
  userId: string
  eventId: string
  ticketCount: number
  totalPrice: number
  status: "confirmed" | "cancelled"
  createdAt: string
  cancelledAt?: string
}

interface DataContextType {
  events: Event[]
  reservations: Reservation[]
  addReservation: (userId: string, eventId: string, ticketCount: number) => Reservation
  cancelReservation: (reservationId: string) => void
  updateEventRegisteredCount: (eventId: string, count: number) => void
  addEvent: (event: Omit<Event, "id" | "createdAt" | "registeredCount">) => Event
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const INITIAL_EVENTS: Event[] = [
  {
    id: "event_1",
    title: "Conferencia de Tecnología 2025",
    description: "Únete a líderes de la industria para obtener información sobre el futuro de la tecnología",
    date: "2025-01-15",
    time: "09:00 AM",
    location: "Centro de Convenciones, San Francisco, CA",
    category: "Tecnología",
    price: 150,
    capacity: 500,
    registeredCount: 320,
    image: "/tech-conference-hall.png",
    organizer: "Eventos Tecnológicos S.A.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "event_2",
    title: "Taller de Diseño",
    description: "Aprende principios de diseño creativo de diseñadores galardonados",
    date: "2025-01-20",
    time: "02:00 PM",
    location: "Centro de Diseño, Nueva York, NY",
    category: "Diseño",
    price: 89,
    capacity: 150,
    registeredCount: 98,
    image: "/design-workshop-creative-space.jpg",
    organizer: "Mentes Creativas S.L.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "event_3",
    title: "Evento de Networking para Startups",
    description: "Conecta con fundadores, inversionistas e innovadores en el ecosistema de startups",
    date: "2025-01-25",
    time: "06:00 PM",
    location: "El Pabellón, Austin, TX",
    category: "Networking",
    price: 49,
    capacity: 300,
    registeredCount: 185,
    image: "/startup-networking-event.png",
    organizer: "Colectivo de Startups",
    createdAt: new Date().toISOString(),
  },
  {
    id: "event_4",
    title: "Bootcamp de Programación",
    description: "Bootcamp intensivo de 3 días cubriendo desarrollo full-stack",
    date: "2025-02-01",
    time: "10:00 AM",
    location: "Academia Tecnológica, Seattle, WA",
    category: "Educación",
    price: 299,
    capacity: 100,
    registeredCount: 87,
    image: "/coding-bootcamp-classroom.jpg",
    organizer: "Academia de Código",
    createdAt: new Date().toISOString(),
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  // Initialize data from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem("events")
    const storedReservations = localStorage.getItem("reservations")

    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    } else {
      setEvents(INITIAL_EVENTS)
      localStorage.setItem("events", JSON.stringify(INITIAL_EVENTS))
    }

    if (storedReservations) {
      setReservations(JSON.parse(storedReservations))
    }
  }, [])

  const addReservation = (userId: string, eventId: string, ticketCount: number) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) {
      throw new Error("Evento no encontrado")
    }

    const totalPrice = event.price * ticketCount
    const reservation: Reservation = {
      id: `res_${Date.now()}`,
      userId,
      eventId,
      ticketCount,
      totalPrice,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    const newReservations = [...reservations, reservation]
    setReservations(newReservations)
    localStorage.setItem("reservations", JSON.stringify(newReservations))

    // Update event registered count
    updateEventRegisteredCount(eventId, event.registeredCount + ticketCount)

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.id === userId)
    if (user) {
      EmailService.sendConfirmation(user.email, event.title, reservation.id, totalPrice)
    }

    return reservation
  }

  const cancelReservation = (reservationId: string) => {
    const reservation = reservations.find((r) => r.id === reservationId)
    if (!reservation) {
      throw new Error("Reserva no encontrada")
    }

    const updatedReservations = reservations.map((r) =>
      r.id === reservationId ? { ...r, status: "cancelled" as const, cancelledAt: new Date().toISOString() } : r,
    )

    setReservations(updatedReservations)
    localStorage.setItem("reservations", JSON.stringify(updatedReservations))

    // Update event registered count
    const event = events.find((e) => e.id === reservation.eventId)
    if (event) {
      updateEventRegisteredCount(reservation.eventId, Math.max(0, event.registeredCount - reservation.ticketCount))
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.id === reservation.userId)
    if (user) {
      EmailService.sendCancellation(user.email, event?.title || "Evento", reservation.totalPrice)
    }
  }

  const updateEventRegisteredCount = (eventId: string, count: number) => {
    const updatedEvents = events.map((e) => (e.id === eventId ? { ...e, registeredCount: count } : e))
    setEvents(updatedEvents)
    localStorage.setItem("events", JSON.stringify(updatedEvents))
  }

  const addEvent = (eventData: Omit<Event, "id" | "createdAt" | "registeredCount">) => {
    const newEvent: Event = {
      ...eventData,
      id: `event_${Date.now()}`,
      createdAt: new Date().toISOString(),
      registeredCount: 0,
    }

    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    localStorage.setItem("events", JSON.stringify(updatedEvents))

    return newEvent
  }

  return (
    <DataContext.Provider
      value={{ events, reservations, addReservation, cancelReservation, updateEventRegisteredCount, addEvent }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}
