/* Updated to use inline styles with pure CSS animations */
import { useNotifications } from "../contexts/notifications-context"

export function NotificationsCenter() {
  const { notifications } = useNotifications()

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "var(--accent)"
      case "error":
        return "var(--destructive)"
      default:
        return "var(--primary)"
    }
  }

  const getTextColor = (type: string) => {
    return type === "error" || type === "success" ? "var(--primary-foreground)" : "var(--primary-foreground)"
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {notifications.map((notif) => (
        <div
          key={notif.id}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius)",
            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
            fontSize: "0.875rem",
            fontWeight: "500",
            backgroundColor: getBackgroundColor(notif.type),
            color: getTextColor(notif.type),
            animation: "slideIn 0.3s ease",
          }}
        >
          {notif.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
