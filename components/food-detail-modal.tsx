"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { closeModal, setActiveCategory } from "@/lib/slices/restaurantSlice"
import { addToCart } from "@/lib/slices/cartSlice"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X, Minus, Plus, Heart, Info } from "lucide-react"
import Image from "next/image"

export function FoodDetailModal() {
  const dispatch = useAppDispatch()
  const { selectedFood, isModalOpen, categories } = useAppSelector((s) => s.restaurant)

  const [quantity, setQuantity] = useState(1)
  const [selectedProtein, setSelectedProtein] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState("")
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState<string[]>([])

  useEffect(() => {
    if (selectedFood) {
      setSelectedProtein(selectedFood.proteinOptions?.[0] || "")
      setSelectedSize(selectedFood.sizeOptions?.[0]?.size || "")
      setSelectedSpiceLevel(selectedFood.spiceLevels?.[0] || "")
    }
  }, [selectedFood])

  if (!selectedFood) return null

  const handleClose = () => {
    dispatch(closeModal())
    setQuantity(1)
    setSelectedDietaryPreferences([])
  }

  const handleCategoryChange = (categoryId: string) => {
    dispatch(setActiveCategory(categoryId))
    handleClose()
  }

  const handleAddToCart = () => {
    const cartItem = {
      ...selectedFood,
      quantity,
      selectedProtein,
      selectedSize,
      selectedSpiceLevel,
      customizations: { dietaryPreferences: selectedDietaryPreferences },
    }
    dispatch(addToCart(cartItem))
    handleClose()
  }

  const toggleDietaryPreference = (p: string) => {
    setSelectedDietaryPreferences((prev) => (prev.includes(p) ? prev.filter((v) => v !== p) : [...prev, p]))
  }

  const getCurrentPrice = () => {
    const sizeOption = selectedFood.sizeOptions?.find((s) => s.size === selectedSize)
    return sizeOption ? sizeOption.price : selectedFood.price
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        size="xl"
        mobileFull
        className="
          bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white
          border-0 shadow-2xl
          h-[92dvh] sm:h-[85vh]
          overflow-x-hidden
          max-[768px]:w-[calc(100%-1.25rem)] max-[768px]:max-w-[calc(100%-1.25rem)] max-[768px]:mx-auto
          max-w-[calc(100%-1rem)] sm:max-w-[740px] md:max-w-[880px] lg:max-w-[1100px] xl:max-w-[1280px]
          p-3 sm:p-6
        "
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-1 sm:px-0 py-2 sm:py-0 border-b border-gray-800/50 pb-3 sm:pb-6 shrink-0">
            <div className="min-w-0 flex items-center gap-2 sm:gap-4 flex-wrap">
              <DialogTitle asChild>
                <h2 className="text-base sm:text-2xl xl:text-3xl font-bold line-clamp-1">{selectedFood.name}</h2>
              </DialogTitle>
              <p className="text-amber-400 text-base sm:text-2xl font-bold shrink-0">${getCurrentPrice().toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                className="hidden xs:flex text-gray-300/80 hover:text-white rounded-lg px-2 py-1.5 sm:px-4 sm:py-2"
              >
                <Info className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Nutrition</span>
                <span className="sm:hidden">Info</span>
              </Button>
              <Button
                onClick={handleClose}
                size="icon"
                variant="ghost"
                className="bg-amber-500/90 hover:bg-amber-600 text-black rounded-lg w-9 h-9 sm:w-10 sm:h-10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto px-1 sm:px-0 pr-3 sm:pr-0 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-8">
              {/* Left: Image */}
              <section>
                <div className="relative mb-4 sm:mb-6 max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto w-full">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-3xl shadow-2xl">
                    <div className="aspect-[4/3] sm:aspect-square" />
                    <Image
                      src={selectedFood.image || "/placeholder.svg"}
                      alt={selectedFood.name}
                      fill
                      className="object-cover"
                      sizes="(min-width:1536px) 700px, (min-width:1280px) 640px, (min-width:1024px) 50vw, 100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </div>

                <div className="flex justify-center gap-2 sm:gap-4">
                  <div className="w-12 h-12 sm:w-20 sm:h-20 relative overflow-hidden rounded-xl sm:rounded-2xl border border-amber-400/70 sm:border-2">
                    <Image
                      src={selectedFood.image || "/placeholder.svg"}
                      alt={selectedFood.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600" />
                </div>
              </section>

              {/* Right: Details */}
              <section className="space-y-5 sm:space-y-6 min-w-0">
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base xl:text-lg">
                  {selectedFood.description}
                </p>

                {/* Dietary Preferences — full width on mobile */}
                <div className="min-w-0">
                  <h3 className="text-amber-400 font-bold mb-2 sm:mb-3 uppercase tracking-wide text-xs sm:text-sm xl:text-base">
                    Dietary Preference:{" "}
                    <span className="text-white font-normal">
                      {selectedDietaryPreferences.length ? selectedDietaryPreferences.join(", ") : "None"}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {selectedFood.dietaryPreferences?.map((p) => (
                      <Button
                        key={p}
                        onClick={() => toggleDietaryPreference(p)}
                        variant="outline"
                        className={`w-full min-w-0 justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full font-semibold ${
                          selectedDietaryPreferences.includes(p)
                            ? "bg-gradient-to-r from-amber-500 to-amber-400 border-amber-400 text-black"
                            : "border-gray-600 text-white hover:bg-gray-700/50 hover:border-amber-400/60"
                        }`}
                      >
                        <span className="truncate">{p}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Protein — full width on mobile */}
                <div className="min-w-0">
                  <h3 className="text-amber-400 font-bold mb-2 sm:mb-3 uppercase tracking-wide text-xs sm:text-sm xl:text-base">
                    Protein: <span className="text-white font-normal">{selectedProtein}</span>
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {selectedFood.proteinOptions?.map((protein) => (
                      <Button
                        key={protein}
                        onClick={() => setSelectedProtein(protein)}
                        variant="outline"
                        className={`w-full min-w-0 justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full font-semibold ${
                          selectedProtein === protein
                            ? "bg-gradient-to-r from-amber-500 to-amber-400 border-amber-400 text-black"
                            : "border-gray-600 text-white hover:bg-gray-700/50 hover:border-amber-400/60"
                        }`}
                      >
                        <span className="truncate">{protein}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Size — full width on mobile */}
                <div className="min-w-0">
                  <h3 className="text-amber-400 font-bold mb-2 sm:mb-3 uppercase tracking-wide text-xs sm:text-sm xl:text-base">
                    Size: <span className="text-white font-normal">{selectedSize}</span>
                    <span className="text-gray-400 text-[10px] sm:text-xs ml-2 block sm:inline">
                      Ships in a single 16 oz container
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                    {selectedFood.sizeOptions?.map((s) => (
                      <Button
                        key={s.size}
                        onClick={() => setSelectedSize(s.size)}
                        variant="outline"
                        className={`w-full min-w-0 justify-center px-3.5 py-2 sm:px-6 sm:py-3 text-xs sm:text-base rounded-full font-semibold ${
                          selectedSize === s.size
                            ? "bg-gradient-to-r from-amber-500 to-amber-400 border-amber-400 text-black"
                            : "border-gray-600 text-white hover:bg-gray-700/50 hover:border-amber-400/60"
                        }`}
                      >
                        <span className="truncate">{s.size}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Spice — full width on mobile */}
                <div className="min-w-0">
                  <h3 className="text-amber-400 font-bold mb-2 sm:mb-3 uppercase tracking-wide text-xs sm:text-sm xl:text-base">
                    Spice Level: <span className="text-white font-normal">{selectedSpiceLevel}</span>
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                    {selectedFood.spiceLevels?.map((sp) => (
                      <Button
                        key={sp}
                        onClick={() => setSelectedSpiceLevel(sp)}
                        variant="outline"
                        className={`w-full min-w-0 justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full font-semibold ${
                          selectedSpiceLevel === sp
                            ? "bg-gradient-to-r from-amber-500 to-amber-400 border-amber-400 text-black"
                            : "border-gray-600 text-white hover:bg-gray-700/50 hover:border-amber-400/60"
                        }`}
                      >
                        <span className="truncate">{sp}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quantity + CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2.5 sm:gap-4">
                    <Button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      size="icon"
                      variant="outline"
                      className="rounded-full border-gray-600 text-white w-8 h-8 sm:w-12 sm:h-12"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </Button>
                    <span className="text-lg sm:text-2xl font-bold w-9 sm:w-12 text-center">{quantity}</span>
                    <Button
                      onClick={() => setQuantity(quantity + 1)}
                      size="icon"
                      variant="outline"
                      className="rounded-full border-gray-600 text-white w-8 h-8 sm:w-12 sm:h-12"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <Button
                      onClick={handleAddToCart}
                      className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold px-4 py-2.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl uppercase leading-tight text-sm sm:text-base"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full border-amber-400/50 text-amber-300 bg-transparent w-9 h-9 sm:w-12 sm:h-12"
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Categories */}
          <div className="border-t border-gray-800/50 bg-slate-900/95 px-2 sm:px-6 py-3 sm:py-5 shrink-0">
            <h3 className="text-amber-400 font-bold mb-3 sm:mb-4 uppercase tracking-wide text-xs sm:text-sm text-center">
              Categories
            </h3>
            <div className="overflow-x-auto overflow-y-hidden">
              <div className="flex gap-2 sm:gap-3 min-w-max justify-start sm:justify-center pb-1 sm:pb-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    variant={category.active ? "default" : "outline"}
                    className="rounded-full px-3 py-1.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap
                               data-[active=true]:bg-gradient-to-r data-[active=true]:from-amber-400 data-[active=true]:to-amber-500 data-[active=true]:text-black
                               aria-[current=true]:bg-gradient-to-r aria-[current=true]:from-amber-400 aria-[current=true]:to-amber-500"
                    aria-current={category.active ? "true" : "false"}
                    data-active={category.active ? "true" : "false"}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
