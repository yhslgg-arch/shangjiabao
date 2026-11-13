
  // ================= v7：情报库统一成「对齐的行 + 详情面板」 =================
  // 列表不再用横向滚动的表格；点一行，电脑从右侧滑出详情，手机从底部弹出。
  // 这里重新声明的 fbar / flApply / libList / libSlang / libChat / libRaw / libRed / libJargon / renderHolders 会覆盖前面文件里的同名函数。
  const FGL = {k:'类型', s:'平台现状', c:'分类', g:'', n:'', m:''};
  function fbar(id, o = {}) {
    const lab = o.labels || {};
    return `<div class="fbar f2 anim" data-fl="${id}">
      <div class="f-top"><label class="fq">${ic('search')}<input data-fq type="search" placeholder="${esc(o.ph || '在这一页里筛')}" autocomplete="off"></label>
        ${(o.sel || []).map(([k, l, opts]) => `<select data-fs="${k}" aria-label="${l}"><option value="">${l}：全部</option>${opts.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select>`).join('')}
        <b class="fcount" data-fc></b><button class="f-clr" data-fclr hidden>${ic('x')}清除筛选</button></div>
      ${(o.chips || []).length ? `<div class="f-chips">${o.chips.map(([k, opts]) => { const l = lab[k] !== undefined ? lab[k] : FGL[k]; return `<div class="fgrp">${l ? `<span class="fgl">${l}</span>` : ''}${opts.map(([v, t, n, cls]) => `<button class="catbtn ${cls || ''}" data-fk="${k}" data-fv="${esc(v)}">${esc(t)}<small>${n}</small></button>`).join('')}</div>`; }).join('')}</div>` : ''}</div>`;
  }
  function flApply(box) {
    const id = box.dataset.fl, st = FL[id] || (FL[id] = {q:''}), root = $(id); if (!root) return;
    const q = (st.q || '').trim().toLowerCase(); let n = 0, any = !!q;
    for (const k in st) if (k !== 'q' && st[k]) any = true;
    for (const r of root.querySelectorAll('.fr')) { let ok = !q || r.dataset.t.includes(q); if (ok) for (const k in st) if (k !== 'q' && st[k] && r.dataset[k] !== st[k]) { ok = false; break; } r.hidden = !ok; if (ok) n++; }
    box.querySelector('[data-fc]').textContent = num(n) + ' 条';
    box.querySelectorAll('[data-fk]').forEach(b => b.classList.toggle('on', (st[b.dataset.fk] || '') === b.dataset.fv));
    box.querySelectorAll('select[data-fs]').forEach(s => { s.value = st[s.dataset.fs] || ''; });
    const i = box.querySelector('[data-fq]'); if (i && i.value !== (st.q || '')) i.value = st.q || '';
    const c = box.querySelector('[data-fclr]'); if (c) c.hidden = !any;
    const e = document.querySelector(`[data-fe="${id}"]`); if (e) e.hidden = n > 0;
    root.querySelectorAll('[data-fsec]').forEach(s => { s.hidden = !s.querySelector('.fr:not([hidden])'); });
  }
  const fEmpty = id => `<p class="f-empty" data-fe="${id}" hidden>${ic('search')}没有符合的内容。换个词，或者点「清除筛选」。</p>`;
  const chev7 = ic('chevron', 'rchev');
  const labB = r => r.labels.map(l => `<span class="b ${isClaim(l) ? 'risk' : ''}">${esc(l)}</span>`).join('');

  // ---------- 版权名单 ----------
  const recRow = r => `<button class="fr qrow" data-sh="rec:${r.id}" data-t="${esc([r.name, ...r.variants, ...r.companies, ...r.registrations].join(' ').toLowerCase())}" data-c="${esc(r.category)}" data-o="${esc(r.object_type)}" data-n="${NEW_IDS.has(r.id) ? 1 : ''}" data-m="${r.labels.some(isClaim) ? 1 : ''}"><span class="qnm"><b>${esc(r.name)}</b>${NEW_IDS.has(r.id) ? '<span class="b reg">新</span>' : ''}${labB(r)}</span><span class="qm"><span>${esc(r.category)}</span><span>${esc(r.object_type)}</span><span class="el">${esc(r.companies.join('、') || '没有登记权利人')}</span></span>${chev7}</button>`;
  const recHead = '<div class="qhead"><span>名字</span><span>领域</span><span>类型</span><span>权利人</span><i></i></div>';
  function libList() {
    return `${fbar('fl-list', {ph:'搜名字、公司、登记号', sel:[['c', '领域', cnt(records, r => r.category).map(([k, n]) => [k, `${k}（${n}）`])], ['o', '类型', cnt(records, r => r.object_type).map(([k, n]) => [k, `${k}（${n}）`])]], chips:[['n', [['1', '本期新进', fresh.length, 'regc']]], ['m', [['1', '被维权过', records.filter(r => r.labels.some(isClaim)).length, 'riskc']]]]})}
      <p class="rw-hint anim">${ic('info')}点任意一行，看这个名字的登记信息、为什么危险、哪些不能做、哪些能做、可以换什么方向。</p>
      <div class="qrows rl anim" id="fl-list">${recHead}${records.map(recRow).join('')}</div>${fEmpty('fl-list')}`;
  }

  // ---------- 暗语 / 聊天话术 / 红线：同一种行 ----------
  function termRow(t) {
    const txt = [t.name, ...t.variants, t.explanation, t.category_name].join(' ').toLowerCase();
    return `<button class="fr qrow" id="t-${t.id}" data-sh="term:${t.id}" data-t="${esc(txt)}" data-k="${t.kind}" data-c="${esc(t.category_name)}" data-s="${t.liveness || 'none'}" data-g="${t.policy ? 'grey' : ''}"><span class="qs"><span class="b ${liveCls(t.liveness)}">${liveName(t.liveness)}</span></span><span class="qnm"><b>${esc(t.name)}</b>${t.policy ? `<span class="b risk">${esc(t.policy_label)}</span>` : ''}${t.risk ? `<span class="b ${t.risk === 'danger' ? 'risk' : t.risk === 'warning' ? 'vio' : 'reg'}">${RISKN4[t.risk] || t.risk}</span>` : ''}<small class="pv">${esc((t.explanation || t.variants.slice(0, 8).join('、')).slice(0, 110))}</small></span><span class="qm"><span>${esc(t.category_name)}</span><span class="mono">${t.variants.length} 种写法</span></span>${chev7}</button>`;
  }
  const exRow = (r, i) => `<button class="fr qrow" data-sh="ex:${i}" data-t="${esc([r.n, ...r.v, r.e].join(' ').toLowerCase())}" data-k="extra" data-c="" data-s="none" data-g=""><span class="qs"><span class="b">网友补充</span></span><span class="qnm"><b>${esc(r.n)}</b><small class="pv">${esc((r.e || r.v.slice(0, 8).join('、')).slice(0, 110))}</small></span><span class="qm"><span>${esc(srcNames[r.k] || '')}</span><span class="mono">${r.v.length ? r.v.length + ' 种写法' : ''}</span></span>${chev7}</button>`;
  const termHead = '<div class="qhead"><span>现状</span><span>词条</span><span>分类</span><span>写法</span><i></i></div>';
  function libSlang() {
    const rows = SA.terms;
    return `${fbar('fl-slang', {ph:'搜暗语：名字、写法、意思', sel:[['c', '分类', cnt(rows, t => t.category_name).map(([k, n]) => [k, `${k}（${n}）`])]], chips:[['k', [...Object.entries(KINDS).map(([k, n]) => [k, n, rows.filter(t => t.kind === k).length]), ['extra', '网友补充', EXTRA.length]]], ['s', liveChips(rows)], ['g', [['grey', '灰色题材', rows.filter(t => t.policy).length, 'riskc']]]]})}
      <div class="qrows rt anim" id="fl-slang">${termHead}${rows.map(termRow).join('')}${EXTRA.map(exRow).join('')}</div>${fEmpty('fl-slang')}`;
  }
  function libChat() {
    return `${fbar('fl-chat', {ph:'搜话术', sel:[['c', '分类', cnt(TALK, t => t.category_name).map(([k, n]) => [k, `${k}（${n}）`])]], chips:[['s', liveChips(TALK)]]})}
      <div class="qrows rt anim" id="fl-chat">${termHead}${TALK.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0)).map(termRow).join('')}</div>${fEmpty('fl-chat')}<h2 class="sec-t anim">${ic('search')}贴聊天记录查</h2>${renderChat()}`;
  }
  function libRaw() {
    const keys = Object.keys(RAW), k = keys.includes(state.sc) ? state.sc : keys[0], rows = RAW[k], meta = SA.sources.find(s => s.key === k) || {};
    return `<div class="srcs anim">${keys.map(x => { const m = SA.sources.find(s => s.key === x) || {}; return `<button class="srcb${x === k ? ' on' : ''}" data-sc="${x}">${ic(m.kind === '网站' ? 'globe' : 'code')}<b>${esc((m.name || x).split('（')[0])}</b><small>${num(RAW[x].length)} 条 · ${num(RAW[x].reduce((a, r) => a + r.v.length, 0))} 写法</small></button>`; }).join('')}</div>
      <section class="card anim srcm">${ic('link')}<b>${esc(meta.name || k)}</b><span class="b">${esc(meta.repo || '')}</span><span class="b slate">${esc(meta.license || '')}</span><span class="b">取用 ${esc(meta.fetched || '')}</span><span class="b reg">原始词条 · 未筛未改</span></section>
      ${fbar('fl-raw', {ph:'在这个来源里搜', sel:[['c', '分类', cnt(rows, r => r.c).map(([c, n]) => [c, `${c}（${n}）`])]]})}
      <div class="qrows rt anim" id="fl-raw">${rows.map((r, i) => `<button class="fr qrow" data-sh="raw:${k}:${i}" data-t="${esc([r.n, ...r.v, r.e].join(' ').toLowerCase())}" data-c="${esc(r.c)}"><span class="qs"><span class="b slate">原件</span></span><span class="qnm"><b>${esc(r.n)}</b><small class="pv">${esc((r.e || r.v.slice(0, 8).join('、')).slice(0, 110))}</small></span><span class="qm"><span>${esc(r.c || '')}</span><span class="mono">${r.v.length ? r.v.length + ' 种写法' : ''}</span></span>${chev7}</button>`).join('')}</div>${fEmpty('fl-raw')}`;
  }
  const redRow = (r, i) => `<button class="fr qrow" data-sh="red:${i}" data-t="${esc([r.name, ...r.variants, r.explanation || ''].join(' ').toLowerCase())}" data-c="${esc(r.label)}"><span class="qnm"><b>${esc(r.name)}</b><small class="pv two">${esc((r.explanation || '').slice(0, 140))}</small></span><span class="qm"><span class="rcq">${ic('alert')}${esc((r.consequence || '').split(/[。；]/)[0])}</span><span class="mono">${r.variants.length ? r.variants.length + ' 种写法' : ''}</span></span>${chev7}</button>`;
  function libRed() {
    const rows = SA.redline, groups = cnt(rows, r => r.label);
    return `<section class="card anim red warn4">${ic('alert')}<span><b>这些题材不能卖</b><small>写进标题或聊天会被封号，有些直接违法。上新时碰到这些，工具不会出方案。这里只用来认。</small></span></section>
      ${fbar('fl-red', {ph:'搜红线题材', chips:[['c', groups.map(([k, n]) => [k, k, n, 'riskc'])]], labels:{c:'题材'}})}
      <div id="fl-red" class="redg">${groups.map(([g, n]) => `<section class="redsec anim" data-fsec><h3>${ic('ban')}${esc(g)}<span>${n} 条</span></h3><div class="qrows rr">${rows.map((r, i) => r.label === g ? redRow(r, i) : '').join('')}</div></section>`).join('')}</div>${fEmpty('fl-red')}`;
  }

  // ---------- 行话 ----------
  function libJargon() {
    const ST = {ok:['可进标题', 'reg'], care:['只进详情', 'vio'], ban:['不用', 'risk']};
    const cname = k => k === '*' ? '通用' : (treeOf(k) || {}).name || k;
    return `${fbar('fl-jar', {ph:'搜行话', chips:[['s', Object.entries(ST).map(([k, v]) => [k, v[0], JARGON.filter(j => j.status === k).length, k === 'ok' ? 'regc' : k === 'ban' ? 'riskc' : ''])], ['c', cnt(JARGON, j => j.cat).map(([k, n]) => [k, cname(k), n])]], labels:{s:'用法', c:'品类'}})}
      <div class="qrows rj anim" id="fl-jar"><div class="qhead"><span>词</span><span>用法</span><span>品类</span><span>怎么用</span></div>${JARGON.map(j => `<div class="fr qrow" data-t="${esc((j.word + ' ' + j.note).toLowerCase())}" data-s="${j.status}" data-c="${esc(j.cat)}"><b class="jw">${esc(j.word)}</b><span class="js"><span class="b ${ST[j.status][1]}">${ST[j.status][0]}</span></span><span class="jc">${esc(cname(j.cat))}</span><span class="jn">${esc(j.note)}${j.source ? `<small>${esc(j.source)}</small>` : ''}</span></div>`).join('')}</div>${fEmpty('fl-jar')}`;
  }

  // ---------- 谁在投诉 ----------
  function renderHolders() {
    const hs = [...holderStats.values()].sort((a, b) => b.count - a.count);
    if (state.co) { FL['fl-hold'] = {q:state.co}; }
    return `${fbar('fl-hold', {ph:'搜公司名，例如：版锐'})}
      <p class="rw-hint anim">${ic('info')}点一家公司，看它是谁、常用什么手段、盯着哪些名字。</p>
      <div class="qrows rh anim" id="fl-hold"><div class="qhead"><span>公司</span><span>盯着</span><span>本期新增</span><span>常用手段</span><i></i></div>${hs.map(h => `<button class="fr qrow" data-sh="co:${esc(h.name)}" data-t="${esc((h.name + ' ' + holderType(h.name) + ' ' + holderNote(h.name)).toLowerCase())}"><span class="qnm"><b>${esc(h.name)}</b><small class="pv">${esc(holderType(h.name))}${holderNote(h.name) ? ' · ' + esc(holderNote(h.name)) : ''}</small></span><span class="qm"><span class="hnum"><b>${num(h.count)}</b> 个名字</span><span class="hnum ${h.fresh ? 'qup' : ''}">${h.fresh ? '+' + h.fresh : '—'}</span><span class="hmeans">${[...h.means].map(x => `<span class="b risk">${esc(x)}</span>`).join('') || '<span class="b">没有记录</span>'}</span></span>${chev7}</button>`).join('')}</div>${fEmpty('fl-hold')}`;
  }

  // ================= 详情面板 =================
  const byName7 = new Map(records.map(r => [r.name, r]));
  const sx = (cls, icn, title, body, extra = '') => body ? `<section class="sx ${cls}"><h4><span class="sxi">${ic(icn)}</span>${title}${extra ? `<small>${extra}</small>` : ''}</h4>${body}</section>` : '';
  const sl7 = (items, cls) => items.length ? `<ul class="qlist ${cls}">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const para = t => t && String(t).trim() ? `<p class="qp">${esc(t)}</p>` : '';
  const chipsAll = (vs, cls = '') => vs.length ? `<div class="vars sv">${vs.map(v => `<span class="b ${cls}">${esc(v)}</span>`).join('')}</div>` : '';
  const LVN = {red:'红灯', amber:'黄灯', green:'绿灯'};
  const isDont = s => /^(不要|不卖|不用|不做|别|放弃|禁止)/.test(s);
  function sheetRec(r) {
    const card = advise('matched', r), forms = FORMS[r.category] || FORMS._default;
    const acts = card.actions || [], dont = unique([...forms.filter(f => f.level === 'red').map(f => `${f.name}：${f.note}`), ...acts.filter(isDont)]), can = acts.filter(a => !isDont(a));
    const okForms = forms.filter(f => f.level !== 'red');
    const plats = Object.entries(card.platforms || {}), others = r.variants.filter(v => v !== r.name);
    const ck = DOMAIN_CAT[r.category], tree = ck ? treeOf(ck) : null;
    const mates = unique(r.companies.flatMap(c => (holderStats.get(c) || {ids:[]}).ids)).filter(id => id !== r.id).map(id => byId.get(id)).filter(Boolean);
    return {kind:'版权名单', body:`
      <h2 class="sh-t">${esc(r.name)}</h2>
      <div class="sh-bs">${NEW_IDS.has(r.id) ? '<span class="b reg">本期新进</span>' : ''}${labB(r)}<span class="b slate">${esc(r.category)}</span><span class="b">${esc(r.object_type)}</span></div>
      <div class="qinfo"><div><small>领域</small><b>${esc(r.category)}</b></div><div><small>类型</small><b>${esc(r.object_type)}</b></div>
        <div class="w2"><small>权利人</small>${r.companies.length ? r.companies.map(c => `<button class="link" data-sh="co:${esc(c)}">${esc(c)}</button>`).join('') : '<b>名单里没有登记</b>'}</div>
        ${r.registrations.length ? `<div class="w2"><small>作品登记号</small><b class="mono">${esc(r.registrations.join('、'))}</b></div>` : ''}
        ${others.length ? `<div class="w2"><small>其它写法</small>${chipsAll(others)}</div>` : ''}
        <div class="w2"><small>核实情况</small><b>${r.verification === 'unverified' ? '按公开投诉名单原样收录，没有逐条核实' : esc(r.verification || '—')}</b></div></div>
      <div class="vd ${card.level}"><div class="vd-r"><span class="vd-l">${LVN[card.level]}</span><b>${esc(card.title)}</b><span class="vd-s">风险 ${card.score}<i style="--w:${card.score}%"></i></span></div><p>${esc(card.headline)}</p></div>
      ${sx('k-why', 'bulb', '为什么要小心', sl7(card.meaning, 'q-d'))}
      ${sx('k-no', 'ban', '不能做', sl7(dont, 'q-x'))}
      ${sx('k-ok', 'check', '可以这样做', sl7(can, 'q-v'))}
      ${sx('k-ok', 'layers', '能做的商品形态', okForms.length ? `<div class="fms">${okForms.map(f => `<div class="fm ${f.level}"><b>${esc(f.name)}</b><span class="b ${f.level === 'green' ? 'reg' : 'vio'}">${f.level === 'green' ? '可以做' : '有条件'}</span><p>${esc(f.note)}</p></div>`).join('')}</div>` : '')}
      ${sx('k-dir', 'target', '换个方向', sl7(card.alternatives, 'q-a'))}
      ${sx('k-doc', 'file', '想卖正版，先拿到这些', chipsAll(card.docs, 'slate'))}
      ${sx('k-plat', 'globe', '各平台怎么看', plats.length ? `<dl class="pl">${plats.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : '')}
      ${sx('k-who', 'scale', '谁在盯这个名字', r.companies.length ? `<div class="hcs">${r.companies.map(c => `<button class="qhc" data-sh="co:${esc(c)}">${holderHTML(c)}${chev7}</button>`).join('')}</div>` : '')}
      ${sx('k-who', 'list', '同一家还盯着', mates.length ? `<div class="vars sv">${mates.slice(0, 14).map(m => `<button class="chip" data-sh="rec:${m.id}">${esc(m.name)}</button>`).join('')}</div>${mates.length > 14 ? `<p class="cd-note">共 ${mates.length} 个，点上面的公司看全部。</p>` : ''}` : '')}
      ${sx('k-chk', 'shield', '上架前四查', `<ul class="cks">${card.checklist.map(c => { const [k, v] = c.split('：'); return `<li class="${v === '已查' ? 'done' : ''}"><i>${v === '已查' ? ic('check') : ''}</i><span>${esc(k)}</span><em>${esc(v || '')}</em></li>`; }).join('')}</ul>`)}
      <p class="cd-note">${esc(card.notice)}</p>`,
      foot:`<button class="btn" data-shcopy="${esc(r.name)}">${ic('copy')}复制名字</button>${tree ? `<button class="btn" ${navAttr({p:'cat', ck})}>${ic('book')}品类档案</button>` : ''}<button class="btn" ${navAttr({p:'lib', tab:'list', lc:r.category})}>${ic('list')}同领域名单</button>`};
  }
  function sheetCo(name) {
    const h = holderStats.get(name) || {name, count:0, fresh:0, means:new Set(), cats:new Map(), ids:[]};
    const cats = [...h.cats.entries()].sort((a, b) => b[1] - a[1]), rs = h.ids.map(id => byId.get(id)).filter(Boolean);
    return {kind:'谁在投诉', body:`
      <h2 class="sh-t">${esc(name)}</h2>
      <div class="sh-bs"><span class="b slate">${esc(holderType(name))}</span>${[...h.means].map(x => `<span class="b risk">${esc(x)}</span>`).join('')}</div>
      ${para(holderNote(name))}
      <div class="qinfo q3"><div><small>盯着的名字</small><b class="qbig">${num(h.count)}</b></div><div><small>本期新增</small><b class="qbig ${h.fresh ? 'qup' : ''}">${h.fresh ? '+' + h.fresh : '0'}</b></div><div><small>最集中的领域</small><b>${esc(cats[0] ? cats[0][0] : '—')}</b></div></div>
      ${sx('k-why', 'bulb', '碰到它的东西怎么办', sl7(['标题、图片、说明里不要出现它名下的作品名、课程名、品牌名。', '想卖它的东西，只有拿到它的授权或走正规分销这一条路。', '同主题可以做自己写的笔记、模板、答疑服务，不带它的名字。'], 'q-d'))}
      ${sx('k-plat', 'layers', '它盯的领域', cats.length ? `<div class="vars sv">${cats.map(([c, n]) => `<span class="b">${esc(c)} · ${n}</span>`).join('')}</div>` : '')}
      ${sx('k-who', 'list', '它盯着的名字', rs.length ? `<div class="qrows qmini">${rs.slice(0, 200).map(r => `<button class="qrow" data-sh="rec:${r.id}"><span class="qnm"><b>${esc(r.name)}</b>${NEW_IDS.has(r.id) ? '<span class="b reg">新</span>' : ''}${labB(r)}<small class="pv">${esc(r.category)} · ${esc(r.object_type)}</small></span>${chev7}</button>`).join('')}</div>${rs.length > 200 ? '<p class="cd-note">只显示前 200 个。在版权名单里搜这家公司可以看全部。</p>' : ''}` : '', `${rs.length} 个`)}`,
      foot:`<button class="btn" data-shcopy="${esc(name)}">${ic('copy')}复制公司名</button><button class="btn" ${navAttr({p:'lib', tab:'list', lq:name})}>${ic('list')}名单里看全部</button>`};
  }
  const liveSay = {killed:'平台已经在拦这个词，写了会被处理。', watching:'平台在抽查，随时可能被处理。', active:'目前还能搜到，不代表安全。'};
  function sheetTerm(t) {
    return {kind:t.kind === 'talk' ? '聊天话术' : '暗语词典', body:`
      <h2 class="sh-t">${esc(t.name)}</h2>
      <div class="sh-bs"><span class="b ${liveCls(t.liveness)}">${liveName(t.liveness)}</span>${t.policy ? `<span class="b risk">${esc(t.policy_label)}</span>` : ''}${t.risk ? `<span class="b ${t.risk === 'danger' ? 'risk' : t.risk === 'warning' ? 'vio' : 'reg'}">${RISKN4[t.risk] || t.risk}</span>` : ''}<span class="b slate">${esc(KINDS[t.kind])} · ${esc(t.category_name)}</span></div>
      ${liveSay[t.liveness] ? `<div class="vd ${t.liveness === 'killed' ? 'red' : t.liveness === 'watching' ? 'amber' : 'green'}"><div class="vd-r"><span class="vd-l">${liveName(t.liveness)}</span><b>${liveSay[t.liveness]}</b></div>${t.trend ? `<p>${esc(t.trend)}</p>` : ''}</div>` : ''}
      ${sx('k-why', 'bulb', '是什么意思', para(t.explanation))}
      ${sx('k-plat', 'type', '常见写法', chipsAll(t.variants), `${t.variants.length} 种`)}
      ${sx('k-dir', 'target', '卖家为什么这么写', para(t.seller_intent))}
      ${sx('k-ok', 'users', '给买家的提醒', para(t.buyer_advice))}
      ${sx('k-no', 'alert', '给卖家的提醒', para(t.seller_advice))}
      ${sx('k-plat', 'refresh', '接替写法', chipsAll(t.successors || []))}
      ${!liveSay[t.liveness] ? sx('k-plat', 'trend', '现状', para(t.trend)) : ''}
      ${kvs([['平台', (t.platforms || []).join('、')], ['收录时间', t.since], ['票数', t.votes ? t.votes + ' 票' : ''], ['来源', t.source.map(s => srcNames[s] || s).join(' + ')]])}`,
      foot:`<button class="btn" data-shcopy="${esc(t.name)}">${ic('copy')}复制词条名</button>`};
  }
  function sheetLoose(r, kind) {
    return {kind, body:`<h2 class="sh-t">${esc(r.n)}</h2>${r.c ? `<div class="sh-bs"><span class="b slate">${esc(r.c)}</span></div>` : ''}
      ${sx('k-why', 'bulb', '是什么意思', para(r.e))}
      ${sx('k-plat', 'type', '常见写法', chipsAll(r.v), r.v.length ? `${r.v.length} 种` : '')}
      ${kvs([...Object.entries(r.m || {}), ['来源', srcNames[r.k] || r.k || '']])}`, foot:`<button class="btn" data-shcopy="${esc(r.n)}">${ic('copy')}复制词条名</button>`};
  }
  function sheetRed(r) {
    return {kind:'红线题材', body:`
      <h2 class="sh-t">${esc(r.name)}</h2>
      <div class="sh-bs"><span class="b risk">${esc(r.label)}</span>${r.category_name ? `<span class="b slate">${esc(r.category_name)}</span>` : ''}</div>
      <div class="vd red"><div class="vd-r"><span class="vd-l">不能卖</span><b>${esc(r.consequence || '碰了会被封号，有些直接违法。')}</b></div><p>上新时输入这类东西，工具不会出方案。这一页只用来认。</p></div>
      ${sx('k-why', 'bulb', '这是什么', para(r.explanation))}
      ${sx('k-no', 'alert', '提醒', para(r.buyer_advice))}
      ${sx('k-plat', 'type', '别人常见的写法', chipsAll(r.variants, 'risk'), r.variants.length ? `${r.variants.length} 种 · 看到就绕开` : '')}
      ${kvs([['来源', srcNames[r.source] || r.source]])}`, foot:''};
  }
  function sheetOf(key) {
    const i = key.indexOf(':'), k = key.slice(0, i), v = key.slice(i + 1);
    if (k === 'rec') { const r = byId.get(v); return r ? sheetRec(r) : null; }
    if (k === 'co') return sheetCo(v);
    if (k === 'term') { const t = SA.terms.find(x => String(x.id) === v); return t ? sheetTerm(t) : null; }
    if (k === 'ex') return EXTRA[+v] ? sheetLoose(EXTRA[+v], '网友补充') : null;
    if (k === 'red') return SA.redline[+v] ? sheetRed(SA.redline[+v]) : null;
    if (k === 'raw') { const j = v.lastIndexOf(':'), r = (RAW[v.slice(0, j)] || [])[+v.slice(j + 1)]; return r ? sheetLoose(r, '来源原件') : null; }
    return null;
  }
  const shStack = []; let shFocus = null;
  function shEl() {
    let el = $('sheet'); if (el) return el;
    el = document.createElement('div'); el.id = 'sheet'; el.className = 'sheet';
    el.innerHTML = `<div class="sh-bg" data-shx></div><aside class="sh-box" role="dialog" aria-modal="true" aria-label="详情"><header class="sh-h"><button class="sh-ib" data-shback aria-label="返回上一个" hidden>${ic('arrow', 'bk')}</button><span class="sh-k"></span><button class="sh-ib" data-shx aria-label="关闭">${ic('x')}</button></header><div class="sh-b"></div><footer class="sh-f"></footer></aside>`;
    document.body.appendChild(el); return el;
  }
  function shPaint() {
    const el = shEl(), s = sheetOf(shStack[shStack.length - 1]); if (!s) { shClose(); return; }
    el.querySelector('.sh-k').textContent = s.kind; el.querySelector('[data-shback]').hidden = shStack.length < 2;
    const b = el.querySelector('.sh-b'); b.innerHTML = s.body; b.scrollTop = 0;
    const f = el.querySelector('.sh-f'); f.innerHTML = s.foot || ''; f.hidden = !s.foot;
  }
  function shOpen(key, push) {
    if (!sheetOf(key)) return false;
    const el = shEl(), was = el.classList.contains('on');
    if (!was) { shStack.length = 0; shFocus = document.activeElement; }
    if (!push) shStack.length = 0; shStack.push(key); shPaint();
    if (!was) { el.classList.add('on'); document.documentElement.classList.add('sh-lock'); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in'))); el.querySelector('[data-shx].sh-ib').focus({preventScroll:true}); }
    return true;
  }
  function shClose() {
    const el = $('sheet'); if (!el || !el.classList.contains('on')) return;
    el.classList.remove('in'); document.documentElement.classList.remove('sh-lock'); shStack.length = 0;
    setTimeout(() => { if (!el.classList.contains('in')) el.classList.remove('on'); }, 260);
    if (shFocus && document.contains(shFocus)) shFocus.focus({preventScroll:true}); shFocus = null;
  }
  // 捕获阶段先处理：详情面板的开关；名单里的名字不再跳去上新，改成看详情
  document.addEventListener('click', e => {
    const b = e.target.closest('button, [data-shx]'); if (!b) return;
    const d = b.dataset, inSheet = !!b.closest('#sheet');
    if (d.shx !== undefined) { shClose(); e.stopPropagation(); return; }
    if (d.shback !== undefined) { shStack.pop(); shPaint(); e.stopPropagation(); return; }
    if (d.shcopy !== undefined) { copyText(d.shcopy); e.stopPropagation(); return; }
    if (d.sh) { if (shOpen(d.sh, inSheet)) e.stopPropagation(); return; }
    if (d.pick !== undefined && (b.classList.contains('chip') || b.classList.contains('link')) && byName7.has(d.pick)) { shOpen('rec:' + byName7.get(d.pick).id, inSheet); e.stopPropagation(); return; }
    if (d.fclr !== undefined) { const box = b.closest('[data-fl]'); FL[box.dataset.fl] = {q:''}; flApply(box); e.stopPropagation(); return; }
    if (d.sidetg !== undefined) { b.closest('.side').classList.toggle('open'); e.stopPropagation(); return; }
    if (inSheet && d.nav) shClose();
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('sheet') && $('sheet').classList.contains('on')) shClose(); });
  function v7After() {
    if (state.p !== 'lib') { if ($('sheet') && $('sheet').classList.contains('on') && !shStack.length) shClose(); return; }
    if (state.sl) { const k = 'term:' + state.sl; state.sl = ''; shOpen(k); }
    else if (state.tab === 'holders' && state.co) { const c = state.co; state.co = ''; if (holderStats.has(c)) shOpen('co:' + c); }
  }
