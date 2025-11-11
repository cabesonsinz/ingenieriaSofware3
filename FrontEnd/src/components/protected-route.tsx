"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"

interface ProtectedRouteProps {
  requiredRole?: "user" | "admin"
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole === "admin" && user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
