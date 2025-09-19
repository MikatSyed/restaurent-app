"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, User } from "lucide-react";
import IndividualFoodSelection from "./individual-food-selection";

type BookingType = "individual" | "group" | "takeout";

type FoodSelection = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  quantity: number;
};

type Person = {
  id: string;
  name: string;
  seatNumber: number;
  foodSelections: FoodSelection[];
};

interface SeatSelectionProps {
  selectedTable: number;
  onStepChange: (
    step: "table-selection" | "seat-selection" | "person-details" | "food-selection"
  ) => void;
}

export function SeatSelection({ selectedTable, onStepChange }: SeatSelectionProps) {
  const [bookingType, setBookingType] = useState<BookingType>("individual");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [names, setNames] = useState<string[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  const availableSeats = Array.from({ length: 8 }, (_, i) => i + 1); // assume 8 seats per table
  const maxPickable = availableSeats.length;

  useEffect(() => {
    setNames((prev) => {
      const next = [...prev];
      if (numberOfPeople > next.length) {
        while (next.length < numberOfPeople) next.push("");
      } else if (numberOfPeople < next.length) {
        next.length = numberOfPeople;
      }
      return next;
    });
  }, [numberOfPeople]);

  useEffect(() => {
    const newPeople: Person[] = Array.from({ length: numberOfPeople }, (_, i) => ({
      id: `p-${i + 1}`,
      name: (names[i] ?? "").trim(),
      seatNumber: i + 1,
      foodSelections: people[i]?.foodSelections || [],
    }));
    setPeople(newPeople);
  }, [names, numberOfPeople]);

  const completedCount = useMemo(
    () => names.filter((n) => n.trim().length > 0).length,
    [names]
  );

  const handleBookingTypeChange = (type: BookingType) => {
    setBookingType(type);
    if (type === "individual") setNumberOfPeople(1);
  };

  const handleNumberOfPeopleChange = (num: number) => {
    const safe = Math.max(1, Math.min(maxPickable, Math.floor(num || 0)));
    setNumberOfPeople(safe);
  };

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleBack = () => onStepChange("table-selection");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold text-yellow-400">
              Guest Details — Table {selectedTable}
            </h1>
            <p className="text-gray-300">
              Choose booking type, party size, and enter guest names
            </p>
          </div>
        </div>

        {/* Booking Type */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">
            Reservation Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => handleBookingTypeChange("individual")}
              variant={bookingType === "individual" ? "default" : "outline"}
              className={`p-6 h-auto flex flex-col items-center gap-3 ${
                bookingType === "individual"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
                  : "border-gray-600 text-white hover:bg-gray-700/50"
              }`}
            >
              <User className="w-8 h-8" />
              <div className="text-center">
                <div className="font-bold">Individual Reservation</div>
                <div className="text-sm opacity-80">
                  One person, personal menu flow
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handleBookingTypeChange("group")}
              variant={bookingType === "group" ? "default" : "outline"}
              className={`p-6 h-auto flex flex-col items-center gap-3 ${
                bookingType === "group"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
                  : "border-gray-600 text-white hover:bg-gray-700/50"
              }`}
            >
              <Users className="w-8 h-8" />
              <div className="text-center">
                <div className="font-bold">Group Reservation</div>
                <div className="text-sm opacity-80">
                  Multiple guests, shared or individual menus
                </div>
              </div>
            </Button>
          </div>
        </Card>

        {/* Party Size */}
        {bookingType === "individual" && (
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 mb-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              Number of People
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4 items-start">
              <div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: maxPickable }, (_, i) => i + 1).map(
                    (num) => (
                      <Button
                        key={num}
                        onClick={() => handleNumberOfPeopleChange(num)}
                        variant={numberOfPeople === num ? "default" : "outline"}
                        className={`w-12 h-12 rounded-full ${
                          numberOfPeople === num
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
                            : "border-gray-600 text-white hover:bg-gray-700/50"
                        }`}
                      >
                        {num}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="w-full max-w-[220px]">
                <Label htmlFor="num-people" className="text-gray-300">
                  Enter number of people
                </Label>
                <Input
                  id="num-people"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={maxPickable}
                  value={numberOfPeople}
                  onChange={(e) =>
                    handleNumberOfPeopleChange(Number(e.target.value))
                  }
                  className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                />
                <div className="mt-1 text-xs text-gray-400">
                  Max {maxPickable} based on availability.
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Person Details */}
        {bookingType === "individual" && (
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 mb-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">
              Enter Person Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: numberOfPeople }, (_, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Person {index + 1}
                      </h3>
                      <p className="text-sm text-gray-400">Guest details</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`name-${index}`}
                      className="text-gray-300"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id={`name-${index}`}
                      type="text"
                      placeholder="Enter full name"
                      value={names[index] ?? ""}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-yellow-400 font-semibold">
                  {completedCount} of {numberOfPeople} completed
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      numberOfPeople
                        ? (completedCount / numberOfPeople) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Food Selection stage */}
        <IndividualFoodSelection
          selectedTable={selectedTable}
          bookingType={bookingType}
          numberOfPeople={numberOfPeople}
          people={people}
          onPeopleUpdate={setPeople}
        />
      </div>
    </div>
  );
}
