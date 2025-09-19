"use client"

import { useAppSelector, useAppDispatch } from "@/lib/store"
import { resetBooking, addToOrderHistory } from "@/lib/slices/bookingSlice"
import { clearCart } from "@/lib/slices/cartSlice"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, MapPin, Clock, History, Home, Receipt } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function BookingConfirmation() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { currentBooking, bookingStep, selectedTable } = useAppSelector((state) => state.booking)
  const { foodItems } = useAppSelector((state) => state.restaurant)
  const { items: cartItems } = useAppSelector((state) => state.cart)

  useEffect(() => {
    if (currentBooking && selectedTable) {
      const orderItems = currentBooking.people.flatMap((person) =>
        person.foodSelections
          .map((foodId) => {
            const foodItem = foodItems.find((item) => item.id === foodId)
            return foodItem
              ? {
                  id: foodItem.id,
                  name: foodItem.name,
                  price: foodItem.price,
                  personName: person.name,
                  category: foodItem.category,
                }
              : null
          })
          .filter(Boolean),
      )

      // Add cart items to order
      const allOrderItems = [
        ...orderItems,
        ...cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price * item.quantity,
          personName: item.personName || "Group Order",
          category: "Cart Item",
        })),
      ]

      const totalAmount = allOrderItems.reduce((sum, item) => sum + (item?.price || 0), 0)

      const orderHistory = {
        id: `order-${Date.now()}`,
        tableNumber: selectedTable.number,
        bookingId: currentBooking.id,
        items: allOrderItems,
        total: totalAmount,
        date: new Date().toISOString(),
        status: "completed" as const,
      }

      dispatch(addToOrderHistory(orderHistory))
    }
  }, [currentBooking, selectedTable, foodItems, cartItems, dispatch])

  if (bookingStep !== "confirmation" || !currentBooking || !selectedTable) {
    return null
  }

  const handleViewOrderHistory = () => {
    router.push("/order-history")
  }

  const handleNewOrder = () => {
    dispatch(resetBooking())
    dispatch(clearCart())
    router.push("/")
  }

  const totalFoodItems = currentBooking.people.reduce((total, person) => total + person.foodSelections.length, 0)
  const preOrderCost = currentBooking.people.reduce((total, person) => {
    return (
      total +
      person.foodSelections.reduce((personTotal, foodId) => {
        const foodItem = foodItems.find((item) => item.id === foodId)
        return personTotal + (foodItem?.price || 0)
      }, 0)
    )
  }, 0)

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const grandTotal = preOrderCost + cartTotal

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-green-400 mb-2">Order Confirmed!</h1>
          <p className="text-gray-300 text-lg">Your table reservation and order has been placed successfully</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <Receipt className="w-4 h-4" />
            <span className="text-sm font-semibold">Order #{currentBooking.id.slice(-6).toUpperCase()}</span>
          </div>
        </div>

        {/* Booking Details */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 mb-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">Booking Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Table</p>
                <p className="font-bold text-lg">Table {selectedTable.number}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Party Size</p>
                <p className="font-bold text-lg">{currentBooking.numberOfPeople} People</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Booking Type</p>
                <p className="font-bold text-lg capitalize">{currentBooking.bookingType}</p>
              </div>
            </div>
          </div>

          {/* Seats */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Reserved Seats</h3>
            <div className="flex flex-wrap gap-2">
              {[...currentBooking.bookedSeats]
                .sort((a, b) => a - b)
                .map((seat) => (
                  <Badge key={seat} className="bg-yellow-500 text-black px-3 py-1 text-sm font-semibold">
                    Seat {seat}
                  </Badge>
                ))}
            </div>
          </div>
        </Card>

        {/* People and Food Orders */}
        {totalFoodItems > 0 && (
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Individual Pre-Orders</h2>

            <div className="space-y-6">
              {currentBooking.people.map((person) => (
                <div key={person.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                      {person.seatNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{person.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Seat {person.seatNumber} • {person.foodSelections.length} items
                      </p>
                    </div>
                  </div>

                  {person.foodSelections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {person.foodSelections.map((foodId) => {
                        const foodItem = foodItems.find((item) => item.id === foodId)
                        return foodItem ? (
                          <div key={foodId} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                            <div>
                              <p className="font-semibold text-white">{foodItem.name}</p>
                              <p className="text-gray-400 text-sm">{foodItem.category}</p>
                            </div>
                            <p className="font-bold text-yellow-400">${foodItem.price.toFixed(2)}</p>
                          </div>
                        ) : null
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No food items selected</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {cartItems.length > 0 && (
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Additional Cart Items</h2>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{item.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Qty: {item.quantity}</span>
                      {item.personName && <span>For: {item.personName}</span>}
                      {item.options?.size && <span>Size: {item.options.size}</span>}
                    </div>
                  </div>
                  <p className="font-bold text-yellow-400">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-6 mb-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Individual Pre-orders:</span>
              <span className="font-semibold">${preOrderCost.toFixed(2)}</span>
            </div>
            {cartItems.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Cart Items:</span>
                <span className="font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Items:</span>
              <span className="font-semibold">
                {totalFoodItems + cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Grand Total:</span>
                <span className="text-3xl font-bold text-green-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleViewOrderHistory}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg"
          >
            <History className="w-5 h-5 mr-2" />
            View Order History
          </Button>
          <Button
            onClick={handleNewOrder}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700/50 px-8 py-4 rounded-xl text-lg bg-transparent"
          >
            <Home className="w-5 h-5 mr-2" />
            New Order
          </Button>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-semibold">
              Thank you for your order! Your food will be prepared shortly.
            </p>
            <p className="text-gray-400 text-sm mt-1">Estimated preparation time: 15-25 minutes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
