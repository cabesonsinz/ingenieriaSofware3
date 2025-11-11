"use client"

export interface EmailTemplate {
  id: string
  recipient: string
  subject: string
  type: "confirmation" | "cancellation" | "reminder"
  data: Record<string, any>
  sentAt: string
  status: "sent" | "pending" | "failed"
}

class EmailService {
  private emails: EmailTemplate[] = []

  constructor() {
    this.loadEmails()
  }

  private loadEmails() {
    const stored = localStorage.getItem("eventhub_emails")
    if (stored) {
      this.emails = JSON.parse(stored)
    }
  }

  private saveEmails() {
    localStorage.setItem("eventhub_emails", JSON.stringify(this.emails))
  }

  sendConfirmationEmail(email: string, eventTitle: string, ticketsCount: number, reservationId: string) {
    const emailTemplate: EmailTemplate = {
      id: `email_${Date.now()}`,
      recipient: email,
      subject: `Reservation Confirmed: ${eventTitle}`,
      type: "confirmation",
      data: {
        eventTitle,
        ticketsCount,
        reservationId,
        confirmationDate: new Date().toISOString().split("T")[0],
      },
      sentAt: new Date().toISOString(),
      status: "sent",
    }

    this.emails.push(emailTemplate)
    this.saveEmails()
    return emailTemplate
  }

  sendCancellationEmail(email: string, eventTitle: string, reservationId: string) {
    const emailTemplate: EmailTemplate = {
      id: `email_${Date.now()}`,
      recipient: email,
      subject: `Reservation Cancelled: ${eventTitle}`,
      type: "cancellation",
      data: {
        eventTitle,
        reservationId,
        cancellationDate: new Date().toISOString().split("T")[0],
      },
      sentAt: new Date().toISOString(),
      status: "sent",
    }

    this.emails.push(emailTemplate)
    this.saveEmails()
    return emailTemplate
  }

  sendReminderEmail(email: string, eventTitle: string, eventDate: string) {
    const emailTemplate: EmailTemplate = {
      id: `email_${Date.now()}`,
      recipient: email,
      subject: `Reminder: ${eventTitle} is coming up!`,
      type: "reminder",
      data: {
        eventTitle,
        eventDate,
      },
      sentAt: new Date().toISOString(),
      status: "sent",
    }

    this.emails.push(emailTemplate)
    this.saveEmails()
    return emailTemplate
  }

  getEmailHistory(email?: string) {
    if (email) {
      return this.emails.filter((e) => e.recipient === email)
    }
    return this.emails
  }

  getAllEmails() {
    return this.emails
  }
}

export const emailService = new EmailService()
