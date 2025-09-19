"use client";

import { X, Image as ImageIcon, Plus } from "lucide-react";

export default function FloorSettingsSidebar({
  open = false,
  onClose = () => {},
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="floor-settings-title"
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] max-w-[92vw] z-50 transform bg-gradient-to-b from-gray-900 to-gray-950 border-l border-gray-800 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 id="floor-settings-title" className="text-lg font-semibold text-white">
              Floor Settings
            </h2>
            <p className="text-xs text-gray-400">Configure background, tables, and defaults</p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-64px)]">
          {/* Background */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-200">Background</h3>

            <label className="block text-xs text-gray-400">Upload background image</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800">
                <ImageIcon className="w-4 h-4" />
                <span>Choose file</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
              <span className="text-xs text-gray-500">PNG / JPG / WEBP</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Or paste image URL</label>
              <input
                type="text"
                placeholder="/floor-2.jpg"
                className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </section>

          {/* Selected Table Editor */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-200">Selected Table</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Table number</label>
                <input
                  type="number"
                  min={1}
                  placeholder="1"
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Seat capacity</label>
                <input
                  type="number"
                  min={1}
                  placeholder="10"
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Width (px)</label>
                <input
                  type="number"
                  min={80}
                  placeholder="200"
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Height (px)</label>
                <input
                  type="number"
                  min={80}
                  placeholder="300"
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="block text-xs text-gray-400">Accent color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    defaultValue="#f59e0b"
                    className="h-9 w-12 rounded-md border border-gray-700 bg-gray-800 p-1"
                    title="Pick color"
                  />
                  <input
                    type="text"
                    placeholder="#f59e0b"
                    className="flex-1 rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Create New Table */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-200">Create New Table</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Table number</label>
                <input
                  type="number"
                  min={1}
                  placeholder="4"
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Seat capacity</label>
                <select
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  defaultValue="4"
                  title="Select seat capacity"
                >
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Width (px)</label>
                <input
                  type="number"
                  min={80}
                  placeholder="200"
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Height (px)</label>
                <input
                  type="number"
                  min={80}
                  placeholder="300"
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="block text-xs text-gray-400">Accent color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    defaultValue="#22c55e"
                    className="h-9 w-12 rounded-md border border-gray-700 bg-gray-800 p-1"
                  />
                  <input
                    type="text"
                    placeholder="#22c55e"
                    className="flex-1 rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button className="mt-1 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add table
            </button>
          </section>
        </div>
      </aside>
    </>
  );
}
