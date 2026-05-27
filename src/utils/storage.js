const KEY = 'mlb-draft-board-2025-v1'

export function loadBoard() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveBoard(prospects) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prospects))
  } catch {
    // Storage full or unavailable — silent fail
  }
}

export function clearBoard() {
  localStorage.removeItem(KEY)
}
