"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "visitor" | "user" | "admin"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Ensure ID is string even from local storage
        const formattedUser = { ...parsedUser, id: String(parsedUser.id) }
        setUser(formattedUser)
      } catch (error) {
        console.error("Failed to parse stored user", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Error al iniciar sesión")
        }
        // Ensure ID is string
        const formattedUser = { ...data, id: String(data.id) }
        setUser(formattedUser)
        localStorage.setItem("currentUser", JSON.stringify(formattedUser))
      } else {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Error del servidor: Respuesta no válida")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (email: string, name: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password }),
      })

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.detail || "Error al registrarse")
        }
        // Ensure ID is string
        const formattedUser = { ...data, id: String(data.id) }
        setUser(formattedUser)
        localStorage.setItem("currentUser", JSON.stringify(formattedUser))
      } else {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Error del servidor: Respuesta no válida")
      }
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
