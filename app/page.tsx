"use client";

import { useState } from "react";

import { PersonDetails } from "@/components/person-details";
import IndividualFoodSelection from "@/components/individual-food-selection";
import { Navigation } from "@/components/navigation";
import TableSelection from "@/components/table-selection";
import { SeatSelection } from "@/components/seat-selection";

export default function HomePage() {
  const [step, setStep] = useState<"table-selection" | "seat-selection" | "person-details" | "food-selection">(
    "table-selection"
  );
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const handleTableSelect = (table: { number: number }) => {
    setSelectedTable(table.number);
    setStep("seat-selection");
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {step === "table-selection" && <TableSelection onTableSelect={handleTableSelect} />}
      {step === "seat-selection" && selectedTable !== null && (
        <SeatSelection selectedTable={selectedTable} onStepChange={setStep} />
      )}
      {step === "person-details" && <PersonDetails />}
      {step === "food-selection" && <IndividualFoodSelection />}
    </div>
  );
}
