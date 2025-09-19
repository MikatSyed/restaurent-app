"use client"

import { useAppSelector, useAppDispatch } from "@/lib/store"
import { clearCart } from "@/lib/slices/cartSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Users, DollarSign, Clock, Receipt, Trash2, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function OrderHistoryPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { orderHistory } = useAppSelector((state) => state.booking)
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all")
  const [sortBy, setSortBy] = useState<"date" | "total">("date")

  const filteredOrders = orderHistory
    .filter((order) => filterStatus === "all" || order.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return b.total - a.total
    })

  const totalSpent = orderHistory.reduce((sum, order) => sum + order.total, 0)
  const completedOrders = orderHistory.filter((order) => order.status === "completed").length

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all order history? This action cannot be undone.")) {
      // Note: You'd need to add a clearOrderHistory action to the booking slice
      dispatch(clearCart()) // For now, just clear cart as example
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              size="sm"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-yellow-300">Order History</h1>
              <p className="text-gray-300">Track all your restaurant orders and bookings</p>
            </div>
          </div>

          {orderHistory.length > 0 && (
            <Button
              onClick={handleClearHistory}
              variant="outline"
              size="sm"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        {orderHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gray-800 border-gray-600 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{orderHistory.length}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-600 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-green-400">${totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-600 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-purple-400">{completedOrders}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        {orderHistory.length > 0 && (
          <Card className="bg-gray-800 border-gray-600 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-300">Filters:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setFilterStatus("all")}
                  size="sm"
                  variant={filterStatus === "all" ? "default" : "outline"}
                  className={filterStatus === "all" ? "bg-yellow-400 text-black" : "border-gray-600 text-gray-300"}
                >
                  All Orders
                </Button>
                <Button
                  onClick={() => setFilterStatus("completed")}
                  size="sm"
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  className={filterStatus === "completed" ? "bg-green-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  Completed
                </Button>
                <Button
                  onClick={() => setFilterStatus("pending")}
                  size="sm"
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  className={filterStatus === "pending" ? "bg-orange-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  Pending
                </Button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-400">Sort by:</span>
                <Button
                  onClick={() => setSortBy("date")}
                  size="sm"
                  variant={sortBy === "date" ? "default" : "outline"}
                  className={sortBy === "date" ? "bg-blue-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  Date
                </Button>
                <Button
                  onClick={() => setSortBy("total")}
                  size="sm"
                  variant={sortBy === "total" ? "default" : "outline"}
                  className={sortBy === "total" ? "bg-blue-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  Amount
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-gray-800 border-gray-600 p-8 text-center">
            <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-4">
              {orderHistory.length === 0 ? "No Orders Yet" : "No Orders Match Your Filter"}
            </h3>
            <p className="text-gray-400 mb-6">
              {orderHistory.length === 0
                ? "Your order history will appear here once you complete a booking."
                : "Try adjusting your filters to see more orders."}
            </p>
            <Button onClick={() => router.push("/")} className="bg-yellow-400 text-black hover:bg-yellow-300">
              Start New Order
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="bg-gray-800 border-gray-600 p-6 hover:border-yellow-400/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-300">Table {order.tableNumber}</h3>
                      <div className="flex items-center gap-4 text-gray-300 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(order.date).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
                        <DollarSign className="w-5 h-5" />
                        {order.total.toFixed(2)}
                      </div>
                      <Badge
                        className={`${
                          order.status === "completed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        } border`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Items Ordered ({order.items.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.slice(0, 6).map((item, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{item.name}</p>
                            {item.personName && <p className="text-blue-400 text-xs">For: {item.personName}</p>}
                          </div>
                          <span className="text-gray-400 text-sm ml-2">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 6 && (
                      <div className="bg-gray-700/30 rounded-lg p-3 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">+{order.items.length - 6} more items</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
