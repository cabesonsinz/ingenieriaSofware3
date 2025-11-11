"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export function AdminSetup() {
  const { user } = useAuth()
  const [setup, setSetup] = useState(false)

  useEffect(() => {
    // Create a demo admin user if no users exist
    const users = JSON.parse(localStorage.getItem("eventub_users") || "[]")
    if (users.length === 0) {
      const adminUser = {
        id: "user_admin_001",
        email: "admin@eventhub.com",
        name: "Admin User",
        role: "admin",
      }
      users.push(adminUser)
      localStorage.setItem("eventub_users", JSON.stringify(users))
      setSetup(true)
    }
  }, [])

  return null
}
