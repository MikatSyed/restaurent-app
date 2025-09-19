"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import FloorSettingsSidebar from "./floor-settings-sidebar";


export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Leesburg Dine In
          </h1>
          <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-amber-400 to-amber-600 mt-2 rounded-full" />
        </div>

        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
        >
          Open Floor Settings
        </Button>
      </div>

      <FloorSettingsSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}
