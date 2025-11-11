"use client"

import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Navigation } from "../components/navigation"
import { EmailHistory } from "../components/email-history"

export default function EmailsPage() {
  const [filterType, setFilterType] = useState<"all" | "confirmation" | "cancellation" | "reminder">("all")

  const storedEmails = JSON.parse(localStorage.getItem("sentEmails") || "[]")

  const filteredEmails = useMemo(() => {
    if (filterType === "all") return storedEmails
    return storedEmails.filter((email: any) => email.type === filterType)
  }, [filterType, storedEmails])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Historial de Correos</h1>
              <p className="text-muted-foreground">Ver todos los correos generados por el sistema</p>
            </div>
            <Link to="/admin" className="btn-outline">
              Volver a Admin
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-8 flex gap-2 flex-wrap">
            {(["all", "confirmation", "cancellation", "reminder"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === type ? "btn-primary" : "btn-outline"
                }`}
              >
                {type === "all" ? "Todos" : type === "confirmation" ? "Confirmación" : type === "cancellation" ? "Cancelación" : "Recordatorio"}
              </button>
            ))}
          </div>

          {/* Email History */}
          <EmailHistory emails={filteredEmails} />
        </div>
      </main>
    </>
  )
}
