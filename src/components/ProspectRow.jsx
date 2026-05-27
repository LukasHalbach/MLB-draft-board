import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatStats, getPositionGroup, getGradeColor, POSITION_BADGE, LEVEL_COLOR } from '../utils/stats'

function DragHandle(props) {
  return (
    <button
      {...props}
      className="shrink-0 p-1 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none"
      title="Drag to reorder"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <circle cx="4.5" cy="3.5" r="1.2" />
        <circle cx="9.5" cy="3.5" r="1.2" />
        <circle cx="4.5" cy="7" r="1.2" />
        <circle cx="9.5" cy="7" r="1.2" />
        <circle cx="4.5" cy="10.5" r="1.2" />
        <circle cx="9.5" cy="10.5" r="1.2" />
      </svg>
    </button>
  )
}

export default function ProspectRow({
  prospect,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  isDragDisabled,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: prospect.id, disabled: isDragDisabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const posGroup = getPositionGroup(prospect.position)
  const isPersonallyGraded = prospect.personalGrade != null
  const displayGrade = isPersonallyGraded ? prospect.personalGrade : prospect.grade
  const { bg, text } = getGradeColor(displayGrade)
  const statsLine = formatStats(prospect)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-2 py-2 rounded-lg border transition-colors select-none ${
        isDragging
          ? 'opacity-30 border-gray-700 bg-gray-900'
          : isSelected
          ? 'bg-blue-950/60 border-blue-700'
          : 'bg-gray-900 border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Drag handle */}
      {isDragDisabled ? (
        <div className="w-5 shrink-0" />
      ) : (
        <DragHandle {...attributes} {...listeners} />
      )}

      {/* Rank */}
      <div className="w-8 text-right shrink-0 text-gray-500 font-mono text-sm tabular-nums">
        {prospect.rank}
      </div>

      {/* Main info — clickable to open detail panel */}
      <button
        onClick={onSelect}
        className="flex-1 min-w-0 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-white text-sm truncate">{prospect.name}</span>
          <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded border font-medium ${POSITION_BADGE[posGroup] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
            {prospect.position}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
          <span className="truncate">{prospect.school}</span>
          <span>·</span>
          <span className={`shrink-0 font-medium ${LEVEL_COLOR[prospect.level] || 'text-gray-500'}`}>
            {prospect.level}
          </span>
          {statsLine && (
            <>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline truncate text-gray-600">{statsLine}</span>
            </>
          )}
        </div>
      </button>

      {/* Grade badge */}
      <div className="shrink-0 flex flex-col items-center gap-0.5">
        <div className={`w-9 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${bg} ${text} ${!isPersonallyGraded ? 'opacity-60' : ''}`}>
          {displayGrade || '—'}
        </div>
        <span className={`text-[9px] font-bold uppercase leading-none tracking-wide ${isPersonallyGraded ? 'text-blue-500' : 'text-gray-700'}`}>
          {isPersonallyGraded ? 'my' : 'sc'}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onMoveUp}
          className="p-1 text-gray-600 hover:text-gray-300 transition-colors"
          title="Move up one"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 10V3M3 6.5l3.5-3.5 3.5 3.5" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          className="p-1 text-gray-600 hover:text-gray-300 transition-colors"
          title="Move down one"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 3v7M3 6.5l3.5 3.5 3.5-3.5" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-gray-700 hover:text-red-500 transition-colors"
          title="Remove from board"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* Lightweight clone rendered inside DragOverlay — no hooks, no sortable context needed */
export function ProspectRowOverlay({ prospect }) {
  const posGroup = getPositionGroup(prospect.position)
  const isPersonallyGraded = prospect.personalGrade != null
  const displayGrade = isPersonallyGraded ? prospect.personalGrade : prospect.grade
  const { bg, text } = getGradeColor(displayGrade)

  return (
    <div className="flex items-center gap-2 px-2 py-2 rounded-lg border bg-gray-800 border-gray-600 shadow-2xl">
      <div className="w-5 shrink-0" />
      <div className="w-8 text-right shrink-0 text-gray-400 font-mono text-sm">{prospect.rank}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-white text-sm truncate">{prospect.name}</span>
          <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded border font-medium ${POSITION_BADGE[posGroup] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
            {prospect.position}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5 truncate">{prospect.school} · {prospect.level}</div>
      </div>
      <div className="shrink-0 flex flex-col items-center gap-0.5">
        <div className={`w-9 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${bg} ${text} ${!isPersonallyGraded ? 'opacity-60' : ''}`}>
          {displayGrade || '—'}
        </div>
        <span className={`text-[9px] font-bold uppercase leading-none tracking-wide ${isPersonallyGraded ? 'text-blue-500' : 'text-gray-700'}`}>
          {isPersonallyGraded ? 'my' : 'sc'}
        </span>
      </div>
    </div>
  )
}
