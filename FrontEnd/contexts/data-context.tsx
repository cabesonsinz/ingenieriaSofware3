"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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
}

export interface Reservation {
  id: string
  userId: string
  eventId: string
  eventTitle: string
  reservationDate: string
  status: "confirmed" | "cancelled"
  ticketsCount: number
  totalPrice: number
}

interface DataContextType {
  events: Event[]
  reservations: Reservation[]
  addReservation: (reservation: Reservation) => void
  cancelReservation: (reservationId: string) => void
  getEventById: (id: string) => Event | undefined
  getUserReservations: (userId: string) => Reservation[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const INITIAL_EVENTS: Event[] = [
  {
    id: "evt_1",
    title: "Tech Conference 2025",
    description:
      "Annual technology conference featuring keynotes from industry leaders, workshops, and networking opportunities.",
    date: "2025-03-15",
    time: "09:00",
    location: "San Francisco, CA",
    category: "Conference",
    price: 299,
    capacity: 500,
    registeredCount: 245,
    image: "/tech-conference-hall.png",
    organizer: "Tech Events Inc",
  },
  {
    id: "evt_2",
    title: "Design Workshop",
    description: "Interactive workshop on modern UI/UX design principles with hands-on exercises and expert guidance.",
    date: "2025-03-20",
    time: "14:00",
    location: "New York, NY",
    category: "Workshop",
    price: 149,
    capacity: 50,
    registeredCount: 42,
    image: "/design-workshop-creative-space.jpg",
    organizer: "Design Academy",
  },
  {
    id: "evt_3",
    title: "Startup Networking Event",
    description:
      "Connect with fellow entrepreneurs, investors, and industry mentors in an exclusive networking setting.",
    date: "2025-03-25",
    time: "18:00",
    location: "Austin, TX",
    category: "Networking",
    price: 79,
    capacity: 200,
    registeredCount: 156,
    image: "/startup-networking-event.png",
    organizer: "Startup Hub",
  },
  {
    id: "evt_4",
    title: "Web Development Bootcamp",
    description:
      "Intensive bootcamp covering modern web technologies, frameworks, and best practices for professional development.",
    date: "2025-04-01",
    time: "10:00",
    location: "Seattle, WA",
    category: "Course",
    price: 499,
    capacity: 100,
    registeredCount: 87,
    image: "/coding-bootcamp-classroom.jpg",
    organizer: "DevSchool",
  },
  {
    id: "evt_5",
    title: "Marketing Summit",
    description: "Discover latest trends in digital marketing, SEO, social media strategies, and brand development.",
    date: "2025-04-05",
    time: "09:00",
    location: "Los Angeles, CA",
    category: "Summit",
    price: 199,
    capacity: 300,
    registeredCount: 178,
    image: "/marketing-conference-audience.jpg",
    organizer: "Marketing Pro",
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  // Load initial data on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("eventub_events")
    const savedReservations = localStorage.getItem("eventub_reservations")

    if (!savedEvents) {
      localStorage.setItem("eventub_events", JSON.stringify(INITIAL_EVENTS))
      setEvents(INITIAL_EVENTS)
    } else {
      setEvents(JSON.parse(savedEvents))
    }

    if (savedReservations) {
      setReservations(JSON.parse(savedReservations))
    }
  }, [])

  const addReservation = (reservation: Reservation) => {
    const updated = [...reservations, reservation]
    setReservations(updated)
    localStorage.setItem("eventub_reservations", JSON.stringify(updated))

    // Update registered count
    const updatedEvents = events.map((evt) =>
      evt.id === reservation.eventId
        ? { ...evt, registeredCount: evt.registeredCount + reservation.ticketsCount }
        : evt,
    )
    setEvents(updatedEvents)
    localStorage.setItem("eventub_events", JSON.stringify(updatedEvents))
  }

  const cancelReservation = (reservationId: string) => {
    const reservation = reservations.find((r) => r.id === reservationId)
    if (!reservation) return

    const updated = reservations.map((r) => (r.id === reservationId ? { ...r, status: "cancelled" as const } : r))
    setReservations(updated)
    localStorage.setItem("eventub_reservations", JSON.stringify(updated))

    // Update registered count
    const updatedEvents = events.map((evt) =>
      evt.id === reservation.eventId
        ? { ...evt, registeredCount: Math.max(0, evt.registeredCount - reservation.ticketsCount) }
        : evt,
    )
    setEvents(updatedEvents)
    localStorage.setItem("eventub_events", JSON.stringify(updatedEvents))
  }

  const getEventById = (id: string) => events.find((evt) => evt.id === id)

  const getUserReservations = (userId: string) =>
    reservations.filter((r) => r.userId === userId && r.status === "confirmed")

  return (
    <DataContext.Provider
      value={{ events, reservations, addReservation, cancelReservation, getEventById, getUserReservations }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}
