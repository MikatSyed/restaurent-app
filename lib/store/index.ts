import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import restaurantSlice from "../slices/restaurantSlice"
import cartSlice from "../slices/cartSlice"
import bookingSlice from "../slices/bookingSlice"
import tableSlice from "../slices/tablesSlice"
import flowSlice from "../slices/flowSlice"


const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action)

  if (typeof window !== "undefined") {
    const state = store.getState()
    localStorage.setItem(
      "restaurant-booking-state",
      JSON.stringify({
        booking: state.booking,
        cart: state.cart,
        restaurant: state.restaurant,
      }),
    )
  }

  return result
}

const loadFromLocalStorage = () => {
  if (typeof window === "undefined") return undefined

  try {
    const serializedState = localStorage.getItem("restaurant-booking-state")
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (err) {
    console.warn("Failed to load state from localStorage:", err)
    return undefined
  }
}

const preloadedState = loadFromLocalStorage()

export const store = configureStore({
  reducer: {
    restaurant: restaurantSlice,
    cart: cartSlice,
    booking: bookingSlice,
    tables: tableSlice,
    flow: flowSlice
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
      },
    }).concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
