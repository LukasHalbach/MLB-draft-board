const PITCHER_POSITIONS = new Set(['RHP', 'LHP', 'SP', 'RP'])

export function isPitcher(position) {
  return PITCHER_POSITIONS.has(position)
}

export function getPositionGroup(position) {
  if (PITCHER_POSITIONS.has(position)) return 'P'
  if (['SS', '2B', '3B', '1B', 'IF'].includes(position)) return 'IF'
  if (['OF', 'CF', 'RF', 'LF'].includes(position)) return 'OF'
  if (position === 'C') return 'C'
  return 'IF'
}

export function formatStats(prospect) {
  const { stats, position } = prospect
  if (!stats || Object.keys(stats).length === 0) return ''

  if (isPitcher(position)) {
    const parts = []
    if (stats.era != null) parts.push(`ERA ${Number(stats.era).toFixed(2)}`)
    if (stats.k != null) parts.push(`${stats.k}K`)
    if (stats.velocity != null) parts.push(`${stats.velocity}mph`)
    return parts.join(' · ')
  } else {
    const parts = []
    if (stats.avg != null) {
      const avg = Number(stats.avg)
      parts.push(avg < 1 ? avg.toFixed(3).replace('0.', '.') : avg.toFixed(3))
    }
    if (stats.hr != null) parts.push(`${stats.hr}HR`)
    if (stats.sb != null) parts.push(`${stats.sb}SB`)
    return parts.join(' · ')
  }
}

export function formatStatValue(key, value) {
  const v = Number(value)
  if (['avg', 'obp', 'slg', 'ops'].includes(key)) {
    return v < 1 ? v.toFixed(3).replace('0.', '.') : v.toFixed(3)
  }
  if (key === 'era') return v.toFixed(2)
  if (key === 'ip') {
    const whole = Math.floor(v)
    const frac = Math.round((v - whole) * 10)
    return frac === 0 ? `${whole}.0` : `${whole}.${frac}`
  }
  return String(value)
}

export function getGradeColor(grade) {
  if (!grade) return { bg: 'bg-gray-700', text: 'text-gray-400' }
  if (grade >= 70) return { bg: 'bg-yellow-400', text: 'text-yellow-950' }
  if (grade >= 60) return { bg: 'bg-green-500', text: 'text-white' }
  if (grade >= 55) return { bg: 'bg-blue-500', text: 'text-white' }
  if (grade >= 50) return { bg: 'bg-blue-700', text: 'text-white' }
  if (grade >= 45) return { bg: 'bg-gray-500', text: 'text-white' }
  if (grade >= 40) return { bg: 'bg-orange-500', text: 'text-white' }
  return { bg: 'bg-red-600', text: 'text-white' }
}

export const GRADE_LABELS = {
  80: '80 — Elite',
  75: '75 — Top Prospect',
  70: '70 — Excellent',
  65: '65 — Plus-Plus',
  60: '60 — Plus',
  55: '55 — Plus/Average',
  50: '50 — Average',
  45: '45 — Below Average',
  40: '40 — Well Below Average',
  35: '35 — Fringe',
  30: '30 — Org Player',
  25: '25 — Non-Prospect',
  20: '20 — Non-Roster',
}

export const GRADE_OPTIONS = [80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20]

export const POSITION_BADGE = {
  P: 'bg-red-950 text-red-300 border-red-800',
  IF: 'bg-blue-950 text-blue-300 border-blue-800',
  OF: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  C: 'bg-purple-950 text-purple-300 border-purple-800',
}

export const LEVEL_COLOR = {
  HS: 'text-yellow-400',
  College: 'text-sky-400',
  International: 'text-emerald-400',
}
