"use client"

import { useAppSelector } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FoodMenu } from "@/components/food-menu"

export default function MenuPage() {
  const selectedTable = useAppSelector((state) => state.restaurant.selectedTable)
  const router = useRouter()

  useEffect(() => {
    if (!selectedTable) {
      router.push("/")
    }
  }, [selectedTable, router])

  if (!selectedTable) {
    return <div>Loading...</div>
  }

  return <FoodMenu />
}
