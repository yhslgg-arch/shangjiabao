// 走查：指南词表并入后的名单、拦截词、红线、实物禁售。node build/shots7.mjs
import { chromium } from '/Users/ys/.claude/skills/ljg-card/node_modules/playwright/index.mjs';
const url = 'file:///Users/ys/kuaitu/上架宝/index.html', out = '/Users/ys/kuaitu/上架宝/build/shots7/';
const b = await chromium.launch(); const pg = await b.newPage({viewport:{width:1440, height:900}});
const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
const goto = async h => { await pg.goto(url + '#' + h); await pg.reload(); await pg.waitForTimeout(400); };
const main = () => pg.evaluate(() => document.querySelector('#main').innerText);
await goto('p=home');
console.log('records', await pg.evaluate(() => JSON.parse(document.getElementById('risk-data').textContent).records.length), 'G ids', await pg.evaluate(() => JSON.parse(document.getElementById('risk-data').textContent).records.filter(r => r.id.startsWith('G')).length), 'new_ids', await pg.evaluate(() => JSON.parse(document.getElementById('sjb-data').textContent).new_ids.length));
for (const t of ['史铁生文集pdf', 'Navicat16永久激活', '斑马英语启蒙课', '清华沙沙老师音标', '鬼谷八荒安卓直装', '许我耀眼全32集', '自制国考行测刷题计划表']) {
  await goto('p=tools&tab=matrix&q=' + encodeURIComponent(t)); await pg.waitForTimeout(300);
  console.log('lint', t, '→', await pg.evaluate(() => { const tr = document.querySelector('table tbody tr'); return tr ? tr.children[1].innerText.trim() + ' | ' + tr.children[2].innerText.replace(/\s+/g, ' ').trim() : 'no row'; }));
}
await goto('p=lib&tab=banned');
console.log('banned groups', await pg.evaluate(() => [...document.querySelectorAll('#main h3, #main summary, #main .catbtn')].map(e => e.innerText.replace(/\s+/g, ' ')).filter(t => /个$/.test(t)).join(' | ')));
const bt = await main(); console.log('banned has', ['盗版信号词', '禁售实物', '胎心仪', '永久激活', '菠菜'].map(w => w + ':' + bt.includes(w)).join(' '));
await pg.screenshot({path:out + 'banned.png', fullPage:true});
await goto('p=lib&tab=redline'); const rt = await main();
console.log('redline', rt.match(/\d+ 条/)?.[0], 'has', ['菠菜', '荷官', '上门服务', '赤安本子', '赌博 2'].map(w => w + ':' + rt.includes(w)).join(' '));
await goto('p=lib&tab=phys'); const pt = await main();
console.log('phys', pt.match(/\d+ 条/)?.[0], 'has', ['胎心仪', '婴幼儿食品', '仿真枪', '催情用品', '指南'].map(w => w + ':' + pt.includes(w)).join(' '));
await pg.screenshot({path:out + 'phys.png', fullPage:true});
await goto('p=lib&tab=slang'); console.log('slang footer', (await main()).match(/闲鱼虚拟品指南[^。]{0,80}/)?.[0]);
await goto('p=lib&tab=list'); await pg.fill('[data-fq]', '维拉多'); await pg.waitForTimeout(400); console.log('list 维拉多:', (await main()).match(/维拉多[\s\S]{0,60}/)?.[0]?.replace(/\s+/g, ' '));
for (const q of ['胎心仪', '婴幼儿食品', '美曈', '危险武器', '自制国考行测刷题计划表']) { await goto('p=pick&q=' + encodeURIComponent(q)); await pg.click('#st-go'); await pg.waitForTimeout(900); console.log('pick', q, '→', (await pg.evaluate(() => (document.querySelector('.st-risk')?.innerText || '(no risk box) ' + document.querySelector('#main').innerText.slice(0, 120)))).replace(/\s+/g, ' ').slice(0, 160)); }
await pg.screenshot({path:out + 'pick-phys.png', fullPage:true});
await goto('p=pick&q=' + encodeURIComponent('自制国考行测刷题计划表')); await pg.click('#st-go'); await pg.waitForTimeout(900); await pg.click('#st-more').catch(() => {}); console.log('studio text', (await main()).match(/\d[\d,]* 个违禁词、[\d,]+ 个被投诉过的名字/)?.[0]);
await pg.setViewportSize({width:390, height:800}); for (const h of ['p=lib&tab=banned', 'p=lib&tab=phys', 'p=lib&tab=redline']) { await goto(h); console.log('mobile overflow', h, await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)); }
console.log('\nERRORS', errs.length, errs.slice(0, 8));
await b.close();
