"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "visitor" | "registered" | "admin"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("eventub_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    // Simulated login logic
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = JSON.parse(localStorage.getItem("eventub_users") || "[]")
    const foundUser = users.find((u: User) => u.email === email)

    if (!foundUser) {
      throw new Error("Credenciales inválidas")
    }

    setUser(foundUser)
    localStorage.setItem("eventub_user", JSON.stringify(foundUser))
    setLoading(false)
  }

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = JSON.parse(localStorage.getItem("eventub_users") || "[]")

    if (users.find((u: User) => u.email === email)) {
      throw new Error("El usuario ya existe")
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: "registered",
    }

    users.push(newUser)
    localStorage.setItem("eventub_users", JSON.stringify(users))

    setUser(newUser)
    localStorage.setItem("eventub_user", JSON.stringify(newUser))
    setLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("eventub_user")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
