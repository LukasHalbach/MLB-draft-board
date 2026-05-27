# ⚾ MLB Draft Big Board

A personal MLB draft big board for ranking, researching, and evaluating the top 150 prospects in the 2025 draft class. Pre-loaded with consensus rankings, fully reorderable, with your own grades and scouting notes on each player.

## Features

- **Board view** — numbered list of all prospects showing rank, name, position, school, level, key stats, and your grade
- **Drag-and-drop reordering** — drag rows for big jumps; up/down arrows for ±1 moves
- **Detail panel** — click any prospect to open a side panel with full stats, an editable 20–80 grade (slider + dropdown), and auto-saving scout notes
- **Add prospect** — manually add any player to your board at a chosen rank
- **Delete** — remove any prospect from your board
- **Filter bar** — filter by position group (P, IF, OF, C), level (HS/College/International), grade range, and name/school search
- **Pre-loaded data** — 150 prospects from the 2025 MLB draft class with realistic stats
- **Persistence** — board state auto-saves to localStorage on every change; reset-to-default button in the header
- **CSV export** — export your full board (rank, name, position, school, level, grade, notes)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| dnd-kit | Drag-and-drop |
| localStorage | Persistence |

## Data Model

Each prospect has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `rank` | number | Current board position |
| `name` | string | Player name |
| `position` | string | `RHP`, `LHP`, `SS`, `OF`, `C`, `3B`, `2B`, `1B`, etc. |
| `school` | string | High school, college, or academy |
| `level` | string | `HS`, `College`, or `International` |
| `stats` | object | Hitter: avg/obp/slg/hr/sb · Pitcher: era/ip/k/bb/velocity |
| `grade` | number | Your OFP grade on the 20–80 scouting scale |
| `notes` | string | Free-text scouting notes |
| `source` | string | `preloaded` or `manual` |

## Grading Scale (20–80)

| Grade | Label |
|-------|-------|
| 80 | Elite |
| 70 | Excellent |
| 60 | Plus |
| 50 | Average |
| 40 | Well Below Average |
| 30 | Org Player |
| 20 | Non-Roster |

## File Structure

```
src/
  components/
    Board.jsx           # Sortable prospect list (dnd-kit)
    ProspectRow.jsx     # Individual row with drag handle & controls
    DetailPanel.jsx     # Expanded view with grade editor & notes
    AddProspectForm.jsx # Modal form to add a new prospect
    FilterBar.jsx       # Search, position, level, and grade filters
    ExportButton.jsx    # CSV download
  data/
    prospects2025.json  # Pre-loaded top 150 prospects
  utils/
    storage.js          # localStorage helpers
    stats.js            # Stat formatting and grade color utilities
  App.jsx               # Root component and state management
  index.css             # Tailwind base styles
```

## Usage Tips

- **Reorder** — grab the dot-grid handle on the left of any row and drag. Filters must be cleared to enable drag-and-drop.
- **Edit grade & notes** — click anywhere on a row to open the detail panel on the right.
- **Quick moves** — use the ↑ ↓ arrows on the right of each row to nudge a prospect up or down one spot.
- **Reset** — the circular-arrow icon in the top-right resets everything back to the default 2025 board (with a confirmation prompt).
- **Export** — the "Export CSV" button downloads your current board as a spreadsheet-ready CSV file.
