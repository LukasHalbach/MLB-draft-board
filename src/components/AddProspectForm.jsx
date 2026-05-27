import { useState } from 'react'

const POSITIONS = ['SS', 'OF', 'CF', 'RF', 'LF', 'C', '3B', '2B', '1B', 'RHP', 'LHP', 'IF', 'DH']
const LEVELS = ['HS', 'College', 'International']

const HITTER_STATS = ['avg', 'obp', 'slg', 'hr', 'sb']
const PITCHER_STATS = ['era', 'ip', 'k', 'bb', 'velocity']

function isPitcherPos(pos) {
  return pos === 'RHP' || pos === 'LHP'
}

export default function AddProspectForm({ totalProspects, onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '',
    position: 'SS',
    school: '',
    level: 'HS',
    grade: 50,
    rank: totalProspects + 1,
    notes: '',
  })
  const [stats, setStats] = useState(
    Object.fromEntries(HITTER_STATS.map(k => [k, '']))
  )

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePosition = pos => {
    set('position', pos)
    const keys = isPitcherPos(pos) ? PITCHER_STATS : HITTER_STATS
    setStats(Object.fromEntries(keys.map(k => [k, ''])))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name.trim()) return
    const parsedStats = {}
    Object.entries(stats).forEach(([k, v]) => {
      if (v !== '') parsedStats[k] = parseFloat(v)
    })
    onAdd({
      ...form,
      grade: parseInt(form.grade) || 50,
      rank: parseInt(form.rank) || totalProspects + 1,
      stats: parsedStats,
    })
  }

  const statKeys = isPitcherPos(form.position) ? PITCHER_STATS : HITTER_STATS

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-base font-bold text-white">Add Prospect</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
              autoFocus
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Player name"
            />
          </div>

          {/* Position + Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Position</label>
              <select
                value={form.position}
                onChange={e => handlePosition(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {POSITIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Level</label>
              <select
                value={form.level}
                onChange={e => set('level', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* School */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">School / Team</label>
            <input
              value={form.school}
              onChange={e => set('school', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="School or team name"
            />
          </div>

          {/* Grade + Rank */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Grade (20–80)</label>
              <input
                type="number"
                min="20" max="80" step="5"
                value={form.grade}
                onChange={e => set('grade', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Insert at Rank</label>
              <input
                type="number"
                min="1"
                max={totalProspects + 1}
                value={form.rank}
                onChange={e => set('rank', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Stats */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">
              {isPitcherPos(form.position) ? 'Pitching Stats' : 'Hitting Stats'}{' '}
              <span className="text-gray-600">(optional)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statKeys.map(key => (
                <div key={key}>
                  <label className="block text-xs text-gray-600 mb-1 uppercase">{key}</label>
                  <input
                    type="number"
                    step="any"
                    value={stats[key]}
                    onChange={e => setStats(s => ({ ...s, [key]: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="—"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm resize-none placeholder-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="Initial scouting notes…"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Add to Board
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
