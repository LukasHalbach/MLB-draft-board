import 'dotenv/config';
import { ApifyClient } from 'apify-client';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { fetchMLBDraftList } from './scrapers/mlb-stats-api.js';
import { scrapeCollegeStats } from './scrapers/d1baseball.js';
import { scrapeHSStats } from './scrapers/perfect-game.js';
import { transformProspect } from './transform.js';
import { mergeWithExisting } from './merge.js';

const DRY_RUN = process.argv.includes('--dry-run');
const YEAR = parseInt(process.argv.find(a => /^\d{4}$/.test(a)) ?? '2026');
const OUTPUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '../src/data/prospects2025.json');

if (!process.env.APIFY_TOKEN) {
  console.error('Error: APIFY_TOKEN is not set. Copy .env.example to .env and add your token.');
  process.exit(1);
}

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

console.log(`\nFetching ${YEAR} MLB draft list from MLB Stats API...`);
const players = await fetchMLBDraftList(YEAR);
console.log(`  Found ${players.length} players in official draft list.`);

console.log('\nScraping college stats from D1Baseball (via Apify)...');
const collegeStats = await scrapeCollegeStats(client);
console.log(`  Matched stats for ${collegeStats.size} college players.`);

console.log('\nScraping HS rankings from Perfect Game (via Apify)...');
const hsStats = await scrapeHSStats(client);
console.log(`  Matched stats/grades for ${hsStats.size} HS players.`);

const top100 = players.slice(0, 100);
const scraped = top100.map((p, i) => {
  const statsMap = p.level === 'HS' ? hsStats : collegeStats;
  return transformProspect(p, i + 1, statsMap);
});

const existing = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'));
const final = mergeWithExisting(scraped, existing);

const matched = final.filter(p => existing.some(e => e.id === p.id)).length;
console.log(`\n  ${matched} players matched existing board data (customizations preserved).`);

if (DRY_RUN) {
  console.log('\nDRY RUN — first 3 prospects:');
  console.log(JSON.stringify(final.slice(0, 3), null, 2));
  console.log(`\nWould write ${final.length} prospects. Run without --dry-run to apply.`);
} else {
  writeFileSync(OUTPUT_PATH, JSON.stringify(final, null, 2));
  console.log(`\nWrote ${final.length} prospects to src/data/prospects2025.json`);
  console.log('Run `npm run build` to bundle the updated data into the app.');
}
