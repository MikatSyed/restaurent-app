"use client"

import { useAppSelector, useAppDispatch } from "@/lib/store"
import { updatePersonName, proceedToFoodSelection, goBackToStep } from "@/lib/slices/bookingSlice"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Users } from "lucide-react"

export function PersonDetails() {
  const dispatch = useAppDispatch()
  const { selectedTable, bookingType, people, bookingStep } = useAppSelector((state) => state.booking)

  if (bookingStep !== "person-details" || !selectedTable) {
    return null
  }

  const handleNameChange = (personId: string, name: string) => {
    dispatch(updatePersonName({ personId, name }))
  }

  const handleProceed = () => {
    dispatch(proceedToFoodSelection())
  }

  const handleBack = () => {
    dispatch(goBackToStep("seat-selection"))
  }

  const allNamesEntered = people.every((person) => person.name.trim().length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="border border-white text-white hover:bg-white hover:text-black transition-colors rounded-full h-10 w-10 p-0 flex items-center justify-center bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">Person Details - Table {selectedTable.number}</h1>
            <p className="text-gray-300">Enter names for each person</p>
          </div>
        </div>

        {/* Booking Summary */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            {bookingType === "individual" ? (
              <User className="w-6 h-6 text-yellow-400" />
            ) : (
              <Users className="w-6 h-6 text-yellow-400" />
            )}
            <h2 className="text-xl font-bold text-yellow-400">
              {bookingType === "individual" ? "Individual Booking" : "Group Booking"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Table:</span>
              <span className="ml-2 font-semibold">Table {selectedTable.number}</span>
            </div>
            <div>
              <span className="text-gray-400">People:</span>
              <span className="ml-2 font-semibold">{people.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Seats:</span>
              <span className="ml-2 font-semibold">
                {people
                  .map((p) => p.seatNumber)
                  .sort((a, b) => a - b)
                  .join(", ")}
              </span>
            </div>
          </div>
        </Card>

        {/* Person Details Form */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-6">Enter Person Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {people.map((person, index) => (
              <div key={person.id} className="space-y-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                    {person.seatNumber}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Seat {person.seatNumber}</h3>
                    <p className="text-sm text-gray-400">Person {index + 1}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`name-${person.id}`} className="text-gray-300">
                    Full Name *
                  </Label>
                  <Input
                    id={`name-${person.id}`}
                    type="text"
                    placeholder="Enter full name"
                    value={person.name}
                    onChange={(e) => handleNameChange(person.id, e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-yellow-400 font-semibold">
                {people.filter((p) => p.name.trim().length > 0).length} of {people.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(people.filter((p) => p.name.trim().length > 0).length / people.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700/50 bg-transparent"
          >
            Back to Seat Selection
          </Button>
          <Button
            onClick={handleProceed}
            disabled={!allNamesEntered}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Food Selection
          </Button>
        </div>
      </div>
    </div>
  )
}
