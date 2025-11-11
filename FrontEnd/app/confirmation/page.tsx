"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ReservationConfirmation } from "@/components/reservation-confirmation"

interface ConfirmationData {
  eventTitle: string
  ticketsCount: number
  totalPrice: number
  reservationId: string
}

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null)

  useEffect(() => {
    // Get confirmation data from sessionStorage (set during reservation)
    const data = sessionStorage.getItem("reservation_confirmation")
    if (data) {
      setConfirmationData(JSON.parse(data))
      sessionStorage.removeItem("reservation_confirmation")
    } else {
      // Fallback: redirect to home if no confirmation data
      router.push("/")
    }
  }, [router])

  if (!confirmationData) {
    return null
  }

  return (
    <ReservationConfirmation
      eventTitle={confirmationData.eventTitle}
      ticketsCount={confirmationData.ticketsCount}
      totalPrice={confirmationData.totalPrice}
      reservationId={confirmationData.reservationId}
    />
  )
}
