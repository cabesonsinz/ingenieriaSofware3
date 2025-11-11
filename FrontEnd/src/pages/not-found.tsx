import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Página no encontrada</p>
        <Link to="/" className="btn-primary">
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
