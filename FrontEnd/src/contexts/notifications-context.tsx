"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (message: string, type: "success" | "error" | "info", duration?: number) => void
  removeNotification: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback(
    (message: string, type: "success" | "error" | "info" = "info", duration = 4000) => {
      const id = `notif_${Date.now()}`
      setNotifications((prev) => [...prev, { id, message, type, duration }])

      if (duration > 0) {
        setTimeout(() => removeNotification(id), duration)
      }
    },
    [],
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider")
  }
  return context
}
