import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  priceRange?: string
  image?: string
  category: string
  proteinOptions?: string[]
  sizeOptions?: { size: string; price: number }[]
  spiceLevels?: string[]
  dietaryPreferences?: string[]
}

export interface Category {
  id: string
  name: string
  active: boolean
}

interface RestaurantState {
  selectedTable: string | null
  categories: Category[]
  activeCategory: string
  foodItems: FoodItem[]
  selectedFood: FoodItem | null
  isModalOpen: boolean
}

const initialState: RestaurantState = {
  selectedTable: null,
  categories: [
    { id: "1", name: "Appetizers", active: true },
    { id: "2", name: "Main Course", active: false },
    { id: "3", name: "Desserts", active: false },
    { id: "4", name: "Beverages", active: false },
  ],
  activeCategory: "1",
  foodItems: [
    {
      id: "1",
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with parmesan cheese and croutons",
      price: 12.99,
      category: "Appetizers",
      image: "/caesar-salad.png",
      proteinOptions: ["Chicken", "Shrimp", "None"],
      sizeOptions: [
        { size: "Small", price: 12.99 },
        { size: "Large", price: 16.99 },
      ],
      spiceLevels: ["Mild"],
      dietaryPreferences: ["Vegetarian Option", "Gluten-Free Option"],
    },
    {
      id: "2",
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with herbs and lemon",
      price: 24.99,
      category: "Main Course",
      image: "/grilled-salmon-plate.png",
      proteinOptions: ["Salmon"],
      sizeOptions: [
        { size: "6oz", price: 24.99 },
        { size: "8oz", price: 28.99 },
      ],
      spiceLevels: ["Mild", "Medium"],
      dietaryPreferences: ["Gluten-Free", "Keto-Friendly"],
    },
    {
      id: "3",
      name: "Chocolate Cake",
      description: "Rich chocolate cake with vanilla ice cream",
      price: 8.99,
      category: "Desserts",
      image: "/decadent-chocolate-cake.png",
      proteinOptions: [],
      sizeOptions: [
        { size: "Regular", price: 8.99 },
        { size: "Large", price: 12.99 },
      ],
      spiceLevels: ["None"],
      dietaryPreferences: ["Vegetarian"],
    },
    {
      id: "4",
      name: "Fresh Lemonade",
      description: "Freshly squeezed lemonade with mint",
      price: 4.99,
      category: "Beverages",
      image: "/fresh-lemonade.png",
      proteinOptions: [],
      sizeOptions: [
        { size: "Small", price: 4.99 },
        { size: "Large", price: 6.99 },
      ],
      spiceLevels: ["None"],
      dietaryPreferences: ["Vegan", "Gluten-Free"],
    },
  ],
  selectedFood: null,
  isModalOpen: false,
}

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setSelectedTable: (state, action: PayloadAction<string>) => {
      state.selectedTable = action.payload
    },
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload
      state.categories = state.categories.map((cat) => ({
        ...cat,
        active: cat.id === action.payload,
      }))
    },
    selectFood: (state, action: PayloadAction<FoodItem>) => {
      state.selectedFood = action.payload
      state.isModalOpen = true
    },
    closeModal: (state) => {
      state.isModalOpen = false
      state.selectedFood = null
    },
  },
})

export const { setSelectedTable, setActiveCategory, selectFood, closeModal } = restaurantSlice.actions
export default restaurantSlice.reducer
