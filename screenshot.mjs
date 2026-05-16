import puppeteer from '/Users/ipeople/Documents/simplynod/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

const existing = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] ?? '0')).filter(Boolean);
const n = nums.length ? Math.max(...nums) + 1 : 1;
const filename = `screenshot-${n}${label}.png`;
const outPath = path.join(screenshotsDir, filename);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 800));
// Reveal all scroll-animated elements for full-page screenshots
await page.evaluate(() => {
  document.querySelectorAll('[da]').forEach(el => el.classList.add('vis'));
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: temporary screenshots/${filename}`);
