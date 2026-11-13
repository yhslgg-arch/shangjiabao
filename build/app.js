  // ===== 上架宝 UI：建立在雷达引擎的 lint / advise / cardHTML 之上 =====
  const X = JSON.parse(document.getElementById('sjb-data').textContent);
  const FORMS = X.forms, HOLDERS = X.holders, MATRIX = X.matrix, AMBIG = X.ambig, RESCUE = X.rescue, CAT_TOPIC = X.cat_topic, TREE = X.tree, JARGON = X.jargon, PRICE_RULES = X.price_rules;
  const NEW_IDS = new Set(X.new_ids);
  const SA = X.slang_all, KINDS = SA.kinds, LIVE_ORDER = {killed:0, watching:1, active:2, '':3};
  const LV = {red:'红灯', amber:'黄灯', green:'绿灯'};
  const RANK = {exact_name:0, exact_company:1, partial_candidate:2, disguised_candidate:3};
  const PLATFORMS = ['闲鱼', '小红书', '淘宝', '拼多多'];
  const TITLE_MAX = 30;
  const isClaim = l => /维权|起诉|投诉|律师函|版权|著作权|判决/.test(l);
  const MEANS = l => { const m = []; if (/起诉|判决/.test(l)) m.push('起诉'); if (l.includes('律师函')) m.push('律师函'); if (/投诉|维权/.test(l)) m.push('投诉'); if (l.includes('售假')) m.push('售假判定'); return m; };
  let toastTimer;
  function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 1800); }
  async function copyText(t) { try { await navigator.clipboard.writeText(t); toast('已复制'); } catch (_) { toast('复制失败，请手动选择文本'); } }
  function download(name, text, type = 'text/plain;charset=utf-8') { const blob = new Blob(['﻿' + text], {type}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('已下载 ' + name); }
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (_) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (_) { return false; } }, del(k) { try { localStorage.removeItem(k); } catch (_) {} } };
  const fresh = records.filter(r => NEW_IDS.has(r.id));
  const median = arr => { const a = arr.filter(x => Number.isFinite(x)).sort((x, y) => x - y); if (!a.length) return null; const m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
  const fmt = n => n === null || n === undefined || Number.isNaN(n) ? '<i class="nd">无数据</i>' : (Number.isInteger(n) ? num(n) : String(Math.round(n * 10) / 10));
  const today = X.today;

  // ----- 类目树 -----
  const DOMAIN_CAT = {}; TREE.forEach(c => c.domains.forEach(d => DOMAIN_CAT[d] = c.key));
  const treeOf = key => TREE.find(c => c.key === key) || null;
  function guessCat(text, hits) {
    const rec = worstRecord(hits || lint(text).hits); if (rec && DOMAIN_CAT[rec.category]) return DOMAIN_CAT[rec.category];
    const t = String(text); for (const c of TREE) if (new RegExp(c.kw, 'i').test(t)) return c.key;
    return '';
  }
  const jargonFor = (key, status, domain) => JARGON.filter(j => (j.cat === key || j.cat === '*') && (!status || j.status === status) && (domain === undefined || !X.jargon_domains[j.word] || X.jargon_domains[j.word].includes(domain)));

  // ----- 维权方统计（只用公开字段） -----
  const holderStats = (() => {
    const m = new Map();
    const get = c => { if (!m.has(c)) m.set(c, {name:c, count:0, fresh:0, means:new Set(), cats:new Map(), ids:[]}); return m.get(c); };
    for (const r of records) {
      for (const c of r.companies) { const s = get(c); s.count++; s.ids.push(r.id); if (NEW_IDS.has(r.id)) s.fresh++; r.labels.forEach(l => MEANS(l).forEach(x => s.means.add(x))); if (r.registrations.length) s.means.add('作品登记'); s.cats.set(r.category, (s.cats.get(r.category) || 0) + 1); }
      if (r.object_type === '公司名称') { const s = get(r.name); r.labels.forEach(l => MEANS(l).forEach(x => s.means.add(x))); if (NEW_IDS.has(r.id)) s.fresh = Math.max(s.fresh, 1); }
    }
    return m;
  })();
  const holderType = c => (HOLDERS[c] || {}).type || '权利人（待建档）';
  const holderNote = c => (HOLDERS[c] || {}).note || '';
  function holderHTML(c, extra = '') {
    const s = holderStats.get(c) || {count:0, fresh:0, means:new Set(), cats:new Map()};
    const topCat = [...s.cats.entries()].sort((a, b) => b[1] - a[1])[0];
    return `<div class="holder"><span class="hn">${esc(c)}</span><span class="ht">${esc(holderType(c))}${holderNote(c) ? ' · ' + esc(holderNote(c)) : ''}</span>
      <div class="hm">${[...s.means].map(x => `<span class="b risk">${esc(x)}</span>`).join('') || '<span class="b">手段待记录</span>'}<span class="b">关联 ${s.count} 条</span>${s.fresh ? `<span class="b reg">本版新进 ${s.fresh}</span>` : ''}${topCat ? `<span class="b slate">${esc(topCat[0])}</span>` : ''}${extra}</div></div>`;
  }

  // ----- 状态与 hash -----
  const PAGES = ['home', 'market', 'pick', 'shop', 'cat', 'lib', 'tools', 'access', 'search'];
  const defaults = {p:'home', q:'', platform:'闲鱼', step:1, form:-1, topic:'', ti:0, cat:'', mc:'', tab:'', ev:'下架通知', co:'', rq:'', lc:'', lq:'', pal:0, sk:'virtual', sc:'', ss:'', sq:'', sl:'', ck:'', tp:'', gq:'', fk:'', fs:''};
  let state = {...defaults};
  const mem = {shopRows:[], shopSub:false, offSel:new Set(), desc:{key:'', text:''}, rescuePath:'', shopText:'', wordText:'', wtText:'', wtRows:null, ctText:'', ctRows:null, words:{key:'', add:[], drop:[]}, fill:{key:'', 交付:'', 时效:'', price:''}, marketText:'', importMsg:''};
  mem.market = store.get('sjb-market', {groups:[]});
  function readHash() {
    const p = new URLSearchParams(location.hash.slice(1)); state = {...defaults};
    if (PAGES.includes(p.get('p'))) state.p = p.get('p');
    for (const k of ['q', 'topic', 'co', 'rq', 'lq', 'tab', 'sc', 'sq', 'sl', 'ck', 'tp', 'gq', 'fk', 'fs']) state[k] = (p.get(k) || '').slice(0, 300);
    if (KINDS[p.get('sk')]) state.sk = p.get('sk');
    if (['killed', 'watching', 'active', 'none'].includes(p.get('ss'))) state.ss = p.get('ss');
    if (PLATFORMS.includes(p.get('platform'))) state.platform = p.get('platform');
    for (const k of ['cat', 'lc']) if (categories.includes(p.get(k))) state[k] = p.get(k);
    if (treeOf(p.get('mc'))) state.mc = p.get('mc');
    if (RESCUE[p.get('ev')]) state.ev = p.get('ev');
    for (const k of ['step', 'form', 'ti', 'pal']) { const n = Number(p.get(k)); if (p.has(k) && Number.isInteger(n)) state[k] = n; }
    state.step = Math.min(5, Math.max(1, state.step));
    if (state.p === 'tools') { state.p = 'lib'; if (!state.tab) state.tab = 'words'; }
  }
  function saveHash() {
    const p = new URLSearchParams(); for (const k of Object.keys(defaults)) if (state[k] !== defaults[k]) p.set(k, String(state[k]));
    const h = p.toString(); try { history.replaceState(null, '', location.pathname + (h ? '#' + h : '')); } catch (_) { location.replace('#' + h); }
  }
  function go(ch, scroll = false) { state = {...state, ...ch}; if (state.p === 'tools') { state.p = 'lib'; if (!state.tab) state.tab = 'words'; } render(); if (scroll) window.scrollTo({top:0, behavior:'instant'}); }

  // ----- 市场数据：导入、归类、统计 -----
  const toNum = v => { if (v === null || v === undefined) return null; const n = parseFloat(String(v).replace(/[^\d.]/g, '')); return Number.isFinite(n) ? n : null; };
  function normItem(o) {
    if (typeof o === 'string') return {title:o.trim()};
    const it = o['商品信息'] || o;
    return {title:String(it.title || it['商品标题'] || it.name || '').trim(), price:toNum(it.price ?? it['当前售价'] ?? it['商品价格']), wants:toNum(it.wants ?? it['“想要”人数'] ?? it['想要人数'] ?? it['想要']), views:toNum(it.views ?? it['浏览量']), link:it.link || it['商品链接'] || '', published:it.published || it['发布时间'] || '', seller:it.seller || it['卖家昵称'] || ''};
  }
  function parseCSV(text) {
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) { const ch = text[i]; if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; } else if (ch === '"') q = true; else if (ch === ',') { row.push(cell); cell = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; } else cell += ch; }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim()));
  }
  function parseImport(raw, name = '') {
    const text = String(raw).replace(/^﻿/, '').trim(); if (!text) return [];
    const groupBy = (items, src) => { const m = new Map(); for (const it of items) { if (!it.title) continue; const k = it.keyword || ''; if (!m.has(k)) m.set(k, {source:src, keyword:k, captured_at:it.captured_at || '', items:[]}); m.get(k).items.push(it); } return [...m.values()]; };
    if (/^[\[{]/.test(text)) {
      try {
        const j = JSON.parse(text);
        if (Array.isArray(j)) return groupBy(j.map(o => ({...normItem(o), keyword:o['搜索关键字'] || '', captured_at:o['爬取时间'] || ''})), 'json');
        if (j.items) return [{source:j.source || 'json', keyword:j.keyword || '', page:j.page || '', captured_at:j.captured_at || '', items:j.items.map(normItem).filter(i => i.title)}];
        if (j.listings) return [{source:'executor', keyword:'', page:'mine', captured_at:j.snapshot_at || '', items:j.listings.map(normItem).filter(i => i.title)}];
      } catch (_) {}
      if (text.includes('\n{')) { const items = []; for (const line of text.split('\n')) { try { const o = JSON.parse(line); items.push({...normItem(o), keyword:o['搜索关键字'] || '', captured_at:o['爬取时间'] || ''}); } catch (_) {} } if (items.length) return groupBy(items, 'ai-goofish-monitor jsonl'); }
    }
    const first = text.split('\n')[0];
    if (/标题/.test(first) && first.includes(',')) {
      const rows = parseCSV(text); const h = rows[0].map(s => s.trim()); const idx = re => h.findIndex(c => re.test(c));
      const iT = idx(/商品标题|^标题$/), iP = idx(/当前售价|价格/), iK = idx(/搜索关键字|关键词/), iD = idx(/发布时间/), iL = idx(/商品链接|链接/), iS = idx(/卖家昵称|卖家/), iW = idx(/想要/), iV = idx(/浏览/);
      const items = rows.slice(1).map(r => ({title:(r[iT] || '').trim(), price:iP >= 0 ? toNum(r[iP]) : null, keyword:iK >= 0 ? r[iK] : '', published:iD >= 0 ? r[iD] : '', link:iL >= 0 ? r[iL] : '', seller:iS >= 0 ? r[iS] : '', wants:iW >= 0 ? toNum(r[iW]) : null, views:iV >= 0 ? toNum(r[iV]) : null}));
      return groupBy(items, name.endsWith('.csv') || /任务名称/.test(first) ? 'ai-goofish-monitor csv' : 'csv');
    }
    const lines = unique(text.split(/\n+/).map(s => s.trim()).filter(Boolean)).slice(0, 1000);
    return [{source:'lines', keyword:'', page:'', captured_at:'', items:lines.map(l => { const m = l.match(/^(.*?)[\t,]\s*[¥￥]?\s*([\d.]+)\s*$/); return m ? {title:m[1].trim(), price:toNum(m[2])} : {title:l}; })}];
  }
  function addMarket(groups, catOverride) {
    const now = new Date().toISOString();
    for (const g of groups) { if (!g.items.length) continue; const sample = g.keyword || g.items.slice(0, 20).map(i => i.title).join(' '); g.id = 'g' + Math.random().toString(36).slice(2, 8); g.cat = catOverride || guessCat(sample) || ''; g.added_at = now; if (!g.captured_at) g.captured_at = g.items.find(i => i.captured_at)?.captured_at || now; g.items = g.items.slice(0, 2000).map(i => ({title:i.title, price:i.price ?? null, wants:i.wants ?? null, views:i.views ?? null, link:i.link || '', published:i.published || '', seller:i.seller || ''})); mem.market.groups.push(g); }
    mem.market.groups = mem.market.groups.slice(-60);
    if (!store.set('sjb-market', mem.market)) toast('浏览器不允许保存，刷新后数据会丢');
  }
  const daysAgo = (s, ref) => { if (!s) return null; const m = String(s).match(/(\d+)\s*(分钟|小时|天)前/); if (m) return m[2] === '天' ? +m[1] : 0; const d = new Date(String(s).replace(/-/g, '/')); if (Number.isNaN(d.getTime())) return null; return Math.max(0, (new Date(ref || Date.now()) - d) / 86400000); };
  function marketStats(key) {
    const gs = mem.market.groups.filter(g => g.cat === key && g.page !== 'mine'); const items = gs.flatMap(g => g.items);
    if (!items.length) return {n:0, groups:gs};
    const wants = items.map(i => i.wants).filter(Number.isFinite), prices = items.map(i => i.price).filter(Number.isFinite);
    const ages = items.map(i => daysAgo(i.published, gs[0].captured_at)).filter(x => x !== null);
    const lints = items.slice(0, 400).map(i => lint(i.title).level); const red = lints.filter(l => l === 'red').length, amber = lints.filter(l => l === 'amber').length;
    return {n:items.length, groups:gs, keywords:unique(gs.map(g => g.keyword).filter(Boolean)), wantsMed:wants.length ? median(wants) : null, wantsN:wants.length, priceMed:prices.length ? median(prices) : null, priceN:prices.length, new7:ages.length ? ages.filter(a => a <= 7).length : null, agesN:ages.length, redPct:Math.round(red / lints.length * 100), amberPct:Math.round(amber / lints.length * 100), sources:unique(gs.map(g => g.source)), latest:gs.map(g => g.captured_at).sort().pop(), enough:items.length >= 50};
  }
  function riskStats(c) {
    const rs = records.filter(r => c.domains.includes(r.category));
    const hc = new Map(); rs.forEach(r => r.companies.forEach(x => hc.set(x, (hc.get(x) || 0) + 1)));
    const holders = [...hc.entries()].sort((a, b) => b[1] - a[1]);
    const sl = SLANG.terms.filter(t => c.slang.includes(t.category));
    return {n:rs.length, fresh:rs.filter(r => NEW_IDS.has(r.id)).length, claim:rs.filter(r => r.labels.some(isClaim)).length, holders, holderN:hc.size, slangKilled:sl.filter(t => t.liveness === 'killed').length, slangWatch:sl.filter(t => t.liveness === 'watching').length, slangN:sl.length, records:rs};
  }
  function scores() {
    const rows = TREE.map(c => { const r = riskStats(c), m = marketStats(c.key); const raw = Math.log1p(r.n) * 0.5 + (r.n ? r.fresh / r.n : 0) * 6 + (r.n ? r.claim / r.n : 0) * 3 + Math.log1p(r.slangKilled) * 0.8; const opp = m.n ? Math.log1p(m.n) * (1 + Math.log1p(m.wantsMed || 0)) : null; return {c, r, m, raw, opp}; });
    const maxR = Math.max(...rows.map(x => x.raw), 0.001), maxO = Math.max(...rows.map(x => x.opp || 0), 0.001);
    rows.forEach(x => { x.risk = Math.round(x.raw / maxR * 100); x.oppS = x.opp === null ? null : Math.round(x.opp / maxO * 100); });
    return rows;
  }

  // ----- 分析：一个品名得到的全部东西 -----
  function worstRecord(hits) { let w = null; for (const h of hits) if (h.kind === 'copyright' && (!w || RANK[h.match_type] < RANK[w.match_type])) w = h; return w ? w.record : null; }
  function deriveTopic(text, hits) {
    let t = String(text).normalize('NFKC');
    for (const h of [...hits].sort((a, b) => b.start - a.start)) t = t.slice(0, h.start) + ' ' + t.slice(h.start + h.fragment.length);
    for (const f of FILLERS) t = t.split(f).join(' ');
    t = t.replace(/[【】\[\]（）()《》“”"'!！?？,，。.、:：;；|/\\+＋\-—~·]/g, ' ').replace(/(秒发|网盘|链接|永久|更新|无水印|安装包|合集|全集|音频|视频|pdf|mp3|mp4|最新|高清|数字版|电子版|扫描版|打包|文件|中英双语)/gi, ' ');
    return t.split(/\s+/).filter(w => w.length >= 2 && !/^\d+$/.test(w) && !/^(册|套|张|份|版|期|年)$/.test(w)).join(' ').trim();
  }
  function analyze(q) {
    const res = lint(q);
    const copyHits = res.hits.filter(h => h.kind === 'copyright');
    const rec = worstRecord(res.hits);
    const category = rec ? rec.category : state.cat;
    const forms = FORMS[category] || FORMS._default;
    const derived = deriveTopic(q, res.hits); const guessed = !state.topic && !derived;
    const topic = state.topic || derived || CAT_TOPIC[category] || CAT_TOPIC._default;
    let fi = state.form; if (fi < 0 || fi >= forms.length || forms[fi].level === 'red') fi = -1;
    const holders = unique([...copyHits.flatMap(h => h.record.companies), ...copyHits.filter(h => h.record.object_type === '公司名称').map(h => h.record.name)]);
    const ambig = Object.keys(AMBIG).filter(k => copyHits.some(h => h.record.name === k || h.matched_term === k || h.fragment.includes(k)));
    const platKey = (RULES.categories[category] || RULES.categories._default).platform;
    const cell = (MATRIX[platKey] || MATRIX.course).cells[state.platform] || {};
    const treeKey = (category && DOMAIN_CAT[category]) || guessCat(q, res.hits) || '';
    return {q, res, copyHits, rec, category, forms, topic, guessed, fi, form:fi >= 0 ? forms[fi] : null, holders, ambig, platKey, cell, treeKey, tree:treeOf(treeKey)};
  }
  const isService = form => /服务|答疑|陪跑|咨询|陪练|批改|诊断|协助|点评|排查|代运营/.test(form.name);
  const formKind = form => isService(form) ? 'service' : /模板|清单|工具表|计划|排期|打卡/.test(form.name) ? 'template' : /教程|讲解|自录/.test(form.name) ? 'tutorial' : /原创|作品|素材|乐谱|周边/.test(form.name) ? 'original' : 'notes';
  // 关键词池：行话（可进标题）+ 用户贴进来的词 + 导入的同类目竞品标题拆词
  function tokenizeLine(line) {
    const out = [];
    for (const piece of line.split(/[\s,，、|/+＋\-—:：;；()（）【】\[\]《》"“”!！?？.。·~]+/).filter(Boolean)) {
      const r = lint(piece); const spans = r.hits.map(h => [h.start, h.start + h.fragment.length]).sort((a, b) => a[0] - b[0]);
      if (!spans.length) { out.push(piece); continue; }
      let pos = 0; for (const [s, e] of spans) { if (s > pos) out.push(piece.slice(pos, s)); out.push(piece.slice(s, e)); pos = e; } if (pos < piece.length) out.push(piece.slice(pos));
    }
    return out.map(t => t.trim()).filter(t => t.length >= 2 && t.length <= 8 && !/^\d+$/.test(t));
  }
  function classifyWord(t) {
    const r = lint(t); const h = r.hits[0];
    if (FILLERS.includes(t)) return {status:'filler', why:'填充词'};
    if (!h) return {status:'ok', why:''};
    if (h.kind === 'copyright') return {status:'out', why:(h.match_type === 'disguised_candidate' ? '伪装写法：' : '版权名：') + h.record.name};
    if (h.kind === 'slang') return {status:'out', why:'暗语：' + h.name};
    return {status:h.level === 'red' ? 'out' : 'warn', why:h.group_name};
  }
  function wordPool(a) {
    const count = new Map(), raw = new Map(), src = new Map();
    const feed = (line, s) => { for (const t of tokenizeLine(line)) { const k = norm(t); count.set(k, (count.get(k) || 0) + 1); if (!raw.has(k)) raw.set(k, t); src.set(k, s); } };
    (mem.wordText || '').split(/\n+/).forEach(l => feed(l, 'you'));
    const imported = mem.market.groups.filter(g => g.cat === a.treeKey && g.page !== 'mine').flatMap(g => g.items).slice(0, 600);
    imported.forEach(i => feed(i.title, 'market'));
    const rows = [...count.entries()].map(([k, c]) => ({t:raw.get(k), c, src:src.get(k), ...classifyWord(raw.get(k))})).sort((a, b) => b.c - a.c);
    const topicNorm = norm(a.topic);
    return {ok:rows.filter(r => r.status === 'ok' && !topicNorm.includes(norm(r.t))).slice(0, 24), out:rows.filter(r => r.status === 'out' || r.status === 'warn').slice(0, 24), importedN:imported.length};
  }
  function autoWords(a) {
    const kind = a.form ? formKind(a.form) : 'notes'; const fit = new Set(X.jargon_kinds[kind] || []);
    const ok = jargonFor(a.treeKey, 'ok', a.category || '').filter(j => fit.has(j.word) && !norm(a.topic).includes(norm(j.word)) && !(a.form && a.form.name.includes(j.word)));
    return unique([...ok.filter(j => j.cat !== '*'), ...ok.filter(j => j.cat === '*')].map(j => j.word)).slice(0, 4);
  }
  function chosenWords(a) {
    const key = [a.q, a.fi, a.topic].join('|'); if (mem.words.key !== key) mem.words = {key, add:[], drop:[]};
    return unique([...mem.words.add, ...autoWords(a).filter(w => !mem.words.drop.includes(w))]);
  }
  function buildTitle(tpl, topic, words) {
    let title = tpl.replace('{主题}', topic).replace(/[，,]\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (title.length > TITLE_MAX) title = title.slice(0, TITLE_MAX).trim();
    const used = []; let have = words.filter(w => title.includes(w)).length;
    const overlaps = w => { for (let i = 0; i + 2 <= w.length; i++) if (title.includes(w.slice(i, i + 2))) return true; return false; };
    for (const w of words) { if (have >= 2) break; if (title.includes(w) || overlaps(w)) continue; if ((title + ' ' + w).length > TITLE_MAX) continue; title = title + ' ' + w; used.push(w); have++; }
    return {title, used};
  }
  function genTitles(a) {
    const words = chosenWords(a);
    return (a.form.titles || []).map(tpl => { const {title, used} = buildTitle(tpl, a.topic, words); const r = lint(title); return {title, used, level:r.level, reasons:r.reasons, len:title.length}; });
  }
  function fillFor(a) {
    const key = [a.q, a.fi].join('|'); if (mem.fill.key !== key) { const svc = a.form && isService(a.form); mem.fill = {key, 交付:svc ? '下单后 24 小时内联系你，按约定时间进行' : '下单后发送可编辑文件（PDF / Excel / 图片）', 时效:svc ? '服务期内随时答疑' : '一般当天送达，最晚 24 小时', price:''}; }
    return mem.fill;
  }
  function genDesc(a, title) {
    const form = a.form, topic = a.topic, svc = isService(form), fill = fillFor(a);
    const care = jargonFor(a.treeKey, 'care').slice(0, 3).map(j => j.word);
    return [title, '', `商品介绍：围绕「${topic}」的${form.name}，${svc ? '由我本人提供，按次或按周交付' : '由我本人整理制作'}。适合刚开始${topic}、想少走弯路的人。`, '',
      '包含：', `1. （写第一项，例如：${topic}要点清单 1 份，约 20 页）`, '2. （写第二项，数量与形式）', '3. （写第三项）', '',
      `不包含：不含任何第三方课程、第三方文件或他人课件，不提供任何云端链接，所有内容为本人${svc ? '服务' : '自制'}。`, '',
      `交付：${fill.交付}，${fill.时效}。${care.length ? `交付格式：（如有，写明 ${care.join(' / ')} 等具体格式与数量）` : ''}`, `售后：${svc ? '服务期内免费答疑。' : '7 天内答疑；内容与描述不符可全额退。'}不承诺任何考试、收益或疗效结果。`, '',
      `说明：${form.note}`].join('\n');
  }
  function priceFor(a) {
    const rule = PRICE_RULES[formKind(a.form)]; const m = marketStats(a.treeKey);
    return {rule, market:m.priceN >= 20 ? {med:m.priceMed, n:m.priceN, latest:m.latest} : null};
  }
  const fillTpl = (s, a) => { const fill = fillFor(a); return s.replace(/\{主题\}/g, a.topic).replace(/\{形态\}/g, a.form.name).replace(/\{交付\}/g, fill.交付).replace(/\{时效\}/g, fill.时效); };
  const IMG_RULES = ['首图只放自制内容截图或自制封面，不出现任何机构名、讲师名、作品名、官方 LOGO。', '图上文字不用「全套」「最新版」「官方」「网盘」「秒发」。', '不放网盘界面、目录树、他人课件截图。', '详情图与实际交付一致，不借用别人的效果图。'];

  // ----- 画布：主图与详情长图 -----
  const PALETTES = [['#c0392b', '#fbe9e7', '#191817'], ['#0f8a63', '#e4f4ec', '#191817'], ['#2f5d8a', '#e6edf3', '#191817'], ['#c07a0a', '#fdf0d5', '#191817']];
  function wrapText(ctx, text, maxW) { const out = []; let line = ''; for (const ch of String(text)) { if (ch === '\n') { out.push(line); line = ''; continue; } if (ctx.measureText(line + ch).width > maxW && line) { out.push(line); line = ch; } else line += ch; } if (line) out.push(line); return out; }
  function drawCover(cv, d) {
    const [acc, soft, ink] = PALETTES[d.pal % PALETTES.length]; const ctx = cv.getContext('2d'); const W = cv.width = 800, H = cv.height = 800;
    ctx.fillStyle = soft; ctx.fillRect(0, 0, W, H); ctx.fillStyle = acc; ctx.fillRect(0, 0, W, 18); ctx.fillRect(0, H - 150, W, 150);
    ctx.fillStyle = acc; ctx.font = '600 26px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText(d.badge, 56, 90);
    ctx.fillStyle = ink; ctx.font = '800 60px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; let y = 190; for (const l of wrapText(ctx, d.title, W - 112).slice(0, 4)) { ctx.fillText(l, 56, y); y += 76; }
    ctx.font = '500 28px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillStyle = '#45433d'; y = Math.max(y + 10, 500); for (const b of d.bullets.slice(0, 3)) { ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(70, y - 10, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#45433d'; ctx.fillText(b, 92, y); y += 46; }
    ctx.fillStyle = '#fff'; ctx.font = '600 24px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText(d.foot, 56, H - 80); ctx.font = '400 20px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText('内容为本人自制 · 不含任何第三方课程与文件', 56, H - 42);
  }
  function drawDetail(cv, d) {
    const [acc, soft, ink] = PALETTES[d.pal % PALETTES.length]; const ctx = cv.getContext('2d'); const W = cv.width = 800, H = cv.height = 1500;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = acc; ctx.fillRect(0, 0, W, 210);
    ctx.fillStyle = '#fff'; ctx.font = '800 44px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; let y = 90; for (const l of wrapText(ctx, d.title, W - 96).slice(0, 2)) { ctx.fillText(l, 48, y); y += 54; }
    ctx.font = '500 22px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText(d.badge, 48, 180);
    const section = (t, lines) => { ctx.fillStyle = soft; ctx.fillRect(48, y, W - 96, 44); ctx.fillStyle = acc; ctx.font = '800 24px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText(t, 64, y + 31); y += 70; ctx.fillStyle = ink; ctx.font = '400 24px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; for (const l of lines) for (const w of wrapText(ctx, l, W - 128)) { ctx.fillText(w, 64, y); y += 36; } y += 26; };
    y = 270; section('你会拿到', d.includes); section('不包含', ['任何第三方课程、第三方文件或他人课件', '任何云端链接；所有内容为本人自制或本人服务']); section('交付与售后', d.delivery); section('常见问题', d.faq);
    ctx.fillStyle = '#7a776f'; ctx.font = '400 18px -apple-system, PingFang SC, Microsoft YaHei, sans-serif'; ctx.fillText('详情图与实际交付一致 · 不承诺任何考试、收益或疗效结果', 48, H - 36);
  }
  function kitData(a, chosen) {
    const fill = fillFor(a); const includes = mem.desc.text.split('\n').filter(l => /^\d\.\s/.test(l)).map(l => l.replace(/^\d\.\s*/, '').replace(/^（|）$/g, ''));
    return {pal:state.pal, title:chosen.title, badge:`${a.form.name} · 自制`, bullets:includes.length ? includes : ['写第一项', '写第二项', '写第三项'], foot:`${a.topic} · ${isService(a.form) ? '服务型交付' : '自制内容'}`, includes:includes.length ? includes : ['（在说明里填「包含」三项，这里自动同步）'], delivery:[`交付：${fill.交付}，${fill.时效}`, `售后：${isService(a.form) ? '服务期内免费答疑' : '7 天内答疑，内容与描述不符可全额退'}`], faq:X.faq.slice(0, 3).map(([q, ans]) => `Q：${q}  A：${fillTpl(ans, a)}`)};
  }
  function paintKit() { const a = analyze(state.q.trim()); if (!a.form) return; const titles = genTitles(a); const chosen = titles[Math.min(state.ti, titles.length - 1)]; if (!chosen) return; const d = kitData(a, chosen); const c1 = $('cv-cover'), c2 = $('cv-detail'); if (c1) drawCover(c1, d); if (c2) drawDetail(c2, d); }
  function downloadCanvas(id, name) { const cv = $(id); if (!cv) return; cv.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('已下载 ' + name); }, 'image/png'); }

  function hitRow(h) {
    let v, cls;
    if (h.kind === 'copyright') { v = `${MODE_NAMES[h.match_type]}：${esc(h.record.name)}<div class="mute xs">${esc(h.record.category)} · ${esc(h.record.labels.join('、') || '待核对')}${NEW_IDS.has(h.record.id) ? ' · <span class="fresh">本版新进</span>' : ''}</div>`; cls = h.match_type.startsWith('exact') ? 'red' : 'amber'; }
    else if (h.kind === 'slang') { v = `${LIVE[h.liveness] || '暗语'}（${RISKN[h.risk] || '未分级'}）：${esc(h.name)}`; cls = (h.liveness === 'killed' || h.risk === 'danger' || h.policy === 'grey') ? 'red' : 'amber'; }
    else { v = esc(h.group_name); cls = h.level; }
    return `<tr><td><span class="frag ${cls}">${esc(h.fragment)}</span></td><td>${v}</td><td class="adv">${esc(h.advice)}</td></tr>`;
  }
  const hitsTable = hits => hits.length ? `<div class="tbl"><table><thead><tr><th>片段</th><th>判定</th><th>建议</th></tr></thead><tbody>${hits.map(hitRow).join('')}</tbody></table></div>` : '';
  const ambigHTML = keys => keys.map(k => `<div class="ambig"><b>疑似误判场景：「${esc(k)}」也是通用词</b><br>通用义：${esc(AMBIG[k].通用义)}<br>怎么判：${esc(AMBIG[k].判断)}<br>如果你卖的是通用义而被判了：${esc(AMBIG[k].申诉要点)}。可直接去「诊断 → 有品被处理了」。</div>`).join('');
  const srcTag = (s, d) => `<span class="src">${esc(s)}${d ? ' · ' + esc(String(d).slice(0, 10)) : ''}</span>`;

  // ================= 找方向：按类目 =================
  function importPanel(ctx) {
    return `<section class="card"><h3>导入市场数据<span class="lab">三条来路 · 都是你自己账号看到的</span></h3>
      <div class="drop" id="drop">把 CSV / JSON / JSONL 文件拖到这里，或在下面粘贴。<br><span class="xs">书签脚本复制的内容、ai-goofish-monitor 导出的 CSV、一行一个标题，都认。</span></div>
      <textarea id="mk-text" rows="4" placeholder="粘贴到这里……" style="margin-top:10px">${esc(mem.marketText || '')}</textarea>
      <div class="hs" style="margin-top:10px"><label class="fld"><span>归到类目（留空自动判断）</span><select id="mk-cat"><option value="">自动判断</option>${TREE.map(c => `<option value="${c.key}">${esc(c.name)}</option>`).join('')}</select></label><button class="btn acc" id="mk-go">导入</button><button class="btn" id="mk-demo">载入演示数据</button><span class="sp"></span><button class="btn ghost" id="mk-bm">书签脚本怎么用</button></div>
      ${mem.importMsg ? `<p class="cd-note">${esc(mem.importMsg)}</p>` : ''}
      ${mem.market.groups.length ? `<div class="tbl" style="margin-top:12px"><table><thead><tr><th>来源</th><th>关键词 / 页面</th><th>条数</th><th>抓取时间</th><th>类目</th><th></th></tr></thead><tbody>${mem.market.groups.slice().reverse().map(g => `<tr><td class="xs">${esc(g.source)}</td><td>${esc(g.keyword || (g.page === 'mine' ? '我的在售' : '（无关键词）'))}</td><td class="mono">${g.items.length}</td><td class="xs mute">${esc(String(g.captured_at).slice(0, 16).replace('T', ' '))}</td><td><select data-gcat="${g.id}">${[['', '未归类'], ...TREE.map(c => [c.key, c.name])].map(([k, n]) => `<option value="${k}"${g.cat === k ? ' selected' : ''}>${n}</option>`).join('')}</select></td><td><button class="btn sm" data-gdel="${g.id}">删</button></td></tr>`).join('')}</tbody></table></div><p class="cd-note">数据只存在这台电脑的浏览器里。<button class="link xs" id="mk-clear">全部清除</button></p>` : ''}
      <details class="fold" style="margin-top:10px" ${ctx === 'bm' ? 'open' : ''}><summary>书签脚本：零安装，一分钟拿到一页搜索结果${icon('chevron')}</summary><div class="fold-body"><ol class="skel"><li><b>1</b>电脑浏览器（Chrome / Edge）收藏栏右键 → 添加网页，名称填「上架宝读取」，网址粘贴下面这段代码。</li><li><b>2</b>打开闲鱼网页版，登录，搜一个关键词（例如「国考 笔记」），往下滚几屏让更多商品加载出来。</li><li><b>3</b>点收藏栏的「上架宝读取」。它只读你眼前这页的标题、价格、想要数、链接，复制到剪贴板，不发给任何人。</li><li><b>4</b>回到这里粘贴、导入。「我发布的」页面同样能读，读出来的会归到体检店铺。</li></ol><div class="row" style="margin-top:8px"><button class="btn sm dark" id="bm-copy">${icon('copy')}复制书签代码</button><button class="btn sm" id="bm-dl">${icon('down')}下载 书签脚本.js</button></div><p class="cd-note">老实说：闲鱼页面结构会变，这段脚本按通用方式找商品卡片，第一次用请核对读到的条数和字段。读不到的字段留空，不编数。</p></div></details></section>`;
  }
  function renderMarket() {
    const rows = scores(); const withData = rows.filter(x => x.m.n);
    const sel = treeOf(state.mc);
    const head = `<section class="hero anim"><h1 class="hero-t">找方向：按类目，机会 × 风险</h1><p class="hero-p">风险面来自名单，每个类目都有。机会面（在卖量、想要数、价格、新上）来自你导入的闲鱼搜索数据，没导入就显示「无数据」，不用估算值糊你。怎么参考：先看风险低、有数据且想要数中位高的类目，再进类目看谁在维权、竞品标题在踩什么雷，最后带着主题去上新品。</p>
      <div class="row"><span class="b">名单 ${esc(updatedAt)}</span><span class="b">暗语快照 ${esc(X.slang_version)}</span><span class="b">违禁词表 ${esc(X.banned_version)}</span>${withData.length ? `<span class="b reg">市场数据 ${mem.market.groups.length} 组 · ${withData.length} 个类目有数据</span>` : '<span class="b">市场数据：未导入</span>'}</div></section>`;
    const quad = withData.length ? `<section class="card anim"><h3>四象限<span class="lab">横轴风险（名单） · 纵轴机会（导入数据）</span></h3><div class="quad"><span class="vl"></span><span class="hl"></span><span class="qn" style="left:0;top:0">风险低 · 机会高：优先</span><span class="qn" style="right:0;top:0">风险高 · 机会高：只做服务型形态</span><span class="qn" style="left:0;bottom:0">风险低 · 机会低：练手</span><span class="qn" style="right:0;bottom:0">风险高 · 机会低：不碰</span>${withData.map(x => `<button class="pt ${x.risk < 50 && x.oppS >= 50 ? 'good' : x.risk >= 50 ? 'bad' : ''}" style="left:${8 + x.risk * 0.84}%;top:${92 - x.oppS * 0.84}%" data-mc="${x.c.key}">${esc(x.c.name)}${x.m.enough ? '' : ' *'}</button>`).join('')}</div><p class="cd-note">带 * 的样本不足 50 条，位置仅供参考。没有导入数据的类目不画点。</p></section>` : `<section class="card anim"><h3>四象限<span class="lab">需要导入数据</span></h3><p class="sm mute">机会面没有数据就画不出四象限。下面的类目卡先给你风险面；导入任一类目的搜索结果后，这里会出现它的位置。</p></section>`;
    const cards = `<div class="cats anim" style="margin-top:16px">${rows.sort((a, b) => a.risk - b.risk).map(({c, r, m, risk, oppS}) => `<button class="cat${sel && sel.key === c.key ? ' on' : ''}" data-mc="${c.key}"><span class="tt">${esc(c.name)}</span><span class="hint">${esc(c.publish_hint)} · 风险 ${risk}${oppS !== null ? ` · 机会 ${oppS}` : ''}</span>
      <div class="nums"><div><b>${num(r.n)}</b>名单条数</div><div><b class="${r.fresh ? 'fresh' : ''}">${r.fresh ? '+' + r.fresh : '0'}</b>本版新进</div><div><b>${r.holderN}</b>维权方</div><div><b>${r.slangKilled}</b>已拦截暗语</div>
      ${m.n ? `<div><b>${num(m.n)}</b>在卖（抓到）</div><div class="${m.wantsMed === null ? 'nd' : ''}"><b>${fmt(m.wantsMed)}</b>想要数中位</div><div class="${m.priceMed === null ? 'nd' : ''}"><b>${m.priceMed === null ? '无数据' : '¥' + fmt(m.priceMed)}</b>价格中位</div><div class="${m.new7 === null ? 'nd' : ''}"><b>${fmt(m.new7)}</b>近 7 天新上</div>` : '<div class="nd span">机会面：还没导入这个类目的搜索数据</div>'}</div>
      <span class="hint">${m.n ? srcTag(m.sources.join(' / '), m.latest) + (m.enough ? '' : ' 样本不足 50，不出结论') : '风险面：名单 ' + esc(updatedAt)}</span></button>`).join('')}</div>`;
    let detail = '';
    if (sel) {
      const r = riskStats(sel), m = marketStats(sel.key); const okWords = jargonFor(sel.key, 'ok').filter(j => j.cat !== '*').slice(0, 12);
      const freshList = r.records.filter(x => NEW_IDS.has(x.id)).slice(0, 40);
      const sl = SLANG.terms.filter(t => sel.slang.includes(t.category) && t.liveness);
      const sample = m.n ? m.groups.flatMap(g => g.items).slice(0, 60).map(i => ({...i, r:lint(i.title)})) : [];
      detail = `<section class="card mt anim"><h3>${esc(sel.name)}<span class="lab">怎么参考这个类目</span><button class="chip rm" data-mc="">收起 ${icon('close')}</button></h3><p class="sm" style="margin:0 0 12px">${esc(sel.note)}</p>
        <div class="grid"><div class="col"><section class="card"><h3>风险面<span class="lab">名单 ${esc(updatedAt)}</span></h3><div class="tiles" style="grid-template-columns:repeat(4,1fr);margin-bottom:10px"><div class="tile"><b>${num(r.n)}</b><span>名单条数</span></div><div class="tile green"><b>+${r.fresh}</b><span>本版新进</span></div><div class="tile red"><b>${r.claim}</b><span>带维权标签</span></div><div class="tile"><b>${r.slangKilled}/${r.slangN}</b><span>暗语已拦截</span></div></div>
          <p class="lab" style="margin:0 0 6px">谁在维权（关联条数）</p><div class="row">${r.holders.slice(0, 6).map(([h, k]) => `<button class="chip" data-go="lib" data-tab="holders" data-co="${esc(h)}">${esc(h)} <small>${k}</small></button>`).join('') || '<span class="mute sm">名单里没有关联到具体维权方</span>'}</div>
          ${freshList.length ? `<p class="lab" style="margin:12px 0 6px">本版新进（${freshList.length}）</p><div class="vars">${freshList.map(x => `<button class="chip" data-pick="${esc(x.name)}">${esc(x.name)}</button>`).join('')}</div>` : ''}
          ${sl.length ? `<p class="lab" style="margin:12px 0 6px">暗语状态</p><div class="vars">${sl.slice(0, 12).map(t => `<span class="b ${t.liveness === 'killed' ? 'risk' : t.liveness === 'watching' ? 'vio' : 'reg'}">${esc(t.variants[0] || t.name)} · ${LIVE[t.liveness]}</span>`).join('')}</div>` : ''}</section>
          <section class="card"><h3>这个类目能用的行话<span class="lab">体检能过 · 买家会搜</span></h3><div class="jg">${okWords.map(j => `<span class="b reg" title="${esc(j.note)}">${esc(j.word)}</span>`).join('') || '<span class="mute sm">还没有类目专属行话，通用行话见资料库</span>'}</div><p class="cd-note">${esc(okWords[0] ? okWords[0].source : '')}。上新品第 3 步会自动把这些词放进标题。</p></section></div>
        <div class="col"><section class="card"><h3>机会面<span class="lab">${m.n ? srcTag(m.sources.join(' / '), m.latest) : '无数据'}</span></h3>${m.n ? `<div class="tiles" style="grid-template-columns:repeat(4,1fr);margin-bottom:10px"><div class="tile"><b>${num(m.n)}</b><span>抓到在卖</span></div><div class="tile"><b>${fmt(m.wantsMed)}</b><span>想要数中位${m.wantsN ? `（${m.wantsN} 条有值）` : ''}</span></div><div class="tile"><b>${m.priceMed === null ? fmt(null) : '¥' + fmt(m.priceMed)}</b><span>价格中位</span></div><div class="tile"><b>${fmt(m.new7)}</b><span>近 7 天新上</span></div></div><p class="sm">关键词：${m.keywords.map(k => `<span class="b">${esc(k)}</span>`).join(' ') || '—'}${m.enough ? '' : '<br><span class="mute">样本不足 50 条，先多导几个关键词再看结论。</span>'}</p>
            <p class="lab" style="margin:12px 0 6px">竞品标题在踩什么雷</p><div class="heat" style="margin:0 0 6px"><i class="r" style="width:${m.redPct}%"></i><i class="a" style="width:${m.amberPct}%"></i><i class="g" style="width:${100 - m.redPct - m.amberPct}%"></i></div><p class="sm mute" style="margin:0">红灯 ${m.redPct}% · 黄灯 ${m.amberPct}%。红灯比例高说明两件事：这个类目靶子多、维权方活跃；也说明合规做法的对手少。</p>
            <details class="fold" style="margin-top:10px"><summary>抓到的标题样本（前 60 条）${icon('chevron')}</summary><div class="fold-body"><div class="tbl"><table><thead><tr><th>标题</th><th>价格</th><th>想要</th><th>体检</th></tr></thead><tbody>${sample.map(i => `<tr><td>${esc(i.title)}</td><td class="mono">${i.price === null ? '—' : '¥' + i.price}</td><td class="mono">${i.wants === null ? '—' : i.wants}</td><td><span class="b lv ${i.r.level}">${LV[i.r.level]}</span></td></tr>`).join('')}</tbody></table></div></div></details>` : `<p class="sm mute">还没有这个类目的搜索数据。在闲鱼网页版搜 2 到 3 个关键词（例如 ${esc(sel.kw.split('|').slice(0, 3).join('、'))}），用书签脚本读进来，这里就有在卖量、想要数、价格中位和竞品标题体检。</p>`}</section>
          <section class="card"><h3>下一步</h3><div class="hs"><label class="fld grow"><span>带着主题去上新品</span><input id="mk-q" type="text" placeholder="例如：${esc(CAT_TOPIC[sel.domains[0]] || '你的主题')}"></label><button class="btn dark" id="mk-q-go">开始上新品 →</button></div></section></div></div></section>`;
    }
    return head + quad + cards + detail + `<div class="mt anim">${importPanel(state.tab)}</div>`;
  }

  // ================= 上新品向导 =================
  const STEP_NAMES = ['定品', '定形态', '做素材包', '通行证', '拿走'];
  function stepsBar(a) {
    return `<div class="steps">${STEP_NAMES.map((n, i) => { const s = i + 1; const on = s === state.step, ok = s < state.step; const dis = !a ? s > 1 : (s > 2 && !a.form); return `<button data-step="${s}" class="${on ? 'on' : ''}${ok ? ' ok' : ''}" ${dis ? 'disabled' : ''}><span class="n">${ok ? '✓' : s}</span>${n}</button>`; }).join('')}</div>`;
  }
  function renderPick() {
    const q = state.q.trim();
    const a = q ? analyze(q) : null;
    const head = `<section class="hero anim"><h1 class="hero-t">上新品 ${state.step} / 5 · ${STEP_NAMES[state.step - 1]}</h1><p class="hero-p">${['先断这个品能不能碰，看谁在维权，归到哪个类目。', '红灯不代表这个主题不能做，换一个合规形态。', '主题词、关键词、标题、说明、主图、详情图、话术、定价，一次做完。', '标题加说明整条过五类体检，这是上架前最后一关。', '把素材包全部拿走，照着发布。'][state.step - 1]}</p>
      <div class="hs"><label class="fld grow"><span>品名或你打算写的标题</span><input id="q" type="text" value="${esc(state.q)}" placeholder="例如：粉笔国考全套网盘" autocomplete="off"></label><label class="fld"><span>平台</span><select id="platform">${PLATFORMS.map(p => `<option${p === state.platform ? ' selected' : ''}>${p}</option>`).join('')}</select></label><button class="btn acc" id="go">断一断</button></div>
      ${!q ? `<div class="ex"><span class="try">试试</span>${X.pick_examples.map(e => `<button class="chip" data-ex="${esc(e)}">${esc(e)}</button>`).join('')}</div>` : ''}</section>${stepsBar(a)}`;
    if (!a) return head + `<div class="grid anim"><section class="card"><h3>五步会得到</h3><ul class="skel"><li><b>断</b>红黄绿加分数，为什么这么判，归到哪个类目</li><li><b>谁</b>这个品背后谁在维权、用什么手段</li><li><b>换</b>同主题的合规形态</li><li><b>做</b>素材包：三个标题、说明、主图、详情图、三段话术、五条问答、定价建议</li><li><b>拿</b>一键下载，草稿 JSON 可以喂给执行器</li></ul></section><section class="card"><h3>边界</h3><ul class="skel"><li>红灯品不生成原品内容，只给同主题合规形态</li><li>标题里不出现原作品名、作者名、机构名</li><li>行话只用体检能过、人工核过的词；拦截词和高压线题材不给替代词</li><li>生成的每一条都回过体检，不过不输出</li></ul></section></div>`;
    const S = state.step;
    if (S === 1) {
      const lvl = a.res.level;
      const next = lvl === 'red' ? '红灯，去换形态 →' : lvl === 'amber' ? '黄灯，先核清再定，也可以换形态 →' : '绿灯，去定形态 →';
      return head + `<div class="grid anim"><div class="col"><section class="card ${lvl}"><h3>断<span class="lab">查版权 · 体检</span></h3>${cardHTML(a.res.card)}</section>${a.ambig.length ? `<section class="card">${ambigHTML(a.ambig)}</section>` : ''}
        <section class="card"><h3>归类<span class="lab">类目</span></h3>${a.tree ? `<p class="sm" style="margin:0"><b>${esc(a.tree.name)}</b> · ${esc(a.tree.publish_hint)}<br><span class="mute">${esc(a.tree.note)}</span></p><p style="margin:8px 0 0"><button class="link" data-go="market" data-mc="${a.tree.key}">看这个类目的机会与风险 →</button></p>` : '<p class="sm mute" style="margin:0">没判出类目，第 2 步选领域后会带出来。</p>'}</section></div>
        <div class="col"><section class="card"><h3>命中明细<span class="lab">${a.res.hits.length} 处</span></h3>${hitsTable(a.res.hits) || '<p class="mute sm">标题里没有版权名、暗语或违禁词。未收录不等于可售，处置卡里的四查照走。</p>'}</section>
        <section class="card"><h3>谁在维权<span class="lab">维权方档案</span></h3>${a.holders.length ? `<div class="fgrid">${a.holders.map(h => holderHTML(h)).join('')}</div>` : `<p class="mute sm">${a.copyHits.length ? '命中条目没有关联到具体维权方，标签来自平台处理记录。' : '没有命中名单，没有维权方信息。'}</p>`}</section></div></div>
        <div class="navrow"><span></span><button class="btn dark" data-step="2">${next}</button></div>`;
    }
    if (S === 2) {
      return head + `<section class="card anim"><h3>换形态<span class="lab">${esc(a.category || '按领域选')}</span></h3>
        ${!a.rec ? `<p class="sm mute" style="margin:0 0 8px">没命中名单，先选这个品所属的领域：</p><div class="row" style="margin-bottom:12px">${categories.filter(c => FORMS[c]).map(c => `<button class="catbtn${c === state.cat ? ' on' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : `<p class="sm mute" style="margin:0 0 10px">命中「${esc(a.rec.name)}」，领域 ${esc(a.category)}。原形态红灯，下面是这个领域能做的形态，选一个。</p>`}
        <div class="forms">${a.forms.map((f, i) => `<button class="form ${f.level}${i === a.fi ? ' on' : ''}" data-form="${i}" ${f.level === 'red' ? 'disabled' : ''}><span class="b lv">${LV[f.level]}</span><span><span class="fn">${esc(f.name)}</span><br><span class="fnote">${esc(f.note)} · 建议定价 ${PRICE_RULES[formKind(f)].low}–${PRICE_RULES[formKind(f)].high} 元</span></span></button>`).join('')}</div>
        <p class="cd-note">黄灯形态可以做，但发布前要核清主体与授权；绿灯形态是你自己的交付，最稳。</p></section>
        <div class="navrow"><button class="btn ghost" data-step="1">← 上一步</button><button class="btn dark" data-step="3" ${a.form ? '' : 'disabled'}>${a.form ? `就做「${esc(a.form.name)}」，去做素材包 →` : '先选一个形态'}</button></div>`;
    }
    const titles = genTitles(a);
    const ti = Math.min(state.ti, Math.max(0, titles.length - 1));
    const chosen = titles[ti];
    const descKey = [q, a.fi, a.topic, ti].join('|');
    if (mem.desc.key !== descKey) mem.desc = {key:descKey, text:chosen ? genDesc(a, chosen.title) : ''};
    if (S === 3) {
      const pool = wordPool(a); const words = chosenWords(a); const price = priceFor(a); const fill = fillFor(a);
      const jg = jargonFor(a.treeKey, 'ok', a.category || '').map(j => j.word);
      return head + `<div class="grid anim"><div class="col"><section class="card"><h3>主题词与关键词<span class="lab">标题 = 主题 + 形态 + 行话</span></h3>
          <label class="fld" style="margin-bottom:10px"><span>主题词（替代原作品名，可改，回车生效）</span><input id="topic" type="text" value="${esc(a.topic)}" maxlength="60"></label>${a.guessed ? `<div class="ambig" style="margin-bottom:10px">从品名里剥掉作品名后没剩下主题，先用领域示例「${esc(a.topic)}」占位。改成你的真实主题。</div>` : ''}
          <p class="lab" style="margin:0 0 6px">行话（体检能过、买家会搜，点击取舍，最多进 2 个）</p><div class="pool">${jg.map(w => `<button data-word="${esc(w)}" class="ok${words.includes(w) ? ' in' : ''}" title="${esc((JARGON.find(j => j.word === w) || {}).note || '')}">${esc(w)}</button>`).join('') || '<span class="mute sm">该类目暂无专属行话</span>'}</div>
          <p class="lab" style="margin:12px 0 6px">拓词：贴竞品标题或搜索下拉词，一行一条（可选）</p><textarea id="word-text" rows="3" placeholder="例如：国考行测刷题计划表 每日打卡 可编辑">${esc(mem.wordText || '')}</textarea><div class="row" style="margin-top:6px"><button class="btn sm" id="word-go">拆词</button><button class="btn sm" id="word-ex">载入示例</button>${pool.importedN ? `<span class="xs mute">已并入选品页导入的 ${pool.importedN} 条同类目标题</span>` : ''}</div>
          ${pool.ok.length ? `<p class="lab" style="margin:10px 0 6px">可用词（点击加进标题）</p><div class="pool">${pool.ok.map(r => `<button data-word="${esc(r.t)}" class="${words.includes(r.t) ? 'in' : ''}">${esc(r.t)}<span class="cnt">×${r.c}</span></button>`).join('')}</div>` : ''}
          ${pool.out.length ? `<p class="lab" style="margin:10px 0 6px">剔除词（写进标题会出事）</p><div class="vars">${pool.out.slice(0, 12).map(r => `<span class="b risk" title="${esc(r.why)}">${esc(r.t)}</span>`).join('')}</div>` : ''}</section>
        <section class="card"><h3>标题<span class="lab">三条 · 已回过体检 · ≤ ${TITLE_MAX} 字</span></h3><div class="titles">${titles.map((t, i) => `<button class="title ${t.level}${i === ti ? ' on' : ''}" data-ti="${i}" ${t.level === 'red' ? 'disabled' : ''}><span class="b lv">${LV[t.level]}</span><span><span class="tt">${esc(t.title)}</span><br><span class="tr">${t.len} 字${t.used.length ? ' · 行话：' + esc(t.used.join('、')) : ''} · ${t.level === 'red' ? '未过体检：' + esc(t.reasons.join('、')) : t.level === 'amber' ? '有黄灯项：' + esc(t.reasons.join('、')) : '过体检'}${i === ti && t.level !== 'red' ? ' · 已选' : ''}</span></span></button>`).join('')}</div></section>
        <section class="card"><h3>定价与 SKU<span class="lab">${price.market ? srcTag('同类目导入数据', price.market.latest) : '规则区间'}</span></h3><dl class="kv"><dt>形态</dt><dd>${esc(price.rule.name)}</dd><dt>建议区间</dt><dd><b>¥${price.rule.low} – ¥${price.rule.high}</b> · ${esc(price.rule.note)}</dd><dt>同类目中位</dt><dd>${price.market ? `¥${fmt(price.market.med)}（${price.market.n} 条有价格）` : '<i class="nd">无数据</i> · 导入该类目搜索结果后显示'}</dd><dt>SKU</dt><dd>${isService(a.form) ? '按次 / 按周两档，周档 ≈ 3 次价' : '单品一档；想做高价加「含 30 分钟答疑」档'}</dd></dl><label class="fld" style="margin-top:8px"><span>我的定价（写进素材包）</span><input id="fill-price" type="text" value="${esc(fill.price)}" placeholder="例如 29.9"></label></section></div>
        <div class="col"><section class="card"><h3>说明<span class="lab">括号里替换成你的内容</span></h3><textarea id="desc" rows="16">${esc(mem.desc.text)}</textarea><div class="fgrid" style="margin-top:8px"><label class="fld"><span>交付方式</span><input id="fill-交付" type="text" value="${esc(fill.交付)}"></label><label class="fld"><span>时效</span><input id="fill-时效" type="text" value="${esc(fill.时效)}"></label></div><div class="row" style="margin-top:8px"><button class="btn sm" id="desc-regen">按所选标题重新生成</button><button class="btn sm" data-copy-desc="1">${icon('copy')}复制说明</button></div></section>
        <section class="card"><h3>主图与详情图<span class="lab">画布生成 · 改文字即更新</span></h3><div class="kit"><div><canvas id="cv-cover" class="cv" width="800" height="800"></canvas><div class="cvrow">${PALETTES.map((p, i) => `<button class="pal${i === state.pal ? ' on' : ''}" data-pal="${i}" style="background:${p[0]}" title="配色 ${i + 1}"></button>`).join('')}<button class="btn sm" data-dlcv="cv-cover">${icon('down')}主图 PNG</button></div></div><div><canvas id="cv-detail" class="cv" width="800" height="1500"></canvas><div class="cvrow"><button class="btn sm" data-dlcv="cv-detail">${icon('down')}详情长图 PNG</button><span class="xs mute">「包含」三项填了会自动同步到图上</span></div></div></div><details class="fold" style="margin-top:10px"><summary>图片规范${icon('chevron')}</summary><div class="fold-body"><ul>${IMG_RULES.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div></details></section></div></div>
        <div class="grid anim" style="margin-top:16px"><section class="card"><h3>自动回复话术<span class="lab">三段 + 两问</span></h3><dl class="kv" style="grid-template-columns:80px 1fr">${Object.entries(X.scripts).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(fillTpl(v, a))}</dd>`).join('')}</dl></section><section class="card"><h3>常见问题<span class="lab">贴进详情或自动回复</span></h3><ol class="skel">${X.faq.map(([qq, ans]) => `<li><b>问</b>${esc(qq)}<br><span class="mute">答：${esc(fillTpl(ans, a))}</span></li>`).join('')}</ol></section></div>
        <div class="navrow"><button class="btn ghost" data-step="2">← 上一步</button><button class="btn dark" data-step="4" ${chosen && chosen.level !== 'red' ? '' : 'disabled'}>标题和说明一起过通行证 →</button></div>`;
    }
    const full = (chosen ? chosen.title : '') + '\n' + mem.desc.text;
    const pass = lint(full.replace(/（[^）]*）/g, ''));
    const n = {exact:0, disguise:0, slang:0, banned:0};
    pass.hits.forEach(h => { if (h.kind === 'copyright') (h.match_type === 'disguised_candidate' ? n.disguise++ : n.exact++); else if (h.kind === 'slang') n.slang++; else n.banned++; });
    if (S === 4) {
      const m = MATRIX[a.platKey] || MATRIX.course;
      return head + `<section class="card ${pass.level} anim"><h3>通行证<span class="lab">五类体检 · 标题 + 说明</span></h3>
        <div class="pass"><b>${pass.level === 'red' ? '没过' : pass.level === 'amber' ? '有条件通过' : '通过'}</b><span>${pass.level === 'red' ? '标题或说明里还有红灯词，回去改。' : pass.level === 'amber' ? '没有红灯词，但有黄灯项：' + esc(pass.reasons.join('、')) + '。发布前核清。' : '标题和说明里没有版权名、伪装写法、暗语、违禁词。'}</span></div>
        <div class="five"><div class="${n.exact ? 'hit' : ''}"><b>${n.exact}</b><span>版权名精确命中</span></div><div class="${n.disguise ? 'hit' : ''}"><b>${n.disguise}</b><span>伪装写法</span></div><div class="${n.slang ? 'hit' : ''}"><b>${n.slang}</b><span>平台暗语</span></div><div class="${n.banned ? 'hit' : ''}"><b>${n.banned}</b><span>违禁词与极限词</span></div><div><b>${esc(state.platform)}</b><span>${esc(a.cell.高频判罚 || '平台提示')}</span></div></div>
        ${hitsTable(pass.hits)}
        <details class="fold" style="margin-top:12px"><summary>体检的是这段文字${icon('chevron')}</summary><div class="fold-body"><pre>${esc(full)}</pre></div></details></section>
        <section class="card mt anim"><h3>${esc(state.platform)} · ${esc(m.name)}<span class="lab">规则矩阵</span></h3><dl class="kv"><dt>资质</dt><dd>${esc(a.cell.资质 || '—')}</dd><dt>高频判罚</dt><dd>${esc(a.cell.高频判罚 || '—')}</dd><dt>词的差异</dt><dd>${esc(a.cell.违禁词差异 || '—')}</dd></dl><p class="cd-note">同一条文案换平台看：<button class="link" data-go="lib" data-tab="matrix">规则矩阵 →</button></p></section>
        <div class="navrow"><button class="btn ghost" data-step="3">← 回去改</button><button class="btn dark" data-step="5" ${pass.level === 'red' ? 'disabled' : ''}>${pass.level === 'red' ? '没过通行证，不能拿走' : '通过了，拿走 →'}</button></div>`;
    }
    // S === 5 拿走
    const {pack, draft} = currentPack(a, titles, chosen, pass);
    const recent = store.get('sjb-recent', []); if (!recent.some(r => r.q === q && r.title === chosen.title)) { recent.unshift({q, title:chosen.title, form:a.form.name, level:pass.level, at:new Date().toISOString()}); store.set('sjb-recent', recent.slice(0, 20)); }
    return head + `<div class="grid anim"><section class="card ${pass.level}"><h3>素材包<span class="lab">文字部分 · 直接贴到平台</span></h3><div class="pack">${esc(pack)}</div><div class="row" style="margin-top:10px"><button class="btn dark" data-copy-pack="1">${icon('copy')}复制全部文字</button><button class="btn" id="dl-pack">${icon('down')}素材包 .txt</button><button class="btn" id="dl-draft">${icon('down')}草稿 JSON</button></div></section>
      <div class="col"><section class="card"><h3>图片</h3><div class="kit"><div><canvas id="cv-cover" class="cv" width="800" height="800"></canvas><div class="cvrow"><button class="btn sm" data-dlcv="cv-cover">${icon('down')}主图 PNG</button></div></div><div><canvas id="cv-detail" class="cv" width="800" height="1500"></canvas><div class="cvrow"><button class="btn sm" data-dlcv="cv-detail">${icon('down')}详情长图 PNG</button></div></div></div></section>
      <section class="card"><h3>接下来</h3><ul class="skel"><li><b>上架</b>闲鱼发布页：类目选「${esc(a.tree ? a.tree.publish_hint : '对应方向')}」，粘贴标题与说明，上传两张图，价格 ${esc(fillFor(a).price || '按建议区间')}。想少点几下：草稿 JSON 是执行器能直接消费的格式，见接入页。</li><li><b>话术</b>把三段话术设成闲鱼自动回复，问答贴在详情末尾。</li><li><b>盯店</b>发布后用书签脚本把店铺读进体检店铺，名单一更新就知道有没有中招。<button class="link" data-go="shop">去体检店铺 →</button></li></ul></section>
      <section class="card"><h3>这次的决策记录</h3><dl class="kv"><dt>品名</dt><dd>${esc(q)}</dd><dt>判定</dt><dd><span class="b lv ${a.res.level}">${LV[a.res.level]}</span> ${a.res.card.score} 分</dd><dt>类目</dt><dd>${esc(a.tree ? a.tree.name : '—')}</dd><dt>形态</dt><dd>${esc(a.form.name)}（${LV[a.form.level]}）</dd><dt>主题词</dt><dd>${esc(a.topic)}</dd><dt>行话</dt><dd>${esc(chosen.used.join('、') || '未用')}</dd><dt>通行证</dt><dd><span class="b lv ${pass.level}">${LV[pass.level]}</span></dd><dt>版本</dt><dd class="mono xs">名单 ${esc(updatedAt)} · 规则 ${esc(RULES.version)}</dd></dl><details class="fold" style="margin-top:10px"><summary>草稿 JSON${icon('chevron')}</summary><div class="fold-body"><pre>${esc(JSON.stringify(draft, null, 2))}</pre></div></details></section></div></div>
      <div class="navrow"><button class="btn ghost" data-step="4">← 上一步</button><button class="btn" data-new="1">再上一个品</button></div>`;
  }
  function currentPack(a, titles, chosen, pass) {
    if (!a) { a = analyze(state.q.trim()); titles = genTitles(a); chosen = titles[Math.min(state.ti, titles.length - 1)]; pass = lint((chosen ? chosen.title : '') + '\n' + mem.desc.text.replace(/（[^）]*）/g, '')); }
    const fill = fillFor(a), price = priceFor(a);
    const pack = [`【标题】（三选一，首选第 ${titles.indexOf(chosen) + 1} 条）`, ...titles.filter(t => t.level !== 'red').map((t, i) => `${i + 1}. ${t.title}`), '', `【说明】`, mem.desc.text, '', `【定价】`, `我的定价：${fill.price || '（未填）'}；建议区间 ¥${price.rule.low}–¥${price.rule.high}（${price.rule.name}）${price.market ? `；同类目中位 ¥${fmt(price.market.med)}，${price.market.n} 条样本` : '；同类目中位：无数据'}`, '', `【上架类目】${a.tree ? a.tree.publish_hint : '按平台发布页选择'}（以发布页实际类目为准）`, '', `【自动回复】`, ...Object.entries(X.scripts).map(([k, v]) => `${k}：${fillTpl(v, a)}`), '', `【常见问题】`, ...X.faq.map(([qq, ans], i) => `${i + 1}. 问：${qq} 答：${fillTpl(ans, a)}`), '', `【图片规范】`, ...IMG_RULES.map((r, i) => `${i + 1}. ${r}`), '', `【上架前四查】`, ...RULES.checklist.map(c => '□ ' + c), '', `【${state.platform} 提示】`, `资质：${a.cell.资质 || '—'}`, `高频判罚：${a.cell.高频判罚 || '—'}`, '', `【通行证】${LV[pass.level]} · 名单 ${updatedAt} · 规则 ${RULES.version} · 上架宝 ${today}`].join('\n');
    const draft = {draft_id:'d_' + updatedAt.replace(/-/g, '') + '_' + Math.random().toString(36).slice(2, 6), platform:state.platform, title:chosen.title, alt_titles:titles.filter(t => t !== chosen && t.level !== 'red').map(t => t.title), description:mem.desc.text, price:toNum(fill.price) || price.rule.low, quantity:999, category_hint:a.tree ? a.tree.publish_hint : '', images:['./img/cover.png', './img/detail.png'], auto_replies:Object.fromEntries(Object.entries(X.scripts).map(([k, v]) => [k, fillTpl(v, a)])), strategist:{list_version:updatedAt, rule_version:RULES.version, lint_level:pass.level, form:a.form.name, topic:a.topic, jargon:chosen.used, category:a.treeKey, checked_at:new Date().toISOString()}};
    return {pack, draft};
  }

  // ================= 体检店铺（含：有品被处理了） =================
  function rewriteFor(row) {
    const rec = worstRecord(row.hits); const category = rec ? rec.category : '_default'; const forms = FORMS[category] || FORMS._default;
    const form = forms.find(f => f.level === 'green') || forms.find(f => f.level === 'amber'); if (!form) return null;
    const topic = deriveTopic(row.text, row.hits) || '〔你的主题〕'; const key = DOMAIN_CAT[category] || guessCat(row.text, row.hits);
    const fitK = new Set(X.jargon_kinds[formKind(form)] || []); const words = jargonFor(key, 'ok', category === '_default' ? '' : category).filter(j => fitK.has(j.word)).map(j => j.word).filter(w => !norm(topic).includes(norm(w)));
    for (const tpl of form.titles) { const {title} = buildTitle(tpl, topic, words); const r = lint(title); if (r.level !== 'red') return {title, level:r.level, form:form.name}; }
    return null;
  }
  const shopSub = () => `<div class="sub"><button class="${state.tab !== 'rescue' ? 'on' : ''}" data-tab="audit">体检在售商品</button><button class="${state.tab === 'rescue' ? 'on' : ''}" data-tab="rescue">有品被处理了</button></div>`;
  function renderShop() {
    if (state.tab === 'rescue') return shopSub() + renderRescue();
    const rows = mem.shopRows;
    const head = shopSub() + `<section class="hero anim"><h1 class="hero-t">体检店铺</h1><p class="hero-p">把在售商品读进来，批量体检。出健康分、谁在盯你的店、重复踩的词、下架优先级，还会标出哪些是因为这一版名单新增才中招的。拿列表有三种办法，都不需要把账号交给任何人。</p>
      <div class="grid" style="margin-bottom:12px"><div class="card" style="padding:12px 14px"><b class="sm">① 书签脚本（推荐）</b><p class="xs mute" style="margin:4px 0 8px">闲鱼网页版打开「我发布的」，点收藏栏的「上架宝读取」，回来粘贴。零安装。</p><div class="row"><button class="btn sm dark" id="bm-copy">${icon('copy')}复制书签代码</button><button class="btn sm" data-go="market" data-tab="bm">怎么装 →</button></div></div><div class="card" style="padding:12px 14px"><b class="sm">② 手贴 / ③ 文件</b><p class="xs mute" style="margin:4px 0 0">后台复制标题一行一个；或拖入执行器的 listings.json、ai-goofish-monitor 导出的 CSV。</p></div></div>
      <div class="drop" id="drop">把文件拖到这里，或在下面粘贴</div><textarea id="shop-text" rows="5" placeholder="粘贴书签脚本复制的内容，或一行一个标题……" style="margin-top:10px">${esc(mem.shopText || '')}</textarea><div class="hs" style="margin-top:10px"><button class="btn acc" id="shop-go">体检全部</button><button class="btn" id="shop-ex">载入示例</button><button class="btn ghost" id="shop-clear">清空</button><span class="sp"></span><label class="sm mute" style="display:flex;align-items:center;gap:6px"><input type="checkbox" id="shop-sub" ${mem.shopSub ? 'checked' : ''}>名单更新时提醒我（原型只演示）</label><button class="btn" id="shop-csv" ${rows.length ? '' : 'disabled'}>${icon('down')}导出 CSV</button></div>${mem.importMsg ? `<p class="cd-note">${esc(mem.importMsg)}</p>` : ''}</section>`;
    if (!rows.length) return head + `<div class="grid anim"><section class="card"><h3>体检会得到</h3><ul class="skel"><li><b>健康分</b>红灯占比与黄灯占比折算，A 到 D 四档</li><li><b>谁在盯</b>命中的维权方，按本店命中条数排</li><li><b>踩词</b>反复出现的问题词，改习惯比改一条标题管用</li><li><b>优先级</b>先下哪几条，附带行话的改写标题</li><li><b>提醒</b>名单更新后哪些品是新中招的</li></ul></section><section class="card"><h3>读进来的字段</h3><ul class="skel"><li><b>标题</b>必有，体检用</li><li><b>价格 / 想要 / 浏览</b>书签脚本能读到时带上，用来排「先改哪条」：想要数高的红灯品损失最大</li><li><b>链接</b>有就带上，导出下架清单时执行器用</li></ul></section></div>`;
    const n = {red:0, amber:0, green:0}; rows.forEach(r => n[r.level]++);
    const total = rows.length, score = Math.max(0, Math.round(100 - 70 * n.red / total - 25 * n.amber / total)), grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D';
    const holders = new Map(), frags = new Map(); let freshHit = 0;
    for (const r of rows) { let f = false; for (const h of r.hits) { if (h.kind === 'copyright') { for (const c of h.record.companies) holders.set(c, (holders.get(c) || 0) + 1); if (NEW_IDS.has(h.record.id)) f = true; } const k = h.fragment.toLowerCase(); frags.set(k, (frags.get(k) || 0) + 1); } if (f) freshHit++; }
    const topH = [...holders.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3), topF = [...frags.entries()].filter(x => x[1] > 1).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const order = {red:0, amber:1, green:2};
    const sorted = [...rows].sort((a, b) => order[a.level] - order[b.level] || (b.meta.wants || 0) - (a.meta.wants || 0) || b.card.score - a.card.score || b.hits.length - a.hits.length);
    const reds = sorted.filter(r => r.level === 'red');
    const hasMeta = rows.some(r => r.meta.price !== null || r.meta.wants !== null);
    const sub = mem.shopSub ? `<div class="notice" style="margin-bottom:16px">已订阅演示：名单从 ${esc(X.prev_version)} 更新到 ${esc(updatedAt)} 时，你会收到「本店 ${freshHit} 条因新增名单中招」的提醒，附下架优先级。</div>` : '';
    return head + sub + `<div class="tiles anim"><div class="tile"><div class="grade"><b>${score}</b><div><span class="g">${grade}</span><br><span>店铺健康分</span></div></div></div><div class="tile red"><b>${n.red}</b><span>红灯 · 建议下架</span></div><div class="tile amber"><b>${n.amber}</b><span>黄灯 · 先核清再定</span></div><div class="tile green"><b>${n.green}</b><span>绿灯</span></div><div class="tile"><b>${holders.size}</b><span>命中维权方</span></div><div class="tile ${freshHit ? 'red' : ''}"><b>${freshHit}</b><span>因本版新增名单中招</span></div></div>
      <div class="heat anim"><i class="r" style="width:${n.red / total * 100}%"></i><i class="a" style="width:${n.amber / total * 100}%"></i><i class="g" style="width:${n.green / total * 100}%"></i></div>
      <div class="grid anim"><section class="card"><h3>谁在盯你的店</h3>${topH.length ? `<div class="fgrid">${topH.map(([c, k]) => holderHTML(c, `<span class="b risk">本店命中 ${k} 条</span>`)).join('')}</div>` : '<p class="mute sm">没有命中带维权方的条目。</p>'}</section>
      <section class="card"><h3>重复踩的词</h3>${topF.length ? `<div class="vars">${topF.map(([k, c]) => `<span class="b risk">${esc(k)} × ${c}</span>`).join('')}</div><p class="cd-note">同一个词反复出现，是写标题的习惯问题。改习惯比改一条标题管用。</p>` : '<p class="mute sm">没有重复踩的词。</p>'}</section></div>
      <section class="card mt anim"><h3>体检结果<span class="lab">${total} 条 · 按下架优先级${hasMeta ? '（红灯里想要数高的排前）' : ''}</span></h3><div class="tbl"><table><thead><tr><th>#</th><th>标题</th>${hasMeta ? '<th>价格</th><th>想要</th>' : ''}<th>等级</th><th>命中</th><th>可改写成</th><th></th></tr></thead><tbody>${sorted.map((r, i) => { const rw = r.level !== 'green' ? rewriteFor(r) : null; const isFresh = r.hits.some(h => h.kind === 'copyright' && NEW_IDS.has(h.record.id)); return `<tr class="${r.level}"><td class="pri">${i + 1}</td><td>${esc(r.text)}${isFresh ? ' <span class="b reg">新中招</span>' : ''}</td>${hasMeta ? `<td class="mono">${r.meta.price === null ? '—' : '¥' + r.meta.price}</td><td class="mono">${r.meta.wants === null ? '—' : r.meta.wants}</td>` : ''}<td><span class="b lv">${LV[r.level]}</span> <span class="mono mute xs">${r.card.score}</span></td><td>${r.hits.map(h => `<span class="frag ${h.kind === 'copyright' ? (h.match_type.startsWith('exact') ? 'red' : 'amber') : h.kind === 'banned' ? h.level : 'amber'}">${esc(h.fragment)}</span>`).join(' ') || '<span class="mute">—</span>'}</td><td class="adv">${rw ? `${esc(rw.title)} <span class="mute xs">（${esc(rw.form)}）</span>` : r.level === 'green' ? '<span class="mute">不用改</span>' : '<span class="mute">该领域无可生成形态</span>'}</td><td><button class="btn sm" data-pick="${esc(r.text)}">去上新品</button></td></tr>`; }).join('')}</tbody></table></div></section>
      <section class="card mt anim"><h3>下架清单<span class="lab">导出给执行器，或照着手动下</span></h3>${reds.length ? `<p class="sm mute" style="margin:0 0 6px">红灯 ${reds.length} 条。勾选要下的，导出 JSON。执行器会逐条再请你确认，每条之间随机间隔，遇到验证就停。</p>${reds.map((r, i) => `<label class="checkbox"><input type="checkbox" data-off="${esc(r.text)}" ${mem.offSel.has(r.text) ? 'checked' : ''}><span><b class="pri">${i + 1}</b> ${esc(r.text)} <span class="mute xs">· ${r.card.score} 分 · ${esc(r.reasons.join('、'))}</span></span></label>`).join('')}<div class="row" style="margin-top:10px"><button class="btn sm" id="off-all">全选</button><button class="btn sm dark" id="off-json" ${mem.offSel.size ? '' : 'disabled'}>${icon('down')}导出下架清单 JSON（${mem.offSel.size}）</button></div>` : '<p class="mute sm">没有红灯条目，不需要下架。</p>'}</section>`;
  }
  function runShop(raw, name) {
    mem.shopText = raw !== undefined ? raw : $('shop-text').value; const groups = parseImport(mem.shopText, name || '');
    const items = groups.flatMap(g => g.items).filter(i => i.title); const seen = new Set(); const uniq = items.filter(i => { const k = norm(i.title); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 500);
    mem.shopRows = uniq.map(i => physLv({...lint(i.title), meta:{price:i.price ?? null, wants:i.wants ?? null, link:i.link || ''}})); mem.offSel = new Set();
    mem.importMsg = uniq.length ? `读到 ${uniq.length} 条（来源：${unique(groups.map(g => g.source)).join(' / ')}）。` : '没读到标题。';
    if (groups.some(g => g.page === 'mine') && uniq.length) { const g = groups.find(x => x.page === 'mine'); addMarket([{...g, items:uniq}], ''); }
    render();
  }
  function exportCSV() { const q = v => '"' + String(v).replace(/"/g, '""') + '"'; const rows = [['优先级', '标题', '价格', '想要', '等级', '分数', '命中片段', '原因', '可改写成', '先做什么'], ...[...mem.shopRows].sort((a, b) => ({red:0, amber:1, green:2}[a.level]) - ({red:0, amber:1, green:2}[b.level]) || b.card.score - a.card.score).map((r, i) => { const rw = r.level !== 'green' ? rewriteFor(r) : null; return [i + 1, r.text, r.meta.price ?? '', r.meta.wants ?? '', LV[r.level], r.card.score, r.hits.map(h => h.fragment).join('|'), r.reasons.join('|'), rw ? rw.title : '', r.card.actions[0] || '']; })]; download(`店铺体检_${updatedAt}.csv`, rows.map(r => r.map(q).join(',')).join('\n'), 'text/csv;charset=utf-8'); }

  function submitHTML(prefillName, prefillRes = '下架') {
    return `<section class="card mt anim"><h3>登记这次处理<span class="lab">回流 · 帮名单长</span></h3><p class="sm mute" style="margin:0 0 10px">你遇到的下架、投诉、律师函，填进来就是名单的下一条。审核通过后脱敏并入公开名单，提交者在周报里署名。原型不保存，只展示会发出的内容。</p>
      <div class="fgrid"><label class="fld"><span>名称</span><input id="sr-name" type="text" value="${esc(prefillName)}" placeholder="课程名、作者或机构"></label><label class="fld"><span>平台</span><select id="sr-plat">${PLATFORMS.map(p => `<option${p === state.platform ? ' selected' : ''}>${p}</option>`).join('')}</select></label><label class="fld"><span>处理结果</span><select id="sr-res">${['下架', '投诉下架', '售假判定', '律师函', '起诉', '扣分'].map(o => `<option${o === prefillRes ? ' selected' : ''}>${o}</option>`).join('')}</select></label><label class="fld"><span>日期</span><input id="sr-date" type="date"></label></div>
      <div class="navrow" style="justify-content:flex-start"><button class="btn dark" id="sr-go">生成回流记录</button></div><div id="sr-out"></div></section>`;
  }
  function renderRescue() {
    const ev = RESCUE[state.ev]; const rq = state.rq.trim(); const a = rq ? analyze(rq) : null;
    let lean = mem.rescuePath; if (!lean && a) lean = a.ambig.length ? 'wrong' : (a.res.level === 'red' ? 'real' : '');
    return `<section class="hero anim"><h1 class="hero-t">被处理了怎么办</h1><p class="hero-p">先分清是平台判错了，还是确实有问题。判错了就申诉，确实有问题就马上止损。</p>
      <div class="hs"><label class="fld"><span>收到的是</span><select id="ev">${Object.keys(RESCUE).map(k => `<option${k === state.ev ? ' selected' : ''}>${k}</option>`).join('')}</select></label><label class="fld grow"><span>涉及的品名或标题（可选，填了帮你判）</span><input id="rq" type="text" value="${esc(state.rq)}" placeholder="例如：粉笔字教程 / 凯叔讲故事音频合集"></label><button class="btn acc" id="rq-go">看处置办法</button></div></section>
      ${a ? `<div class="grid anim"><section class="card ${a.res.level}"><h3>判断<span class="lab">${esc(rq)}</span></h3><div class="pass"><b>${LV[a.res.level]} ${a.res.card.score}</b><span>${esc(a.res.card.headline)}</span></div>${a.res.hits.length ? hitsTable(a.res.hits) : ''}${a.ambig.length ? `<div style="margin-top:10px">${ambigHTML(a.ambig)}</div>` : ''}<p class="cd-note">${lean === 'wrong' ? '倾向：疑似误判。命中的是通用词，如果你卖的是通用义，走申诉。' : lean === 'real' ? '倾向：实锤。名单精确命中且有维权记录，走止损。' : '名单没有精确命中，看你的内容来源决定走哪条路。'}</p></section>
        <section class="card"><h3>对方是谁</h3>${a.holders.length ? `<div class="fgrid">${a.holders.map(h => holderHTML(h)).join('')}</div><p class="cd-note">手段是「起诉」的主体，收到函件要更认真对待，通常以和解结案。</p>` : '<p class="mute sm">名单里没有关联到具体维权方。投诉方信息以平台通知为准。</p>'}</section></div>` : ''}
      <section class="card mt anim"><h3>第一步 · 判断<span class="lab">${esc(state.ev)}</span></h3><ol class="skel">${ev.判断.map(x => `<li>${esc(x)}</li>`).join('')}</ol><div class="row" style="margin-top:10px"><span class="sm mute">我判断是：</span><button class="chip${lean === 'wrong' ? ' on' : ''}" data-lean="wrong">误判</button><button class="chip${lean === 'real' ? ' on' : ''}" data-lean="real">实锤</button></div></section>
      <div class="grid anim" style="margin-top:16px"><section class="card ${lean === 'wrong' ? 'green' : ''}" style="${lean === 'real' ? 'opacity:.55' : ''}"><h3>误判 · 申诉<span class="lab">要点与凭证</span></h3><p class="lab" style="margin:0 0 6px">申诉要点</p><ol class="skel">${ev.误判.要点.map(x => `<li>${esc(x)}</li>`).join('')}${a && a.ambig.length ? a.ambig.map(k => `<li><b>通用词</b>${esc(AMBIG[k].申诉要点)}</li>`).join('') : ''}</ol><p class="lab" style="margin:12px 0 6px">要准备的凭证</p><ul class="skel">${ev.误判.凭证.map(x => `<li>□ ${esc(x)}</li>`).join('')}</ul><div class="row" style="margin-top:10px"><button class="btn sm" data-copy-appeal="1">${icon('copy')}复制申诉要点</button></div></section>
      <section class="card ${lean === 'real' ? 'red' : ''}" style="${lean === 'wrong' ? 'opacity:.55' : ''}"><h3>实锤 · 止损<span class="lab">按顺序做</span></h3><ol class="skel">${ev.实锤.map(x => `<li>${esc(x)}</li>`).join('')}</ol>${a && a.res.level === 'red' ? `<p class="cd-note">同主题还想做：去上新品换形态。<button class="link" data-pick="${esc(rq)}">去换形态 →</button></p>` : ''}</section></div>
      ${submitHTML(rq, state.ev === '知识产权投诉' ? '投诉下架' : state.ev === '律师函' ? '律师函' : state.ev === '起诉 / 法院传票' ? '起诉' : state.ev === '扣分 / 限流' ? '扣分' : '下架')}`;
  }

  // ================= 资料库 =================
  const LIB_TABS = [['list', '名单'], ['holders', '维权方档案'], ['jargon', '行话词典'], ['slang', '暗语词典'], ['banned', '拦截词表']];
  function renderList() {
    const kw = norm(state.lq); const rs = records.filter(r => (!state.lc || r.category === state.lc) && (!kw || norm(r.name).includes(kw) || r.variants.some(v => norm(v).includes(kw)))).slice(0, 300);
    const stats = categories.map(c => ({c, n:records.filter(r => r.category === c).length})).sort((a, b) => b.n - a.n);
    return `<section class="hero anim"><h1 class="hero-t">名单</h1><p class="hero-p">${num(records.length)} 条公开名单，来自公开收集与卖家回流。命中是核对线索不是结论；未命中也不等于可售。查一个名字最快的办法还是回上新品输入它。</p><div class="hs"><label class="fld grow"><span>搜名称或写法</span><input id="lq" type="text" value="${esc(state.lq)}" placeholder="例如：粉笔"></label></div><div class="row" style="margin-top:10px">${stats.map(s => `<button class="catbtn${s.c === state.lc ? ' on' : ''}" data-lc="${esc(s.c)}">${esc(s.c)} <small>${s.n}</small></button>`).join('')}</div></section>
      <section class="card anim"><h3>${state.lc ? esc(state.lc) : '全部'}<span class="lab">${rs.length} 条${rs.length >= 300 ? '（只显示前 300）' : ''}</span></h3><div class="tbl"><table><thead><tr><th>名称</th><th>领域</th><th>标签</th><th>关联公司</th><th></th></tr></thead><tbody>${rs.map(r => `<tr><td><b>${esc(r.name)}</b>${NEW_IDS.has(r.id) ? ' <span class="b reg">新进</span>' : ''}</td><td class="mute xs">${esc(r.category)}</td><td>${r.labels.map(l => `<span class="b ${isClaim(l) ? 'risk' : ''}">${esc(l)}</span>`).join(' ') || (r.registrations.length ? '<span class="b reg">附登记</span>' : '—')}</td><td class="mute xs">${esc(r.companies.join('、') || '—')}</td><td><button class="btn sm" data-pick="${esc(r.name)}">去上新品</button></td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function renderHolders() {
    const kw = norm(state.co); const hs = [...holderStats.values()].filter(h => !kw || norm(h.name).includes(kw)).sort((a, b) => b.count - a.count);
    const sel = hs.length === 1 ? hs[0] : null;
    return `<section class="hero anim"><h1 class="hero-t">谁在投诉</h1><p class="hero-p">这 ${holderStats.size} 家公司投诉过卖家。点一家，看它盯着哪些名字。</p><div class="hs"><label class="fld grow"><span>搜主体名</span><input id="co" type="text" value="${esc(state.co)}" placeholder="例如：版锐"></label></div></section>
      <section class="card anim"><div class="tbl"><table><thead><tr><th>主体</th><th>类型</th><th>备注</th><th>关联</th><th>新进</th><th>手段</th><th></th></tr></thead><tbody>${hs.map(h => `<tr><td><b>${esc(h.name)}</b></td><td class="mute xs">${esc(holderType(h.name))}</td><td class="mute xs">${esc(holderNote(h.name) || '—')}</td><td class="mono">${h.count}</td><td class="${h.fresh ? 'fresh' : 'mute'}">${h.fresh ? '+' + h.fresh : '—'}</td><td>${[...h.means].map(x => `<span class="b risk">${esc(x)}</span>`).join(' ') || '—'}</td><td><button class="btn sm" data-co="${esc(h.name)}">看名单</button></td></tr>`).join('')}</tbody></table></div></section>
      ${sel ? `<section class="card mt anim"><h3>${esc(sel.name)} 盯着的名称<span class="lab">${sel.ids.length} 条</span><button class="chip rm" data-co="">清除 ${icon('close')}</button></h3><div class="tbl"><table><thead><tr><th>名称</th><th>领域</th><th>标签</th><th></th></tr></thead><tbody>${sel.ids.slice(0, 200).map(id => byId.get(id)).map(r => `<tr><td>${esc(r.name)}${NEW_IDS.has(r.id) ? ' <span class="b reg">新进</span>' : ''}</td><td class="mute xs">${esc(r.category)}</td><td>${r.labels.map(l => `<span class="b ${isClaim(l) ? 'risk' : ''}">${esc(l)}</span>`).join(' ') || (r.registrations.length ? '<span class="b reg">附登记</span>' : '—')}</td><td><button class="btn sm" data-pick="${esc(r.name)}">去上新品</button></td></tr>`).join('')}</tbody></table></div>${sel.ids.length > 200 ? '<p class="cd-note">只显示前 200 条。</p>' : ''}</section>` : ''}`;
  }
  function renderJargon() {
    const key = state.mc; const ST = {ok:'可进标题', care:'只进详情', ban:'不用'};
    const freq = new Map(); mem.market.groups.filter(g => !key || g.cat === key).flatMap(g => g.items).slice(0, 2000).forEach(i => { for (const t of tokenizeLine(i.title)) { const k = norm(t); freq.set(k, (freq.get(k) || 0) + 1); } });
    const order = {ok:0, care:1, ban:2};
    const rows = JARGON.filter(j => !key || j.cat === key || j.cat === '*').map(j => ({...j, n:freq.get(norm(j.word)) || 0})).sort((a, b) => order[a.status] - order[b.status] || b.n - a.n || a.word.localeCompare(b.word, 'zh-CN'));
    const n = st => rows.filter(r => r.status === st).length;
    return `<section class="hero anim"><h1 class="hero-t">行话词典</h1><p class="hero-p">买家搜索用的是行话，不用行话没流量。这里只收人工核过、体检能过的正经行话，分三层：<b>可进标题</b>（上新品第 3 步会自动放进标题，最多两个）、<b>只进详情</b>（黄灯词和暗示文件交付的词）、<b>不用</b>。暗语和拦截词不在这页：暗语是躲审核的写法，见「暗语词典」；平台拦截与极限词见「拦截词表」。有导入数据时「出现」一列是这个词在竞品标题里的实测次数。</p>
      <div class="row"><button class="catbtn${!key ? ' on' : ''}" data-mc="">全部</button>${TREE.map(c => `<button class="catbtn${c.key === key ? ' on' : ''}" data-mc="${c.key}">${esc(c.name)}</button>`).join('')}</div></section>
      <div class="tiles anim" style="grid-template-columns:repeat(4,1fr)"><div class="tile green"><b>${n('ok')}</b><span>可进标题</span></div><div class="tile amber"><b>${n('care')}</b><span>只进详情</span></div><div class="tile red"><b>${n('ban')}</b><span>不用</span></div><div class="tile"><b>${freq.size ? num(freq.size) : '<i class="nd">无数据</i>'}</b><span>导入标题里的不同词</span></div></div>
      <section class="card anim"><div class="tbl"><table class="dict"><thead><tr><th>状态</th><th>词</th><th>类目</th><th>说明</th><th>出现</th><th>来源 · 日期</th></tr></thead><tbody>${rows.map(r => `<tr><td class="nw"><span class="lvl ${r.status}"></span>${ST[r.status]}</td><td class="nw"><b>${esc(r.word)}</b></td><td class="nw xs mute">${esc(r.cat === '*' ? '通用' : (treeOf(r.cat) || {}).name || r.cat)}</td><td class="wrap xs">${esc(r.note)}</td><td class="mono">${r.n ? r.n : '<span class="mute">—</span>'}</td><td class="nw xs mute">${esc(r.source)}${r.since ? ' · ' + esc(r.since) : ''}</td></tr>`).join('')}</tbody></table></div><p class="cd-note">你用一个词被处理了，或者发现一个能搜的新词，到「有品被处理了」登记，词典按回流更新。</p></section>`;
  }
  // ----- 暗语词典：两个开源词典全量，按虚拟 / 实物 / 话术分开 -----
  const liveCls = l => l === 'killed' ? 'risk' : l === 'watching' ? 'vio' : l === 'active' ? 'reg' : '';
  const liveName = l => LIVE[l] || '未标状态';
  function renderSlang() {
    const kind = KINDS[state.sk] ? state.sk : 'virtual';
    const all = SA.terms.filter(t => t.kind === kind);
    const cats = [...new Map(all.map(t => [t.category_name, 0])).keys()].map(c => [c, all.filter(t => t.category_name === c).length]);
    const sc = cats.some(([c]) => c === state.sc) ? state.sc : '';
    const kw = norm(state.sq);
    const rows = all.filter(t => (!sc || t.category_name === sc) && (!state.ss || (state.ss === 'none' ? !t.liveness : t.liveness === state.ss)) && (!kw || norm(t.name).includes(kw) || t.variants.some(v => norm(v).includes(kw))));
    const live = {killed:0, watching:0, active:0, '':0}; all.forEach(t => live[t.liveness] = (live[t.liveness] || 0) + 1);
    const sel = SA.terms.find(t => t.id === state.sl);
    const noSub = t => t.risk === 'danger' || t.policy;
    const srcName = Object.fromEntries(SA.sources.map(s => [s.key, s.name]));
    const hero = `<section class="hero anim"><h1 class="hero-t">暗语词典</h1><p class="hero-p">暗语是卖家为了躲审核发明的写法。这页把 ${SA.sources.length} 个来源（两个开源词典、两个小仓库、四个网站）整体收进来，只做查阅：<b>虚拟商品</b>的那部分（${SA.counts.by_kind.virtual.terms} 条）同时用于标题体检，写进标题会被标出；<b>实物商品</b>和<b>交易话术</b>只查不拦。写上会怎样看状态：拦截词写上就下架，抽检会限流，可搜说明平台还没盯上，但暗语本身就说明这个品类受审核关注。高危与灰色题材不给替代词。</p>
      <div class="seg">${Object.entries(KINDS).map(([k, n]) => `<button class="${k === kind ? 'on' : ''}" data-sk="${k}">${n}<small>${SA.counts.by_kind[k].terms} 条 · ${num(SA.counts.by_kind[k].variants)} 种写法</small></button>`).join('')}</div>
      <div class="hs" style="margin-top:14px"><label class="fld grow"><span>搜暗语、写法或指代的东西</span><input id="sq" type="text" value="${esc(state.sq)}" placeholder="例如：克劳德 / 网盘 / 卡贴"></label></div>
      <div class="row" style="margin-top:10px"><span class="lab">状态</span>${[['', '全部', all.length], ['killed', '拦截词', live.killed], ['watching', '抽检', live.watching], ['active', '可搜', live.active], ['none', '未标状态', live['']]].map(([k, n, c]) => `<button class="catbtn${state.ss === k ? ' on' : ''}" data-ss="${k}">${n} <small>${c}</small></button>`).join('')}</div>
      <div class="row" style="margin-top:8px"><span class="lab">分类</span><button class="catbtn${!sc ? ' on' : ''}" data-sc="">全部</button>${cats.map(([c, k]) => `<button class="catbtn${c === sc ? ' on' : ''}" data-sc="${esc(c)}">${esc(c)} <small>${k}</small></button>`).join('')}</div></section>`;
    const detail = sel ? `<section class="card anim" style="margin-bottom:16px"><h3>${esc(sel.name)}<span class="b ${liveCls(sel.liveness)}">${liveName(sel.liveness)}</span>${sel.risk ? `<span class="b">${esc(RISKN[sel.risk] || sel.risk)}</span>` : ''}${sel.policy ? `<span class="b risk">${esc(sel.policy_label)}</span>` : ''}${sel.review ? '<span class="b vio" title="虚实是按关键词规则判断的，没有人核过">待核</span>' : ''}<span class="lab">${esc(KINDS[sel.kind])} · ${esc(sel.category_name)}</span><button class="chip rm" data-sl="">收起 ${icon('close')}</button></h3>
        <div class="grid"><div><p class="lab" style="margin:0 0 6px">全部写法（${sel.variants.length}）</p><div class="vars">${sel.variants.map(v => `<span class="b">${esc(v)}</span>`).join('')}</div>
          ${sel.explanation ? `<p class="lab" style="margin:12px 0 4px">指什么</p><p class="sm" style="margin:0">${esc(sel.explanation)}</p>` : ''}
          ${sel.seller_intent ? `<p class="lab" style="margin:12px 0 4px">卖家为什么这么写</p><p class="sm" style="margin:0">${esc(sel.seller_intent)}</p>` : ''}</div>
        <div>${sel.trend ? `<p class="lab" style="margin:0 0 4px">现状</p><p class="sm" style="margin:0 0 12px">${esc(sel.trend)}</p>` : ''}
          <p class="lab" style="margin:0 0 4px">可换的写法</p><p class="sm" style="margin:0 0 12px">${noSub(sel) ? '<span class="mute">高危或灰色题材，不给替代词。</span>' : (sel.successors.length ? sel.successors.map(v => `<span class="b reg">${esc(v)}</span>`).join(' ') : '<span class="mute">用正常描述。</span>')}</p>
          ${sel.buyer_advice ? `<p class="lab" style="margin:0 0 4px">买家视角</p><p class="sm" style="margin:0 0 12px">${esc(sel.buyer_advice)}</p>` : ''}
          ${sel.seller_advice && !noSub(sel) ? `<p class="lab" style="margin:0 0 4px">如实卖应该怎么写</p><p class="sm" style="margin:0 0 12px">${esc(sel.seller_advice)}</p>` : ''}
          <p class="lab" style="margin:0 0 4px">来源</p><p class="sm" style="margin:0">${sel.source.map(k => esc(srcName[k] || k)).join(' + ')}${sel.votes ? ' · 票数 ' + sel.votes : ''}${sel.since ? ' · 投稿 ' + esc(sel.since) : ''}${sel.platforms.length ? ' · 平台：' + esc(sel.platforms.join('、')) : ''}${sel.in_radar ? ' · <span class="b reg">体检会标出</span>' : ' · <span class="b">只查阅，体检不拦</span>'}</p></div></div></section>` : '';
    const cap = 200;
    return hero + detail + `<section class="card anim"><h3>${esc(KINDS[kind])}${sc ? ' · ' + esc(sc) : ''}<span class="lab">${rows.length} 条${rows.length > cap ? `，显示前 ${cap}` : ''} · 点名称看全部写法与说明</span></h3><div class="tbl"><table class="dict"><thead><tr><th>状态</th><th>指什么</th><th>分类</th><th>常见写法</th><th>风险</th><th>可换</th><th>体检</th></tr></thead><tbody>${rows.slice(0, cap).map(t => `<tr${t.id === state.sl ? ' class="on"' : ''}><td class="nw"><span class="b ${liveCls(t.liveness)}">${liveName(t.liveness)}</span></td><td class="wrap"><button class="link" data-sl="${t.id}">${esc(t.name)}</button>${t.policy ? ` <span class="b risk">${esc(t.policy_label)}</span>` : ''}${t.review ? ' <span class="b vio">待核</span>' : ''}</td><td class="nw xs mute">${esc(t.category_name)}</td><td class="wrap xs">${esc(t.variants.slice(0, 6).join('、'))}${t.variants.length > 6 ? ` <button class="link xs" data-sl="${t.id}">+${t.variants.length - 6}</button>` : ''}</td><td class="nw xs">${esc(RISKN[t.risk] || '—')}</td><td class="wrap xs">${noSub(t) ? '<span class="mute">不给</span>' : esc(t.successors.slice(0, 3).join('、') || '用正常描述')}</td><td class="nw xs">${t.in_radar ? '<span class="b reg">标出</span>' : '<span class="mute">只查阅</span>'}</td></tr>`).join('') || '<tr><td colspan="7" class="mute">没有符合条件的词条。</td></tr>'}</tbody></table></div>
      <p class="cd-note">来源 ${SA.sources.length} 个：${SA.sources.map(s => `${esc(s.name)}（${esc(s.license)}，${s.kind === '本地文件' ? '只补红线警示和名单，词典并入 0 条' : '并入 ' + s.terms + ' 条，' + (s.commit ? 'commit ' + esc(s.commit.slice(0, 7)) : '抓取 ' + esc(s.fetched))}）`).join('；')}。${esc(SA.policy)}红线题材 ${SA.counts.redline} 条见 <button class="link xs" data-go="tools" data-tab="redline">情报库 → 红线警示</button>。虚实靠规则判断的 ${SA.counts.review} 条标「待核」，清单在 build/sources/review_待核.tsv。状态与风险是词典作者的判断，日期以仓库 commit 或抓取日为准；变化要两期比对。</p></section>`;
  }
  // ----- 拦截词表：雷达违禁词表全量 -----
  function renderBanned() {
    const G = {...X.banned_groups, ...X.banned_extra.groups}; const ALL = [...BANNED.terms, ...X.banned_extra.terms]; const g = G[state.sc] ? state.sc : '';
    const kw = norm(state.sq);
    const rows = ALL.filter(t => (!g || t.group === g) && (!kw || norm(t.term).includes(kw)));
    const n = k => ALL.filter(t => t.group === k).length;
    return `<section class="hero anim"><h1 class="hero-t">拦截词表</h1><p class="hero-p">${ALL.length} 个词，${Object.keys(G).length} 组。前三组是标题体检在用的雷达违禁词表（${BANNED.terms.length} 个）：<b>售假与版权高频词</b>是红灯（写上基本等于告诉平台你在卖别人的东西），<b>广告法极限词</b>和<b>系统稽查触发词</b>是黄灯（提示改写，减少堆叠）。后面各组是查阅用词（${X.banned_extra.terms.length} 个），标「不进体检」：三组挑自小红书违禁词库，八组来自《闲鱼虚拟品指南》的商品违禁词和被判违规的标题，都是卖家经验口径、没逐条核验，先当提示。命中只提示改写，不等于必被处理；未命中也不等于通过审核。</p>
      <div class="hs"><label class="fld grow"><span>搜词</span><input id="sq" type="text" value="${esc(state.sq)}" placeholder="例如：全套 / 最 / 网盘"></label></div>
      <div class="row" style="margin-top:10px"><button class="catbtn${!g ? ' on' : ''}" data-sc="">全部 <small>${ALL.length}</small></button>${Object.entries(G).map(([k, v]) => `<button class="catbtn${k === g ? ' on' : ''}" data-sc="${k}">${esc(v.name)} <small>${n(k)}</small></button>`).join('')}</div></section>
      <div class="grid three anim" style="margin-bottom:16px">${Object.entries(G).map(([k, v]) => `<section class="card ${v.level}"><h3><span class="b lv">${LV[v.level]}</span>${esc(v.name)}${v.lint === false ? '<span class="b">不进体检</span>' : ''}<span class="lab">${n(k)} 个</span></h3><p class="sm" style="margin:0">${esc(v.advice)}</p>${v.source ? `<p class="cd-note" style="margin:8px 0 0">${esc(v.source)}</p>` : ''}</section>`).join('')}</div>
      <section class="card anim"><h3>${g ? esc(G[g].name) : '全部'}<span class="lab">${rows.length} 个</span></h3><div class="vars">${rows.map(t => `<span class="b ${G[t.group].level === 'red' ? 'risk' : 'vio'}" title="${esc(G[t.group].name)}${t.note ? ' · ' + esc(t.note) : ''}">${esc(t.term)}</span>`).join('') || '<span class="mute sm">没有符合条件的词。</span>'}</div><p class="cd-note">违禁词表 ${esc(X.banned_version)}。${esc(X.banned_notice)}</p></section>`;
  }
  function renderMatrix() {
    const m = MATRIX[mem.mc || "course"]; const q = state.q.trim(); const r = q ? lint(q) : null;
    return `<section class="hero anim"><h1 class="hero-t">平台规则</h1><p class="hero-p">同一个东西，四个平台的要求和处罚不一样。先选一类，再看各平台；也可以贴一条标题看它在各平台会遇到什么。</p><p class="cd-note">这张表是经验整理。闲鱼的禁发范围已对照官方规范核对；小红书、淘宝、拼多多三家还没有逐条核对，以各平台发布页为准。</p><div class="row">${Object.entries(MATRIX).map(([k, v]) => `<button class="catbtn${k === (mem.mc || 'course') ? ' on' : ''}" data-mx="${k}">${esc(v.name)}</button>`).join('')}</div></section>
      <div class="grid anim" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr))">${PLATFORMS.map(p => { const c = m.cells[p]; return `<section class="card"><h3>${esc(p)}</h3><dl class="kv" style="grid-template-columns:70px 1fr"><dt>资质</dt><dd>${esc(c.资质)}</dd><dt>高频判罚</dt><dd>${esc(c.高频判罚)}</dd><dt>词的差异</dt><dd>${esc(c.违禁词差异)}</dd></dl></section>`; }).join('')}</div>
      <section class="card mt anim"><h3>一条标题，四个平台</h3><div class="hs"><label class="fld grow"><span>标题</span><input id="mq" type="text" value="${esc(state.q)}" placeholder="例如：粉笔国考全套网盘"></label><button class="btn dark" id="mq-go">看结论</button></div>${r ? `<div class="tbl" style="margin-top:12px"><table><thead><tr><th>平台</th><th>词级体检</th><th>命中</th><th>这个平台还要注意</th></tr></thead><tbody>${PLATFORMS.map(p => `<tr><td><b>${esc(p)}</b></td><td><span class="b lv ${r.level}">${LV[r.level]}</span></td><td>${r.hits.map(h => `<span class="frag ${h.kind === 'copyright' ? 'red' : 'amber'}">${esc(h.fragment)}</span>`).join(' ') || '—'}</td><td class="adv">${esc(m.cells[p].资质)}；${esc(m.cells[p].高频判罚)}</td></tr>`).join('')}</tbody></table></div><p class="cd-note">词级体检四个平台相同，差异在资质和类目处理。版权名在哪个平台都一样会被投诉。</p>` : ''}</section>`;
  }

  // ================= 工具箱 =================
  const TOOL_TABS = [['words', '拓词台'], ['chat', '聊天预警'], ['matrix', '规则矩阵'], ['redline', '红线警示']];
  // ----- 拓词台：贴词和标题，拆词、过滤、用合规形态组标题 -----
  function runWords() {
    const count = new Map(), raw = new Map();
    for (const l of (mem.wtText || '').split(/\n+/)) for (const t of tokenizeLine(l)) { const k = norm(t); count.set(k, (count.get(k) || 0) + 1); if (!raw.has(k)) raw.set(k, t); }
    mem.wtRows = [...count.entries()].map(([k, c]) => { const t = raw.get(k); const r = lint(t); return {t, c, hits:r.hits, ...classifyWord(t)}; }).sort((a, b) => b.c - a.c || a.t.localeCompare(b.t, 'zh-CN'));
    render();
  }
  function renderWords() {
    const rows = mem.wtRows; const marketN = mem.market.groups.filter(g => g.page !== 'mine').flatMap(g => g.items).length;
    const head = `<section class="hero anim"><h1 class="hero-t">标题找词</h1><p class="hero-p">把同行的标题贴进来，一行一条。工具帮你挑出能用的词、标出不能用的词，再用能用的词拼几条标题。</p>
      <textarea id="wt-text" rows="6" placeholder="一行一条：种子词、竞品标题都行……">${esc(mem.wtText || '')}</textarea><div class="hs" style="margin-top:10px"><button class="btn acc" id="wt-go">开始挑词</button><button class="btn" id="wt-ex">放个例子</button>${marketN ? `<button class="btn" id="wt-market">把选品页导入的 ${num(marketN)} 条标题也贴进来</button>` : ''}</div></section>`;
    if (!rows) return head;
    const ok = rows.filter(r => r.status === 'ok'), out = rows.filter(r => r.status === 'out' || r.status === 'warn'), fill = rows.filter(r => r.status === 'filler');
    const seeds = ok.map(r => r.t).filter(t => t.length <= 6 && !/^\d/.test(t)).filter((t, i, arr) => !arr.some((o, j) => j !== i && o !== t && t.includes(o))).slice(0, 6);
    const rec = rows.flatMap(r => r.hits).filter(h => h.kind === 'copyright').map(h => h.record)[0];
    const forms = FORMS[rec ? rec.category : '_default'] || FORMS._default;
    const topic = seeds.slice(0, 2).join(' ');
    const combos = [];
    if (topic) for (const f of forms.filter(f => f.level !== 'red')) { let k = 0; for (const tpl of (f.titles || [])) { const {title} = buildTitle(tpl, topic, seeds.slice(2)); const r = lint(title); if (r.level !== 'red') { combos.push({title, level:r.level, form:f.name}); k++; } if (k >= 2 || combos.length >= 6) break; } if (combos.length >= 6) break; }
    return head + `<div class="tiles anim"><div class="tile green"><b>${ok.length}</b><span>能用的词</span></div><div class="tile red"><b>${out.length}</b><span>不能用的词</span></div><div class="tile"><b>${fill.length}</b><span>凑数的词</span></div><div class="tile"><b style="font-size:16px;line-height:1.3">${rec ? esc(rec.category) : '<i class="nd">未命中名单</i>'}</b><span>按命中的名单条目判领域</span></div></div>
      <div class="grid anim"><section class="card"><h3>能用的词<span class="lab">出现越多越常用</span></h3><div class="vars">${ok.map(r => `<span class="b reg">${esc(r.t)} × ${r.c}</span>`).join('') || '<span class="mute sm">没有可用词</span>'}</div>${fill.length ? `<p class="lab" style="margin:12px 0 4px">凑数的词（没用，堆多了反而被查）</p><div class="vars">${fill.map(r => `<span class="b">${esc(r.t)} × ${r.c}</span>`).join('')}</div>` : ''}</section>
      <section class="card"><h3>不能用的词<span class="lab">写进标题会出事</span></h3><div class="tbl"><table><thead><tr><th>词</th><th>次数</th><th>原因</th></tr></thead><tbody>${out.map(r => `<tr><td class="nw"><span class="frag ${r.status === 'out' ? 'red' : 'amber'}">${esc(r.t)}</span></td><td class="mono">${r.c}</td><td class="adv xs">${esc(r.why)}</td></tr>`).join('') || '<tr><td colspan="3" class="mute">没有要剔除的词</td></tr>'}</tbody></table></div></section></div>
      <section class="card mt anim"><h3>用这些词拼出来的标题<span class="lab">都检查过</span></h3>${combos.length ? `<div class="titles">${combos.map(c => `<div class="title ${c.level}"><span class="b lv">${LV[c.level]}</span><span><span class="tt">${esc(c.title)}</span><br><span class="tr">${esc(c.form)}</span></span></div>`).join('')}</div>` : '<p class="mute sm">可用词不够，组不出标题。</p>'}${topic ? `<div class="row" style="margin-top:10px"><button class="btn dark" data-pick="${esc(topic)}">用「${esc(topic)}」去生成整套上架内容</button></div>` : ''}</section>`;
  }
  // ----- 聊天预警：买家或同行的话里有没有套路句、红线词 -----
  const TALK_INDEX = (() => {
    const rows = [];
    for (const t of SA.terms) if (t.kind === 'talk' || t.policy || t.risk === 'danger') for (const v of [t.name, ...t.variants]) if (v.length >= 2) rows.push({v, nv:norm(v), t, red:false});
    for (const r of SA.redline) for (const v of [r.name, ...r.variants]) if (v.length >= 2) rows.push({v, nv:norm(v), t:r, red:true});
    return rows.filter(r => r.nv.length >= 2).sort((a, b) => b.nv.length - a.nv.length);
  })();
  function runChat() {
    const text = norm(mem.ctText || ''); const hits = [], taken = [];
    for (const row of TALK_INDEX) { let i = text.indexOf(row.nv); while (i >= 0) { const e = i + row.nv.length; if (!taken.some(([s, t]) => i < t && e > s)) { taken.push([i, e]); hits.push(row); } i = text.indexOf(row.nv, e); } }
    mem.ctRows = hits; render();
  }
  function renderChat() {
    const rows = mem.ctRows;
    const head = `<section class="hero anim"><h1 class="hero-t">聊天预警</h1><p class="hero-p">把对方发来的话贴进来，帮你标出套路话和不能接的话，并告诉你怎么回。只在这台电脑上检查。</p>
      <textarea id="ct-text" rows="6" placeholder="贴聊天记录或商品描述……">${esc(mem.ctText || '')}</textarea><div class="hs" style="margin-top:10px"><button class="btn acc" id="ct-go">看看有没有套路</button><button class="btn" id="ct-ex">载入示例</button></div></section>`;
    if (!rows) return head;
    const seen = new Set(); const uniq = rows.filter(r => { const k = (r.red ? 'R' : 'T') + (r.t.id || r.t.name); if (seen.has(k)) return false; seen.add(k); return true; });
    const red = uniq.filter(r => r.red), talk = uniq.filter(r => !r.red);
    const lvl = r => r.red ? '<span class="b risk">红线</span>' : r.t.policy ? `<span class="b risk">${esc(r.t.policy_label)}</span>` : r.t.risk === 'danger' ? '<span class="b risk">高危</span>' : r.t.risk === 'warning' ? '<span class="b vio">留意</span>' : '<span class="b">提示</span>';
    const how = r => r.red ? '不接、不回。' + esc(r.t.consequence) : esc(r.t.buyer_advice || (r.t.policy ? '灰色题材，不要跟。' : '按原话问清楚，留在平台内沟通。'));
    return head + `<div class="tiles anim"><div class="tile red"><b>${red.length}</b><span>红线词</span></div><div class="tile amber"><b>${talk.length}</b><span>套路句 / 行话</span></div><div class="tile"><b>${num((mem.ctText || '').length)}</b><span>字</span></div></div>
      ${uniq.length ? `<section class="card anim"><div class="tbl"><table class="dict"><thead><tr><th>级别</th><th>原话里的词</th><th>这是什么</th><th>怎么应对</th></tr></thead><tbody>${[...red, ...talk].map(r => `<tr><td class="nw">${lvl(r)}</td><td class="nw"><b>${esc(r.v)}</b></td><td class="wrap"><b>${esc(r.t.name)}</b>${r.t.explanation ? `<div class="xs mute">${esc(r.t.explanation.slice(0, 90))}</div>` : ''}</td><td class="wrap xs">${how(r)}</td></tr>`).join('')}</tbody></table></div><p class="cd-note">匹配只按字面，有误报就忽略。应对口径来自词典作者的买家建议和本产品的规则，不是法律意见。</p></section>` : '<section class="card anim"><p class="mute sm" style="margin:0">没匹配到词典里的套路句或红线词。不等于没问题，只是词典里没有。</p></section>'}`;
  }
  // ----- 红线警示：从暗语来源里整条剔出来的高危题材，只展示、不进流程 -----
  function renderRedline() {
    const R = SA.redline; const groups = Object.entries(SA.redline_groups).sort((a, b) => b[1] - a[1]);
    const g = SA.redline_groups[state.sc] ? state.sc : '';
    const kw = norm(state.sq);
    const rows = R.filter(r => (!g || r.label === g) && (!kw || norm(r.name).includes(kw) || norm(r.explanation || '').includes(kw) || r.variants.some(v => norm(v).includes(kw))));
    const srcName = Object.fromEntries(SA.sources.map(s => [s.key, s.name]));
    return `<section class="hero anim"><h1 class="hero-t">红线警示</h1><p class="hero-p">这 ${R.length} 条是从 ${SA.sources.length} 个来源里整条剔出来的题材：色情服务、毒品、武器、赌博、盗号洗钱、涉未成年、翻墙节点、虚拟货币换汇、代过认证。它们不进暗语词典、不进标题体检、不给任何替代写法。放在这里只有一个用处：让你认得出这些题材和它们的伪装词，离远一点。买家或同行用这些词找你，不接。</p>
      <div class="hs"><label class="fld grow"><span>搜题材、名称或写法</span><input id="sq" type="text" value="${esc(state.sq)}" placeholder="例如：梯子 / 泰达币 / 喝茶"></label></div>
      <div class="row" style="margin-top:10px"><button class="catbtn${!g ? ' on' : ''}" data-sc="">全部 <small>${R.length}</small></button>${groups.map(([k, n]) => `<button class="catbtn${k === g ? ' on' : ''}" data-sc="${esc(k)}">${esc(k)} <small>${n}</small></button>`).join('')}</div></section>
      <div class="grid three anim" style="margin-bottom:16px">${groups.map(([k, n]) => `<section class="card red"><h3><span class="b risk">${n} 条</span>${esc(k)}</h3><p class="sm" style="margin:0">${esc(SA.redline_consequence[k] || '平台直接封号处理。')}</p></section>`).join('')}</div>
      <section class="card anim"><h3>${g ? esc(g) : '全部题材'}<span class="lab">${rows.length} 条 · 写法只列前几个，够认出来就行</span></h3><div class="tbl"><table class="dict"><thead><tr><th>题材</th><th>名称 / 指什么</th><th>伪装写法</th><th>后果</th><th>来源</th></tr></thead><tbody>${rows.map(r => `<tr><td class="nw"><span class="b risk">${esc(r.label)}</span></td><td class="wrap"><b>${esc(r.name)}</b>${r.explanation ? `<div class="xs mute">${esc(r.explanation.slice(0, 90))}</div>` : ''}</td><td class="wrap xs">${esc(r.variants.slice(0, 5).join('、')) || '<span class="mute">—</span>'}${r.variants.length > 5 ? ` <span class="mute">等 ${r.variants.length} 个</span>` : ''}</td><td class="wrap xs">${esc(r.consequence)}</td><td class="nw xs mute">${esc(srcName[r.source] || r.source)}</td></tr>`).join('') || '<tr><td colspan="5" class="mute">没有符合条件的条目。</td></tr>'}</tbody></table></div>
      <p class="cd-note">题材判定按关键词规则自动做，有误判就说；「后果」是常识口径，不是法律意见。灰色题材（假货仿品、黑产工具、烟酒、医疗减肥、黄牛、盗版破解）没有放这里，它们留在暗语词典里带标签、不给替代词。</p></section>`;
  }

  // ================= 接入 =================
  function renderAccess() {
    const tools = [['check_copyright', '查版权', '名称或候选表', '红黄绿、分数、命中记录、维权方、类目', '上新品第 1 步'], ['suggest_forms', '红灯换形态', '领域或命中记录', '形态列表、等级、定价区间', '上新品第 2 步'], ['make_kit', '做素材包', '形态 + 主题词 + 平台 + 可选竞品标题', '标题 ×3（含行话）、说明、话术、问答、定价、图片参数', '上新品第 3 步'], ['lint_listing', '体检标题与说明', '文本 + 平台', '五类命中、等级、处置卡', '上新品第 4 步'], ['shop_audit', '店铺体检', '在售列表（标题、价格、想要）', '健康分、优先级、改写、新中招', '体检店铺'], ['market_view', '类目机会与风险', '类目 + 导入的搜索数据', '风险面、机会面、竞品标题体检', '找方向'], ['subscribe_diff', '名单增量', '上次版本号', '新进名称、变化的维权方', '找方向 / 体检店铺'], ['submit_record', '回流记录', '名称、平台、结果、日期、截图', '待审队列回执', '有品被处理了']];
    return `<section class="hero anim"><h1 class="hero-t">接入：一个大脑，几种接法</h1><p class="hero-p">给会用工具的人：同一套名单和规则，可以接到 AI 助手或自己的程序里。上架宝不登录、不发布、不碰账号。</p></section>
      <div class="grid three anim"><section class="card"><h3>网页工作台</h3><p class="sm">就是这个文件。离线单文件，双击打开，不联网。导入的市场数据只存在你这台电脑的浏览器里。</p><p class="lab">给谁</p><p class="sm">运营小白、个人卖家。</p></section>
      <section class="card"><h3>Skill</h3><p class="sm">现有 virtual-product-risk-checker 升级为 <code>shangjiabao</code>，子命令与八个能力一一对应。标准库、离线、名单随包分发。</p><pre>/shangjiabao pick 粉笔国考全套网盘
/shangjiabao kit --form 自制错题归纳 --topic 国考行测
/shangjiabao audit listings.json
/shangjiabao market study --import search.csv</pre><p class="lab">给谁</p><p class="sm">用 Claude、Cursor 这类助手做选品的人。</p></section>
      <section class="card"><h3>MCP · HTTP</h3><p class="sm">工具名就是能力名，JSON 进 JSON 出，输出带 list_version 与 rule_version。</p><pre>{"tool":"lint_listing",
 "input":{"text":"…","platform":"闲鱼"}}
→ {"level":"red","score":90,
   "hits":[…],"card":{…},
   "list_version":"${esc(updatedAt)}",
   "rule_version":"${esc(RULES.version)}"}</pre><p class="lab">给谁</p><p class="sm">ERP、RPA、选品 agent、发布工具。</p></section></div>
      <section class="card mt anim"><h3>八个能力</h3><div class="tbl"><table><thead><tr><th>工具名</th><th>做什么</th><th>输入</th><th>输出</th><th>网页里在哪</th></tr></thead><tbody>${tools.map(([n, w, i, o, where]) => `<tr><td class="mono">${n}</td><td>${w}</td><td class="mute xs">${i}</td><td class="xs">${o}</td><td class="xs">${where}</td></tr>`).join('')}</tbody></table></div></section>
      <div class="grid anim" style="margin-top:16px"><section class="card"><h3>书签脚本<span class="lab">零安装的数据入口</span></h3><p class="sm">在闲鱼网页版任何商品列表页（搜索结果、我发布的）点一下，读取当前页标题、价格、想要数、链接，复制成 JSON。只读你眼前这页，不登录、不请求任何接口、不发给任何人。</p><div class="row" style="margin-top:8px"><button class="btn sm dark" id="bm-copy">${icon('copy')}复制书签代码</button><button class="btn sm" id="bm-dl">${icon('down')}下载 书签脚本.js</button><button class="btn sm" data-go="market" data-tab="bm">安装步骤 →</button></div><p class="cd-note">闲鱼页面结构会变，脚本按通用方式找卡片；第一次用请核对条数。</p></section>
      <section class="card"><h3>导入格式<span class="lab">找方向与体检店铺都认</span></h3><ul class="skel"><li><b>书签</b>JSON：{source, page, keyword, captured_at, items:[{title, price, wants, views, link}]}</li><li><b>监控</b>ai-goofish-monitor 结果页导出的 CSV（搜索关键字、商品标题、当前售价、发布时间、商品链接…）；JSONL 另含想要人数与浏览量</li><li><b>执行器</b>listings.json：{snapshot_at, listings:[{title, price, …}]}</li><li><b>手贴</b>一行一个标题，可带「标题,价格」</li></ul></section></div>
      <section class="card mt anim"><h3>需求数据从哪来<span class="lab">三条来路</span></h3><div class="tbl"><table><thead><tr><th>来路</th><th>成本</th><th>怎么做</th><th>拿到什么</th><th>适合谁</th></tr></thead><tbody>${X.market_sources.map(s => `<tr><td class="nw"><b>${esc(s.name)}</b></td><td class="xs nw">${esc(s.cost)}</td><td class="xs wrap">${esc(s.how)}</td><td class="xs wrap">${esc(s.fields)}</td><td class="xs nw">${esc(s.who)}</td></tr>`).join('')}</tbody></table></div></section>
      <div class="grid anim" style="margin-top:16px"><section class="card"><h3>执行器（可选，独立组件）</h3><p class="sm">上架宝的手。只在你自己电脑上跑，只做三件事：拉在售列表、按草稿发布、按确认清单下架；第二阶段加类目搜索。真实浏览器扫码登录，不逆向签名、不破滑块、不换代理；遇到验证就停；每日上限不可解除。分开发布、分开担责。上新品第 5 步的草稿 JSON 和体检店铺的下架清单就是它的输入。</p></section>
      <section class="card"><h3>已核验的宿主与挂接点</h3><ul class="skel"><li><b>发布</b>zhinianboke/xianyu-auto-reply：发布接口前挂 lint_listing，红灯不发；风控日志回流 submit_record</li><li><b>监控</b>Usagi-org/ai-goofish-monitor：关键词任务的 CSV 直接导入找方向</li><li><b>管理</b>bixipeng/Xianyu-Auto：商品列表跑 shop_audit，下架由它自己执行</li><li><b>客服</b>shaxiu/XianyuAutoAgent：被问到作品名时查一次，不替卖家承诺侵权品</li></ul><p class="cd-note">四个都是「它们调上架宝」，上架宝永远拿不到 Cookie。</p></section></div>
      <section class="card mt anim"><h3>怎么收费</h3><dl class="kv"><dt>免费</dt><dd>网页上新品向导、skill 基础查询、公开名单、书签脚本</dd><dt>个人订阅</dt><dd>体检店铺与名单更新提醒、找方向的类目数据视图、行话词典全量、处置办法全文</dd><dt>工具方接口</dt><dd>MCP 与 HTTP，按调用量或按年</dd><dt>培训与社群</dt><dd>类目周报就是每周选题</dd></dl></section>`;
  }

  // ================= 渲染与事件 =================
  function moveIndicator() { const active = document.querySelector('.tabs button.on'), ind = document.querySelector('.tabs .ind'); if (!active || !ind) return; ind.style.width = active.offsetWidth + 'px'; ind.style.transform = `translateX(${active.offsetLeft - 3}px)`; }
  function render() {
    saveHash();
    document.querySelectorAll('[data-p]').forEach(b => b.classList.toggle('on', b.dataset.p === (state.p === 'cat' ? 'market' : state.p)));
    const fn = {home:renderHome4, market:renderSelect, pick:renderStudio, shop:renderShop6, cat:renderCat, lib:renderLib4, access:renderAccess, search:renderSearch}[state.p];
    $('main').innerHTML = fn();
    requestAnimationFrame(() => { moveIndicator(); if (state.p !== 'pick') paintKit(); bindDrop(); v4After(); });
  }
  function bindDrop() {
    const d = $('drop'); if (!d) return;
    d.addEventListener('dragover', e => { e.preventDefault(); d.classList.add('over'); }); d.addEventListener('dragleave', () => d.classList.remove('over'));
    d.addEventListener('drop', e => { e.preventDefault(); d.classList.remove('over'); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return; f.text().then(t => { if (state.p === 'shop') runShop(t, f.name); else importMarket(t, f.name); }); });
  }
  function importMarket(text, name) {
    const groups = parseImport(text, name); const n = groups.reduce((s, g) => s + g.items.length, 0);
    if (!n) { mem.importMsg = '没读到商品。支持书签脚本 JSON、ai-goofish-monitor 的 CSV / JSONL、一行一个标题。'; render(); return; }
    const cat = $('mk-cat') ? $('mk-cat').value : ''; addMarket(groups, cat); mem.marketText = '';
    mem.importMsg = `导入 ${n} 条，${groups.length} 组${groups.map(g => `（${g.keyword || '无关键词'} → ${(treeOf(g.cat) || {}).name || '未归类'}）`).join('')}。归类不对可以在下表改。`;
    const first = groups.find(g => g.cat); go({mc:first ? first.cat : state.mc});
  }
  function demoMarket() {
    const rnd = (a, b) => Math.floor(a + Math.random() * (b - a));
    const mk = (keyword, cat, titles) => ({source:'演示数据', keyword, page:'search', captured_at:new Date().toISOString(), items:titles.map(t => ({title:t, price:rnd(5, 60) + 0.9, wants:rnd(0, 120), views:rnd(50, 3000), published:`${rnd(1, 20)}天前`, link:''}))});
    const study = ['国考行测刷题计划表 每日打卡 可编辑', '粉笔国考全套网盘秒发', '2027国考申论自制笔记 思维导图', '华图行测模块宝典 PDF', '公考常识高频考点整理 自制', '国考上岸经验 备考排期表', '行测数量关系秒杀技巧 全套', '考公申论范文结构拆解 自写', '省考备考 90 天排期表 可编辑', '中公国考讲义 最新版', '行测错题本模板 自用', '国考资料 网盘打包'];
    const design = ['PS 原创海报模板 30 套 自制可商用', '站酷海报素材打包 全套', '小红书封面模板 源文件 可编辑', '简历模板 原创 50 套', '方正字体包 全套', 'PPT 模板 原创 配色方案', '手账贴纸 原创插画 自绘'];
    const demo = [mk('国考 笔记', 'study', study), mk('国考 排期表', 'study', study.slice(0, 8).map(t => t + ' ')), mk('海报模板', 'design', design)];
    demo.forEach(g => { g.items = g.items.map(i => ({...i, title:i.title.trim()})); });
    addMarket(demo, ''); demo.forEach((g, i) => { mem.market.groups[mem.market.groups.length - demo.length + i].cat = g.cat; }); store.set('sjb-market', mem.market);
    mem.importMsg = '已载入 3 组演示数据（随机价格与想要数，只为看版式；真实数据请用书签脚本或 CSV 导入）。'; go({mc:'study'});
  }
  function applyTheme(theme) { const root = document.documentElement; if (theme) root.setAttribute('data-theme', theme); else root.removeAttribute('data-theme'); const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; $('theme').textContent = dark ? '浅色' : '深色'; }
  function startPick(q, step = 1) { mem.rescuePath = ''; go({p:'pick', q:q.slice(0, 300), step, form:-1, topic:'', ti:0, tab:''}, true); }
  function init() {
    $('list-version').textContent = updatedAt; $('rule-version').textContent = RULES.version;
    let saved = null; try { saved = localStorage.getItem('sjb-theme'); } catch (_) {}
    applyTheme(saved === 'dark' || saved === 'light' ? saved : null);
    $('theme').addEventListener('click', () => { const dark = document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.hasAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches); const next = dark ? 'light' : 'dark'; applyTheme(next); try { localStorage.setItem('sjb-theme', next); } catch (_) {} });
    document.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const d = b.dataset;
      if (d.p) { const g = $('gq'); if (g) g.value = ''; go({p:d.p, tab:'', ck:'', tp:'', gq:'', sc:'', sq:'', sl:'', ss:''}, true); }
      else if (d.go !== undefined) { const ch = {p:d.go, tab:d.tab || ''}; if (d.step) ch.step = Number(d.step); if (d.mc) ch.mc = d.mc; if (d.co !== undefined) ch.co = d.co; go(ch, true); }
      else if (d.ex !== undefined) startPick(d.ex);
      else if (d.pick !== undefined) startPick(d.pick);
      else if (b.id === 'go' || b.id === 'home-go') startPick($(b.id === 'go' ? 'q' : 'home-q').value);
      else if (b.id === 'mk-q-go') { const v = $('mk-q').value.trim(); if (v) startPick(v); }
      else if (d.step !== undefined && !b.disabled) go({step:Number(d.step)}, true);
      else if (d.form !== undefined) go({form:Number(d.form), ti:0});
      else if (d.cat !== undefined) go({cat:d.cat === state.cat ? '' : d.cat, form:-1, topic:''});
      else if (d.ti !== undefined) go({ti:Number(d.ti)});
      else if (d.word !== undefined) { const w = d.word; if (mem.words.add.includes(w)) { mem.words.add = mem.words.add.filter(x => x !== w); mem.words.drop.push(w); } else if (mem.words.drop.includes(w)) mem.words.drop = mem.words.drop.filter(x => x !== w); else { const auto = autoWords(analyze(state.q.trim())); if (auto.includes(w)) mem.words.drop.push(w); else mem.words.add.push(w); } mem.desc.key = ''; render(); }
      else if (d.pal !== undefined) go({pal:Number(d.pal)});
      else if (d.dlcv !== undefined) downloadCanvas(d.dlcv, (d.dlcv === 'cv-cover' ? '主图' : '详情长图') + `_${today}.png`);
      else if (d.mc !== undefined) go({mc:d.mc});
      else if (d.mx !== undefined) { mem.mc = d.mx; render(); }
      else if (d.lc !== undefined) go({lc:d.lc === state.lc ? '' : d.lc});
      else if (d.co !== undefined) go({co:d.co});
      else if (d.tab !== undefined) go({tab:d.tab, sc:'', sq:'', sl:''});
      else if (d.sk !== undefined) go({sk:d.sk, sc:'', sl:''});
      else if (d.sc !== undefined) go({sc:d.sc, sl:''});
      else if (d.ss !== undefined) go({ss:d.ss, sl:''});
      else if (d.sl !== undefined) go({sl:d.sl});
      else if (d.lean !== undefined) { mem.rescuePath = mem.rescuePath === d.lean ? '' : d.lean; render(); }
      else if (d.gdel !== undefined) { mem.market.groups = mem.market.groups.filter(g => g.id !== d.gdel); store.set('sjb-market', mem.market); render(); }
      else if (d.new !== undefined) { go({q:'', step:1, form:-1, topic:'', ti:0}, true); }
      else if (d.copyDesc !== undefined) copyText($('desc').value);
      else if (d.copyPack !== undefined) copyText(currentPack().pack);
      else if (d.copyAppeal !== undefined) { const ev = RESCUE[state.ev]; copyText(['申诉要点：', ...ev.误判.要点.map((x, i) => `${i + 1}. ${x}`), '', '凭证：', ...ev.误判.凭证.map(x => '□ ' + x)].join('\n')); }
      else if (b.id === 'dl-pack') download(`素材包_${today}.txt`, currentPack().pack);
      else if (b.id === 'dl-draft') download(`草稿_${today}.json`, JSON.stringify(currentPack().draft, null, 2), 'application/json');
      else if (b.id === 'desc-regen') { mem.desc = {key:'', text:''}; render(); }
      else if (b.id === 'wt-go') runWords();
      else if (b.id === 'wt-ex') { mem.wtText = X.word_examples.join('\n'); runWords(); }
      else if (b.id === 'wt-market') { mem.wtText = unique([...(mem.wtText || '').split('\n').filter(Boolean), ...mem.market.groups.filter(g => g.page !== 'mine').flatMap(g => g.items).map(i => i.title)]).join('\n'); runWords(); }
      else if (b.id === 'ct-go') runChat();
      else if (b.id === 'ct-ex') { mem.ctText = X.chat_examples.join('\n'); runChat(); }
      else if (b.id === 'word-go') render();
      else if (b.id === 'word-ex') { mem.wordText = X.word_examples.join('\n'); render(); }
      else if (b.id === 'shop-go') runShop();
      else if (b.id === 'shop-ex') { runShop(X.shop_examples.join('\n')); }
      else if (b.id === 'shop-clear') { mem.shopText = ''; mem.shopRows = []; mem.offSel = new Set(); mem.importMsg = ''; render(); }
      else if (b.id === 'shop-csv') exportCSV();
      else if (b.id === 'off-all') { mem.shopRows.filter(r => r.level === 'red').forEach(r => mem.offSel.add(r.text)); render(); }
      else if (b.id === 'off-json') { const rows = mem.shopRows.filter(r => mem.offSel.has(r.text)).sort((a, b) => b.card.score - a.card.score); download(`下架清单_${today}.json`, JSON.stringify({snapshot_at:new Date().toISOString(), list_version:updatedAt, rule_version:RULES.version, offline:rows.map((r, i) => ({priority:i + 1, title:r.text, link:r.meta.link || '', score:r.card.score, reasons:r.reasons}))}, null, 2), 'application/json'); }
      else if (b.id === 'rq-go') { mem.rescuePath = ''; go({ev:$('ev').value, rq:$('rq').value.slice(0, 300)}); }
      else if (b.id === 'mq-go') go({q:$('mq').value.slice(0, 300)});
      else if (b.id === 'mk-go') importMarket($('mk-text').value, '');
      else if (b.id === 'mk-demo') demoMarket();
      else if (b.id === 'mk-bm') go({tab:'bm'});
      else if (b.id === 'mk-clear') { mem.market = {groups:[]}; store.del('sjb-market'); mem.importMsg = '已清除全部市场数据。'; render(); }
      else if (b.id === 'bm-copy') copyText('javascript:' + X.bookmarklet);
      else if (b.id === 'bm-dl') download('书签脚本.js', '// 上架宝书签脚本：把下面整行存成收藏夹网址\njavascript:' + X.bookmarklet, 'text/javascript;charset=utf-8');
      else if (b.id === 'recent-clear') { store.del('sjb-recent'); render(); }
      else if (b.id === 'sr-go') { const rec = {name:$('sr-name').value.trim(), platform:$('sr-plat').value, result:$('sr-res').value, date:$('sr-date').value || new Date().toISOString().slice(0, 10), submitted_by:'（匿名或署名）', status:'待审'}; $('sr-out').innerHTML = rec.name ? `<pre>${esc(JSON.stringify(rec, null, 2))}</pre><p class="cd-note">审核通过后脱敏并入公开名单，原始提交只进私库。</p>` : '<p class="cd-note">先填名称。</p>'; }
    });
    document.addEventListener('change', e => {
      const t = e.target;
      if (t.id === 'platform') go({platform:t.value});
      else if (t.id === 'topic') go({topic:t.value.slice(0, 60), ti:0});
      else if (t.id === 'shop-sub') { mem.shopSub = t.checked; render(); }
      else if (t.id === 'ev') go({ev:t.value});
      else if (t.id === 'co') go({co:t.value.slice(0, 60)});
      else if (t.id === 'lq') go({lq:t.value.slice(0, 60)});
      else if (t.id === 'sq') go({sq:t.value.slice(0, 60), sl:''});
      else if (t.id === 'fill-交付' || t.id === 'fill-时效') { mem.fill[t.id.slice(5)] = t.value.slice(0, 80); mem.desc.key = ''; render(); }
      else if (t.id === 'fill-price') { mem.fill.price = t.value.slice(0, 20); }
      else if (t.dataset.gcat !== undefined) { const g = mem.market.groups.find(x => x.id === t.dataset.gcat); if (g) { g.cat = t.value; store.set('sjb-market', mem.market); render(); } }
      else if (t.dataset.off !== undefined) { if (t.checked) mem.offSel.add(t.dataset.off); else mem.offSel.delete(t.dataset.off); render(); }
    });
    let liveTimer; const LIVE_INPUTS = {sq:['sq', 60, {sl:''}], lq:['lq', 60, {}], co:['co', 60, {}]};
    document.addEventListener('input', e => { const id = e.target.id; if (id === 'desc') { mem.desc.text = e.target.value; paintKit(); } if (id === 'shop-text') mem.shopText = e.target.value; if (id === 'word-text') mem.wordText = e.target.value; if (id === 'wt-text') mem.wtText = e.target.value; if (id === 'ct-text') mem.ctText = e.target.value; if (id === 'mk-text') mem.marketText = e.target.value;
      if (LIVE_INPUTS[id]) { const [k, max, extra] = LIVE_INPUTS[id]; const v = e.target.value.slice(0, max); clearTimeout(liveTimer); liveTimer = setTimeout(() => { if (state[k] === v) return; go({[k]:v, ...extra}); const el = $(id); if (el) { el.focus(); try { el.setSelectionRange(el.value.length, el.value.length); } catch (_) {} } }, 220); } });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const id = e.target.id;
      if (id === 'q' || id === 'home-q') startPick(e.target.value);
      else if (id === 'mk-q') { const v = e.target.value.trim(); if (v) startPick(v); }
      else if (['topic', 'co', 'lq', 'fill-交付', 'fill-时效', 'fill-price'].includes(id)) e.target.blur();
      else if (id === 'rq') { mem.rescuePath = ''; go({ev:$('ev').value, rq:e.target.value.slice(0, 300)}); }
      else if (id === 'mq') go({q:e.target.value.slice(0, 300)});
      else if ((id === 'shop-text' || id === 'word-text' || id === 'mk-text' || id === 'wt-text' || id === 'ct-text') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); if (id === 'shop-text') runShop(); else if (id === 'mk-text') importMarket(e.target.value, ''); else if (id === 'wt-text') runWords(); else if (id === 'ct-text') runChat(); else render(); }
    });
    window.addEventListener('resize', moveIndicator);
    window.addEventListener('hashchange', () => { readHash(); render(); });
    readHash(); const g0 = $('gq'); if (g0) g0.value = state.gq; render();
  }
/*__V3__*/
  init();
