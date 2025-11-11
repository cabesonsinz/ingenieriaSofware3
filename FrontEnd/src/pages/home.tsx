"use client"

/* Updated to use pure CSS classes instead of Tailwind */
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useData } from "../contexts/data-context"
import { Navigation } from "../components/navigation"
import "../styles/pages.css"

export default function HomePage() {
  const { events } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.category)))
  }, [events])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || event.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [events, searchTerm, selectedCategory])

  return (
    <>
      <Navigation />
      <main className="page-container">
        <div className="container py-12">
          <div className="page-header mb-12">
            <h1 className="page-title">Descubre Eventos</h1>
            <p className="page-subtitle">Encuentra y reserva entradas para eventos increíbles cerca de ti</p>
          </div>

          <div className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`btn btn-sm ${selectedCategory === null ? "btn-primary" : "btn-outline"}`}
              >
                Todos los Eventos
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn btn-sm ${selectedCategory === category ? "btn-primary" : "btn-outline"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="events-grid">
            {filteredEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} style={{ textDecoration: "none" }}>
                <div className="event-card">
                  <div className="event-card-image">
                    <img src={event.image || "/placeholder.svg"} alt={event.title} />
                  </div>
                  <div className="event-card-body">
                    <div className="event-card-category">{event.category}</div>
                    <h3 className="event-card-title">{event.title}</h3>
                    <p className="event-card-description">{event.description}</p>

                    <div className="event-card-footer">
                      <div className="event-card-info">
                        <span className="event-card-info-date">{event.date}</span>
                        <span className="event-card-info-price">${event.price}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                        />
                      </div>
                      <span className="event-card-availability">
                        {event.registeredCount} de {event.capacity} entradas vendidas
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No se encontraron eventos</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
