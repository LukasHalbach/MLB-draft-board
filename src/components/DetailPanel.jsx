import { useState, useEffect } from 'react'
import { getGradeColor, GRADE_OPTIONS, GRADE_LABELS, formatStatValue, isPitcher, LEVEL_COLOR, getPositionGroup, POSITION_BADGE } from '../utils/stats'

function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 1l9 9M10 1L1 10" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5.5 1v9M1 5.5h9" />
    </svg>
  )
}

function EditableStatsSection({ title, stats, onChange, defaultEmpty = false }) {
  const [adding, setAdding] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newVal, setNewVal] = useState('')

  const handleValueChange = (key, raw) => {
    const parsed = raw === '' ? '' : !isNaN(raw) && raw.trim() !== '' ? Number(raw) : raw
    onChange({ ...stats, [key]: parsed })
  }

  const handleDelete = key => {
    const copy = { ...stats }
    delete copy[key]
    onChange(copy)
  }

  const handleAdd = () => {
    const k = newKey.trim()
    if (!k) return
    const v = newVal === '' ? '' : !isNaN(newVal) && newVal.trim() !== '' ? Number(newVal) : newVal
    onChange({ ...stats, [k]: v })
    setNewKey('')
    setNewVal('')
    setAdding(false)
  }

  const entries = Object.entries(stats)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-400 transition-colors"
          >
            <PlusIcon />
            Add field
          </button>
        )}
      </div>

      {entries.length === 0 && !adding && (
        <p className="text-xs text-gray-700 italic">No stats yet — click Add field to start.</p>
      )}

      <div className="space-y-1.5">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 uppercase font-medium w-24 shrink-0 truncate" title={key}>
              {key}
            </span>
            <input
              type="text"
              value={val === null || val === undefined ? '' : String(val)}
              onChange={e => handleValueChange(key, e.target.value)}
              className="flex-1 min-w-0 bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleDelete(key)}
              className="shrink-0 p-1 text-gray-700 hover:text-red-400 transition-colors"
              title="Remove field"
            >
              <XIcon />
            </button>
          </div>
        ))}

        {adding && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="field name"
              autoFocus
              className="w-24 shrink-0 bg-gray-800 border border-blue-600 text-white rounded px-2 py-1 text-xs focus:outline-none placeholder-gray-600"
            />
            <input
              type="text"
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="value"
              className="flex-1 min-w-0 bg-gray-800 border border-blue-600 text-white rounded px-2 py-1 text-xs font-mono focus:outline-none placeholder-gray-600"
            />
            <button
              onClick={handleAdd}
              className="shrink-0 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setAdding(false); setNewKey(''); setNewVal('') }}
              className="shrink-0 p-1 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <XIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DetailPanel({ prospect, onUpdate, onClose, onDelete }) {
  const [notes, setNotes] = useState(prospect.notes || '')
  const [grade, setGrade] = useState(prospect.grade || 50)
  const [stats, setStats] = useState(prospect.stats || {})
  const [defenseStats, setDefenseStats] = useState(prospect.defenseStats || {})

  // Reset all local state when switching prospects
  useEffect(() => {
    setNotes(prospect.notes || '')
    setGrade(prospect.grade || 50)
    setStats(prospect.stats || {})
    setDefenseStats(prospect.defenseStats || {})
  }, [prospect.id])

  // Debounce notes
  useEffect(() => {
    const t = setTimeout(() => {
      if (notes !== (prospect.notes || '')) {
        onUpdate(prospect.id, { notes })
      }
    }, 600)
    return () => clearTimeout(t)
  }, [notes])

  // Debounce stats
  useEffect(() => {
    const t = setTimeout(() => {
      onUpdate(prospect.id, { stats })
    }, 400)
    return () => clearTimeout(t)
  }, [stats])

  // Debounce defense stats
  useEffect(() => {
    const t = setTimeout(() => {
      onUpdate(prospect.id, { defenseStats })
    }, 400)
    return () => clearTimeout(t)
  }, [defenseStats])

  const handleGradeChange = val => {
    setGrade(val)
    onUpdate(prospect.id, { grade: val })
  }

  const { bg, text } = getGradeColor(grade)
  const posGroup = getPositionGroup(prospect.position)
  const pitcher = isPitcher(prospect.position)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-gray-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 font-mono text-xs">#{prospect.rank}</span>
            <h2 className="text-base font-bold text-white leading-tight">{prospect.name}</h2>
            <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${POSITION_BADGE[posGroup] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
              {prospect.position}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {prospect.school}
            <span className="mx-1 text-gray-600">·</span>
            <span className={LEVEL_COLOR[prospect.level] || 'text-gray-500'}>{prospect.level}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 mt-0.5 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          title="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 2l12 12M14 2L2 14" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-5 overflow-y-auto">
        {/* Grade */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            OFP Grade (20–80 Scale)
          </label>
          <div className="flex items-center gap-3 mb-2">
            <select
              value={grade}
              onChange={e => handleGradeChange(parseInt(e.target.value))}
              className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {GRADE_OPTIONS.map(g => (
                <option key={g} value={g}>{GRADE_LABELS[g]}</option>
              ))}
            </select>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${bg} ${text}`}>
              {grade}
            </div>
          </div>
          <input
            type="range"
            min="20" max="80" step="5"
            value={grade}
            onChange={e => handleGradeChange(parseInt(e.target.value))}
            className="w-full accent-blue-500 h-1.5"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>20</span>
            <span>50</span>
            <span>80</span>
          </div>
        </div>

        {/* Hitting / Pitching Stats */}
        <div className="bg-gray-800/50 rounded-xl p-3">
          <EditableStatsSection
            title={pitcher ? 'Pitching Stats' : 'Hitting Stats'}
            stats={stats}
            onChange={setStats}
          />
        </div>

        {/* Defense Stats */}
        <div className="bg-gray-800/50 rounded-xl p-3">
          <EditableStatsSection
            title="Defense Stats"
            stats={defenseStats}
            onChange={setDefenseStats}
          />
        </div>

        {/* Scout Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Scout Notes
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add your scouting notes, tool grades, comp players…"
            rows={6}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 resize-none placeholder-gray-600 focus:outline-none focus:border-blue-500 leading-relaxed"
          />
          <p className="text-xs text-gray-600 mt-1">Auto-saves as you type</p>
        </div>

        {/* Remove */}
        <button
          onClick={() => onDelete(prospect.id)}
          className="w-full py-2 border border-red-900 text-red-500 hover:bg-red-950/50 rounded-lg text-sm transition-colors"
        >
          Remove from Board
        </button>
      </div>
    </div>
  )
}
