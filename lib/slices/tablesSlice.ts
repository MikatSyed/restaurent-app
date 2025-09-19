// src/lib/slices/tableSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/lib/store"

export type TableFlags = { draggable?: boolean; resizable?: boolean }

export type Table = {
  id: string
  number: number
  position: { x: number; y: number }
  backgroundImage?: string
  width?: number
  height?: number
  flags?: TableFlags
}

type TablesState = {
  tables: Table[]
  loaded: boolean
}

const PERSIST_KEY = "tablesStateV1"

/** ---- Your default tables (seed) ---- */
const DEFAULT_TABLES: Table[] = [
  { id: "t1", number: 1, position: { x: 40,  y: 40  }, backgroundImage: "/4-sit.png", width: 300, height: 300, flags: { draggable: false, resizable: false } },
  { id: "t2", number: 2, position: { x: 360, y: 40  }, backgroundImage: "/6-sit.png", width: 300, height: 300, flags: { draggable: false, resizable: false } },
  { id: "t3", number: 3, position: { x: 680, y: 40  }, backgroundImage: "/4-sit.png", width: 300, height: 300, flags: { draggable: false, resizable: false } },

]

/** ---- localStorage helpers ---- */
const readLocal = (): Table[] | null => {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : parsed?.tables ?? null
  } catch {
    return null
  }
}

const writeLocal = (tables: Table[]) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(PERSIST_KEY, JSON.stringify({ tables }))
  } catch {}
}

/** Merge defaults into existing list without duplicates (by id) */
const mergeDefaults = (existing: Table[], defaults: Table[]) => {
  const ids = new Set(existing.map(t => t.id))
  const toAdd = defaults.filter(t => !ids.has(t.id))
  return [...existing, ...toAdd]
}

let saveTimer: any = null
const queueSave = (tables: Table[], ms = 120) => {
  if (typeof window === "undefined") return
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => writeLocal(tables), ms)
}

const initialState: TablesState = {
  tables: [],
  loaded: false,
}

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    /** 1) Initialize from localStorage (seed if empty/missing) */
    initFromLocal(state, action: PayloadAction<{ seedIfEmpty?: boolean; alsoMergeMissingDefaults?: boolean } | undefined>) {
      const opts = action?.payload ?? { seedIfEmpty: true, alsoMergeMissingDefaults: false }
      const local = readLocal()

      if (!local || local.length === 0) {
        // nothing persisted → seed defaults if requested
        state.tables = opts.seedIfEmpty ? [...DEFAULT_TABLES] : []
        writeLocal(state.tables)
      } else {
        state.tables = [...local]
        // optionally merge any DEFAULT_TABLES not present yet (helpful after you add more defaults later)
        if (opts.alsoMergeMissingDefaults) {
          const merged = mergeDefaults(state.tables, DEFAULT_TABLES)
          if (merged.length !== state.tables.length) {
            state.tables = merged
            writeLocal(state.tables)
          }
        }
      }
      state.loaded = true
    },

    /** Replace all tables (import/reset) */
    setAllTables(state, action: PayloadAction<Table[]>) {
      state.tables = action.payload
      state.loaded = true
      writeLocal(state.tables)
    },

    /** Create or update a table */
    upsertTable(state, action: PayloadAction<Table>) {
      const idx = state.tables.findIndex(t => t.id === action.payload.id)
      if (idx >= 0) state.tables[idx] = action.payload
      else state.tables.push(action.payload)
      queueSave(state.tables)
    },

    /** Remove by id */
    removeTable(state, action: PayloadAction<string>) {
      state.tables = state.tables.filter(t => t.id !== action.payload)
      queueSave(state.tables)
    },

    /** Move with snapping */
    updateTablePosition(state, action: PayloadAction<{ tableId: string; position: { x: number; y: number }; snap?: number }>) {
      const t = state.tables.find(tb => tb.id === action.payload.tableId)
      if (!t) return
      const snap = action.payload.snap ?? 20
      t.position.x = Math.round(action.payload.position.x / snap) * snap
      t.position.y = Math.round(action.payload.position.y / snap) * snap
      queueSave(state.tables, 60)
    },

    /** Misc small updates */
    setTableSize(state, action: PayloadAction<{ tableId: string; width?: number; height?: number }>) {
      const t = state.tables.find(tb => tb.id === action.payload.tableId)
      if (!t) return
      if (typeof action.payload.width === "number") t.width = action.payload.width
      if (typeof action.payload.height === "number") t.height = action.payload.height
      queueSave(state.tables)
    },

    setTableFlags(state, action: PayloadAction<{ tableId: string; flags: TableFlags }>) {
      const t = state.tables.find(tb => tb.id === action.payload.tableId)
      if (!t) return
      t.flags = { ...t.flags, ...action.payload.flags }
      queueSave(state.tables)
    },

    setTableBackground(state, action: PayloadAction<{ tableId: string; backgroundImage?: string }>) {
      const t = state.tables.find(tb => tb.id === action.payload.tableId)
      if (!t) return
      t.backgroundImage = action.payload.backgroundImage
      queueSave(state.tables)
    },
  },
})

export const {
  initFromLocal,
  setAllTables,
  upsertTable,
  removeTable,
  updateTablePosition,
  setTableSize,
  setTableFlags,
  setTableBackground,
} = tablesSlice.actions

export default tablesSlice.reducer

// selectors
export const selectTables = (s: RootState) => s.tables.tables
export const selectTablesLoaded = (s: RootState) => s.tables.loaded
export const selectSortedTables = (s: RootState) => [...s.tables.tables].sort((a, b) => Number(a.number) - Number(b.number))
