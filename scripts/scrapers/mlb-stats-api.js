/**
 * Fetches the official MLB draft prospect list from the free MLB Stats API.
 * Returns players sorted by pick order (which is the official ranking).
 */
export async function fetchMLBDraftList(year) {
  const res = await fetch(`https://statsapi.mlb.com/api/v1/draft/${year}`);
  if (!res.ok) throw new Error(`MLB Stats API responded with ${res.status}`);
  const json = await res.json();

  const players = json.drafts.rounds.flatMap(round =>
    round.picks.map(pick => ({
      name: pick.person?.fullName ?? '',
      position: normalizePosition(pick.position?.abbreviation),
      school: pick.school?.name ?? pick.team?.name ?? '',
      level: inferLevel(pick.school?.schoolType),
    }))
  );

  return players.filter(p => p.name);
}

function normalizePosition(abbreviation) {
  if (!abbreviation) return 'OF';
  const map = {
    'P': 'RHP', 'SP': 'RHP', 'RP': 'RHP',
    'TWP': 'RHP', 'DH': '1B',
  };
  return map[abbreviation] ?? abbreviation;
}

function inferLevel(schoolType) {
  if (!schoolType) return 'International';
  if (schoolType === 'HighSchool') return 'HS';
  if (schoolType === 'College' || schoolType === 'JuniorCollege') return 'College';
  return 'International';
}
