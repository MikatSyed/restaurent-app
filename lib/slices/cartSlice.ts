import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  optionKey?: string
  options?: {
    protein?: string
    size?: string
    spice?: string
    dietaryPreferences?: string[]
  }
  personId?: string // For individual person orders
  personName?: string
  tableId?: string // Added table association
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) => {
      const item = { ...action.payload, quantity: action.payload.quantity || 1 }
      const existingIndex = state.items.findIndex(
        (existing) =>
          existing.id === item.id && existing.optionKey === item.optionKey && existing.personId === item.personId,
      )

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += item.quantity
      } else {
        state.items.push(item)
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; optionKey?: string; personId?: string }>) => {
      const { id, optionKey, personId } = action.payload
      state.items = state.items.filter(
        (item) => !(item.id === id && item.optionKey === optionKey && item.personId === personId),
      )
    },
    changeQuantityBy: (
      state,
      action: PayloadAction<{ id: string; optionKey?: string; personId?: string; delta: number }>,
    ) => {
      const { id, optionKey, personId, delta } = action.payload
      const item = state.items.find(
        (item) => item.id === id && item.optionKey === optionKey && item.personId === personId,
      )
      if (item) {
        item.quantity = Math.max(0, item.quantity + delta)
        if (item.quantity === 0) {
          state.items = state.items.filter(
            (existing) => !(existing.id === id && existing.optionKey === optionKey && existing.personId === personId),
          )
        }
      }
    },
    clearCart: (state) => {
      state.items = []
    },
    clearCartByTable: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.tableId !== action.payload)
    },
    updateCartItemTable: (state, action: PayloadAction<{ tableId: string }>) => {
      state.items.forEach((item) => {
        if (!item.tableId) {
          item.tableId = action.payload.tableId
        }
      })
    },
  },
})

export const { addToCart, removeFromCart, changeQuantityBy, clearCart, clearCartByTable, updateCartItemTable } =
  cartSlice.actions

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartCount = (state: RootState) => state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

export const selectCartItemsByTable = (tableId: string) => (state: RootState) =>
  state.cart.items.filter((item) => item.tableId === tableId)
export const selectCartCountByTable = (tableId: string) => (state: RootState) =>
  state.cart.items.filter((item) => item.tableId === tableId).reduce((total, item) => total + item.quantity, 0)

export default cartSlice.reducer
