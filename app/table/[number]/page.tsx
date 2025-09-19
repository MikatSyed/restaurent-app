"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { selectTable } from "@/lib/slices/bookingSlice"
import { SeatSelection } from "@/components/seat-selection"
import { PersonDetails } from "@/components/person-details"
import { IndividualFoodSelection } from "@/components/individual-food-selection"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { Navigation } from "@/components/navigation"

export default function TablePage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { tables, bookingStep, selectedTable } = useAppSelector((state) => state.booking)

  const tableNumber = Number.parseInt(params.number as string)

  useEffect(() => {
    if (tableNumber && !selectedTable) {
      const table = tables.find((t) => t.number === tableNumber)
      if (table) {
        dispatch(selectTable(table.id))
      } else {
        // Redirect to home if table not found
        router.push("/")
      }
    }
  }, [tableNumber, selectedTable, tables, dispatch, router])

  // Redirect to home if no table selected
  if (!selectedTable || selectedTable.number !== tableNumber) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Loading Table {tableNumber}...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {bookingStep === "seat-selection" && <SeatSelection />}
      {bookingStep === "person-details" && <PersonDetails />}
      {bookingStep === "food-selection" && <IndividualFoodSelection />}
      {bookingStep === "confirmation" && <BookingConfirmation />}
    </div>
  )
}
