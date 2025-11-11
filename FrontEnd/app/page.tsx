"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useData } from "@/contexts/data-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Home() {
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
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-balance mb-2">Descubre Eventos</h1>
            <p className="text-muted-foreground text-lg">
              Encuentra y reserva entradas para eventos increíbles cerca de ti
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <Input
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
              >
                Todos los Eventos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{event.date}</span>
                        <span className="font-semibold text-primary">${event.price}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-accent rounded-full h-2 transition-all"
                          style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {event.registeredCount} de {event.capacity} entradas vendidas
                      </span>
                    </div>
                  </div>
                </Card>
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
