"use client"
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { Suspense } from "react"
import "./globals.css"

// export const metadata: Metadata = {
//   title: "Restaurant Booking System",
//   description: "Advanced restaurant table booking with drag-drop interface",
//   generator: "v0.app",
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased bg-gray-900`}>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading Restaurant...</p>
              </div>
            </div>
          }
        >
          <Provider store={store}>{children}</Provider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
