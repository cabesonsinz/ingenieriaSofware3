"use client"

import { useEffect } from "react"

export function AdminSetup() {
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Only add demo admin if no users exist
    if (users.length === 0) {
      const demoAdmin = {
        id: "admin_demo",
        email: "admin@example.com",
        name: "Admin User",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
      }

      users.push(demoAdmin)
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [])

  return null
}
