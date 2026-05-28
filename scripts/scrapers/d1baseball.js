/**
 * Scrapes D1Baseball.com for college hitter and pitcher stats.
 * Returns a Map<normalizedName, stats> for use in data enrichment.
 */
export async function scrapeCollegeStats(client) {
  const [hitters, pitchers] = await Promise.all([
    scrapeHitters(client),
    scrapePitchers(client),
  ]);

  const statsMap = new Map();
  for (const p of hitters) statsMap.set(normalize(p.name), p.stats);
  for (const p of pitchers) {
    const key = normalize(p.name);
    if (!statsMap.has(key)) statsMap.set(key, p.stats);
  }
  return statsMap;
}

async function scrapeHitters(client) {
  const run = await client.actor('apify/cheerio-scraper').call({
    startUrls: [{ url: 'https://www.d1baseball.com/stats/hitters/?sort=avg&per_page=200' }],
    pageFunction: /* javascript */ `async function pageFunction(context) {
      const $ = context.jQuery;
      const rows = [];
      $('table tbody tr').each((i, el) => {
        const cells = $(el).find('td');
        const name = cells.eq(0).text().trim();
        const school = cells.eq(1).text().trim();
        if (!name || !school) return;
        rows.push({
          name,
          school,
          avg: cells.eq(3).text().trim(),
          obp: cells.eq(4).text().trim(),
          slg: cells.eq(5).text().trim(),
          hr:  cells.eq(6).text().trim(),
          sb:  cells.eq(7).text().trim(),
        });
      });
      return rows;
    }`,
    maxRequestsPerCrawl: 3,
  }, { waitSecs: 120 });

  const dataset = await client.dataset(run.defaultDatasetId).listItems();
  return dataset.items.flat().filter(r => r.name).map(r => ({
    name: r.name,
    stats: {
      avg: parseFloat(r.avg) || 0,
      obp: parseFloat(r.obp) || 0,
      slg: parseFloat(r.slg) || 0,
      hr:  parseInt(r.hr) || 0,
      sb:  parseInt(r.sb) || 0,
    },
  }));
}

async function scrapePitchers(client) {
  const run = await client.actor('apify/cheerio-scraper').call({
    startUrls: [{ url: 'https://www.d1baseball.com/stats/pitchers/?sort=era&per_page=200' }],
    pageFunction: /* javascript */ `async function pageFunction(context) {
      const $ = context.jQuery;
      const rows = [];
      $('table tbody tr').each((i, el) => {
        const cells = $(el).find('td');
        const name = cells.eq(0).text().trim();
        const school = cells.eq(1).text().trim();
        if (!name || !school) return;
        rows.push({
          name,
          school,
          era: cells.eq(3).text().trim(),
          ip:  cells.eq(4).text().trim(),
          k:   cells.eq(5).text().trim(),
          bb:  cells.eq(6).text().trim(),
        });
      });
      return rows;
    }`,
    maxRequestsPerCrawl: 3,
  }, { waitSecs: 120 });

  const dataset = await client.dataset(run.defaultDatasetId).listItems();
  return dataset.items.flat().filter(r => r.name).map(r => ({
    name: r.name,
    stats: {
      era:      parseFloat(r.era) || 0,
      ip:       parseFloat(r.ip) || 0,
      k:        parseInt(r.k) || 0,
      bb:       parseInt(r.bb) || 0,
      velocity: null,
    },
  }));
}

const normalize = name => name.toLowerCase().replace(/[^a-z]/g, '');
