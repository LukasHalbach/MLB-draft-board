/**
 * Scrapes Perfect Game for high school national player rankings.
 * Returns a Map<normalizedName, stats> for HS player enrichment.
 *
 * Note: PG stats for HS players are sparse — avg/hr data is often unavailable.
 * This scraper captures the PG grade and stores it in notes; stats default to null.
 */
export async function scrapeHSStats(client) {
  const players = await scrapePGRankings(client);
  const statsMap = new Map();
  for (const p of players) {
    statsMap.set(normalize(p.name), { stats: p.stats, grade: p.grade, pgGrade: p.pgGrade });
  }
  return statsMap;
}

async function scrapePGRankings(client) {
  const run = await client.actor('apify/playwright-scraper').call({
    startUrls: [{ url: 'https://www.perfectgame.org/Rankings/Players/NationalRankings.aspx' }],
    pageFunction: /* javascript */ `async function pageFunction(context) {
      const { page } = context;
      await page.waitForSelector('table', { timeout: 20000 });
      return page.evaluate(() => {
        return Array.from(document.querySelectorAll('table tbody tr')).map(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          return {
            pgRank:   cells[0]?.innerText?.trim() ?? '',
            name:     cells[1]?.innerText?.trim() ?? '',
            position: cells[2]?.innerText?.trim() ?? '',
            school:   cells[3]?.innerText?.trim() ?? '',
            state:    cells[4]?.innerText?.trim() ?? '',
            year:     cells[5]?.innerText?.trim() ?? '',
            pgGrade:  cells[6]?.innerText?.trim() ?? '',
          };
        }).filter(r => r.name);
      });
    }`,
    maxRequestsPerCrawl: 5,
  }, { waitSecs: 120 });

  const dataset = await client.dataset(run.defaultDatasetId).listItems();
  const isPitcher = pos => ['RHP', 'LHP', 'P'].includes(pos?.toUpperCase());

  return dataset.items.flat().filter(r => r.name).map(r => ({
    name: r.name,
    pgGrade: r.pgGrade,
    grade: mapPGGrade(r.pgGrade),
    stats: isPitcher(r.position)
      ? { era: null, ip: null, k: null, bb: null, velocity: null }
      : { avg: null, obp: null, slg: null, hr: null, sb: null },
  }));
}

const PG_GRADE_MAP = {
  'A+': 65, 'A': 60, 'A-': 57,
  'B+': 55, 'B': 50, 'B-': 47, 'C+': 45,
};

function mapPGGrade(pgGrade) {
  return PG_GRADE_MAP[pgGrade?.trim()] ?? null;
}

const normalize = name => name.toLowerCase().replace(/[^a-z]/g, '');
