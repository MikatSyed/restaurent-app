"use client"

import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { setActiveCategory, selectFood } from "@/lib/slices/restaurantSlice"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { FoodDetailModal } from "./food-detail-modal"
import { CartSidebar } from "./cart-sidebar"

export function FoodMenu() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { categories, activeCategory, foodItems } = useAppSelector((state) => state.restaurant)
  const { items } = useAppSelector((state) => state.cart)

  const filteredFoodItems = foodItems.filter((item) => {
    const activeCategoryName = categories.find((cat) => cat.id === activeCategory)?.name
    return item.category === activeCategoryName
  })

  const handleCategoryChange = (categoryId: string) => {
    dispatch(setActiveCategory(categoryId))
  }

  const handleFoodSelect = (food: any) => {
    dispatch(selectFood(food))
  }

  // Unique items count
  const totalCartItems = items.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700/50 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="
    border border-white text-white hover:bg-white hover:text-black transition-colors
    rounded-full
    h-10 w-10 p-0               /* circle on mobile */
    sm:w-auto sm:px-4 sm:py-2   /* pill on >= sm */
    flex items-center justify-center
  "
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Back</span>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Menu</h1>
              <p className="text-gray-400 text-sm">Choose your favorites</p>
            </div>
          </div>

          {totalCartItems > 0 && (
            <Button
              variant="outline"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black border-yellow-400 hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {totalCartItems} {totalCartItems === 1 ? "item" : "items"}
            </Button>
          )}
        </div>
      </div>

      {/* Food Items */}
      <div className="p-4 sm:p-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-h-[calc(100vh-200px)] overflow-y-auto max-w-7xl mx-auto">
          {filteredFoodItems.map((item) => (
            <Card
              key={item.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 overflow-hidden group cursor-pointer hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10 backdrop-blur-sm"
            >
              <div className="relative">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-900 rounded-full w-10 h-10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 uppercase tracking-wide text-balance">
                    {item.name}
                  </h3>
                  <p className="text-white text-lg font-semibold mb-4">
                    {item.priceRange || `$${item.price?.toFixed(2)}`}
                  </p>
                  <Button
                    onClick={() => handleFoodSelect(item)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 rounded-xl uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Select Options
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-lg border-t border-gray-700/50 p-4 shadow-2xl">
        <div className="flex space-x-2 overflow-x-auto max-w-7xl mx-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              variant={category.active ? "default" : "outline"}
              className={`whitespace-nowrap px-4 sm:px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                category.active
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 scale-105"
                  : "bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:border-yellow-400/50 backdrop-blur-sm"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <FoodDetailModal />
      <CartSidebar />
    </div>
  )
}
