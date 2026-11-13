// v3 走查：首页、选品、品类档案、情报库、专题、搜索，以及旧功能回归。node build/shots5.mjs
import { chromium } from '/Users/ys/.claude/skills/ljg-card/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const file = 'file:///Users/ys/kuaitu/上架宝/index.html';
const dir = '/Users/ys/kuaitu/上架宝/build/shots5'; fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
const info = () => page.evaluate(() => ({h: document.documentElement.scrollHeight, h1: (document.querySelector('#main h1')?.innerText || '').slice(0, 40), len: document.querySelector('#main').innerText.length, ow: document.documentElement.scrollWidth > innerWidth}));
const shot = async (name, hash, full = true) => { await page.goto(file + hash); await page.waitForTimeout(350); await page.screenshot({ path: `${dir}/${name}.png`, fullPage: full }); console.log('==', name, JSON.stringify(await info())); };
await shot('a-home', '#p=home');
console.log('nav', await page.$$eval('.tabs button', b => b.map(x => x.innerText)), 'feed', await page.$$eval('.feed button span', b => b.map(x => x.innerText.slice(0, 50))));
await shot('b-select', '#p=market');
console.log('cards', await page.$$eval('.cats .cat', c => c.length));
await shot('b2-back', '#p=market&tab=back'); await shot('b3-ideas', '#p=market&tab=ideas'); await shot('b4-data', '#p=market&tab=data');
await page.click('#mk-demo'); await page.waitForTimeout(400); console.log('demo → hash', await page.evaluate(() => location.hash), JSON.stringify(await info()));
await shot('c-cat-wall', '#p=cat');
const keys = await page.evaluate(() => [...document.querySelectorAll('.cats .cat')].map(b => JSON.parse(b.dataset.nav).ck));
for (const k of keys) { await page.goto(file + '#p=cat&ck=' + k); await page.waitForTimeout(120); const i = await info(); const empty = await page.$$eval('.blk', b => b.filter(x => x.innerText.length < 40).map(x => x.id)); console.log('cat', k, i.h1, 'h=' + i.h, 'blk=' + await page.$$eval('.blk', b => b.length), empty.length ? 'EMPTY ' + empty : ''); }
await shot('c2-cat-gongkao', '#p=cat&ck=gongkao'); await shot('c3-cat-ai', '#p=cat&ck=ai'); await shot('c4-cat-phone', '#p=cat&ck=phone');
await shot('d-lib', '#p=lib');
const tps = await page.evaluate(() => [...document.querySelectorAll('.tpcs .tpc')].map(b => JSON.parse(b.dataset.nav).tp));
for (const t of tps) { await page.goto(file + '#p=lib&tab=topic&tp=' + t); await page.waitForTimeout(120); const i = await info(); console.log('topic', t, i.h1, 'len=' + i.len, i.len < 300 ? 'THIN' : ''); }
await shot('d2-topic-killed', '#p=lib&tab=topic&tp=killed'); await shot('d3-topic-talk', '#p=lib&tab=topic&tp=talk-top'); await shot('d4-topic-suffix', '#p=lib&tab=topic&tp=suffix');
for (const t of ['list', 'holders', 'slang', 'banned', 'jargon', 'chat', 'matrix', 'redline', 'words', 'src']) { await page.goto(file + '#p=lib&tab=' + t); await page.waitForTimeout(150); console.log('lib', t, JSON.stringify(await info())); }
await shot('d5-chat', '#p=lib&tab=chat'); await shot('d6-src', '#p=lib&tab=src');
// 交互
await page.goto(file + '#p=home'); await page.waitForTimeout(200);
await page.fill('#gq', '粉笔'); await page.waitForTimeout(500); console.log('search hash', await page.evaluate(() => location.hash), 'secs', await page.$$eval('#main .card h3', h => h.map(x => x.innerText.replace(/\s+/g, ' '))), 'focus', await page.evaluate(() => document.activeElement?.id));
await page.screenshot({ path: `${dir}/e-search.png`, fullPage: true });
await page.fill('#gq', '到手刀'); await page.waitForTimeout(500); console.log('search2', await page.$$eval('#main .card h3', h => h.map(x => x.innerText.replace(/\s+/g, ' '))));
await page.click('.tabs button[data-p="home"]'); await page.waitForTimeout(200); console.log('back home, gq=', await page.inputValue('#gq'), await page.evaluate(() => location.hash));
await page.fill('#home-d', '粉笔国考全套网盘秒发'); await page.click('#home-d-go'); await page.waitForTimeout(400); console.log('diag', await page.evaluate(() => location.hash), JSON.stringify(await info()));
await page.screenshot({ path: `${dir}/f-diag.png`, fullPage: true });
await page.goto(file + '#p=home'); await page.waitForTimeout(200); await page.fill('#home-q', '粉笔国考全套网盘'); await page.click('#home-go'); await page.waitForTimeout(400); console.log('pick', await page.evaluate(() => location.hash), JSON.stringify(await info()));
await page.goto(file + '#p=cat&ck=gongkao'); await page.waitForTimeout(200); await page.click('.blk .chip[data-pick]'); await page.waitForTimeout(300); console.log('chip→pick', await page.evaluate(() => location.hash).then(h => decodeURIComponent(h)));
await page.goto(file + '#p=cat&ck=gongkao'); await page.waitForTimeout(200); await page.click('.crumb button'); await page.waitForTimeout(200); console.log('crumb→', await page.evaluate(() => location.hash));
await page.goto(file + '#p=market'); await page.waitForTimeout(200); await page.click('.catbtn:nth-of-type(3)'); await page.waitForTimeout(200); console.log('filter physical', await page.evaluate(() => location.hash), await page.$$eval('.cats .cat', c => c.length));
await page.goto(file + '#p=tools&tab=redline'); await page.waitForTimeout(200); console.log('legacy tools→', await page.evaluate(() => location.hash), (await info()).h1);
await page.click('.foot button[data-go="access"]'); await page.waitForTimeout(200); console.log('access', (await info()).h1);
await page.goto(file + '#p=lib&tab=slang&ss=killed'); await page.waitForTimeout(200); console.log('slang killed rows', await page.$$eval('table.dict tbody tr', r => r.length));
// 手机与深色
await page.setViewportSize({ width: 390, height: 844 });
await shot('m-home', '#p=home'); await shot('m-cat', '#p=cat&ck=ai'); await shot('m-lib', '#p=lib');
await page.setViewportSize({ width: 1280, height: 900 }); await page.emulateMedia({ colorScheme: 'dark' }); await shot('n-dark-home', '#p=home', false);
console.log('ERRORS', errors.length, errors.slice(0, 10));
await browser.close();
