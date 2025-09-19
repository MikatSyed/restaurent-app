"use client";

import React from "react";

type Fit = "cover" | "contain";

export interface TableData {
  id: string | number;
  number: string | number;
  backgroundImage?: string;
  width?: number;
  height?: number;
  aspect?: string | number; // "4 / 3", 1.333, etc.
  fit?: Fit;
  position?: { x: number; y: number };
}

interface Props {
  table: TableData;
  onSelect?: (id: string | number) => void;
  showHandle?: boolean; // arrange mode flag
  listeners?: React.HTMLAttributes<HTMLButtonElement>;
  attributes?: any;
  fixedWidthWhenNotArrange?: string | number; // default "350px"
}

export default function TableCard({
  table,
  onSelect,
  showHandle = false,
  listeners = {},
  attributes = {},
  fixedWidthWhenNotArrange = "350px",
}: Props) {
  const isArrange = !!showHandle;
  const W: number | string = isArrange ? (table.width ?? 160) : fixedWidthWhenNotArrange;

  const hasAspect = !!table.aspect;
  const H: number | undefined = hasAspect ? undefined : (table.height ?? 300);
  const aspectStyle = hasAspect ? { aspectRatio: String(table.aspect) } : {};
  const objectFit: Fit = (table.fit as Fit) || "cover";

  const handleClick = () => {
    if (isArrange) return; // ignore clicks in arrange mode
    onSelect?.(table.id);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (isArrange) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(table.id);
    }
  };

  return (
    <div
      className={`group rounded-xl overflow-hidden border border-transparent transition-all duration-300 hover:border-yellow-400 hover:shadow-yellow-400/20 ${
        isArrange ? "cursor-grab" : "cursor-pointer"
      }`}
      style={{ width: W, height: H }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Select table ${table.number}`}
    >
      <div className="relative block min-w-0 overflow-hidden" style={{ width: W, height: H, ...aspectStyle }}>
        {/* Image fills the box, centered (don't capture clicks) */}
        <img
          src={table.backgroundImage || ""}
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ objectFit, objectPosition: "center", opacity: 0.9 }}
          draggable={false}
        />

        {/* Centered number with glass border (also non-interactive) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 flex items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md">
            <span className="text-white font-bold text-xl drop-shadow">{table.number}</span>
          </div>
        </div>

        {isArrange && (
          <button
            {...listeners}
            {...attributes}
            className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded"
            onClick={(e) => e.stopPropagation()} // don't fire parent click
          >
            Drag
          </button>
        )}
      </div>
    </div>
  );
}
