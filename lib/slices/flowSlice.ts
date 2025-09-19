// src/lib/slices/flowSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type BookingStep =
  | "table-selection"
  | "seat-selection"
  | "person-details"
  | "food-selection"
  | "confirmation"

type FlowState = {
  step: BookingStep
  currentTableRoute: string | null
}

const initialState: FlowState = {
  step: "table-selection",
  currentTableRoute: null,
}

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<BookingStep>) {
      state.step = action.payload
    },
    setCurrentTableRoute(state, action: PayloadAction<string | null>) {
      state.currentTableRoute = action.payload
    },
    resetFlow(state) {
      state.step = "table-selection"
      state.currentTableRoute = null
    },
    goBackToStep(state, action: PayloadAction<BookingStep>) {
      state.step = action.payload
    },
  },
})

export const { setStep, setCurrentTableRoute, resetFlow, goBackToStep } = flowSlice.actions
export default flowSlice.reducer
