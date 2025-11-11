export interface SentEmail {
  id: string
  to: string
  subject: string
  body: string
  type: "confirmation" | "cancellation" | "reminder"
  timestamp: string
}

export class EmailService {
  private static readonly STORAGE_KEY = "sentEmails"

  static sendConfirmation(userEmail: string, eventTitle: string, reservationId: string, totalPrice: number): void {
    const email: SentEmail = {
      id: `email_${Date.now()}`,
      to: userEmail,
      subject: `Reservation Confirmed: ${eventTitle}`,
      body: `
Your reservation has been confirmed!

Event: ${eventTitle}
Confirmation Number: ${reservationId}
Total Price: $${totalPrice.toFixed(2)}

Thank you for booking with EventHub!
      `.trim(),
      type: "confirmation",
      timestamp: new Date().toISOString(),
    }

    this.saveEmail(email)
  }

  static sendCancellation(userEmail: string, eventTitle: string, refundAmount: number): void {
    const email: SentEmail = {
      id: `email_${Date.now()}`,
      to: userEmail,
      subject: `Reservation Cancelled: ${eventTitle}`,
      body: `
Your reservation has been cancelled.

Event: ${eventTitle}
Refund Amount: $${refundAmount.toFixed(2)}

Your refund will be processed within 5-7 business days.
      `.trim(),
      type: "cancellation",
      timestamp: new Date().toISOString(),
    }

    this.saveEmail(email)
  }

  static sendReminder(userEmail: string, eventTitle: string, eventDate: string): void {
    const email: SentEmail = {
      id: `email_${Date.now()}`,
      to: userEmail,
      subject: `Reminder: ${eventTitle} on ${eventDate}`,
      body: `
This is a reminder about your upcoming event.

Event: ${eventTitle}
Date: ${eventDate}

We look forward to seeing you there!
      `.trim(),
      type: "reminder",
      timestamp: new Date().toISOString(),
    }

    this.saveEmail(email)
  }

  private static saveEmail(email: SentEmail): void {
    const emails = this.getAllEmails()
    emails.push(email)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(emails))
  }

  static getAllEmails(): SentEmail[] {
    const emails = localStorage.getItem(this.STORAGE_KEY)
    return emails ? JSON.parse(emails) : []
  }

  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }
}
