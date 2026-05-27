export default function ExportButton({ prospects }) {
  const handleExport = () => {
    const headers = ['Rank', 'Name', 'Position', 'School', 'Level', 'Grade', 'Notes']
    const rows = prospects.map(p => [
      p.rank,
      `"${p.name}"`,
      p.position,
      `"${(p.school || '').replace(/"/g, '""')}"`,
      p.level,
      p.grade || '',
      `"${(p.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mlb-draft-board-2025.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M7 1v8M4 6l3 3 3-3M1 11v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
      </svg>
      Export CSV
    </button>
  )
}
