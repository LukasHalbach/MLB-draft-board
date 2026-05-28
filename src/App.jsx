import { useState, useEffect, useCallback } from 'react'
import Board from './components/Board'
import DetailPanel from './components/DetailPanel'
import FilterBar from './components/FilterBar'
import AddProspectForm from './components/AddProspectForm'
import ExportButton from './components/ExportButton'
import { loadBoard, saveBoard, clearBoard } from './utils/storage'
import { getPositionGroup } from './utils/stats'
import initialData from './data/prospects2025.json'

const DEFAULT_FILTERS = {
  search: '',
  positionGroup: 'All',
  level: 'All',
  gradeMin: 20,
  gradeMax: 80,
}

function applyFilters(prospects, filters) {
  return prospects.filter(p => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !(p.school || '').toLowerCase().includes(q)) return false
    }
    if (filters.positionGroup !== 'All') {
      if (getPositionGroup(p.position) !== filters.positionGroup) return false
    }
    if (filters.level !== 'All' && p.level !== filters.level) return false
    const g = p.grade || 0
    if (g < filters.gradeMin || g > filters.gradeMax) return false
    return true
  })
}

function hasFilters(filters) {
  return (
    !!filters.search ||
    filters.positionGroup !== 'All' ||
    filters.level !== 'All' ||
    filters.gradeMin !== 20 ||
    filters.gradeMax !== 80
  )
}

export default function App() {
  const [prospects, setProspects] = useState(() => loadBoard() || initialData)
  const [selectedId, setSelectedId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Persist on every change
  useEffect(() => {
    saveBoard(prospects)
  }, [prospects])

  const renumber = list => list.map((p, i) => ({ ...p, rank: i + 1 }))

  const handleReorder = useCallback(newList => {
    setProspects(renumber(newList))
  }, [])

  const handleUpdate = useCallback((id, updates) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const handleAdd = useCallback(data => {
    setProspects(prev => {
      const insertAt = Math.max(1, Math.min(data.rank, prev.length + 1)) - 1
      const newProspect = { ...data, id: crypto.randomUUID(), source: 'manual' }
      const list = [...prev]
      list.splice(insertAt, 0, newProspect)
      return renumber(list)
    })
    setShowAddForm(false)
  }, [])

  const handleDelete = useCallback(id => {
    setProspects(prev => renumber(prev.filter(p => p.id !== id)))
    setSelectedId(prev => (prev === id ? null : prev))
  }, [])

  const handleMoveUp = useCallback(id => {
    setProspects(prev => {
      const idx = prev.findIndex(p => p.id === id)
      if (idx <= 0) return prev
      const list = [...prev]
      ;[list[idx - 1], list[idx]] = [list[idx], list[idx - 1]]
      return renumber(list)
    })
  }, [])

  const handleMoveDown = useCallback(id => {
    setProspects(prev => {
      const idx = prev.findIndex(p => p.id === id)
      if (idx === -1 || idx >= prev.length - 1) return prev
      const list = [...prev]
      ;[list[idx], list[idx + 1]] = [list[idx + 1], list[idx]]
      return renumber(list)
    })
  }, [])

  const handleReset = () => {
    clearBoard()
    setProspects(initialData)
    setSelectedId(null)
    setShowResetConfirm(false)
  }

  const filtered = applyFilters(prospects, filters)
  const isFiltered = hasFilters(filters)
  const selectedProspect = prospects.find(p => p.id === selectedId)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl leading-none">⚾</span>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-white leading-tight">MLB Draft Big Board</h1>
              <p className="text-xs text-gray-500 hidden sm:block">2026 Draft Class · {prospects.length} prospects</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ExportButton prospects={prospects} />
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M7 1v12M1 7h12" />
              </svg>
              <span className="hidden sm:inline">Add Prospect</span>
              <span className="sm:hidden">Add</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowResetConfirm(r => !r)}
                className="p-2 text-gray-600 hover:text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                title="Reset to default board"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v4h4" />
                  <path d="M14.5 8A6.5 6.5 0 103 5.1L1 8" />
                </svg>
              </button>
              {showResetConfirm && (
                <div className="absolute right-0 top-full mt-1.5 bg-gray-800 border border-gray-700 rounded-xl p-4 w-56 shadow-2xl z-50">
                  <p className="text-sm text-gray-300 mb-3">Reset to default 2026 draft board? All grades, notes, and reordering will be lost.</p>
                  <div className="flex gap-2">
                    <button onClick={handleReset} className="flex-1 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors">
                      Reset
                    </button>
                    <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5">
        {/* Filter bar */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Count + DnD tip */}
        <div className="flex items-center justify-between mt-3 mb-2 text-xs text-gray-600">
          <span>
            {isFiltered
              ? `${filtered.length} of ${prospects.length} prospects`
              : `${prospects.length} prospects`}
          </span>
          {!isFiltered && (
            <span className="hidden sm:inline">Drag rows to reorder · Click a row to edit grade &amp; notes</span>
          )}
          {isFiltered && (
            <span className="text-yellow-600/80">Drag-to-reorder disabled while filters are active</span>
          )}
        </div>

        {/* Main content */}
        <div className={`flex gap-5 items-start ${selectedProspect ? '' : ''}`}>
          {/* Board */}
          <div className="flex-1 min-w-0">
            <Board
              prospects={filtered}
              allProspects={prospects}
              selectedId={selectedId}
              isFiltered={isFiltered}
              onSelect={setSelectedId}
              onReorder={handleReorder}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={handleDelete}
            />
          </div>

          {/* Detail panel */}
          {selectedProspect && (
            <div className="w-80 xl:w-96 shrink-0 sticky top-20 h-[calc(100vh-5.5rem)]">
              <DetailPanel
                key={selectedProspect.id}
                prospect={selectedProspect}
                onUpdate={handleUpdate}
                onClose={() => setSelectedId(null)}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add form modal */}
      {showAddForm && (
        <AddProspectForm
          totalProspects={prospects.length}
          onAdd={handleAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}
