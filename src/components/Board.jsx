import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import ProspectRow, { ProspectRowOverlay } from './ProspectRow'

export default function Board({
  prospects,
  allProspects,
  selectedId,
  isFiltered,
  onSelect,
  onReorder,
  onMoveUp,
  onMoveDown,
  onDelete,
}) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const oldIdx = allProspects.findIndex(p => p.id === active.id)
    const newIdx = allProspects.findIndex(p => p.id === over.id)
    if (oldIdx !== -1 && newIdx !== -1) {
      onReorder(arrayMove(allProspects, oldIdx, newIdx))
    }
  }

  const handleDragCancel = () => setActiveId(null)

  const activeProspect = activeId ? allProspects.find(p => p.id === activeId) : null

  const rows = prospects.map(p => (
    <ProspectRow
      key={p.id}
      prospect={p}
      isSelected={p.id === selectedId}
      onSelect={() => onSelect(p.id === selectedId ? null : p.id)}
      onMoveUp={() => onMoveUp(p.id)}
      onMoveDown={() => onMoveDown(p.id)}
      onDelete={() => onDelete(p.id)}
      isDragDisabled={isFiltered}
    />
  ))

  if (prospects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-600">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-40">
          <circle cx="20" cy="20" r="16" />
          <path d="M14 20h12M20 14v12" />
        </svg>
        <p className="text-sm">No prospects match your filters.</p>
      </div>
    )
  }

  if (isFiltered) {
    return <div className="space-y-1">{rows}</div>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={prospects.map(p => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">{rows}</div>
      </SortableContext>
      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeProspect ? <ProspectRowOverlay prospect={activeProspect} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
