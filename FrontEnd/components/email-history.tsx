"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { emailService, type EmailTemplate } from "@/services/email-service"

export function EmailHistory() {
  const [emails, setEmails] = useState<EmailTemplate[]>([])
  const [filter, setFilter] = useState<"all" | "confirmation" | "cancellation" | "reminder">("all")

  useEffect(() => {
    const allEmails = emailService.getAllEmails()
    setEmails(allEmails)
  }, [])

  const filteredEmails = filter === "all" ? emails : emails.filter((e) => e.type === filter)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "confirmation":
        return "bg-accent/10 text-accent"
      case "cancellation":
        return "bg-destructive/10 text-destructive"
      case "reminder":
        return "bg-primary/10 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(["all", "confirmation", "cancellation", "reminder"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === type
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {type === "all" ? "Todos" : type === "confirmation" ? "Confirmación" : type === "cancellation" ? "Cancelación" : "Recordatorio"} (
            {emails.filter((e) => type === "all" || e.type === type).length})
          </button>
        ))}
      </div>

      {filteredEmails.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No se encontraron correos</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredEmails.map((email) => (
            <Card key={email.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className={`px-3 py-1 rounded text-xs font-semibold capitalize ${getTypeColor(email.type)}`}>
                  {email.type}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{email.subject}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{email.recipient}</p>
                  <p className="text-xs text-muted-foreground">{new Date(email.sentAt).toLocaleString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
