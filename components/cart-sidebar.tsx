"use client"

import { useMemo } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import {
  changeQuantityBy,
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartSubtotal,
} from "@/lib/slices/cartSlice"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ShoppingCart, Minus, Plus, Trash2, X } from "lucide-react"
import Image from "next/image"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const makeKey = (id: string, optionKey?: string) => `${id}::${optionKey ?? ""}`

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const count = useAppSelector(selectCartCount)
  const { selectedTable } = useAppSelector((state) => state.booking)
  const totalCartItems = items.length

  const filteredItems = useMemo(() => {
    if (!selectedTable) return items
    return items.filter((item) => !item.tableId || item.tableId === selectedTable.id)
  }, [items, selectedTable])

  const safeSubtotal = useMemo(() => {
    return filteredItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [filteredItems])

  const handleDec = (id: string, optionKey?: string) => {
    dispatch(changeQuantityBy({ id, optionKey, delta: -1 }))
  }
  const handleInc = (id: string, optionKey?: string) => {
    dispatch(changeQuantityBy({ id, optionKey, delta: 1 }))
  }
  const handleRemove = (id: string, optionKey?: string) => {
    dispatch(removeFromCart({ id, optionKey }))
  }
  const handleClear = () => dispatch(clearCart())

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg bg-gray-900 text-white border-gray-800 p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-gray-800 flex-row items-center justify-between">
          <SheetTitle className="text-white text-lg md:text-xl font-bold">
            Your Cart {selectedTable && `- Table ${selectedTable.number}`}
          </SheetTitle>
          <Button onClick={onClose} size="icon" variant="ghost" className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </SheetHeader>

        <div className="flex-1 min-h-0 flex flex-col">
          {filteredItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingCart className="w-14 h-14 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-300 text-base md:text-lg">Your cart is empty</p>
                <p className="text-gray-500 text-xs md:text-sm">Add some delicious items to get started!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
                {filteredItems.map((item) => {
                  const key = makeKey(item.id, item.optionKey)
                  const unit = Number(item.price || 0)
                  const rowTotal = unit * item.quantity

                  return (
                    <div key={key} className="bg-gray-800 rounded-lg p-3 md:p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-lg flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm md:text-base truncate">{item.name}</h3>

                          {item.personName && <p className="text-xs text-blue-400 mt-1">For: {item.personName}</p>}

                          {item.options && (
                            <div className="mt-1 text-xs md:text-sm text-gray-400 space-y-0.5">
                              {item.options.protein && <p>Protein: {item.options.protein}</p>}
                              {item.options.size && <p>Size: {item.options.size}</p>}
                              {item.options.spice && <p>Spice: {item.options.spice}</p>}
                              {!!item.options.dietaryPreferences?.length && (
                                <p>Dietary: {item.options.dietaryPreferences.join(", ")}</p>
                              )}
                            </div>
                          )}

                          <p className="text-yellow-400 font-semibold mt-2 text-sm md:text-base">
                            ${unit.toFixed(2)} each
                          </p>
                        </div>

                        <Button
                          onClick={() => handleRemove(item.id, item.optionKey)}
                          size="icon"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Qty & row total */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          <Button
                            onClick={() => handleDec(item.id, item.optionKey)}
                            size="icon"
                            variant="outline"
                            className="w-8 h-8 md:w-9 md:h-9 rounded-full border-gray-600 text-white hover:bg-gray-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-white font-semibold w-8 text-center select-none">{item.quantity}</span>
                          <Button
                            onClick={() => handleInc(item.id, item.optionKey)}
                            size="icon"
                            variant="outline"
                            className="w-8 h-8 md:w-9 md:h-9 rounded-full border-gray-600 text-white hover:bg-gray-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <p className="text-white font-bold text-sm md:text-base">${rowTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Summary */}
              <div className="border-t border-gray-800 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base md:text-lg font-semibold text-white">Total</span>
                  <span className="text-xl md:text-2xl font-extrabold text-yellow-400">${safeSubtotal.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={onClose}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg"
                  >
                    Continue Ordering
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
