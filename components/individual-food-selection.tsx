"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  Minus,
  Check,
  Info,
  ShoppingCart,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  UserIcon,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"


type BookingType = "individual" | "group" | "takeout"

type FoodSelection = {
  id: string
  name: string
  price: number
  image?: string
  category?: string
  quantity: number
}

type Person = {
  id: string
  name: string
  seatNumber: number
  foodSelections: FoodSelection[]
}

type FoodItem = {
  id: string
  name: string
  price: number
  image?: string
  category?: string
  description?: string
}

type Props = {
  selectedTable?: number | null
  bookingType: BookingType
  numberOfPeople: number
  people: Person[]
  onPeopleUpdate: (people: Person[]) => void
}

const mockFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Caesar Salad",
    price: 12.99,
    category: "Appetizers",
    description: "Fresh romaine lettuce with parmesan cheese and croutons",
    image: "/caesar-salad.png",
  },
  {
    id: "2",
    name: "Grilled Salmon",
    price: 24.99,
    category: "Main Course",
    description: "Fresh Atlantic salmon with herbs and lemon",
    image: "/grilled-salmon-plate.png",
  },
  {
    id: "3",
    name: "Chocolate Cake",
    price: 8.99,
    category: "Desserts",
    description: "Rich chocolate cake with vanilla ice cream",
    image: "/decadent-chocolate-cake.png",
  },
  {
    id: "4",
    name: "Margherita Pizza",
    price: 18.99,
    category: "Main Course",
    description: "Classic pizza with tomato, mozzarella and basil",
    image: "/margherita-pizza.png",
  },
]

const mockCategories = [
  { id: "1", name: "Appetizers" },
  { id: "2", name: "Main Course" },
  { id: "3", name: "Desserts" },
]

export default function IndividualFoodSelection({
  selectedTable,
  bookingType,
  numberOfPeople,
  people,
  onPeopleUpdate,
}: Props) {
  const [selectedPersonId, setSelectedPersonId] = useState(people[0]?.id || "")
  const [activeCategory, setActiveCategory] = useState("Appetizers")
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<FoodSelection[]>([])

  const router = useRouter()

  useEffect(() => {
    if (bookingType !== "individual") return
    if (!people.length) {
      if (selectedPersonId) setSelectedPersonId("")
      return
    }
    const exists = people.some((p) => p.id === selectedPersonId)
    if (!exists) setSelectedPersonId(people[0].id)
  }, [bookingType, people, selectedPersonId])

  const personDisplayName = (idx: number, name?: string) => (name && name.trim() ? name : `Guest ${idx + 1}`)

  const selectedPerson = useMemo(() => people.find((p) => p.id === selectedPersonId), [people, selectedPersonId])

  const selectedPersonIndex = useMemo(
    () =>
      Math.max(
        0,
        people.findIndex((p) => p.id === selectedPersonId),
      ),
    [people, selectedPersonId],
  )

  const filteredFoodItems = useMemo(
    () => mockFoodItems.filter((item) => item.category === activeCategory),
    [activeCategory],
  )

  const getPersonFoodCount = (personId: string) =>
    people.find((p) => p.id === personId)?.foodSelections.reduce((t, f) => t + (f.quantity ?? 0), 0) || 0

  const totalFoodSelections =
    bookingType === "group"
      ? cartItems.reduce((t, i) => t + i.quantity, 0)
      : people.reduce((t, p) => t + p.foodSelections.reduce((s, f) => s + (f.quantity ?? 0), 0), 0)

  const selectedFoodsForPerson = useMemo(() => {
    if (!selectedPerson) return []
    return selectedPerson.foodSelections
  }, [selectedPerson])

  const handleAddFood = (foodId: string) => {
    const foodItem = mockFoodItems.find((i) => i.id === foodId)
    if (!foodItem) return

    if (bookingType === "group") {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === foodId)
        if (existing) {
          return prev.map((item) => (item.id === foodId ? { ...item, quantity: item.quantity + 1 } : item))
        }
        return [
          ...prev,
          {
            id: foodItem.id,
            name: foodItem.name,
            price: foodItem.price,
            image: foodItem.image,
            category: foodItem.category,
            quantity: 1,
          },
        ]
      })
      return
    }

    // individual
    let pid = selectedPersonId
    if (!pid && people[0]?.id) {
      pid = people[0].id
      setSelectedPersonId(pid)
    }
    if (!pid) return console.warn("No person selected")

    const updatedPeople = people.map((person) => {
      if (person.id === pid) {
        const existingFood = person.foodSelections.find((f) => f.id === foodId)
        if (existingFood) {
          return {
            ...person,
            foodSelections: person.foodSelections.map((f) =>
              f.id === foodId ? { ...f, quantity: f.quantity + 1 } : f,
            ),
          }
        } else {
          return {
            ...person,
            foodSelections: [
              ...person.foodSelections,
              {
                id: foodItem.id,
                name: foodItem.name,
                price: foodItem.price,
                image: foodItem.image,
                category: foodItem.category,
                quantity: 1,
              },
            ],
          }
        }
      }
      return person
    })
    onPeopleUpdate(updatedPeople)
  }

  const decOneForPerson = (food: FoodSelection, personId: string) => {
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        return {
          ...person,
          foodSelections: person.foodSelections
            .map((f) => (f.id === food.id ? { ...f, quantity: Math.max(0, f.quantity - 1) } : f))
            .filter((f) => f.quantity > 0),
        }
      }
      return person
    })
    onPeopleUpdate(updatedPeople)
  }

  const removeAllForPerson = (foodId: string, personId?: string) => {
    const pid = personId ?? selectedPersonId
    if (!pid) return

    const updatedPeople = people.map((person) => {
      if (person.id === pid) {
        return {
          ...person,
          foodSelections: person.foodSelections.filter((f) => f.id !== foodId),
        }
      }
      return person
    })
    onPeopleUpdate(updatedPeople)
  }

  const handleConfirmBooking = () => {
    const resolvedPeople = people.map((p, idx) => ({
      id: p.id,
      name: personDisplayName(idx, p.name),
      seatNumber: p.seatNumber,
      selections: p.foodSelections.map((f) => ({
        id: f.id,
        name: f.name,
        price: f.price,
        quantity: f.quantity,
        category: f.category,
      })),
      count: p.foodSelections.reduce((s, f) => s + (f.quantity ?? 0), 0),
      subtotal: p.foodSelections.reduce((s, f) => s + (f.quantity ?? 0) * Number(f.price ?? 0), 0),
    }))

    const totalPrice = resolvedPeople.reduce((sum, p) => sum + p.subtotal, 0)

    console.groupCollapsed("✅ Booking Confirmation Data")
    console.log({
      table: selectedTable ?? null,
      bookingType,
      numberOfPeople,
      totalItems: totalFoodSelections,
      totalPrice: Number(totalPrice.toFixed(2)),
      people: resolvedPeople,
    })
    console.groupEnd()
    router.push("/checkout")
  }

  const handleBack = () => {
    // Since we removed Redux navigation, this is just a placeholder
    console.log("Going back to person details")
  }

  return (
    <div className="rounded-2xl ring-1 ring-inset ring-gray-700/60 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-2 sm:p-4 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="border border-white/30 text-white hover:bg-white hover:text-black transition-colors rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 flex items-center justify-center bg-transparent flex-shrink-0"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400">
                Food Selection — Table {selectedTable ?? "-"}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                {bookingType === "group" ? "Select food for the group" : "Select food for each person individually"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {bookingType === "individual" && selectedPerson && selectedPerson.foodSelections.length > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-gray-800/70 border border-gray-700 px-3 py-1.5">
                <UserIcon className="w-4 h-4 opacity-80" />
                <span className="text-sm font-semibold">
                  {personDisplayName(selectedPersonIndex, selectedPerson.name)}
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-sm">
                  {getPersonFoodCount(selectedPerson.id)}{" "}
                  {getPersonFoodCount(selectedPerson.id) === 1 ? "item" : "items"}
                </span>
              </div>
            )}

            <Button
              type="button"
              onClick={() => console.log("Cart opened")}
              className="bg-yellow-400 text-black hover:bg-yellow-300 relative text-sm sm:text-base rounded-full px-4"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Cart </span>(
              {cartItems.reduce((total, item) => total + item.quantity, 0)})
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar for individual */}
          {bookingType === "individual" && (
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/60 p-3 sm:p-4 lg:sticky lg:top-4 rounded-xl">
                <h2 className="text-base sm:text-lg font-bold text-yellow-400 mb-3 sm:mb-4">Select Person</h2>

                {selectedPerson && (
                  <div className="mb-3 sm:mb-4 p-3 rounded-lg bg-gray-700/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                        {selectedPersonIndex + 1}
                      </div>
                      <div className="leading-tight">
                        <div className="font-semibold text-white">
                          {personDisplayName(selectedPersonIndex, selectedPerson.name)}
                        </div>
                        <div className="text-xs text-gray-300">Seat {selectedPerson.seatNumber}</div>
                      </div>
                    </div>
                    <Badge className="bg-gray-600 text-white">{getPersonFoodCount(selectedPerson.id)}</Badge>
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3">
                  {people.map((person, idx) => (
                    <Button
                      key={person.id}
                      type="button"
                      onClick={() => setSelectedPersonId(person.id)}
                      variant={selectedPersonId === person.id ? "default" : "outline"}
                      className={`w-full justify-between p-2 sm:p-4 h-auto text-sm sm:text-base rounded-xl ${
                        selectedPersonId === person.id
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow shadow-yellow-500/20"
                          : "border-gray-600 text-white hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs sm:text-sm">
                          {idx + 1}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{personDisplayName(idx, person.name)}</div>
                          <div className="text-xs opacity-80">Seat {person.seatNumber}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-600 text-white text-xs sm:text-sm">
                        {getPersonFoodCount(person.id)}
                      </Badge>
                    </Button>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-700/40 rounded-lg">
                  <h3 className="font-semibold text-yellow-400 mb-2 text-sm sm:text-base">Order Summary</h3>
                  <div className="text-xs sm:text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Items</span>
                      <span className="font-semibold">{totalFoodSelections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">People</span>
                      <span className="font-semibold">{people.length}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Main */}
          <div className={bookingType === "individual" ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Selected person header + dropdown */}
            {bookingType === "individual" && selectedPerson && (
              <div className="mb-4 sm:mb-6">
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/60 p-3 sm:p-4 rounded-xl">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                          {selectedPerson.seatNumber}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-yellow-400">
                            {personDisplayName(selectedPersonIndex, selectedPerson.name)}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400">
                            Seat {selectedPerson.seatNumber} • {getPersonFoodCount(selectedPerson.id)}{" "}
                            {getPersonFoodCount(selectedPerson.id) === 1 ? "item" : "items"}
                          </p>
                        </div>
                      </div>
                      {getPersonFoodCount(selectedPerson.id) > 0 && (
                        <Badge className="bg-green-600 text-white text-xs sm:text-sm rounded-full">
                          <Check className="w-3 h-3 mr-1" />
                          Ready
                        </Badge>
                      )}
                    </div>

                    <div className="border border-gray-700/70 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDropdown((prev) => (prev === selectedPerson.id ? null : selectedPerson.id))
                        }
                        className="w-full flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-800/60 hover:bg-gray-800/80 transition-colors text-left"
                      >
                        <span className="text-sm sm:text-base font-semibold">
                          {expandedDropdown === selectedPerson.id ? "Hide" : "Show"} Selected Items
                        </span>
                        {expandedDropdown === selectedPerson.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {expandedDropdown === selectedPerson.id && (
                        <div className="p-3 sm:p-4 bg-gray-900/40">
                          {selectedFoodsForPerson.length === 0 ? (
                            <p className="text-sm text-gray-400">No items selected.</p>
                          ) : (
                            <ul className="space-y-2">
                              {selectedFoodsForPerson.map((f) => (
                                <li
                                  key={f.id}
                                  className="flex items-center justify-between rounded-md bg-gray-800/50 px-3 py-2"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 relative overflow-hidden rounded-md bg-gray-700">
                                      <Image
                                        src={f.image || "/placeholder.svg"}
                                        alt={f.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="text-sm font-semibold text-white line-clamp-1">{f.name}</div>
                                      <div className="text-xs text-gray-400">${Number(f.price ?? 0).toFixed(2)}</div>
                                    </div>
                                  </div>

                                  {/* qty controls + remove */}
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                      className="h-7 w-7 border-gray-500 text-gray-200 bg-transparent"
                                      onClick={() => decOneForPerson(f, selectedPerson.id)}
                                      title="Decrease"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                                      {f.quantity ?? 0}
                                    </span>
                                    <Button
                                      type="button"
                                      size="icon"
                                      className="h-7 w-7 bg-yellow-500 text-black hover:bg-yellow-600"
                                      onClick={() => handleAddFood(f.id)}
                                      title="Increase"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>

                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded-full px-2 h-7 bg-transparent"
                                      onClick={() => removeAllForPerson(f.id, selectedPerson.id)}
                                      title="Remove all"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Categories */}
            <div className="mb-4 sm:mb-6">
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {mockCategories.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.name)}
                    variant={activeCategory === category.name ? "default" : "outline"}
                    className={`whitespace-nowrap px-3 py-2 sm:px-4 rounded-full font-semibold transition-all duration-300 text-xs sm:text-sm flex-shrink-0 ${
                      activeCategory === category.name
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow shadow-yellow-500/20"
                        : "bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:border-yellow-400/50"
                    }`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Food grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {filteredFoodItems.map((item) => {
                const qty =
                  bookingType === "individual" && selectedPerson
                    ? (selectedPerson.foodSelections.find((f) => f.id === item.id)?.quantity ?? 0)
                    : (cartItems.find((ci) => ci.id === item.id)?.quantity ?? 0)

                const isSelected = qty > 0

                return (
                  <Card
                    key={item.id}
                    className={`bg-gradient-to-br from-gray-800 to-gray-900 border overflow-hidden group transition-all duration-300 rounded-xl ${
                      isSelected
                        ? "border-yellow-400/70 shadow-yellow-400/20"
                        : "border-gray-700/60 hover:border-yellow-400/50 hover:shadow-lg"
                    }`}
                  >
                    <div className="relative">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow shadow-yellow-500/30">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                          </div>
                        )}
                      </div>

                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-lg font-bold text-yellow-400 mb-1 sm:mb-2 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between z-10 relative">
                          <span className="text-white text-sm sm:text-lg font-semibold">${item.price.toFixed(2)}</span>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              type="button"
                              onClick={() => console.log("Food details:", item)}
                              size="sm"
                              variant="outline"
                              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white p-1 sm:p-2 rounded-full"
                              aria-label={`Details for ${item.name}`}
                            >
                              <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>

                            {/* quantity controls inline */}
                            {qty > 0 ? (
                              <>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    bookingType === "group"
                                      ? null
                                      : decOneForPerson(
                                          {
                                            id: item.id,
                                            name: item.name,
                                            price: item.price,
                                            image: item.image,
                                            category: item.category,
                                            quantity: 1,
                                          },
                                          selectedPerson?.id || people[0]?.id || "",
                                        )
                                  }
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-500 text-gray-200 p-1 sm:p-2 rounded-full"
                                  aria-label={`Decrease ${item.name}`}
                                  disabled={bookingType === "group"}
                                >
                                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                                <span className="px-2 text-sm font-semibold">{qty}</span>
                              </>
                            ) : null}

                            <Button
                              type="button"
                              onClick={() => handleAddFood(item.id)}
                              size="sm"
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black p-1 sm:p-2 rounded-full shadow shadow-yellow-500/20"
                              aria-label={`Add ${item.name}`}
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700/50 bg-transparent text-sm sm:text-base rounded-xl"
              >
                Back to Person Details
              </Button>

              <Button
                type="button"
                onClick={handleConfirmBooking}
                disabled={totalFoodSelections === 0 && bookingType !== "group"}
                className={`group relative overflow-hidden rounded-2xl px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold
                ${
                  totalFoodSelections === 0 && bookingType !== "group"
                    ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 text-black shadow-[0_0_25px_-8px_rgba(16,185,129,0.6)] hover:shadow-[0_0_35px_-6px_rgba(163,230,53,0.7)] transition-shadow"
                }`}
                title={
                  totalFoodSelections === 0 && bookingType !== "group"
                    ? "Add at least one item to continue"
                    : "Proceed to confirmation"
                }
              >
                <span className="relative z-10 inline-flex items-center">
                  {bookingType === "group" ? "Confirm Group Reservation" : "Confirm Reservation & Order"}
                  <ArrowRight
                    className={`ml-2 h-4 w-4 transition-transform duration-200 ${totalFoodSelections === 0 && bookingType !== "group" ? "" : "group-hover:translate-x-0.5"}`}
                  />
                </span>
                {(totalFoodSelections > 0 || bookingType === "group") && (
                  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-white/10 to-transparent" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
