const POS_GROUPS = ['All', 'P', 'IF', 'OF', 'C']
const LEVELS = ['All', 'HS', 'College', 'International']

export default function FilterBar({ filters, onChange }) {
  const set = (key, val) => onChange(f => ({ ...f, [key]: val }))

  const hasFilters =
    filters.search ||
    filters.positionGroup !== 'All' ||
    filters.level !== 'All' ||
    filters.gradeMin !== 20 ||
    filters.gradeMax !== 80

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-44">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="4" />
          <path d="M9 9l3 3" />
        </svg>
        <input
          type="text"
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          placeholder="Search by name…"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-8 pr-3 py-1.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        {filters.search && (
          <button
            onClick={() => set('search', '')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-700 hidden sm:block" />

      {/* Position */}
      <div className="flex gap-1">
        {POS_GROUPS.map(pos => (
          <button
            key={pos}
            onClick={() => set('positionGroup', pos)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filters.positionGroup === pos
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-750'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-700 hidden sm:block" />

      {/* Level */}
      <div className="flex gap-1">
        {LEVELS.map(lvl => (
          <button
            key={lvl}
            onClick={() => set('level', lvl)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filters.level === lvl
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-700 hidden sm:block" />

      {/* Grade range */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="text-xs font-medium text-gray-500">Grade</span>
        <input
          type="number"
          min="20" max="80" step="5"
          value={filters.gradeMin}
          onChange={e => set('gradeMin', Math.min(parseInt(e.target.value) || 20, filters.gradeMax))}
          className="w-14 bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-blue-500"
        />
        <span className="text-gray-600">–</span>
        <input
          type="number"
          min="20" max="80" step="5"
          value={filters.gradeMax}
          onChange={e => set('gradeMax', Math.max(parseInt(e.target.value) || 80, filters.gradeMin))}
          className="w-14 bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => onChange({ search: '', positionGroup: 'All', level: 'All', gradeMin: 20, gradeMax: 80 })}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors ml-auto"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
