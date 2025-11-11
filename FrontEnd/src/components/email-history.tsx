import type { SentEmail } from "../services/email-service"

interface EmailHistoryProps {
  emails: SentEmail[]
}

export function EmailHistory({ emails }: EmailHistoryProps) {
  if (emails.length === 0) {
    return <div className="card p-8 text-center text-muted-foreground">No hay correos para mostrar</div>
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "confirmation":
        return "Confirmación"
      case "cancellation":
        return "Cancelación"
      case "reminder":
        return "Recordatorio"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <div key={email.id} className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{email.subject}</h3>
              <p className="text-sm text-muted-foreground">Para: {email.to}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                email.type === "confirmation"
                  ? "bg-accent/20 text-accent"
                  : email.type === "cancellation"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-primary/20 text-primary"
              }`}
            >
              {getTypeLabel(email.type)}
            </span>
          </div>

          <div className="bg-secondary rounded-lg p-4 mb-4 text-sm whitespace-pre-wrap">{email.body}</div>

          <p className="text-xs text-muted-foreground">{new Date(email.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
