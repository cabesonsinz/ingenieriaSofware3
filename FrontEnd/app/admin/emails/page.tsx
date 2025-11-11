"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmailHistory } from "@/components/email-history"

export default function AdminEmailsPage() {
  const { user } = useAuth()

  if (!user || user.role !== "admin") {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-6">No tienes permiso para acceder a esta página</p>
            <Link href="/">
              <Button className="w-full">Volver al Inicio</Button>
            </Link>
          </Card>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Historial de Correos</h1>
              <p className="text-muted-foreground">Ver todos los correos y notificaciones generados por el sistema</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Volver a Admin</Button>
            </Link>
          </div>

          <EmailHistory />
        </div>
      </main>
    </>
  )
}
