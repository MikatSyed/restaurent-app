import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { setSelectedTable } from "./restaurantSlice"

const PEOPLE_SELECTIONS_KEY = "booking_people_selections" // LS key just for selections

export interface Table {
  id: string
  number: number
  totalSeats: number
  bookedSeats: number[]
  availableSeats: number[]
  position: { x: number; y: number }
  backgroundImage?: string
}

// 👇 Change Person.foodSelections to FoodSelection[]
export type FoodSelection = {
  id: string
  name: string
  price: number
  image?: string
  category?: string
  quantity: number
}

export interface Person {
  id: string
  name: string
  seatNumber: number
  tableId: string
  foodSelections: FoodSelection[]   // <— now objects with qty
}

export interface Booking {
  id: string
  tableId: string
  bookingType: "individual" | "group"
  numberOfPeople: number
  people: Person[]
  bookedSeats: number[]
  status: "pending" | "confirmed" | "completed"
  createdAt: string
}

export interface OrderHistory {
  id: string
  tableNumber: number
  bookingId: string
  items: any[]
  total: number
  date: string
  status: "completed" | "pending"
}

interface BookingState {
  tables: Table[]
  currentBooking: Booking | null
  bookingStep: "table-selection" | "seat-selection" | "person-details" | "food-selection" | "confirmation"
  selectedTable: Table | null
  selectedSeats: number[]
  bookingType: "individual" | "group"
  numberOfPeople: number
  people: Person[]
  orderHistory: OrderHistory[]
  currentTableRoute: string | null
}

/* ... your existing initialState stays the same EXCEPT
   when you build Person objects, use foodSelections: [] (array of FoodSelection) ... */

const initialState: BookingState = {
  tables: [
    {
      id: "1",
      number: 1,
      totalSeats: 10,
      bookedSeats: [1, 3, 7],
      availableSeats: [2, 4, 5, 6, 8, 9, 10],
      position: { x: 100, y: 100 },
      backgroundImage: "/elegant-restaurant-table-with-chairs.jpg",
    },
    {
      id: "2",
      number: 2,
      totalSeats: 10,
      bookedSeats: [2, 5, 8, 9],
      availableSeats: [1, 3, 4, 6, 7, 10],
      position: { x: 300, y: 150 },
      backgroundImage: "/round-dining-table-with-wooden-finish.jpg",
    },
    {
      id: "3",
      number: 3,
      totalSeats: 10,
      bookedSeats: [1, 2, 3, 4, 5],
      availableSeats: [6, 7, 8, 9, 10],
      position: { x: 500, y: 200 },
      backgroundImage: "/modern-square-table-with-contemporary-chairs.jpg",
    },
    {
      id: "4",
      number: 4,
      totalSeats: 10,
      bookedSeats: [],
      availableSeats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      position: { x: 200, y: 300 },
      backgroundImage: "/luxury-dining-table-with-upholstered-chairs.jpg",
    },
    // ---- Added tables ----
    {
      id: "5",
      number: 5,
      totalSeats: 10,
      bookedSeats: [1, 4],
      availableSeats: [2, 3, 5, 6, 7, 8, 9, 10],
      position: { x: 400, y: 100 },
      backgroundImage: "/cozy-wooden-booth-table.jpg",
    },
    {
      id: "6",
      number: 6,
      totalSeats: 10,
      bookedSeats: [2, 3, 6, 10],
      availableSeats: [1, 4, 5, 7, 8, 9],
      position: { x: 600, y: 150 },
      backgroundImage: "/family-dining-table.jpg",
    },
    {
      id: "7",
      number: 7,
      totalSeats: 10,
      bookedSeats: [1, 5, 7, 9],
      availableSeats: [2, 3, 4, 6, 8, 10],
      position: { x: 800, y: 200 },
      backgroundImage: "/window-side-table-two-seater.jpg",
    },
  ],
  currentBooking: null,
  bookingStep: "table-selection",
  selectedTable: null,
  selectedSeats: [],
  bookingType: "individual",
  numberOfPeople: 1,
  people: [],
  orderHistory: [],
  currentTableRoute: null,
}

/* ---------------- helpers for LS ---------------- */
function savePeopleSelectionsToLS(people: Person[]) {
  try {
    const compact = people.map(p => ({
      id: p.id,
      foodSelections: p.foodSelections,
    }))
    localStorage.setItem(PEOPLE_SELECTIONS_KEY, JSON.stringify(compact))
  } catch {}
}

function loadPeopleSelectionsFromLS(): Array<{ id: string; foodSelections: FoodSelection[] }> {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(PEOPLE_SELECTIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}
/* ----------------------------------------------- */

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    selectTable: (state, action: PayloadAction<string>) => {
      /* unchanged */
    },
    selectTableByNumber: (state, action: PayloadAction<number>) => {
      /* unchanged */
    },
    setBookingType: (state, action: PayloadAction<"individual" | "group">) => {
      state.bookingType = action.payload
      state.selectedSeats = []
      state.people = []
      savePeopleSelectionsToLS(state.people) // keep LS in sync
    },
    setNumberOfPeople: (state, action: PayloadAction<number>) => {
      state.numberOfPeople = action.payload
      state.selectedSeats = []
      state.people = []
      savePeopleSelectionsToLS(state.people)
    },
    toggleSeat: (state, action: PayloadAction<number>) => {
      /* unchanged */
    },
    proceedToPersonDetails: (state) => {
      if (state.selectedSeats.length === state.numberOfPeople) {
        state.bookingStep = "person-details"
        state.people = state.selectedSeats.map((seatNumber, index) => ({
          id: `person-${Date.now()}-${index}`,
          name: "",
          seatNumber,
          tableId: state.selectedTable?.id || "",
          foodSelections: [], // FoodSelection[]
        }))
        savePeopleSelectionsToLS(state.people)
      }
    },
    updatePersonName: (state, action: PayloadAction<{ personId: string; name: string }>) => {
      const person = state.people.find((p) => p.id === action.payload.personId)
      if (person) {
        person.name = action.payload.name
        savePeopleSelectionsToLS(state.people)
      }
    },
    proceedToFoodSelection: (state) => {
      state.bookingStep = "food-selection"
    },

    /* -------- your add with quantity + persist to LS -------- */
addFoodToPerson: (
  state,
  action: PayloadAction<{ personId: string; food: Omit<FoodSelection, "quantity">; delta?: number }>
) => {
  const { personId, food, delta = 1 } = action.payload

  // 1) Ensure there's at least one person, and that the target person exists
  if (!Array.isArray(state.people)) state.people = []

  let p = state.people.find((x) => x.id === personId)

  // If no people at all, create the first person with this id
  if (!state.people.length) {
    state.people.push({
      id: personId,
      name: "",
      seatNumber: 1,
      // If your Person has tableId in the type, keep this line; otherwise remove it:
      // tableId: state.selectedTable?.id || "",
      foodSelections: [],
    })
    p = state.people[0]
  }

  // If people exist but this personId isn't in the array, create a new one
  if (!p) {
    state.people.push({
      id: personId,
      name: "",
      seatNumber: state.people.length + 1,
      // tableId: state.selectedTable?.id || "",
      foodSelections: [],
    })
    p = state.people[state.people.length - 1]
  }

  // 2) Now mutate that person's selections
  if (!Array.isArray(p.foodSelections)) p.foodSelections = []

  const existing = p.foodSelections.find((f) => f.id === food.id)

  if (!existing) {
    if (delta > 0) {
      p.foodSelections.push({
        id: food.id,
        name: food.name ?? "",
        price: Number(food.price ?? 0),
        image: food.image,
        category: food.category,
        quantity: delta,
      })
    }
  } else {
    existing.quantity = Math.max(0, (existing.quantity ?? 0) + delta)
    if (existing.quantity === 0) {
      p.foodSelections = p.foodSelections.filter((f) => f.id !== existing.id)
    }
  }

  // 3) Persist after mutation
  savePeopleSelectionsToLS(state.people)
},


    /* decrement/remove ONE or ALL and persist */
    removeFoodFromPerson: (
      state,
      action: PayloadAction<{ personId: string; foodId: string; all?: boolean }>
    ) => {
      const { personId, foodId, all } = action.payload
      const person = state.people.find((p) => p.id === personId)
      if (!person || !Array.isArray(person.foodSelections)) return

      const item = person.foodSelections.find(f => f.id === foodId)
      if (!item) return

      if (all || (item.quantity ?? 1) <= 1) {
        person.foodSelections = person.foodSelections.filter(f => f.id !== foodId)
      } else {
        item.quantity -= 1
      }
      savePeopleSelectionsToLS(state.people)
    },

    /* ------------------ LOADERS you asked for ------------------ */
    // Load ALL people selections from localStorage and merge into current state.people
    loadAllPersonSelectionsFromStorage: (state) => {
      const stored = loadPeopleSelectionsFromLS()
      if (!stored.length) return
      // merge by person id
      for (const rec of stored) {
        const p = state.people.find(x => x.id === rec.id)
        if (p) {
          p.foodSelections = Array.isArray(rec.foodSelections) ? rec.foodSelections : []
        }
      }
    },

    // Load selections for a single personId from localStorage
    loadPersonSelectionsFromStorage: (state, action: PayloadAction<{ personId: string }>) => {
      const { personId } = action.payload
      const stored = loadPeopleSelectionsFromLS()
      const rec = stored.find(x => x.id === personId)
      const p = state.people.find(x => x.id === personId)
      if (p && rec) {
        p.foodSelections = Array.isArray(rec.foodSelections) ? rec.foodSelections : []
      }
    },
    /* ----------------------------------------------------------- */

    confirmBooking: (state) => {
      /* unchanged */
    },
    resetBooking: (state) => {
      state.currentBooking = null
      state.bookingStep = "table-selection"
      state.selectedTable = null
      state.selectedSeats = []
      state.bookingType = "individual"
      state.numberOfPeople = 1
      state.people = []
      state.currentTableRoute = null
      savePeopleSelectionsToLS(state.people)
    },
    goBackToStep: (state, action: PayloadAction<BookingState["bookingStep"]>) => {
      state.bookingStep = action.payload
    },
    updateTablePosition: (state, action: PayloadAction<{ tableId: string; position: { x: number; y: number } }>) => {
      /* unchanged */
    },
    addToOrderHistory: (state, action: PayloadAction<OrderHistory>) => {
      state.orderHistory.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setSelectedTable, (state, action) => {
      const table = state.tables.find((t) => t.id === action.payload)
      if (table) {
        state.selectedTable = table
      }
    })
  },
})

export const {
  selectTable,
  selectTableByNumber,
  setBookingType,
  setNumberOfPeople,
  toggleSeat,
  proceedToPersonDetails,
  updatePersonName,
  proceedToFoodSelection,
  addFoodToPerson,
  removeFoodFromPerson,
  // 👇 new exports
  loadAllPersonSelectionsFromStorage,
  loadPersonSelectionsFromStorage,
  confirmBooking,
  resetBooking,
  goBackToStep,
  updateTablePosition,
  addToOrderHistory,
} = bookingSlice.actions

export default bookingSlice.reducer
