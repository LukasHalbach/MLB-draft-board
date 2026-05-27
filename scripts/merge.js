/**
 * Merges freshly scraped prospects with the existing JSON data.
 *
 * When a player name matches, we re-use their existing `id` so that
 * any customizations stored in localStorage (grades, notes, rank order)
 * survive the data refresh without requiring a board reset.
 */
export function mergeWithExisting(scraped, existing) {
  const existingByName = new Map(
    existing.map(p => [normalize(p.name), p])
  );

  return scraped.map(p => {
    const old = existingByName.get(normalize(p.name));
    if (!old) return p;
    return {
      ...p,
      id: old.id,
      grade: old.grade,
      notes: old.notes ?? p.notes,
      rank: old.rank,
    };
  });
}

const normalize = name => name.toLowerCase().replace(/[^a-z]/g, '');
