import { useState, useEffect } from 'react'
import { getGradeColor, GRADE_OPTIONS, GRADE_LABELS, formatStatValue, isPitcher, LEVEL_COLOR, getPositionGroup, POSITION_BADGE } from '../utils/stats'

const STAT_LABELS = {
  avg: 'AVG', obp: 'OBP', slg: 'SLG', ops: 'OPS', hr: 'HR', sb: 'SB', rbi: 'RBI',
  era: 'ERA', ip: 'IP', k: 'K', bb: 'BB', velocity: 'Velo',
}

export default function DetailPanel({ prospect, onUpdate, onClose, onDelete }) {
  const [notes, setNotes] = useState(prospect.notes || '')
  const [grade, setGrade] = useState(prospect.grade || 50)

  // Reset when prospect changes
  useEffect(() => {
    setNotes(prospect.notes || '')
    setGrade(prospect.grade || 50)
  }, [prospect.id])

  // Debounce notes save
  useEffect(() => {
    const t = setTimeout(() => {
      if (notes !== (prospect.notes || '')) {
        onUpdate(prospect.id, { notes })
      }
    }, 600)
    return () => clearTimeout(t)
  }, [notes])

  const handleGradeChange = val => {
    setGrade(val)
    onUpdate(prospect.id, { grade: val })
  }

  const { bg, text } = getGradeColor(grade)
  const posGroup = getPositionGroup(prospect.position)

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

        {/* Stats */}
        {prospect.stats && Object.keys(prospect.stats).length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {isPitcher(prospect.position) ? 'Pitching Stats' : 'Hitting Stats'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(prospect.stats).map(([key, val]) => (
                <div key={key} className="bg-gray-800 rounded-lg px-3 py-2.5">
                  <div className="text-xs text-gray-500 mb-0.5">{STAT_LABELS[key] || key.toUpperCase()}</div>
                  <div className="text-white font-mono font-semibold text-sm">
                    {formatStatValue(key, val)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
