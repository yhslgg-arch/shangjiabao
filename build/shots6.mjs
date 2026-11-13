import { chromium } from '/Users/ys/.claude/skills/ljg-card/node_modules/playwright/index.mjs';
const url = 'file:///Users/ys/kuaitu/上架宝/index.html', out = '/Users/ys/kuaitu/上架宝/build/shots6/';
const b = await chromium.launch(); const pg = await b.newPage({viewport:{width:1440, height:900}});
const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
const shot = async (n, full = false) => { await pg.waitForTimeout(900); await pg.screenshot({path:out + n + '.png', fullPage:full}); };
const goto = async h => { await pg.goto(url + '#' + h); await pg.reload(); };
await goto('p=home'); await shot('01-home', true);
const titles = async () => pg.$$eval('.plan .pt', els => els.map(e => e.textContent));
for (const [n, q] of [['v', '自制国考行测刷题计划表'], ['red', '粉笔国考全套网盘'], ['p', 'iPhone 14 Pro 256G'], ['x', '小红书起号选题模板'], ['ai', 'ChatGPT Plus 代充'], ['hard', 'usdt 换汇']]) {
  await goto('p=pick&q=' + encodeURIComponent(q)); await pg.waitForTimeout(500);
  const ts = await titles(); const lv = await pg.evaluate(() => document.querySelector('.st-risk')?.className + ' | ' + document.querySelector('.st-risk b')?.textContent + ' | ' + (document.querySelector('.st-meta')?.textContent || ''));
  console.log('\n##', q, '→', lv); ts.forEach(t => console.log('  ', t.length, t));
  await shot('02-pick-' + n, true);
}
await goto('p=pick&q=' + encodeURIComponent('自制国考行测刷题计划表')); await pg.click('[data-plan="3"]'); await pg.waitForTimeout(400);
console.log('desc:\n' + await pg.$eval('#st-desc', e => e.value));
await pg.locator('#st-d').screenshot({path:out + '03-detail.png'});
for (const i of [0, 1, 2, 3, 4]) { await pg.click(`[data-plan="${i}"]`); await pg.waitForTimeout(250); await pg.locator('.gal').screenshot({path:out + `04-gal-${i}.png`}); }
await pg.click('#st-more'); await shot('05-more');
await pg.click('#ai-set'); await shot('06-ai');
await pg.keyboard.press('Escape');
for (const t of ['', 'slang', 'raw', 'redline', 'banned', 'jargon', 'chat', 'list', 'holders', 'src']) { await goto('p=lib&tab=' + t); await pg.waitForTimeout(300); const n = await pg.evaluate(() => [document.querySelectorAll('.fr').length, document.querySelector('[data-fc]')?.textContent].join(' / ')); console.log('lib', t || 'hub', n); await shot('07-lib-' + (t || 'hub')); }
await goto('p=lib&tab=slang'); await pg.fill('[data-fq]', '克劳德'); await pg.waitForTimeout(200); console.log('filter 克劳德:', await pg.$eval('[data-fc]', e => e.textContent)); await pg.click('details.tr:not([hidden]) summary'); await shot('08-slang-open');
await goto('p=lib&tab=raw&sc=searchsharp'); console.log('raw ss rows', await pg.$$eval('.fr', e => e.length));
await goto('p=market'); await shot('09-select', true); await goto('p=cat&ck=ai'); await shot('10-cat', true); await goto('p=shop'); await shot('11-shop');
await pg.setViewportSize({width:390, height:800});
for (const h of ['p=home', 'p=pick&q=' + encodeURIComponent('自制国考行测刷题计划表'), 'p=lib&tab=slang']) { await goto(h); await pg.waitForTimeout(400); console.log('mobile overflow', h.slice(0, 12), await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)); }
await shot('12-mobile-pick', true);
console.log('\nERRORS', errs.length, errs.slice(0, 8));
await b.close();
