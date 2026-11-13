
  // ===== v4：图标、首页、情报库全量浏览（不截断、按来源整份看） =====
  const ICONS = {
    dot:'<circle cx="12" cy="12" r="3"/>', sparkles:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>', pulse:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    db:'<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    alert:'<path d="M12 4 2.5 20h19zM12 10v4m0 3v.5"/>', ban:'<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>', check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>', type:'<path d="M5 7V4h14v3M12 4v16M9 20h6"/>',
    tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.2"/>', coin:'<circle cx="12" cy="12" r="9"/><path d="m9 8 3 4 3-4M12 12v5M9.5 13.5h5"/>',
    truck:'<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8"/><circle cx="6.5" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>', box:'<path d="M12 3 3 7.5v9L12 21l9-4.5v-9zM3 7.5 12 12l9-4.5M12 12v9"/>',
    chat:'<path d="M4 5h16v11H9l-5 4z"/>', down:'<path d="M12 4v12m-6-5 6 6 6-6M5 21h14"/>', copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5h10"/>',
    sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M16 4v4M10 10v4M18 16v4"/>', layers:'<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5"/>',
    users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-4 3-6 6.500-6s6 2 6.500 6M16 4.500a3.500 3.500 0 0 1 0 7M18 14c2 .7 3.200 2.500 3.500 6"/>',
    flame:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>', eye:'<path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    zap:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', list:'<path d="M8 6h13M8 12h13M8 18h13M3.500 6h.01M3.500 12h.01M3.500 18h.01"/>', camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.500"/>',
    key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/>', link:'<path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>',
    star:'<path d="m12 3 2.700 5.800 6.300.800-4.600 4.300 1.200 6.200L12 17l-5.600 3.100 1.200-6.200L3 9.600l6.300-.8z"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    file:'<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>', scale:'<path d="M12 4v16M6 20h12M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    refresh:'<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>', plus:'<path d="M12 5v14M5 12h14"/>', arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>', chevron:'<path d="m9 5 7 7-7 7"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>', bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.500c.700.700 1 1.500 1 2.500h6c0-1 .300-1.800 1-2.500A6 6 0 0 0 12 3z"/>',
    trend:'<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>', heart:'<path d="M12 20s-8-5-8-11a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z"/>', game:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.500 12.500h3M15.500 11.500h.01M18 13.500h.01"/>',
    palette:'<path d="M12 3a9 9 0 1 0 0 18c1.500 0 2-1 2-2 0-1.500 1-2 2-2h2a3 3 0 0 0 3-3c0-5-4-9-9-9z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7.500" r="1"/><circle cx="16" cy="10" r="1"/>',
    code:'<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>', music:'<path d="M9 18V5l11-2v13"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="17.500" cy="16" r="2.500"/>', shirt:'<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
    watch:'<circle cx="12" cy="12" r="6"/><path d="M9 6.500 9.500 3h5l.5 3.500M9 17.500l.5 3.500h5l.5-3.500M12 9.500V12l1.500 1"/>', gem:'<path d="M6 3h12l4 6-10 12L2 9zM2 9h20M9 3l-2 6 5 12 5-12-2-6"/>', paw:'<circle cx="6" cy="11" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="15" cy="6" r="2"/><circle cx="18.500" cy="11" r="2"/><path d="M8 17c0-2.500 2-4.500 4.200-4.500S16.500 14.500 16.500 17c0 2-2 2.500-4.300 2.500S8 19 8 17z"/>',
    phone:'<rect x="7" y="2" width="10" height="20" rx="2.500"/><path d="M11 18.500h2"/>', pc:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>', book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 0 2 2h13"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.500 3 14.500 0 18M12 3c-3 3.500-3 14.500 0 18"/>', cart:'<path d="M3 4h2.500l2.500 12h10l2-8H7"/><circle cx="9.500" cy="19.500" r="1.500"/><circle cx="16.500" cy="19.500" r="1.500"/>',
    gift:'<rect x="3" y="9" width="18" height="12" rx="1.500"/><path d="M12 9v12M3 13h18M12 9c-4 0-5-5-2-5 2 0 2 3 2 5zM12 9c4 0 5-5 2-5-2 0-2 3-2 5z"/>', bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13v2M15 13v2M2 14h2M20 14h2"/>',
    card:'<rect x="2" y="5" width="20" height="14" rx="2.500"/><path d="M2 10h20M6 15h4"/>', smoke:'<path d="M3 15h14v3H3zM20 15v3M17 10c0-2 3-2 3-4.500M13.500 10c0-2 3-2 3-4.500"/>', lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>', x:'<path d="m6 6 12 12M18 6 6 18"/>', save:'<path d="M5 3h11l3 3v15H5zM8 3v6h7V3M8 21v-7h8v7"/>', wand:'<path d="m4 20 11-11M14 5l1-2 1 2 2 1-2 1-1 2-1-2-2-1zM18 13l.700-1.500.700 1.500 1.500.700-1.500.700-.700 1.500-.700-1.500-1.500-.700z"/>',
  };
  const ic = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${(ICONS[n] || ICONS.dot).replace(/(\d)\.(\d)00\b/g, '$1.$2')}</svg>`;
  const CAT_ICON = {gongkao:'book', lang:'globe', k12:'bulb', biz:'trend', fin:'coin', ecom:'cart', design:'palette', soft:'code', health:'heart', art:'music', eng:'sliders', law:'scale', media:'image', ip:'star', emo:'chat', agent:'file', ai:'bot', member:'card', res:'layers', game:'game', acct:'key', task:'zap',
    phone:'phone', elec:'zap', pc:'pc', cam:'camera', console:'game', lux:'gem', watch:'watch', shoe:'shirt', goods:'gift', toy:'box', card:'card', beauty:'heart', pet:'paw', tobacco:'smoke'};
  const catIcon = c => ic(CAT_ICON[c.key] || 'box');
  const cu = n => `<b data-cu="${n}">${num(n)}</b>`;
  const RAW = X.raw_sources, RAW_N = Object.values(RAW).reduce((s, v) => s + v.length, 0), RAW_V = Object.values(RAW).reduce((s, v) => s + v.reduce((a, r) => a + r.v.length, 0), 0);

  // ================= 首页 =================
  // 各来源里没并进词典的词条，补到暗语词典里（网友补充）
  const SEEN = new Set(); [...SA.terms, ...SA.redline].forEach(t => [t.name, ...t.variants].forEach(v => SEEN.add(String(v).toLowerCase())));
  const EXTRA = []; { const got = new Set(); for (const k in RAW) for (const r of RAW[k]) { const ks = [r.n, ...r.v].map(x => String(x).toLowerCase()); if (ks.some(x => SEEN.has(x)) || got.has(ks[0])) continue; got.add(ks[0]); EXTRA.push(Object.assign({k}, r)); } }
  function renderHome4() {
    const items = store.get('sjb-items', []);
    const acts = [['compass', '选品', '看哪些品类能做', {p:'market'}, 'grn'], ['pulse', '诊断', '查在售标题有没有问题', {p:'shop'}, 'amb'], ['grid', '品类档案', '每个品类有哪些坑', {p:'cat'}, 'vio'], ['db', '情报库', '违禁词、暗语、版权名单', {p:'lib'}, 'slate']];
    const stats = [['ban', BANNED_ALL.length, '违禁词', 'banned'], ['file', records.length, '被投诉过的名字', 'list'], ['eye', SA.counts.variants, '暗语写法', 'slang'], ['chat', TALK.length, '聊天套路话', 'chat'], ['alert', SA.redline.length, '红线题材', 'redline']];
    const fIcon = {red:'alert', amber:'flame', green:'check'};
    return `<section class="hero4 anim"><div class="h4-l"><span class="pill">${ic('sparkles')}上架工作台</span><h1>给我一个品<br><em>标题、图片、文案一次备齐</em></h1>
        <button class="btn acc xl home-cta" ${navAttr({p:'pick'})}>${ic('sparkles')}开始生成上架内容${ic('arrow')}</button>
        <p class="home-sub">选平台、选数量、填品名，三步出标题、说明和图片</p>
        <div class="h4-f">${[['type', '多角度标题'], ['image', '主图 + 副图'], ['file', '详情说明'], ['coin', '定价'], ['truck', '交付发货'], ['shield', '违禁词体检']].map(([i, t]) => `<span>${ic(i)}${t}</span>`).join('')}</div></div>
      <div class="h4-r" aria-hidden="true">${[['#ff5a36', '痛点直击', 0], ['#1f6feb', '清单一图', 1], ['#111', '自用背书', 2]].map(([c, t, i]) => `<div class="fc fc${i}" style="--c:${c}"><i></i><b>${t}</b><u></u><u></u><s>${ic('check')}绿灯</s></div>`).join('')}</div></section>
      <section class="hdiag anim"><div class="hd-l"><span class="pill dk">${ic('pulse')}标题诊断</span><h2>贴一条标题，查它会不会违规</h2>
          <div class="bigin"><span class="bi">${ic('type')}</span><input id="home-d" type="text" placeholder="例如：粉笔国考全套网盘 秒发" autocomplete="off" aria-label="要检查的标题"><button class="btn acc lg" id="home-d-go">${ic('search')}检查标题</button></div>
          <p class="hd-n">已经发布的、准备发的都可以查。只在这台电脑上检查，不上传。<button class="link" ${navAttr({p:'shop'})}>一次查很多条${ic('chevron')}</button></p></div>
        <ol class="hd-steps">${[['type', '贴标题', '一条在售的或打算写的标题'], ['db', '自动对四个库', '违禁词、被投诉过的名字、暗语、极限词'], ['check', '看结果', '红色必须改，黄色建议改，每一处都告诉你换成什么']].map(([i, t, d], k) => `<li><span class="hs-i">${ic(i)}</span><b>${k + 1}. ${t}</b><small>${d}</small></li>`).join('')}</ol></section>
      <h2 class="sec-t anim">${ic('db')}情报库<span class="lab">点一个问题，直接看答案</span><button class="link xs" ${navAttr({p:'lib'})}>进情报库${ic('chevron')}</button></h2>
      <div class="libs q home-libs anim">${libCards().map(libCard).join('')}</div>
      <button class="hsel anim" ${navAttr({p:'market'})}><span class="ai">${ic('compass')}</span><span><b>还不知道卖什么？</b><small>${CATS.length} 个品类，每个都写清了：新手能不能做、要准备什么、容易踩什么坑</small></span><em>去选品${ic('arrow')}</em></button>`;
  }

  // ================= 情报库：全量浏览 =================
  const FL = {}; let flKey = '';
  function fbar(id, o = {}) {
    return `<div class="fbar anim" data-fl="${id}"><label class="fq">${ic('search')}<input data-fq type="search" placeholder="${esc(o.ph || '在这一页里筛')}" autocomplete="off"></label><b class="fcount" data-fc></b>
      ${(o.sel || []).map(([k, lab, opts]) => `<select data-fs="${k}" aria-label="${lab}"><option value="">${lab}：全部</option>${opts.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select>`).join('')}
      ${o.open ? `<button class="btn sm" data-fopen="${id}">${ic('layers')}全部展开</button>` : ''}
      ${(o.chips || []).map(([k, opts]) => `<div class="fgrp"><button class="catbtn" data-fk="${k}" data-fv="">全部</button>${opts.map(([v, t, n, cls]) => `<button class="catbtn ${cls || ''}" data-fk="${k}" data-fv="${esc(v)}">${esc(t)} <small>${n}</small></button>`).join('')}</div>`).join('')}</div>`;
  }
  function flApply(box) {
    const id = box.dataset.fl, st = FL[id] || (FL[id] = {q:''}), root = $(id); if (!root) return;
    const q = (st.q || '').trim().toLowerCase(); let n = 0;
    for (const r of root.querySelectorAll('.fr')) { let ok = !q || r.dataset.t.includes(q); if (ok) for (const k in st) if (k !== 'q' && st[k] && r.dataset[k] !== st[k]) { ok = false; break; } r.hidden = !ok; if (ok) n++; }
    box.querySelector('[data-fc]').textContent = num(n) + ' 条';
    box.querySelectorAll('[data-fk]').forEach(b => b.classList.toggle('on', (st[b.dataset.fk] || '') === b.dataset.fv));
    box.querySelectorAll('select[data-fs]').forEach(s => { s.value = st[s.dataset.fs] || ''; });
    const i = box.querySelector('[data-fq]'); if (i && i.value !== (st.q || '')) i.value = st.q || '';
  }
  const kvs = pairs => { const r = pairs.filter(([, v]) => v && String(v).trim()); return r.length ? `<dl class="kv dk">${r.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''; };
  const varChips = (vs, cls = '') => vs.length ? `<div class="vars">${vs.map(v => `<span class="b ${cls}">${esc(v)}</span>`).join('')}</div>` : '';
  const RISKN4 = {danger:'高危', warning:'留心', safe:'安全'};
  function termRow(t) {
    const txt = [t.name, ...t.variants, t.explanation, t.category_name].join(' ').toLowerCase();
    return `<details class="fr tr" id="t-${t.id}" data-t="${esc(txt)}" data-k="${t.kind}" data-c="${esc(t.category_name)}" data-s="${t.liveness || 'none'}" data-g="${t.policy ? 'grey' : ''}">
      <summary><span class="b ${liveCls(t.liveness)}">${liveName(t.liveness)}</span><b class="tn">${esc(t.name)}</b>${t.policy ? `<span class="b risk">${esc(t.policy_label)}</span>` : ''}${t.risk ? `<span class="b ${t.risk === 'danger' ? 'risk' : t.risk === 'warning' ? 'vio' : 'reg'}">${RISKN4[t.risk] || t.risk}</span>` : ''}<span class="b slate">${esc(KINDS[t.kind])} · ${esc(t.category_name)}</span><span class="cnt">${t.variants.length} 种写法${t.votes ? ` · ${t.votes} 票` : ''}</span>${ic('chevron', 'chev')}
        <span class="pv">${esc(t.variants.slice(0, 8).join('、'))}${t.variants.length > 8 ? ' …' : ''}</span></summary>
      ${varChips(t.variants)}${kvs([['是什么', t.explanation], ['卖家用意', t.seller_intent], ['买家建议', t.buyer_advice], ['卖家建议', t.seller_advice], ['接替写法', (t.successors || []).join('、')], ['现状', t.trend], ['平台', (t.platforms || []).join('、')], ['收录', t.since], ['来源', t.source.map(s => srcNames[s] || s).join(' + ')]])}</details>`;
  }
  const cnt = (arr, fn) => { const m = new Map(); arr.forEach(x => { const k = fn(x); m.set(k, (m.get(k) || 0) + 1); }); return [...m.entries()].sort((a, b) => b[1] - a[1]); };
  const liveChips = rows => ['killed', 'watching', 'active', 'none'].map(k => [k, k === 'none' ? '没标注' : LIVE[k], rows.filter(t => (t.liveness || 'none') === k).length, '']);
  function libSlang() {
    const rows = SA.terms;
    return `${fbar('fl-slang', {ph:'筛暗语：名字、写法、解释', open:1, sel:[['c', '分类', cnt(rows, t => t.category_name).map(([k, n]) => [k, `${k}（${n}）`])]], chips:[['k', [...Object.entries(KINDS).map(([k, n]) => [k, n, rows.filter(t => t.kind === k).length]), ['extra', '网友补充', EXTRA.length]]], ['s', liveChips(rows)], ['g', [['grey', '灰色题材', rows.filter(t => t.policy).length]]]]})}
      <div class="trs" id="fl-slang">${rows.map(termRow).join('')}${EXTRA.map(r => `<details class="fr tr" data-t="${esc([r.n, ...r.v, r.e].join(' ').toLowerCase())}" data-k="extra" data-c="" data-s="none" data-g=""><summary><span class="b">网友补充</span><b class="tn">${esc(r.n)}</b><span class="cnt">${r.v.length ? r.v.length + ' 种写法' : ''}</span>${ic('chevron', 'chev')}<span class="pv">${esc(r.e ? r.e.slice(0, 90) : r.v.slice(0, 8).join('、'))}</span></summary>${varChips(r.v)}${kvs([['是什么', r.e], ...Object.entries(r.m), ['来源', srcNames[r.k] || r.k]])}</details>`).join('')}</div>`;
  }
  function libChat() {
    return `${fbar('fl-chat', {ph:'筛话术', open:1, sel:[['c', '分类', cnt(TALK, t => t.category_name).map(([k, n]) => [k, `${k}（${n}）`])]], chips:[['s', liveChips(TALK)]]})}
      <div class="trs" id="fl-chat">${TALK.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0)).map(termRow).join('')}</div><h2 class="sec-t anim">${ic('search')}贴聊天记录查</h2>${renderChat()}`;
  }
  function libRaw() {
    const keys = Object.keys(RAW), k = keys.includes(state.sc) ? state.sc : keys[0], rows = RAW[k], meta = SA.sources.find(s => s.key === k) || {};
    return `<div class="srcs anim">${keys.map(x => { const m = SA.sources.find(s => s.key === x) || {}; return `<button class="srcb${x === k ? ' on' : ''}" data-sc="${x}">${ic(m.kind === '网站' ? 'globe' : 'code')}<b>${esc((m.name || x).split('（')[0])}</b><small>${num(RAW[x].length)} 条 · ${num(RAW[x].reduce((a, r) => a + r.v.length, 0))} 写法</small></button>`; }).join('')}</div>
      <section class="card anim srcm">${ic('link')}<b>${esc(meta.name || k)}</b><span class="b">${esc(meta.repo || '')}</span><span class="b slate">${esc(meta.license || '')}</span><span class="b">取用 ${esc(meta.fetched || '')}</span><span class="b reg">原始词条 · 未筛未改</span></section>
      ${fbar('fl-raw', {ph:'在这个来源里筛', open:1, sel:[['c', '分类', cnt(rows, r => r.c).map(([c, n]) => [c, `${c}（${n}）`])]]})}
      <div class="trs" id="fl-raw">${rows.map(r => `<details class="fr tr" data-t="${esc([r.n, ...r.v, r.e].join(' ').toLowerCase())}" data-c="${esc(r.c)}"><summary><b class="tn">${esc(r.n)}</b>${r.c ? `<span class="b slate">${esc(r.c)}</span>` : ''}<span class="cnt">${r.v.length ? r.v.length + ' 种写法' : ''}</span>${ic('chevron', 'chev')}<span class="pv">${esc(r.e ? r.e.slice(0, 90) : r.v.slice(0, 8).join('、'))}</span></summary>${varChips(r.v)}${kvs([['释义', r.e], ...Object.entries(r.m)])}</details>`).join('')}</div>`;
  }
  function libRed() {
    const rows = SA.redline;
    return `<section class="card anim red warn4">${ic('alert')}<span><b>这些题材不能卖</b><small>写进标题或聊天会被封号，有些直接违法。上新时碰到这些，工具不会出方案。</small></span></section>
      ${fbar('fl-red', {ph:'筛红线题材', chips:[['c', cnt(rows, r => r.label).map(([k, n]) => [k, k, n, 'riskc'])]]})}
      <div class="trs" id="fl-red">${rows.map(r => `<details class="fr tr" open data-t="${esc([r.name, ...r.variants, r.explanation || ''].join(' ').toLowerCase())}" data-c="${esc(r.label)}"><summary><span class="b risk">${esc(r.label)}</span><b class="tn">${esc(r.name)}</b><span class="cnt">${r.variants.length ? r.variants.length + ' 种写法' : ''}</span>${ic('chevron', 'chev')}</summary>${varChips(r.variants, 'risk')}${kvs([['是什么', r.explanation], ['提醒', r.buyer_advice], ['后果', r.consequence], ['原分类', r.category_name], ['来源', srcNames[r.source] || r.source]])}</details>`).join('')}</div>`;
  }
  function libBanned() {
    return `${fbar('fl-ban', {ph:'筛拦截词'})}<div id="fl-ban" class="bgs">${Object.entries(GROUPS_ALL).map(([k, g]) => { const ts = BANNED_ALL.filter(t => t.group === k); return `<section class="card anim bg ${g.level === 'red' ? 'red' : ''}"><h3>${ic(g.level === 'red' ? 'ban' : 'alert')}${esc(g.name)}<span class="lab">${ts.length} 个</span></h3><div class="vars big">${ts.map(t => `<span class="b fr ${g.level === 'red' ? 'risk' : 'vio'}" data-t="${esc((t.term + ' ' + (t.note || '')).toLowerCase())}"${t.note ? ` title="${esc(t.note)}"` : ''}>${esc(t.term)}${t.note ? `<i>${esc(t.note)}</i>` : ''}</span>`).join('')}</div>${g.advice ? `<p class="cd-note">${ic('bulb')}${esc(g.advice)}</p>` : ''}${g.source ? `<p class="cd-note">${ic('link')}${esc(g.source)}</p>` : ''}</section>`; }).join('')}</div>`;
  }
  function libJargon() {
    const ST = {ok:['可进标题', 'reg'], care:['只进详情', 'vio'], ban:['不用', 'risk']};
    const cname = k => k === '*' ? '通用' : (treeOf(k) || {}).name || k;
    return `${fbar('fl-jar', {ph:'筛行话', chips:[['s', Object.entries(ST).map(([k, v]) => [k, v[0], JARGON.filter(j => j.status === k).length])], ['c', cnt(JARGON, j => j.cat).map(([k, n]) => [k, cname(k), n])]]})}
      <section class="card anim"><div class="tbl"><table class="dict" id="fl-jar"><thead><tr><th>词</th><th>用法</th><th>类目</th><th>说明</th><th>来源</th></tr></thead><tbody>${JARGON.map(j => `<tr class="fr" data-t="${esc((j.word + ' ' + j.note).toLowerCase())}" data-s="${j.status}" data-c="${esc(j.cat)}"><td class="nw"><b>${esc(j.word)}</b></td><td class="nw"><span class="b ${ST[j.status][1]}">${ST[j.status][0]}</span></td><td class="xs nw">${esc(cname(j.cat))}</td><td class="wrap xs">${esc(j.note)}</td><td class="xs mute">${esc(j.source || '')}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function libList() {
    return `${fbar('fl-list', {ph:'筛名单：名字、公司、登记号', sel:[['c', '领域', cnt(records, r => r.category).map(([k, n]) => [k, `${k}（${n}）`])], ['o', '类型', cnt(records, r => r.object_type).map(([k, n]) => [k, `${k}（${n}）`])]], chips:[['n', [['1', '本期新进', fresh.length, 'regc']]], ['m', [['1', '带维权标签', records.filter(r => r.labels.some(isClaim)).length, 'riskc']]]]})}
      <section class="card anim"><div class="tbl"><table class="dict" id="fl-list"><thead><tr><th>名字</th><th>领域</th><th>类型</th><th>标签</th><th>权利人</th><th>其它写法 / 登记号</th></tr></thead><tbody>${records.map(r => `<tr class="fr" data-t="${esc([r.name, ...r.variants, ...r.companies, ...r.registrations].join(' ').toLowerCase())}" data-c="${esc(r.category)}" data-o="${esc(r.object_type)}" data-n="${NEW_IDS.has(r.id) ? 1 : ''}" data-m="${r.labels.some(isClaim) ? 1 : ''}"><td class="wrap"><button class="link" data-pick="${esc(r.name)}">${esc(r.name)}</button>${NEW_IDS.has(r.id) ? ' <span class="b reg">新</span>' : ''}</td><td class="xs">${esc(r.category)}</td><td class="xs nw">${esc(r.object_type)}</td><td>${r.labels.map(l => `<span class="b ${isClaim(l) ? 'risk' : ''}">${esc(l)}</span>`).join(' ')}</td><td class="xs wrap">${esc(r.companies.join('、'))}</td><td class="xs mute wrap">${esc([...r.variants.filter(v => v !== r.name), ...r.registrations].join('、'))}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  // 给用户看的板块；raw（各来源原件）和 src（来源致谢）不进导航，只留内部入口
  const LIB4 = [['hub', '总览', 'grid'], ['banned', '违禁词', 'ban'], ['list', '版权名单', 'file'], ['slang', '暗语词典', 'eye'], ['redline', '红线题材', 'alert'], ['chat', '聊天话术', 'chat'], ['jargon', '行话', 'tag'], ['holders', '谁在投诉', 'scale'], ['phys', '实物规则', 'box'], ['matrix', '平台规则', 'layers'], ['topic', '专题', 'flame'], ['words', '标题找词', 'wand']];
  const LIB_HIDE = ['raw', 'src'];
  // 左侧目录的分组：以后加新板块，往 LIB4 加一项，再把它的 key 放进下面某一组（或新开一组）
  const LIB_GROUPS = [['先查一查', ['hub', 'words']], ['不能写、不能卖', ['banned', 'list', 'redline', 'phys']], ['看懂别人在说什么', ['slang', 'chat', 'jargon']], ['平台和投诉方', ['matrix', 'holders']], ['专题', ['topic']]];
  const LIBTIP = {
    banned:['写进标题会被平台拦下或限流的词', '发布前对一遍，红色的必须换掉，紫色的尽量不用'],
    list:['被权利人投诉过的课程、书、软件、品牌名字', '标题、图片、说明里出现这些名字，容易被投诉下架'],
    slang:['别人标题里看不懂的怪词是什么意思，平台现在拦不拦', '标「被拦」的说明平台已经盯上，跟着写一样会被处理'],
    redline:['碰了就封号、甚至违法的题材', '只用来认，这些东西不要卖'],
    chat:['买家、卖家聊天里常见的套路话', '看懂对方想干什么，别被带到平台外交易'],
    jargon:['同行常用、可以正常写的词', '绿色的可以放进标题，紫色的只放说明里'],
    holders:['哪些公司在投诉、起诉卖家', '卖相关的东西之前，先看它管得严不严'],
    matrix:['同一件事，各个平台分别怎么处理', ''],
    phys:['卖实物之前先查：这东西能不能卖、要准备什么', '红色的不要发；紫色的满足条件才能发'],
    words:['不知道标题用什么词？把同行的标题贴进来挑', ''],
    topic:['每个专题回答一个问题', '点开就是答案'],
  };
  const libCards = () => [['banned', 'ban', '这个词能写进标题吗？', '违禁词', `${num(BANNED_ALL.length)} 个`, 'risk'], ['list', 'file', '这个名字能卖吗？', '版权名单', `${num(records.length)} 个`, 'risk'], ['phys', 'box', '这件实物能不能卖？', '实物规则', `${PB.length + PBR.length + PQ.length} 条`, 'risk'], ['redline', 'alert', '哪些东西绝对不能碰？', '红线题材', `${SA.redline.length} 条`, 'risk'],
    ['slang', 'eye', '别人标题里的怪词是什么意思？', '暗语词典', `${num(SA.counts.terms + EXTRA.length)} 条`, 'vio'], ['chat', 'chat', '聊天里对方这句话想干什么？', '聊天话术', `${TALK.length} 条`, 'vio'], ['jargon', 'tag', '同行都在用哪些正常的词？', '行话', `${JARGON.length} 个`, 'reg'], ['words', 'wand', '标题不知道用什么词？', '标题找词', '', 'reg'],
    ['holders', 'scale', '谁在投诉卖家？', '谁在投诉', `${holderStats.size} 家`, 'slate'], ['matrix', 'layers', '各个平台分别怎么罚？', '平台规则', '', 'slate'], ['topic', 'flame', '最近有什么新变化？', '专题', `${TOPICS.length} 个`, 'slate']];
  const libCard = ([k, i, q, t, m, c]) => `<button class="lib ${c}" ${navAttr({p:'lib', tab:k})}><span class="li">${ic(i)}</span><span class="lq">${q}</span><span class="m">${t}${m ? ' · ' + m : ''}${ic('arrow', 'go')}</span></button>`;
  function libHub() {
    const live = {killed:0, watching:0, active:0}; SA.terms.forEach(t => { if (live[t.liveness] !== undefined) live[t.liveness]++; });
    const libs = [['banned', 'ban', '这个词能写进标题吗？', '违禁词', `${num(BANNED_ALL.length)} 个`, 'risk'], ['list', 'file', '这个名字能卖吗？', '版权名单', `${num(records.length)} 个`, 'risk'], ['phys', 'box', '这件实物能不能卖？', '实物规则', `${PB.length + PBR.length + PQ.length} 条`, 'risk'], ['slang', 'eye', '别人标题里的怪词是什么意思？', '暗语词典', `${num(SA.counts.terms + EXTRA.length)} 条`, 'vio'], ['redline', 'alert', '哪些东西绝对不能碰？', '红线题材', `${SA.redline.length} 条`, 'risk'],
      ['chat', 'chat', '聊天里对方这句话想干什么？', '聊天话术', `${TALK.length} 条`, 'vio'], ['jargon', 'tag', '同行都在用哪些正常的词？', '行话', `${JARGON.length} 个`, 'reg'], ['holders', 'scale', '谁在投诉卖家？', '谁在投诉', `${holderStats.size} 家`, 'slate'], ['matrix', 'layers', '各个平台分别怎么罚？', '平台规则', '', 'slate']];
    return `<section class="hubq anim"><h2>${ic('search')}输入一个词，查它能不能用</h2><div class="bigin"><span class="bi">${ic('search')}</span><input id="hub-q" type="search" placeholder="例如：正版、粉笔、克劳德、加微信" autocomplete="off" aria-label="查词"><button class="btn acc lg" id="hub-go">查一下</button></div></section>
      <h2 class="sec-t anim">${ic('compass')}你想知道什么</h2>
      <div class="libs q anim">${libCards().map(libCard).join('')}</div>
      <div class="row anim quick"><span class="mute xs">暗语现状</span>${[['killed', '已被平台拦', live.killed, 'risk', 'ban'], ['watching', '平台在抽查', live.watching, 'vio', 'eye'], ['active', '目前还能搜到', live.active, 'reg', 'check']].map(([k, n, c, cls, i]) => `<button class="b ${cls} bbtn" ${navAttr({p:'lib', tab:'slang', ss:k})}>${ic(i)}${n} ${c}</button>`).join('')}<button class="b bbtn" ${navAttr({p:'lib', tab:'topic', tp:'new-list'})}>${ic('plus')}本期新增名字 ${fresh.length}</button></div>
      <h2 class="sec-t anim">${ic('flame')}专题<span class="lab">${TOPICS.length}</span></h2><div class="tpcs anim">${TOPICS.map(topicCard).join('')}</div>
`;
  }
  function renderLib4() {
    const t = LIB4.some(x => x[0] === state.tab) || LIB_HIDE.includes(state.tab) ? state.tab : 'hub';
    const key = t + '|' + (t === 'raw' ? state.sc : '');
    if (key !== flKey) { flKey = key; for (const k in FL) delete FL[k]; FL['fl-slang'] = {q:'', s:state.ss || ''}; FL['fl-list'] = {q:state.lq || '', c:state.lc || ''}; FL['fl-chat'] = {q:'', c:t === 'chat' ? state.sc : ''}; }
    const LIBN = {banned:BANNED_ALL.length, list:records.length, slang:SA.counts.terms + EXTRA.length, redline:SA.redline.length, chat:TALK.length, jargon:JARGON.length, holders:holderStats.size, topic:TOPICS.length};
    const cur7 = LIB4.find(y => y[0] === t) || LIB4[0];
    const side = `<aside class="side lib-side" aria-label="情报库目录"><button class="side-cur" data-sidetg>${ic(cur7[2])}<span>${cur7[1]}</span><em>换一个板块</em>${ic('chevron')}</button>${LIB_GROUPS.map(([g, ks]) => `<p class="sg">${g}</p>` + ks.map(k => { const x = LIB4.find(y => y[0] === k); return `<button class="${k === t ? 'on' : ''}" ${navAttr({p:'lib', tab:k === 'hub' ? '' : k})}>${ic(x[2])}<span>${x[1]}</span>${LIBN[k] ? `<small>${num(LIBN[k])}</small>` : ''}</button>`; }).join('')).join('')}</aside>`;
    const tip = LIBTIP[t] ? `<div class="libtip anim">${ic('bulb')}<b>${LIBTIP[t][0]}</b>${LIBTIP[t][1] ? `<span>${LIBTIP[t][1]}</span>` : ''}</div>` : '';
    return `<div class="lr">${side}<div class="lr-main">${tip}${({hub:libHub, topic:renderTopic, list:libList, holders:renderHolders, phys:libPhys, jargon:libJargon, slang:libSlang, raw:libRaw, banned:libBanned, chat:libChat, matrix:renderMatrix, redline:libRed, words:renderWords, src:renderSources}[t])()}</div></div>`;
  }
  document.addEventListener('click', e => { if (e.target.closest('#hub-go')) { const v = $('hub-q').value.trim(); if (v) go({p:'search', gq:v}); } });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'hub-q') { const v = e.target.value.trim(); if (v) go({p:'search', gq:v}); } });

  // ----- 渲染后：筛选、数字滚动、定位词条、上新画图 -----
  function v4After() {
    document.querySelectorAll('[data-fl]').forEach(flApply);
    document.querySelectorAll('[data-cu]').forEach(el => { const to = +el.dataset.cu, t0 = performance.now(); if (matchMedia('(prefers-reduced-motion: reduce)').matches || to < 10) return; const step = now => { const p = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - p, 3); el.textContent = num(Math.round(to * e)); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
    if (state.p === 'lib' && state.sl) { const el = $('t-' + state.sl); if (el) { el.hidden = false; el.open = true; el.classList.add('flash'); el.scrollIntoView({block:'center'}); } }
    if (state.p === 'pick') paintStudio();
    v7After();
  }
  document.addEventListener('input', e => { const i = e.target.closest('[data-fq]'); if (!i) return; const box = i.closest('[data-fl]'); (FL[box.dataset.fl] || (FL[box.dataset.fl] = {})).q = i.value; flApply(box); });
  document.addEventListener('change', e => { const s = e.target.closest('select[data-fs]'); if (!s) return; const box = s.closest('[data-fl]'); (FL[box.dataset.fl] || (FL[box.dataset.fl] = {q:''}))[s.dataset.fs] = s.value; flApply(box); });
  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.fk !== undefined) { const box = b.closest('[data-fl]'), st = FL[box.dataset.fl] || (FL[box.dataset.fl] = {q:''}); st[b.dataset.fk] = st[b.dataset.fk] === b.dataset.fv ? '' : b.dataset.fv; flApply(box); }
    else if (b.dataset.fopen) { const all = [...$(b.dataset.fopen).querySelectorAll('details:not([hidden])')], open = !all.every(d => d.open); all.forEach(d => { d.open = open; }); b.lastChild.textContent = open ? '全部收起' : '全部展开'; }
  });
