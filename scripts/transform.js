const PITCHER_POSITIONS = new Set(['RHP', 'LHP', 'SP', 'RP', 'P']);

/**
 * Maps a raw player object (from MLB Stats API) + a stats lookup map
 * into the app's prospect schema.
 */
export function transformProspect(raw, rank, statsMap) {
  const key = normalize(raw.name);
  const match = statsMap.get(key);

  const stats = match?.stats ?? defaultStats(raw.position);
  const pgGrade = match?.pgGrade ?? null;

  return {
    id: `p${String(rank).padStart(3, '0')}`,
    rank,
    name: raw.name,
    position: raw.position,
    school: raw.school,
    level: raw.level,
    grade: match?.grade ?? estimateGrade(rank),
    stats,
    notes: pgGrade ? `PG Grade: ${pgGrade}` : '',
    source: 'scraped',
  };
}

function defaultStats(position) {
  return PITCHER_POSITIONS.has(position)
    ? { era: null, ip: null, k: null, bb: null, velocity: null }
    : { avg: null, obp: null, slg: null, hr: null, sb: null };
}

function estimateGrade(rank) {
  // 20-80 scale: #1 → 72, #100 → 45
  return Math.max(45, Math.round(72 - (rank - 1) * 0.27));
}

const normalize = name => name.toLowerCase().replace(/[^a-z]/g, '');
