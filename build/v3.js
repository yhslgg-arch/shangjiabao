  // ===== v3 工作台：首页五个入口、选品台、品类档案、情报库（总览 / 专题 / 数据来源）、全站搜索 =====
  const CATS = X.cats, IDEAS = X.ideas;
  const catOf = key => CATS.find(c => c.key === key) || null;
  const navAttr = o => `data-nav="${esc(JSON.stringify(o))}"`;
  const navGo = o => go({tab:'', sc:'', sq:'', sl:'', ss:'', tp:'', ck:'', ...o}, true);
  const STANCE = {ok:['适合新手', 'reg'], care:['审核紧，先看清', 'vio'], warn:['只做警示', 'risk']};
  const GROUPS_ALL = {...X.banned_groups, ...X.banned_extra.groups};
  const BANNED_ALL = [...BANNED.terms, ...X.banned_extra.terms];
  const TALK = SA.terms.filter(t => t.kind === 'talk');
  // 真正的聊天话术：去掉归在话术里的商品代称和网络梗
  const TALK_SAID = TALK.filter(t => !['通用话术', '网络梗与代称'].includes(t.category_name));
  const srcNames = Object.fromEntries(SA.sources.map(s => [s.key, s.name]));

  const catCache = new Map();
  function catStats(c) {
    if (catCache.has(c.key)) return catCache.get(c.key);
    const recs = records.filter(r => c.domains.includes(r.category));
    const hc = new Map(); recs.forEach(r => r.companies.forEach(x => hc.set(x, (hc.get(x) || 0) + 1)));
    const sl = SA.terms.filter(t => t.kind === c.kind && c.slang.includes(t.category_name));
    const live = {killed:0, watching:0, active:0, none:0}; sl.forEach(t => live[t.liveness || 'none']++);
    const s = {recs, n:recs.length, fresh:recs.filter(r => NEW_IDS.has(r.id)).length, claim:recs.filter(r => r.labels.some(isClaim)), holders:[...hc.entries()].sort((a, b) => b[1] - a[1]), sl, live, grey:sl.filter(t => t.policy).length,
      buyer:sl.filter(t => t.liveness === 'active' && !t.policy && t.risk !== 'danger')};
    catCache.set(c.key, s); return s;
  }
  // 审核强度条：被拦 / 抽检 / 可搜 / 未标
  function auditBar(live, withText = true) {
    const total = live.killed + live.watching + live.active + live.none;
    if (!total) return withText ? '<p class="xs mute" style="margin:0">这个品类没有暗语词条，审核强度看版权名单。</p>' : '<div class="heat thin"></div>';
    const pct = k => live[k] / total * 100;
    return `<div class="heat thin" title="被拦 ${live.killed} · 抽检 ${live.watching} · 可搜 ${live.active} · 未标 ${live.none}"><i class="r" style="width:${pct('killed')}%"></i><i class="a" style="width:${pct('watching')}%"></i><i class="g" style="width:${pct('active')}%"></i></div>${withText ? `<p class="xs mute" style="margin:4px 0 0">暗语 ${total} 条：被拦 ${live.killed} · 抽检 ${live.watching} · 可搜 ${live.active}${live.none ? ` · 未标 ${live.none}` : ''}</p>` : ''}`;
  }
  const stanceTag = c => `<span class="b ${STANCE[c.stance][1]}">${STANCE[c.stance][0]}</span>`;
  function catCard(c) {
    const s = catStats(c), g = c.gate;
    return `<button class="cat cw ${c.stance}" ${navAttr({p:'cat', ck:c.key})} title="${esc(c.one)}"><span class="ch"><span class="ci">${catIcon(c)}</span><span class="tt">${esc(c.name)}</span><i class="sd ${c.stance}" title="${STANCE[c.stance][0]}"></i></span>
      <span class="row" style="gap:5px"><span class="b ${c.kind === 'virtual' ? 'slate' : ''}">${c.kind === 'virtual' ? '虚拟' : '实物'}</span>${stanceTag(c)}</span>
      ${auditBar(s.live, false)}
      <div class="nums"><div>${ic('file')}<b>${num(s.n)}</b>禁名</div><div>${ic('scale')}<b>${s.holders.length}</b>维权方</div><div>${ic('eye')}<b>${s.sl.length}</b>暗语</div><div>${ic('ban')}<b class="${s.live.killed ? 'hot' : ''}">${s.live.killed}</b>被拦</div></div>
      <span class="gates"><span>${ic('box')}${esc(g.货源)}</span><span>${ic('truck')}${esc(g.交付.split(' / ')[0])}</span></span></button>`;
  }
  const slangRow = t => `<tr><td class="nw"><span class="b ${liveCls(t.liveness)}">${liveName(t.liveness)}</span></td><td class="wrap"><button class="link" ${navAttr({p:'lib', tab:'slang', sk:t.kind, sl:t.id})}>${esc(t.name)}</button>${t.policy ? ` <span class="b risk">${esc(t.policy_label)}</span>` : ''}</td><td class="wrap xs">${esc(t.variants.slice(0, 4).join('、'))}${t.variants.length > 4 ? ` <span class="mute">等 ${t.variants.length} 个</span>` : ''}</td><td class="wrap xs mute">${esc((t.explanation || '').slice(0, 70))}</td></tr>`;
  const slangTable = (rows, cap = 40) => rows.length ? `<div class="tbl"><table class="dict"><thead><tr><th>状态</th><th>指什么</th><th>常见写法</th><th>说明</th></tr></thead><tbody>${rows.slice(0, cap).map(slangRow).join('')}</tbody></table></div>${rows.length > cap ? `<p class="cd-note">只显示前 ${cap} 条，共 ${rows.length} 条。</p>` : ''}` : '<p class="mute sm" style="margin:0">没有词条。</p>';
  const byLive = (a, b) => LIVE_ORDER[a.liveness || ''] - LIVE_ORDER[b.liveness || ''] || (b.votes || 0) - (a.votes || 0);

  // ================= 首页 =================
  function feedItems() {
    const hs = [...holderStats.values()].filter(h => h.fresh).sort((a, b) => b.fresh - a.fresh).slice(0, 3);
    const top = CATS.map(c => [c, catStats(c).live.killed]).sort((a, b) => b[1] - a[1])[0];
    const months = unique(SA.terms.map(t => (t.since || '').slice(0, 7))).sort(); const lastM = months[months.length - 1] || '';
    const newSlang = SA.terms.filter(t => (t.since || '').startsWith(lastM) && lastM);
    const talkTop = TALK_SAID.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 3);
    const course = X.banned_extra.terms.filter(t => t.group === 'course').length;
    return [
      ['red', `本期新进版权名单 <b>${fresh.length}</b> 条${hs.length ? '，新增最多的维权方：' + hs.map(h => `${esc(h.name)} +${h.fresh}`).join('、') : ''}`, {p:'lib', tab:'topic', tp:'new-list'}],
      ['red', `被拦最狠的品类：<b>${esc(top[0].name)}</b>，${top[1]} 个暗语词条已被平台拦截`, {p:'lib', tab:'topic', tp:'killed'}],
      ['amber', `${esc(lastM)} 新收录暗语 <b>${newSlang.length}</b> 条${newSlang.length ? '，例如：' + newSlang.slice(0, 3).map(t => esc(t.name.slice(0, 14))).join('、') : ''}`, {p:'lib', tab:'topic', tp:'new-slang'}],
      ['amber', `聊天里最常见的套路话：${talkTop.map(t => '「' + esc(t.name.slice(0, 12)) + '」').join('')}，共 ${TALK.length} 条`, {p:'lib', tab:'topic', tp:'talk-top'}],
      ['amber', `课程资料类实测限流词 <b>${course}</b> 个（小红书实测）`, {p:'lib', tab:'topic', tp:'course-banned'}],
      ['green', `买家在用、平台还没拦的叫法 <b>${SA.terms.filter(t => t.liveness === 'active' && !t.policy && t.risk !== 'danger').length}</b> 个`, {p:'lib', tab:'topic', tp:'active'}],
      ['red', `红线题材 <b>${SA.redline.length}</b> 条：整条都不能碰`, {p:'lib', tab:'redline'}],
    ];
  }
  function renderHome3() {
    const recent = store.get('sjb-recent', []);
    return `<h1 class="pg-t anim">你现在是哪种情况？</h1>
      <div class="sit anim">
        <button class="entry" ${navAttr({p:'market'})}><span class="k">01 · 不用输入</span><span class="tt">还不知道卖什么</span><span class="q">${CATS.length} 个品类逐个看：能不能做、门槛多高、平台盯得多紧。再看被维权的名字背后有哪些需求可以合规地接。</span><span class="a">去选品 →</span></button>
        <div class="entry main"><span class="k">02 · 输入一个品名</span><span class="tt">有个品，准备上架</span><span class="q">看能不能卖、有什么风险，拿到标题、说明、主图、话术、定价。</span>
          <div class="hs" style="margin-top:auto"><label class="fld grow"><input id="home-q" type="text" placeholder="例如：粉笔国考全套网盘" autocomplete="off" aria-label="品名"></label><button class="btn acc" id="home-go">开始</button></div>
          <div class="ex">${X.pick_examples.slice(0, 3).map(e => `<button class="chip" data-ex="${esc(e)}">${esc(e)}</button>`).join('')}</div></div>
        <div class="entry"><span class="k">03 · 贴一条标题</span><span class="tt">品已经上架，帮我看看</span><span class="q">查标题里有没有版权名、暗语、拦截词，给改写建议。一次贴多条去「诊断」页。</span>
          <div class="hs" style="margin-top:auto"><label class="fld grow"><input id="home-d" type="text" placeholder="贴在售商品的标题" autocomplete="off" aria-label="在售标题"></label><button class="btn dark" id="home-d-go">诊断</button></div>
          <button class="link xs" ${navAttr({p:'shop', tab:'rescue'})} style="align-self:flex-start">我的品被下架或投诉了 →</button></div>
        <button class="entry" ${navAttr({p:'cat'})}><span class="k">04 · 不用输入</span><span class="tt">想做某一类，想了解透</span><span class="q">一个品类一页档案：不能碰的名字、谁在维权、不能写的词、暗语、买家叫法、能做的形态、定价、聊天、出事预案。</span><span class="a">选品类 →</span></button>
      </div>
      <div class="grid wide anim"><section class="card"><h3>今日情报<span class="lab">不用输入，点开就看</span></h3><div class="feed">${feedItems().map(([lv, html, nv]) => `<button ${navAttr(nv)}><i class="dot ${lv}"></i><span>${html}</span><em>看 →</em></button>`).join('')}</div>
          <div class="row" style="margin-top:12px"><button class="btn sm" ${navAttr({p:'lib'})}>逛情报库：7 个库、${TOPICS.length} 个专题 →</button></div></section>
        <div class="col"><section class="card"><h3>库里有什么<span class="lab">名单 ${esc(updatedAt)}</span></h3><div class="tiles two"><button class="tile" ${navAttr({p:'lib', tab:'list'})}><b>${num(records.length)}</b><span>版权名单</span></button><button class="tile" ${navAttr({p:'lib', tab:'slang'})}><b>${num(SA.counts.terms)}</b><span>暗语词条 · ${num(SA.counts.variants)} 种写法</span></button><button class="tile" ${navAttr({p:'lib', tab:'banned'})}><b>${BANNED_ALL.length}</b><span>拦截词与极限词</span></button><button class="tile" ${navAttr({p:'lib', tab:'chat'})}><b>${TALK.length}</b><span>聊天套路</span></button></div></section>
          <section class="card"><h3>我的品<span class="lab">只存在本机</span></h3>${recent.length ? `<div class="recent">${recent.slice(0, 6).map(r => `<button data-pick="${esc(r.q)}"><span class="b lv ${r.level}">${LV[r.level]}</span>${esc(r.title)}<span class="mute xs">${esc(r.at.slice(5, 10))}</span></button>`).join('')}</div><p style="margin:8px 0 0"><button class="link xs" id="recent-clear">清除记录</button></p>` : '<p class="mute sm" style="margin:0">做完一个品的素材包后会记在这里。</p>'}</section></div></div>
      <section class="card mt anim"><h3>热门品类<span class="lab">点进去是完整档案</span><button class="link xs" ${navAttr({p:'cat'})}>全部 ${CATS.length} 个 →</button></h3><div class="cats">${X.hot.map(catOf).filter(Boolean).map(catCard).join('')}</div></section>`;
  }

  // ================= 选品台 =================
  const SEL_TABS = [['', '品类墙'], ['back', '需求倒推榜'], ['ideas', '选品思路'], ['data', '导入市场数据']];
  function catWall() {
    const fk = ['virtual', 'physical'].includes(state.fk) ? state.fk : '', fs = state.fs === 'ok';
    const rows = CATS.filter(c => (!fk || c.kind === fk) && (!fs || c.stance === 'ok'));
    const order = {ok:0, care:1, warn:2};
    const n = k => CATS.filter(c => c.kind === k).length;
    return `<div class="row anim" style="margin-bottom:14px"><span class="lab">筛选</span>${[['', '全部', CATS.length], ['virtual', '虚拟商品', n('virtual')], ['physical', '实物商品', n('physical')]].map(([k, t, c]) => `<button class="catbtn${fk === k ? ' on' : ''}" ${navAttr({p:state.p, tab:state.tab, fk:k, fs:state.fs})}>${t} <small>${c}</small></button>`).join('')}<button class="catbtn${fs ? ' on' : ''}" ${navAttr({p:state.p, tab:state.tab, fk, fs:fs ? '' : 'ok'})}>只看适合新手的</button><span class="legend"><i class="r"></i>被拦<i class="a"></i>抽检<i class="g"></i>可搜</span></div>
      <div class="cats anim">${rows.sort((a, b) => order[a.stance] - order[b.stance]).map(catCard).join('')}</div>`;
  }
  function backBoard() {
    const rows = categories.map(d => { const rs = records.filter(r => r.category === d); const forms = (FORMS[d] || FORMS._default).filter(f => f.level !== 'red'); const c = CATS.find(x => x.domains.includes(d)); return {d, n:rs.length, claim:rs.filter(r => r.labels.some(isClaim)).length, fresh:rs.filter(r => NEW_IDS.has(r.id)).length, forms, c, eg:rs.slice(0, 3).map(r => r.name)}; }).sort((a, b) => b.n - a.n);
    return `<section class="card anim warn4">${ic('bulb')}<span><b>被维权的名字 = 有人在买的需求</b><small>左边不能卖，右边是能做的形态和示范标题</small></span></section>
      ${rows.map(r => { const topic = CAT_TOPIC[r.d] || CAT_TOPIC._default; return `<section class="card anim back"><div class="bl"><h3>${esc(r.d)}</h3><div class="row"><span class="b risk">${num(r.n)} 个名字不能用</span>${r.claim ? `<span class="b">${r.claim} 条带维权标签</span>` : ''}${r.fresh ? `<span class="b reg">本期新进 ${r.fresh}</span>` : ''}</div><p class="xs mute" style="margin:8px 0 0">例如：${r.eg.map(esc).join('、')}</p>${r.c ? `<button class="btn sm" style="margin-top:10px" ${navAttr({p:'cat', ck:r.c.key})}>看「${esc(r.c.name)}」档案 →</button>` : ''}</div>
        <div class="br">${r.forms.map(f => `<div class="title ${f.level}"><span class="b lv">${LV[f.level]}</span><span><span class="tt">${esc(f.name)}</span><br><span class="tr">${esc(f.note)}</span>${f.titles && f.titles[0] ? `<br><span class="eg">示范：${esc(f.titles[0].replace('{主题}', topic))}</span>` : ''}</span></div>`).join('')}</div></section>`; }).join('')}`;
  }
  const ideaCards = () => `<div class="ideas anim">${IDEAS.map((x, i) => `<section class="card"><span class="ci">${ic(['target', 'trend', 'users', 'shield', 'coin', 'layers', 'eye', 'bulb'][i % 8])}</span><h3>${esc(x.t)}</h3><p class="sm" style="margin:0 0 8px">${esc(x.d)}</p><p class="xs mute" style="margin:0 0 12px">${esc(x.eg)}</p><button class="btn sm" ${navAttr(x.nav)}>${esc(x.a)} →</button></section>`).join('')}</div>`;
  // 选品页：左边选「怎么看」，右边一行一个品类，把一句话说明和门槛直接写出来
  const SEL_SIDE = [['挑品类', [['', '', '', '全部品类', 'grid'], ['', 'virtual', '', '虚拟商品', 'file'], ['', 'physical', '', '实物商品', 'box'], ['', '', 'ok', '适合新手的', 'check']]], ['找思路', [['back', '', '', '从被投诉的名字找需求', 'trend'], ['ideas', '', '', '选品思路', 'bulb']]], ['我的数据', [['data', '', '', '导入市场数据', 'down']]]];
  function catRow(c) {
    const s = catStats(c), g = c.gate || {};
    return `<button class="crow ${c.stance}" ${navAttr({p:'cat', ck:c.key})}><span class="ci">${catIcon(c)}</span>
      <span class="cm"><span class="ct"><b>${esc(c.name)}</b><span class="b ${c.kind === 'virtual' ? 'slate' : ''}">${c.kind === 'virtual' ? '虚拟' : '实物'}</span>${stanceTag(c)}</span><span class="one">${esc(c.one)}</span>
        <span class="gate">${Object.entries(g).map(([k, v]) => `<span><i>${esc(k)}</i>${esc(v)}</span>`).join('')}</span></span>
      <span class="cs"><span><b>${num(s.n)}</b>个名字不能用</span><span><b class="${s.live.killed ? 'hot' : ''}">${s.live.killed}</b>个暗语已被拦</span></span>${ic('chevron', 'go')}</button>`;
  }
  function catList() {
    const fk = ['virtual', 'physical'].includes(state.fk) ? state.fk : '', fs = state.fs === 'ok';
    const rows = CATS.filter(c => (!fk || c.kind === fk) && (!fs || c.stance === 'ok'));
    const G = [['ok', '适合新手', '门槛低，照规矩做不容易出事', 'check'], ['care', '审核紧，先看清再做', '能做，但平台盯得严，先把档案看完', 'eye'], ['warn', '不建议做，只用来认', '放在这里是让你认得出，不是让你去卖', 'alert']];
    return G.map(([k, t, d, i]) => { const rs = rows.filter(c => c.stance === k); return rs.length ? `<h2 class="sec-t cg ${k} anim">${ic(i)}${t}<span class="lab">${rs.length} 个 · ${d}</span></h2><div class="crows anim">${rs.map(catRow).join('')}</div>` : ''; }).join('') || `<p class="empty">${ic('box')}这个筛选下没有品类</p>`;
  }
  function renderSelect() {
    const t = state.tab === 'bm' ? 'data' : SEL_TABS.some(x => x[0] === state.tab) ? state.tab : '';
    const fk = t ? '' : (['virtual', 'physical'].includes(state.fk) ? state.fk : ''), fs = !t && !fk && state.fs === 'ok' ? 'ok' : '';
    const n = (k, f) => CATS.filter(c => (!k || c.kind === k) && (!f || c.stance === 'ok')).length;
    const side = `<aside class="side" aria-label="选品目录">${SEL_SIDE.map(([g, items]) => `<p class="sg">${g}</p>` + items.map(([tab, k, f, name, i]) => `<button class="${tab === t && k === fk && f === fs ? 'on' : ''}" ${navAttr({p:'market', tab, fk:k, fs:f})}>${ic(i)}<span>${name}</span>${tab ? '' : `<small>${n(k, f)}</small>`}</button>`).join('')).join('')}</aside>`;
    const TIP = {'':['先挑一个品类，点进去看它的完整档案', '每一行写了：一句话说明、要准备什么、已经有多少名字和暗语被禁'], back:['别人被投诉的名字，说明有人在买这类东西', '原品不能卖，右边是同一个需求下能做的做法'], ideas:['不知道从哪下手时，看这几条思路', ''], data:['把你在闲鱼搜到的结果导进来，看哪类卖得动', '不导入也能用，只是没有销量和价格参考']}[t];
    return `<div class="lr">${side}<div class="lr-main"><div class="libtip anim">${ic('bulb')}<b>${TIP[0]}</b>${TIP[1] ? `<span>${TIP[1]}</span>` : ''}</div>${t === 'back' ? backBoard() : t === 'ideas' ? ideaCards() : t === 'data' ? renderMarket() : catList()}</div></div>`;
  }

  // ================= 品类档案 =================
  const BI = ['', 'info', 'pulse', 'file', 'scale', 'ban', 'eye', 'users', 'layers', 'type', 'globe', 'chat', 'alert'];
  const blk = (n, title, lab, body) => `<section class="card blk anim" id="blk-${n}"><h3><span class="no">${ic(BI[n])}</span>${title}${lab ? `<span class="lab">${lab}</span>` : ''}</h3>${body}</section>`;
  function renderCat() {
    const c = catOf(state.ck);
    if (!c) return renderSelect();
    const s = catStats(c), virt = c.kind === 'virtual';
    const dom = c.domains[0] || '', topic = CAT_TOPIC[dom] || c.name;
    const forms = virt ? (FORMS[dom] || FORMS._default) : X.physical_forms;
    const jg = c.tree ? jargonFor(c.tree) : [];
    const jgBy = st => jg.filter(j => j.status === st);
    const fake = BANNED.terms.filter(t => t.group === 'fake'), extreme = BANNED.terms.filter(t => t.group === 'extreme'), course = X.banned_extra.terms.filter(t => t.group === 'course'), promise = X.banned_extra.terms.filter(t => t.group === 'promise');
    const showCourse = virt && ['study', 'ops'].includes(c.tree);
    const cell = (MATRIX[c.mkey] || MATRIX.course).cells;
    const talkTop = TALK_SAID.filter(t => t.explanation || t.buyer_advice).sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 8);
    const amb = Object.keys(AMBIG).filter(k => s.recs.some(r => r.name.includes(k)));
    const names = [...s.recs.filter(r => NEW_IDS.has(r.id)), ...s.recs.filter(r => !NEW_IDS.has(r.id))];
    const chips = (arr, cls, cap = 40) => `<div class="vars">${arr.slice(0, cap).map(t => `<span class="b ${cls}"${t.note ? ` title="${esc(t.note)}"` : ''}>${esc(t.term || t.word || t)}</span>`).join('')}${arr.length > cap ? `<span class="b">等 ${arr.length} 个</span>` : ''}</div>`;
    const toc = [[1, '一句话'], [2, '风险总览'], [3, '不能碰的名字'], [4, '谁在维权'], [5, '不能写的词'], [6, '暗语对照'], [7, '买家怎么叫'], [8, '能做的形态'], [9, '标题图片定价'], [10, '平台差异'], [11, '聊天与售后'], [12, '出事预案']];
    return `<div class="lr"><aside class="side" aria-label="档案目录"><button class="back" ${navAttr({p:'market'})}>${ic('arrow', 'bk')}<span>返回选品</span></button><p class="sg">${esc(c.name)}</p>${toc.map(([n, t]) => `<a href="#blk-${n}" data-toc="${n}">${ic(BI[n])}<span>${t}</span></a>`).join('')}</aside><div class="lr-main">
      <section class="hero anim"><div class="row" style="margin-bottom:8px"><span class="b ${virt ? 'slate' : ''}">${virt ? '虚拟商品' : '实物商品'}</span>${stanceTag(c)}</div><h1 class="hero-t"><span class="ci lg">${catIcon(c)}</span>${esc(c.name)}</h1><p class="hero-p" style="font-size:var(--fs-md);color:var(--ink2)">${esc(c.one)}</p>
        <div class="hs"><label class="fld grow"><span>想好了？在这个品类上一个品</span><input id="cat-q" type="text" placeholder="例如：${esc(virt ? '自制' + topic + '计划表' : c.name + ' 自用闲置')}"></label><button class="btn acc" id="cat-q-go">${ic('sparkles')}${c.stance === 'warn' ? '查一下' : '生成上架内容'}</button></div></section>
      ${blk(1, '一句话与入门门槛', '门槛为人工填写', `<dl class="kv gate">${Object.entries(c.gate).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>${c.stance === 'warn' ? '<p class="ambig" style="margin:12px 0 0"><b>这个品类不建议做。</b>档案保留，是为了让你认得出相关的词，别人用这些话找你时知道是怎么回事。</p>' : ''}`)}
      ${blk(2, '风险总览', `名单 ${esc(updatedAt)}`, `<div class="tiles" style="margin-bottom:12px"><div class="tile"><b>${num(s.n)}</b><span>不能碰的名字</span></div><div class="tile green"><b>+${s.fresh}</b><span>本期新进</span></div><div class="tile red"><b>${s.claim.length}</b><span>带维权标签</span></div><div class="tile"><b>${s.holders.length}</b><span>维权方</span></div><div class="tile red"><b>${s.live.killed}</b><span>暗语已被拦</span></div><div class="tile amber"><b>${s.grey}</b><span>灰色题材词条</span></div></div><p class="lab" style="margin:0 0 6px">审核强度</p>${auditBar(s.live)}`)}
      ${blk(3, '不能碰的名字', s.n ? `${num(s.n)} 条 · 新进排在前面` : '', s.n ? `<div class="vars">${names.slice(0, 80).map(r => `<button class="chip${NEW_IDS.has(r.id) ? ' new' : ''}" data-pick="${esc(r.name)}" title="点一下查这个名字">${esc(r.name)}</button>`).join('')}</div><div class="row" style="margin-top:12px">${c.domains.map(d => `<button class="btn sm" ${navAttr({p:'lib', tab:'list', lc:d})}>看「${esc(d)}」全部 ${records.filter(r => r.category === d).length} 条 →</button>`).join('')}</div><p class="cd-note">标题、说明、图片里出现这些名字，或它们的拼音、谐音、拆字写法，都会被体检标出。命中是核对线索，不是结论。</p>` : `<p class="sm mute" style="margin:0">${virt ? '版权名单里没有归到这个品类的条目。这一类的风险主要在暗语和平台规则，见第 6 块。' : '版权名单只收虚拟商品。实物能不能卖、品牌货要备什么，见第 10 块。'}</p>`)}
      ${blk(4, '谁在维权', s.holders.length ? `${s.holders.length} 家 · 按关联条数` : '', s.holders.length ? `<div class="grid">${s.holders.slice(0, 6).map(([h, k]) => holderHTML(h, `<span class="b slate">本品类 ${k} 条</span>`)).join('')}</div>${s.holders.length > 6 ? `<p class="cd-note">还有 ${s.holders.length - 6} 家，去 <button class="link xs" ${navAttr({p:'lib', tab:'holders'})}>维权方档案</button> 看。</p>` : ''}` : '<p class="sm mute" style="margin:0">名单里没有关联到具体维权方。</p>')}
      ${blk(5, '不能写的词', '全品类通用，命中即提示改写', `<p class="lab" style="margin:0 0 6px">写上就是红灯（${fake.length}）</p>${chips(fake, 'risk', 60)}<p class="lab" style="margin:14px 0 6px">广告法极限词（${extreme.length}）</p>${chips(extreme, 'vio', 30)}${showCourse ? `<p class="lab" style="margin:14px 0 6px">课程资料类实测限流词（${course.length}，小红书实测）</p>${chips(course, 'vio', 40)}` : ''}<p class="lab" style="margin:14px 0 6px">承诺与引流词（${promise.length}）</p>${chips(promise, 'vio', 30)}<div class="row" style="margin-top:12px"><button class="btn sm" ${navAttr({p:'lib', tab:'banned'})}>看违禁词全表 →</button><button class="btn sm" ${navAttr({p:'lib', tab:'topic', tp:'suffix'})}>卖货后缀表 →</button></div>`)}
      ${blk(6, '暗语对照', s.sl.length ? `${s.sl.length} 条 · 用来认得出、避得开` : '', s.sl.length ? `${slangTable(s.sl.slice().sort(byLive), 30)}<p class="cd-note">暗语是卖家为了躲审核发明的写法。被拦的词写上就下架；抽检会限流；可搜只说明平台暂时没盯上。高危和灰色题材不给替代写法。</p>` : '<p class="sm mute" style="margin:0">暗语词典里没有归到这个品类的词条。</p>')}
      ${blk(7, '买家怎么叫', '可搜、不涉灰色的叫法 + 人工核过的行话', `${s.buyer.length ? `<div class="tbl"><table class="dict"><thead><tr><th>指什么</th><th>买家的叫法</th><th>认可度</th></tr></thead><tbody>${s.buyer.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 15).map(t => `<tr><td class="wrap">${esc(t.name)}</td><td class="wrap xs">${esc(t.variants.slice(0, 5).join('、'))}</td><td class="mono xs">${t.votes ? t.votes + ' 票' : '—'}</td></tr>`).join('')}</tbody></table></div><p class="cd-note">票数是词典用户的投票，表示「大家认不认这个叫法」，不是平台搜索量。</p>` : ''}${jgBy('ok').length ? `<p class="lab" style="margin:${s.buyer.length ? 14 : 0}px 0 6px">可以进标题的行话</p><div class="vars">${jgBy('ok').map(j => `<span class="b reg" title="${esc(j.note)}">${esc(j.word)}</span>`).join('')}</div>` : ''}${!s.buyer.length && !jgBy('ok').length ? '<p class="sm mute" style="margin:0">这个品类还没有收录买家叫法。</p>' : ''}`)}
      ${blk(8, virt ? '能做的形态' : '怎么如实卖', virt ? `${dom ? '形态库：' + esc(dom) : '通用形态'} · 标题为示范写法` : '首版人工整理，待核', `<div class="titles">${forms.map(f => `<div class="title ${f.level}"><span class="b lv">${LV[f.level]}</span><span><span class="tt">${esc(f.name)}</span><br><span class="tr">${esc(f.note)}</span>${(f.titles || []).slice(0, 3).map(t => `<br><span class="eg">示范：${esc(t.replace('{主题}', topic))}</span>`).join('')}</span></div>`).join('')}</div>`)}
      ${blk(9, '标题、图片、说明、定价', '', `<div class="grid"><div><p class="lab" style="margin:0 0 6px">${virt ? '图片规范' : '拍摄清单'}</p><ul class="skel">${(virt ? IMG_RULES : X.physical_shots).map(x => `<li>${esc(x)}</li>`).join('')}</ul>${jgBy('care').length ? `<p class="lab" style="margin:14px 0 6px">只放详情、不进标题的词</p><div class="vars">${jgBy('care').map(j => `<span class="b vio" title="${esc(j.note)}">${esc(j.word)}</span>`).join('')}</div>` : ''}${jgBy('ban').length ? `<p class="lab" style="margin:14px 0 6px">行话里不要用的</p><div class="vars">${jgBy('ban').map(j => `<span class="b risk" title="${esc(j.note)}">${esc(j.word)}</span>`).join('')}</div>` : ''}</div>
        <div><p class="lab" style="margin:0 0 6px">定价</p>${virt ? `<div class="tbl"><table><thead><tr><th>形态</th><th>价格带</th><th>怎么定</th></tr></thead><tbody>${Object.values(PRICE_RULES).map(p => `<tr><td class="nw"><b>${esc(p.name)}</b></td><td class="mono nw">¥${p.low} – ${p.high}</td><td class="xs">${esc(p.note)}</td></tr>`).join('')}</tbody></table></div><p class="cd-note">价格带是形态基准，人工整理。想看同类在卖的真实价格，去选品页导入你搜到的结果。</p>` : `<p class="sm" style="margin:0">实物没有通用价格带。在闲鱼搜同型号同成色，用书签脚本把结果读进「选品 → 导入市场数据」，就能看到价格中位数。</p>`}
          <p class="lab" style="margin:14px 0 6px">说明里要写清的四件事</p><ul class="skel">${(virt ? ['包含什么：逐项列出，写数量和形式', '不包含什么：不含第三方课程、文件、链接', '怎么交付、多久送达', '售后：答疑期限、什么情况可退'] : ['成色：使用时长、瑕疵位置、是否维修', '配件：有什么、缺什么', '购买渠道与凭证', '售后：是否支持验货、是否可退']).map(x => `<li>${x}</li>`).join('')}</ul></div></div>`)}
      ${blk(10, '平台差异', virt ? '首版按公开规则整理，待核' : '能不能卖、要备什么', virt ? `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${PLATFORMS.map(p => `<div class="holder"><span class="hn">${esc(p)}</span><dl class="kv" style="grid-template-columns:64px 1fr;margin-top:4px"><dt>资质</dt><dd>${esc(cell[p].资质)}</dd><dt>常见判罚</dt><dd>${esc(cell[p].高频判罚)}</dd><dt>敏感词</dt><dd>${esc(cell[p].违禁词差异)}</dd></dl></div>`).join('')}</div><p class="cd-note">以平台当前规则为准。</p>` : physBlock(c))}
      ${blk(11, '聊天与售后', `话术 ${Object.keys(X.scripts).length} 条 · 套路库 ${TALK.length} 条`, `<div class="grid"><div>${virt ? `<p class="lab" style="margin:0 0 6px">回复话术（可直接改了用）</p><dl class="kv" style="grid-template-columns:86px 1fr">${Object.entries(X.scripts).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v.replace(/\{主题\}/g, topic).replace(/\{形态\}/g, '整理内容').replace(/\{交付\}/g, '下单后发送文件').replace(/\{时效\}/g, '一般当天送达'))}</dd>`).join('')}</dl>` : `<p class="lab" style="margin:0 0 6px">实物聊天三条底线</p><ul class="skel"><li>只在平台内沟通和收款，对方要求换渠道就停。</li><li>发货前拍开箱前视频，记录序列号。</li><li>成色有争议的地方，聊天里再用文字确认一次。</li></ul>`}</div>
        <div><p class="lab" style="margin:0 0 6px">买家常说的套路话</p><div class="tbl"><table class="dict"><tbody>${talkTop.map(t => `<tr><td class="nw"><b>${esc(t.name.slice(0, 16))}</b></td><td class="wrap xs">${esc((t.explanation || t.buyer_advice || '').slice(0, 80))}</td></tr>`).join('')}</tbody></table></div><div class="row" style="margin-top:10px"><button class="btn sm" ${navAttr({p:'lib', tab:'chat'})}>贴聊天记录查套路 →</button></div></div></div>`)}
      ${blk(12, '反面案例与出事预案', '', `${s.claim.length ? `<p class="lab" style="margin:0 0 6px">反面案例：这些名字已经有人被处理（${s.claim.length}）</p><div class="tbl"><table><tbody>${s.claim.slice(0, 8).map(r => `<tr><td><b>${esc(r.name)}</b></td><td>${r.labels.map(l => `<span class="b ${isClaim(l) ? 'risk' : ''}">${esc(l)}</span>`).join(' ')}</td><td class="xs mute">${esc(r.companies.join('、') || '—')}</td></tr>`).join('')}</tbody></table></div>` : ''}${amb.length ? `<p class="lab" style="margin:14px 0 6px">容易被误判的词</p>${amb.map(k => `<div class="ambig"><b>「${esc(k)}」也是通用词</b>：${esc(AMBIG[k].通用义)}。被误判时：${esc(AMBIG[k].申诉要点)}</div>`).join('')}` : ''}<p class="lab" style="margin:${s.claim.length || amb.length ? 14 : 0}px 0 6px">收到通知了怎么办</p><div class="row">${Object.keys(RESCUE).map(ev => `<button class="chip" ${navAttr({p:'shop', tab:'rescue', ev})}>${esc(ev)}</button>`).join('')}</div>`)}</div></div>`;
  }

  // ================= 专题：预先组合好的查询 =================
  const groupBy = (arr, fn) => { const m = new Map(); arr.forEach(x => { const k = fn(x); if (!m.has(k)) m.set(k, []); m.get(k).push(x); }); return [...m.entries()]; };
  const talkTable = (rows, cap = 60) => `<div class="tbl"><table class="dict"><thead><tr><th>这句话 / 这个词</th><th>还会写成</th><th>什么意思</th><th>怎么应对</th></tr></thead><tbody>${rows.slice(0, cap).map(t => `<tr><td class="wrap"><button class="link" ${navAttr({p:'lib', tab:'slang', sk:t.kind, sl:t.id})}>${esc(t.name)}</button></td><td class="wrap xs">${esc(t.variants.filter(v => v !== t.name).slice(0, 3).join('、')) || '—'}</td><td class="wrap xs">${esc((t.explanation || '').slice(0, 90)) || '<span class="mute">词典没给解释</span>'}</td><td class="wrap xs">${t.policy || t.risk === 'danger' ? '<span class="mute">不接、不跟。</span>' : esc((t.buyer_advice || '').slice(0, 90)) || '—'}</td></tr>`).join('')}</tbody></table></div>`;
  const TOPICS = [
    {key:'new-list', tag:'名单', title:'本期新进名单', desc:'这一版比上一版多出来的名字，按领域分。你在卖的东西里有没有它们。', n:() => fresh.length + ' 条',
      body:() => groupBy(fresh, r => r.category).sort((a, b) => b[1].length - a[1].length).map(([d, rs]) => `<section class="card anim" style="margin-bottom:12px"><h3>${esc(d)}<span class="lab">+${rs.length}</span></h3><div class="vars">${rs.slice(0, 80).map(r => `<button class="chip" data-pick="${esc(r.name)}">${esc(r.name)}</button>`).join('')}</div></section>`).join('') || '<p class="mute">本期没有新进。</p>'},
    {key:'killed', tag:'暗语', title:'哪些品类被拦得最狠', desc:'每个品类里已经被平台拦截的暗语词条。被拦得越多，说明平台盯得越紧。', n:() => SA.terms.filter(t => t.liveness === 'killed').length + ' 条被拦',
      body:() => CATS.map(c => [c, catStats(c)]).filter(([, s]) => s.sl.length).sort((a, b) => b[1].live.killed - a[1].live.killed).map(([c, s]) => `<section class="card anim" style="margin-bottom:12px"><h3><button class="link" ${navAttr({p:'cat', ck:c.key})}>${esc(c.name)}</button><span class="lab">被拦 ${s.live.killed} / ${s.sl.length}</span></h3>${auditBar(s.live)}${s.live.killed ? `<div class="vars" style="margin-top:10px">${s.sl.filter(t => t.liveness === 'killed').map(t => `<button class="chip" ${navAttr({p:'lib', tab:'slang', sk:t.kind, sl:t.id})}>${esc(t.name.slice(0, 22))}</button>`).join('')}</div>` : ''}</section>`).join('')},
    {key:'ai-slang', tag:'暗语', title:'AI 会员类全部暗语和现状', desc:'Claude、ChatGPT、Gemini 这些会员、账号、代充在二手平台上的叫法，以及平台现在怎么处理。', n:() => catStats(catOf('ai')).sl.length + ' 条',
      body:() => { const sl = catStats(catOf('ai')).sl.slice().sort(byLive); return `<section class="card anim">${auditBar(catStats(catOf('ai')).live)}<div class="tbl" style="margin-top:12px"><table class="dict"><thead><tr><th>状态</th><th>指什么</th><th>常见写法</th><th>现状</th></tr></thead><tbody>${sl.map(t => `<tr><td class="nw"><span class="b ${liveCls(t.liveness)}">${liveName(t.liveness)}</span></td><td class="wrap"><button class="link" ${navAttr({p:'lib', tab:'slang', sk:t.kind, sl:t.id})}>${esc(t.name)}</button></td><td class="wrap xs">${esc(t.variants.slice(0, 4).join('、'))}</td><td class="wrap xs mute">${esc((t.trend || t.explanation || '').slice(0, 110))}</td></tr>`).join('')}</tbody></table></div><p class="cd-note">这一类能合规做的是使用教程、提示词模板、环境配置服务。<button class="link xs" ${navAttr({p:'cat', ck:'ai'})}>看品类档案 →</button></p></section>`; }},
    {key:'active', tag:'买家叫法', title:'买家在用、平台还没拦的叫法', desc:'词典里标「可搜」、不涉灰色和高危的词。这是买家真实在用的口头叫法。', n:() => SA.terms.filter(t => t.liveness === 'active' && !t.policy && t.risk !== 'danger').length + ' 条',
      body:() => Object.entries(KINDS).map(([k, n]) => { const rows = SA.terms.filter(t => t.kind === k && t.liveness === 'active' && !t.policy && t.risk !== 'danger').sort((a, b) => (b.votes || 0) - (a.votes || 0)); return rows.length ? `<section class="card anim" style="margin-bottom:12px"><h3>${n}<span class="lab">${rows.length} 条</span></h3>${slangTable(rows, 40)}</section>` : ''; }).join('') + '<p class="cd-note">「可搜」是词典作者写入时的判断，没有日期。暗语本身就说明这个品类受审核关注，能用正常描述就用正常描述。</p>'},
    {key:'course-banned', tag:'违禁词', title:'课程资料类实测限流词', desc:'小红书上发课程、证书、资料类内容，实测会限流或仅自己可见的词和组合。', n:() => X.banned_extra.terms.filter(t => t.group === 'course').length + ' 个',
      body:() => { const g = X.banned_extra.groups.course; return `<section class="card anim"><p class="sm" style="margin:0 0 12px">${esc(g.advice)}</p><div class="tbl"><table><thead><tr><th>词或组合</th><th>说明</th></tr></thead><tbody>${X.banned_extra.terms.filter(t => t.group === 'course').map(t => `<tr><td class="nw"><span class="frag amber">${esc(t.term)}</span></td><td class="xs">${esc(t.note || '—')}</td></tr>`).join('')}</tbody></table></div><p class="cd-note">来源：${esc(g.source)}。这一组不进标题体检，只作提示。</p></section>`; }},
    {key:'fake', tag:'违禁词', title:'写上就是红灯的词', desc:'售假与版权高频词。标题里出现，基本等于告诉平台你在卖别人的东西。', n:() => BANNED.terms.filter(t => t.group === 'fake').length + ' 个',
      body:() => `<section class="card anim red"><p class="sm" style="margin:0 0 12px">${esc(X.banned_groups.fake.advice)}</p><div class="vars big">${BANNED.terms.filter(t => t.group === 'fake').map(t => `<span class="b risk">${esc(t.term)}</span>`).join('')}</div></section>`},
    {key:'extreme', tag:'违禁词', title:'「最、第一」这类夸大词全表', desc:'「最、第一、国家级」这一类。任何平台、任何品类都适用。', n:() => BANNED_ALL.filter(t => t.group === 'extreme' || t.group === 'extreme2').length + ' 个',
      body:() => `<section class="card anim"><p class="sm" style="margin:0 0 12px">${esc(X.banned_groups.extreme.advice)}</p><div class="vars big">${BANNED_ALL.filter(t => t.group === 'extreme' || t.group === 'extreme2').map(t => `<span class="b vio">${esc(t.term)}</span>`).join('')}</div></section>`},
    {key:'suffix', tag:'暗语', title:'「秒发、现货」这类词：堆多了会被查', desc:'「秒发、现货、独享、车位」这类词和具体品类无关，是通用卖货话术。一条标题堆三个以上，本身就是稽查信号。', n:() => X.suffixes.length + ' 个',
      body:() => { const all = SA.terms.flatMap(t => t.variants); const rows = X.suffixes.map(sx => [sx, all.filter(v => v.includes(sx)).length, lint(sx).hits[0]]).sort((a, b) => b[1] - a[1]); return `<section class="card anim"><div class="tbl"><table><thead><tr><th>后缀</th><th>词典里带它的写法</th><th>体检</th></tr></thead><tbody>${rows.map(([sx, n, h]) => `<tr><td class="nw"><b>${esc(sx)}</b></td><td class="mono">${n}</td><td class="xs">${h ? `<span class="b vio">${esc(h.group_name || '会被标出')}</span>` : '<span class="mute">单独出现不标</span>'}</td></tr>`).join('')}</tbody></table></div><p class="cd-note">词典 ${num(SA.counts.variants)} 种写法里，大量是「词干 + 后缀」拼出来的。认暗语看词干，后缀只说明这是在卖货。标题里最多放一个。</p></section>`; }},
    {key:'talk-top', tag:'聊天', title:'聊天里最常见的套路话', desc:'买家或卖家在聊天里说的话，各是什么意思、怎么回。按词典用户的票数排。', n:() => TALK.length + ' 条',
      body:() => `<section class="card anim">${talkTable(TALK_SAID.filter(t => t.explanation).sort((a, b) => (b.votes || 0) - (a.votes || 0)), 50)}<p class="cd-note">应对口径来自词典作者的建议。想查一段具体的聊天记录，去 <button class="link xs" ${navAttr({p:'lib', tab:'chat'})}>聊天套路</button> 贴进去。</p></section>`},
    {key:'condition', tag:'聊天', title:'成色词对照', desc:'「箱说全、仅拆封、战损」各是什么意思。卖实物要会用，买实物要会看。', n:() => TALK.filter(t => /成色/.test(t.category_name)).length + ' 条',
      body:() => `<section class="card anim">${talkTable(TALK.filter(t => /成色/.test(t.category_name)).sort((a, b) => (b.votes || 0) - (a.votes || 0)))}</section>`},
    {key:'guquan', tag:'实物', title:'谷圈黑话入门', desc:'谷子、吧唧、官谷、同人谷。二次元周边圈子的词最密，先认词再进。', n:() => catStats(catOf('goods')).sl.length + ' 条',
      body:() => `<section class="card anim">${slangTable(catStats(catOf('goods')).sl.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0)), 60)}<p class="cd-note"><button class="link xs" ${navAttr({p:'cat', ck:'goods'})}>看谷子品类档案 →</button></p></section>`},
    {key:'new-slang', tag:'暗语', title:'最近收录的暗语', desc:'带投稿日期的词条，按时间倒排。看最近出现了什么新叫法。', n:() => SA.terms.filter(t => t.since).length + ' 条有日期',
      body:() => `<section class="card anim"><div class="tbl"><table class="dict"><thead><tr><th>日期</th><th>状态</th><th>指什么</th><th>常见写法</th><th>分类</th></tr></thead><tbody>${SA.terms.filter(t => t.since).sort((a, b) => b.since.localeCompare(a.since)).slice(0, 80).map(t => `<tr><td class="mono xs nw">${esc(t.since)}</td><td class="nw"><span class="b ${liveCls(t.liveness)}">${liveName(t.liveness)}</span></td><td class="wrap"><button class="link" ${navAttr({p:'lib', tab:'slang', sk:t.kind, sl:t.id})}>${esc(t.name)}</button></td><td class="wrap xs">${esc(t.variants.slice(0, 3).join('、'))}</td><td class="xs mute nw">${esc(KINDS[t.kind])} · ${esc(t.category_name)}</td></tr>`).join('')}</tbody></table></div><p class="cd-note">日期是众包站的投稿日期，只有部分来源带。没有日期的词条不在这页。</p></section>`},
    {key:'holders-top', tag:'谁在投诉', title:'投诉最多的十家公司', desc:'按名单里的关联条数排。看它们是谁、常用什么手段、盯着哪个领域。', n:() => holderStats.size + ' 家',
      body:() => `<div class="grid anim">${[...holderStats.values()].sort((a, b) => b.count - a.count).slice(0, 10).map(h => `<div>${holderHTML(h.name)}<button class="link xs" style="margin:6px 0 0" ${navAttr({p:'lib', tab:'holders', co:h.name})}>看它盯着的 ${h.count} 个名字 →</button></div>`).join('')}</div>`},
    {key:'ambig', tag:'误判', title:'八种误判和申诉要点', desc:'卖粉笔字教程被当成卖粉笔课程。品牌词和通用词同形时，没侵权也会被罚。', n:() => Object.keys(AMBIG).length + ' 个词',
      body:() => `<div class="grid anim">${Object.entries(AMBIG).map(([k, v]) => `<section class="card"><h3>「${esc(k)}」</h3><dl class="kv" style="grid-template-columns:70px 1fr"><dt>通用义</dt><dd>${esc(v.通用义)}</dd><dt>怎么判</dt><dd>${esc(v.判断)}</dd><dt>申诉要点</dt><dd>${esc(v.申诉要点)}</dd></dl></section>`).join('')}</div><p class="cd-note">已经被处理了，去 <button class="link xs" ${navAttr({p:'shop', tab:'rescue'})}>诊断 → 有品被处理了</button>。</p>`},
  ];
  const topicOf = key => TOPICS.find(t => t.key === key) || null;
  const TPI = {名单:'file', 暗语:'eye', 买家叫法:'users', 违禁词:'ban', 聊天:'chat', 实物:'box', 谁在投诉:'scale', 误判:'alert'};
  const topicCard = t => `<button class="tpc" title="${esc(t.desc)}" ${navAttr({p:'lib', tab:'topic', tp:t.key})}><span class="ci">${ic(TPI[t.tag] || 'flame')}</span><span class="b">${esc(t.tag)}</span><span class="tt">${esc(t.title)}</span><span class="hint">${esc(t.desc)}</span><span class="n">${t.n()}</span></button>`;
  function renderTopic() {
    const t = topicOf(state.tp);
    if (!t) return `<section class="hero anim"><h1 class="hero-t">专题</h1><p class="hero-p">每个专题回答一个问题，点开就是答案。</p></section><div class="tpcs anim">${TOPICS.map(topicCard).join('')}</div>`;
    return `<div class="crumb anim"><button class="link" ${navAttr({p:'lib', tab:'topic'})}>专题</button> / ${esc(t.title)}</div><section class="hero anim"><span class="b">${esc(t.tag)}</span><h1 class="hero-t" style="margin-top:8px">${esc(t.title)}</h1><p class="hero-p" style="margin-bottom:0">${esc(t.desc)} <span class="b">${t.n()}</span></p></section>${t.body()}`;
  }

  // ================= 情报库 =================
  const LIB3 = [['hub', '总览'], ['topic', '专题'], ['list', '版权名单'], ['holders', '维权方'], ['slang', '暗语词典'], ['banned', '拦截词'], ['jargon', '行话'], ['chat', '聊天套路'], ['matrix', '平台规则'], ['redline', '红线警示'], ['words', '拓词台'], ['src', '数据来源']];
  function renderHub() {
    const live = {killed:0, watching:0, active:0, none:0}; SA.terms.forEach(t => live[t.liveness || 'none']++);
    const libs = [
      ['list', '版权名单', num(records.length), `${categories.length} 个领域 · 本期新进 ${fresh.length}`, '被维权、被投诉过的作品名、课程名、机构名。标题里不能出现。'],
      ['holders', '维权方', holderStats.size, '按关联名单数排', '谁在投诉、起诉、发律师函，各自盯着什么。'],
      ['slang', '暗语词典', num(SA.counts.terms), `虚拟 ${SA.counts.by_kind.virtual.terms} · 实物 ${SA.counts.by_kind.physical.terms} · 话术 ${SA.counts.by_kind.talk.terms} · ${num(SA.counts.variants)} 种写法`, '卖家躲审核的写法，带状态：被拦、抽检、可搜。'],
      ['banned', '拦截词与极限词', BANNED_ALL.length, `${Object.keys(GROUPS_ALL).length} 组`, '平台和广告法明令不能写的词。'],
      ['jargon', '行话', JARGON.length, '人工核过', '买家会搜、体检能过的正经词。'],
      ['chat', '聊天套路', TALK.length, '可贴聊天记录查', '「到手刀」「我是学生」这类话各是什么意思、怎么回。'],
      ['redline', '红线警示', SA.redline.length, `${Object.keys(SA.redline_groups).length} 类题材`, '整条都不能碰的题材，只用来认。'],
    ];
    return `<section class="hero anim"><h1 class="hero-t">情报库</h1><p class="hero-p">库里所有的东西都摊在这里，不用输入就能逛。七个库按内容分；专题是预先查好的答案；想按品类看，去「品类」页。右上角的搜索框一次搜全部库。</p>
        <div class="row"><span class="lab">暗语按状态看</span>${[['killed', '被拦', live.killed, 'risk'], ['watching', '抽检', live.watching, 'vio'], ['active', '可搜', live.active, 'reg']].map(([k, n, c, cls]) => `<button class="b ${cls} bbtn" ${navAttr({p:'lib', tab:'slang', ss:k})}>${n} ${c}</button>`).join('')}<span class="lab" style="margin-left:10px">按新鲜度</span><button class="b bbtn" ${navAttr({p:'lib', tab:'topic', tp:'new-list'})}>本期新进名单 ${fresh.length}</button><button class="b bbtn" ${navAttr({p:'lib', tab:'topic', tp:'new-slang'})}>最近收录的暗语</button></div></section>
      <div class="libs anim">${libs.map(([k, n, c, m, d]) => `<button class="lib" ${navAttr({p:'lib', tab:k})}><b>${c}</b><span class="tt">${n}</span><span class="hint">${esc(d)}</span><span class="m">${esc(m)}</span></button>`).join('')}</div>
      <h2 class="sec-t anim">专题<span class="lab">${TOPICS.length} 个 · 点开就是答案</span></h2><div class="tpcs anim">${TOPICS.map(topicCard).join('')}</div>
      <h2 class="sec-t anim">按品类看<span class="lab">${CATS.length} 个品类档案</span></h2><div class="row anim">${CATS.map(c => `<button class="chip" ${navAttr({p:'cat', ck:c.key})}>${esc(c.name)}</button>`).join('')}</div>`;
  }
  function renderChatLib() {
    const groups = groupBy(TALK, t => t.category_name).sort((a, b) => b[1].length - a[1].length);
    const g = groups.some(([k]) => k === state.sc) ? state.sc : '';
    const rows = TALK.filter(t => !g || t.category_name === g).sort((a, b) => (b.votes || 0) - (a.votes || 0));
    return renderChat() + `<h2 class="sec-t anim">套路库<span class="lab">${TALK.length} 条 · 不用贴也能看</span></h2><div class="row anim" style="margin-bottom:12px"><button class="catbtn${!g ? ' on' : ''}" data-sc="">全部 <small>${TALK.length}</small></button>${groups.map(([k, v]) => `<button class="catbtn${k === g ? ' on' : ''}" data-sc="${esc(k)}">${esc(k)} <small>${v.length}</small></button>`).join('')}</div><section class="card anim">${talkTable(rows, 80)}${rows.length > 80 ? `<p class="cd-note">只显示前 80 条，共 ${rows.length} 条。选一个分类看全。</p>` : ''}</section>`;
  }
  function renderSources() {
    return `<section class="hero anim"><h1 class="hero-t">数据来源</h1><p class="hero-p">资料来自下面这些公开来源，感谢每一位整理者。</p></section>
      <section class="card anim"><h3>暗语词典<span class="lab">${SA.sources.length} 个来源</span></h3><div class="tbl"><table><thead><tr><th>来源</th><th>类型</th><th>许可</th><th>并入词条</th><th>版本 / 取用日期</th></tr></thead><tbody>${SA.sources.map(s => `<tr><td><b>${esc(s.name)}</b>${s.repo ? `<div class="xs mute">${esc(s.repo)}</div>` : ''}</td><td class="xs nw">${esc(s.kind || '—')}</td><td class="xs nw">${esc(s.license)}</td><td class="mono">${s.kind === '本地文件' ? `<span class="xs">词典 0 · 红线 ${s.redline || 0} · 名单 ${X.new_ids.filter(i => i.startsWith('G')).length}</span>` : s.terms}</td><td class="xs mute nw">${s.commit ? 'commit ' + esc(s.commit.slice(0, 7)) + ' · ' : ''}${esc(s.fetched || '')}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="card mt anim"><h3>拦截词与极限词</h3><div class="tbl"><table><thead><tr><th>分组</th><th>词数</th><th>来源</th></tr></thead><tbody>${Object.entries(GROUPS_ALL).map(([k, v]) => `<tr><td><b>${esc(v.name)}</b></td><td class="mono">${BANNED_ALL.filter(t => t.group === k).length}</td><td class="xs">${esc(v.source || '闲鱼虚拟商品版权雷达违禁词表 ' + X.banned_version)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="card mt anim"><h3>版权名单与规则</h3><dl class="kv"><dt>版权名单</dt><dd>${num(records.length)} 条，闲鱼虚拟商品版权雷达公开名单 ${esc(updatedAt)}，来自公开收集与卖家回流。</dd><dt>处置规则</dt><dd>版权雷达规则表 ${esc(RULES.version)}。</dd><dt>合规形态、平台规则、行话、话术、定价</dt><dd>人工整理首版，逐条标注待核。</dd><dt>品类划分与门槛</dt><dd>人工整理，${CATS.length} 个品类。</dd></dl></section>`;
  }
  function renderLib3() {
    const t = LIB3.some(x => x[0] === state.tab) ? state.tab : 'hub';
    const sub = `<div class="sub">${LIB3.map(([k, n]) => `<button class="${k === t ? 'on' : ''}" ${navAttr({p:'lib', tab:k === 'hub' ? '' : k})}>${n}</button>`).join('')}</div>`;
    return sub + ({hub:renderHub, topic:renderTopic, list:renderList, holders:renderHolders, jargon:renderJargon, slang:renderSlang, banned:renderBanned, chat:renderChatLib, matrix:renderMatrix, redline:renderRedline, words:renderWords, src:renderSources}[t])();
  }

  // ================= 全站搜索 =================
  function renderSearch() {
    const q = state.gq.trim(), k = norm(q);
    if (k.length < 1) return `<section class="hero anim"><h1 class="hero-t">搜索</h1><p class="hero-p">在右上角输入一个词，所有资料一起查。</p></section>`;
    const hit = s => norm(s).includes(k);
    const cats = CATS.filter(c => hit(c.name) || hit(c.one));
    const tps = TOPICS.filter(t => hit(t.title) || hit(t.desc));
    const recs = records.filter(r => hit(r.name) || r.variants.some(hit));
    const sl = SA.terms.filter(t => hit(t.name) || t.variants.some(hit));
    const red = SA.redline.filter(r => hit(r.name) || r.variants.some(hit));
    const ban = BANNED_ALL.filter(t => hit(t.term));
    const jg = JARGON.filter(j => hit(j.word));
    const hs = [...holderStats.values()].filter(h => hit(h.name));
    const r = lint(q); const total = cats.length + tps.length + recs.length + sl.length + red.length + ban.length + jg.length + hs.length;
    const sec = (title, n, body) => n ? `<section class="card anim" style="margin-bottom:12px"><h3>${title}<span class="lab">${n} 条</span></h3>${body}</section>` : '';
    const ST = {ok:['可进标题', 'reg'], care:['只进详情', 'vio'], ban:['不用', 'risk']};
    return `<section class="hero anim"><h1 class="hero-t">「${esc(q)}」</h1><p class="hero-p" style="margin-bottom:10px">全库找到 ${total} 条。${total ? '' : '库里没有不等于可以用，只是没收录。'}</p><div class="row"><span class="lab">如果把它写进标题</span><span class="b lv ${r.level}">${LV[r.level]}</span>${r.hits.slice(0, 4).map(h => `<span class="frag ${h.kind === 'copyright' ? 'red' : 'amber'}">${esc(h.fragment)}</span>`).join('')}<button class="btn sm" data-pick="${esc(q)}">当作品名去上新 →</button></div></section>
      ${sec('品类', cats.length, `<div class="row">${cats.map(c => `<button class="chip" ${navAttr({p:'cat', ck:c.key})}>${esc(c.name)}</button>`).join('')}</div>`)}
      ${sec('专题', tps.length, `<div class="row">${tps.map(t => `<button class="chip" ${navAttr({p:'lib', tab:'topic', tp:t.key})}>${esc(t.title)}</button>`).join('')}</div>`)}
      ${sec('红线题材', red.length, `<div class="qrows rr">${red.slice(0, 20).map(x => redRow(x, SA.redline.indexOf(x))).join('')}</div>`)}
      ${sec('版权名单', recs.length, `<div class="qrows rl">${recs.slice(0, 30).map(recRow).join('')}</div>${recs.length > 30 ? `<p class="cd-note">只显示前 30 条。<button class="link xs" ${navAttr({p:'lib', tab:'list', lq:q})}>去名单看全部 →</button></p>` : ''}`)}
      ${sec('暗语与聊天套路', sl.length, slangTable(sl.slice().sort(byLive), 30))}
      ${sec('拦截词与极限词', ban.length, `<div class="vars">${ban.slice(0, 60).map(t => `<span class="b ${GROUPS_ALL[t.group].level === 'red' ? 'risk' : 'vio'}" title="${esc(GROUPS_ALL[t.group].name)}">${esc(t.term)} · ${esc(GROUPS_ALL[t.group].name)}</span>`).join('')}</div>`)}
      ${sec('行话', jg.length, `<div class="vars">${jg.map(j => `<span class="b ${ST[j.status][1]}" title="${esc(j.note)}">${esc(j.word)} · ${ST[j.status][0]}</span>`).join('')}</div>`)}
      ${sec('维权方', hs.length, `<div class="grid">${hs.slice(0, 8).map(h => holderHTML(h.name)).join('')}</div>`)}`;
  }

  // ----- v3 事件：data-nav 跳转、首页诊断、品类页上新、顶栏搜索 -----
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-toc]'); if (a) { e.preventDefault(); const el = $('blk-' + a.dataset.toc); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}); return; }
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.nav) { let o; try { o = JSON.parse(b.dataset.nav); } catch (_) { return; } if (o.p && o.p !== 'search') { const g = $('gq'); if (g) g.value = ''; o.gq = ''; } navGo(o); }
    else if (b.id === 'home-d-go') diagOne($('home-d').value);
    else if (b.id === 'cat-q-go') { const v = $('cat-q').value.trim(); if (v) startPick(v); }
  });
  function diagOne(v) { v = String(v || '').trim(); if (!v) return; state = {...state, p:'shop', tab:''}; runShop(v); window.scrollTo({top:0, behavior:'instant'}); }
  let gqTimer;
  document.addEventListener('input', e => { if (e.target.id !== 'gq') return; const v = e.target.value.slice(0, 60); clearTimeout(gqTimer); gqTimer = setTimeout(() => { if (v.trim()) go({p:'search', gq:v}); else if (state.p === 'search') go({p:'home', gq:''}); }, 220); });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); $('gq').focus(); return; }
    if (e.key !== 'Enter') return;
    if (e.target.id === 'home-d') diagOne(e.target.value);
    else if (e.target.id === 'cat-q') { const v = e.target.value.trim(); if (v) startPick(v); }
    else if (e.target.id === 'gq') { const v = e.target.value.trim(); if (v) go({p:'search', gq:v}, true); }
  });
