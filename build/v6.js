
  // ===== v6：实物三张表（禁限售 / 品牌售假 / 类目资质）、诊断页、标题找词 =====
  const PB = X.phys_ban, PBR = X.phys_brand, PQ = X.phys_qual, FAKEW = X.fake_words;
  PB.forEach(r => { r.re = new RegExp(r.rx, 'i'); }); PBR.forEach(r => { r.re = new RegExp(r.rx, 'i'); });
  const VIRT_FORM = /教程|模板|笔记|攻略|摄影|计划|清单|指南|课|表格|壁纸|素材|说明书|鉴别|保养|科普/;
  const PLV = {ban:['不能卖', 'risk', 'ban'], limit:['有条件', 'vio', 'alert'], note:['留意', 'slate', 'info']};
  function physRule(name) { if (VIRT_FORM.test(name)) return {ban:[], brand:null}; return {ban:PB.filter(r => r.re.test(name)), brand:PBR.find(r => r.re.test(name)) || null}; }
  function physLv(r) {
    const pr = physRule(r.text), b = pr.ban.find(x => x.lv === 'ban'), lim = pr.ban.find(x => x.lv === 'limit'); r.pb = pr.ban; r.brand = pr.brand;
    // 实物的品牌型号就是商品本身，不按版权名单算
    if (!VIRT_FORM.test(r.text) && (PHYS_RX.test(r.text) || pr.brand || pr.ban.length)) { r.hits = r.hits.filter(h => h.kind !== 'copyright'); r.level = !r.hits.length ? 'green' : r.hits.some(redHit) ? 'red' : 'amber'; r.reasons = r.hits.map(h => h.fragment); }
    if (b && r.level !== 'red') { r.level = 'red'; r.reasons = [...(r.reasons || []), '禁售：' + b.n]; }
    else if (lim && r.level === 'green') { r.level = 'amber'; r.reasons = [...(r.reasons || []), '有条件：' + lim.n]; }
    return r;
  }
  const pbRow = r => `<div class="fr pr ${r.lv}" data-t="${esc((r.n + ' ' + r.eg + ' ' + r.why).toLowerCase())}" data-s="${r.lv}"><span class="b ${PLV[r.lv][1]}">${ic(PLV[r.lv][2])}${PLV[r.lv][0]}</span><div><b>${esc(r.n)}<span class="srcb ${r.src === '官方' ? 'of' : 'ex'}">${r.src === '官方' ? '官方规则' : '经验提醒'}</span></b><small>${esc(r.eg)}</small><p>${esc(r.why)}${r.src2 ? `<span class="mute xs"> 例子里的词部分来自${esc(r.src2)}。</span>` : ''}</p></div></div>`;
  const brandCard = r => `<div class="holder brc"><span class="hn">${ic('tag')}${esc(r.n)}</span><div class="vars">${r.brands.map(b => `<span class="b">${esc(b)}</span>`).join('')}</div><p class="kvl">${ic('file')}建议备好：${esc(r.need)}</p><p class="kvl warn">${ic('alert')}${esc(r.note)}</p></div>`;
  const qualTable = rows => `<div class="qrows rq"><div class="qhead"><span>卖什么</span><span>个人能不能发</span><span>要准备什么</span><span>容易出事的地方</span></div>${rows.map(q => `<div class="qrow"><span class="qnm"><b>${esc(q.n)}</b><span class="srcb ${q.src === '官方' ? 'of' : 'ex'}">${q.src === '官方' ? '官方规则' : '经验提醒'}</span></span><span class="qw"><span class="b ${/不能|不建议/.test(q.who) ? 'risk' : /条件|受限|未拆封/.test(q.who) ? 'vio' : 'reg'}">${esc(q.who)}</span></span><span class="ql" data-l="要准备">${esc(q.need)}</span><span class="ql" data-l="容易出事">${esc(q.warn)}</span></div>`).join('')}</div>`;
  const fakeChips = () => `<div class="vars big">${FAKEW.map(w => `<span class="b risk">${esc(w)}</span>`).join('')}</div><p class="cd-note">${ic('bulb')}这些词写进标题或说明，等于告诉平台你卖的是仿品。真货也不要用。</p>`;
  function libPhys() {
    const n = k => PB.filter(r => r.lv === k).length;
    return `${fbar('fl-phys', {ph:'输入东西的名字，例如：电子烟、分装、门票', chips:[['s', [['ban', '不能卖', n('ban'), 'riskc'], ['limit', '有条件', n('limit')], ['note', '留意', n('note')]]]]})}
      <section class="card anim"><h3>${ic('ban')}哪些东西不能卖<span class="lab">${PB.length} 类</span></h3><div class="prs" id="fl-phys">${PB.map(pbRow).join('')}</div></section>
      <section class="card mt anim"><h3>${ic('tag')}卖品牌货要备什么<span class="lab">${PBR.length} 类</span></h3><div class="grid g3">${PBR.map(brandCard).join('')}</div><p class="lab" style="margin:16px 0 6px">一写就算卖假货的词</p>${fakeChips()}</section>
      <section class="card mt anim"><h3>${ic('shield')}个人能不能发<span class="lab">${PQ.length} 类</span></h3>${qualTable(PQ)}</section>
      <section class="card mt anim"><h3>${ic('scale')}违规了扣多少分<span class="srcb of">官方规则</span></h3><div class="pens">${(X.phys_pen || []).map(([k, v]) => `<div class="pen"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div></section>
      <p class="cd-note anim">${ic('info')}标「官方规则」的来自 ${esc(X.phys_src || '')}。标「经验提醒」的官方原文没写，是按法规和卖家经验补的。品牌货「建议备好」的凭证也是经验。规则会更新，发布时以发布页的提示为准。</p>`;
  }
  function physBlock(c) {
    const ban = PB.filter(r => r.cats.includes(c.key)), br = PBR.filter(r => r.cat === c.key), q = PQ.filter(r => r.cats.includes(c.key));
    return `${q.length ? `<p class="lab" style="margin:0 0 6px">个人能不能发</p>${qualTable(q)}` : ''}
      ${ban.length ? `<p class="lab" style="margin:14px 0 6px">这个品类里不能卖或有条件的</p><div class="prs">${ban.map(pbRow).join('')}</div>` : ''}
      ${br.length ? `<p class="lab" style="margin:14px 0 6px">卖品牌货要备什么</p><div class="grid">${br.map(brandCard).join('')}</div><p class="lab" style="margin:14px 0 6px">一写就算卖假货的词</p>${fakeChips()}` : ''}
      <div class="row" style="margin-top:12px"><button class="btn sm" ${navAttr({p:'lib', tab:'phys'})}>${ic('box')}看实物规则全表</button></div><p class="cd-note">已知门槛：${esc(c.gate.资质)}。以平台发布页的提示为准。</p>`;
  }

  // ---------- 诊断 ----------
  const shopSub6 = () => `<div class="sub icons"><button class="${state.tab !== 'rescue' ? 'on' : ''}" data-tab="audit">${ic('pulse')}查在售标题</button><button class="${state.tab === 'rescue' ? 'on' : ''}" data-tab="rescue">${ic('alert')}被处理了怎么办</button></div>`;
  function renderShop6() {
    if (state.tab === 'rescue') return shopSub6() + renderRescue();
    const rows = mem.shopRows;
    const head = shopSub6() + `<section class="dg-in anim"><h2>${ic('pulse')}把在售的标题贴进来，一行一个</h2>
        <div class="drop dgd" id="drop"><textarea id="shop-text" rows="6" placeholder="例如：\n粉笔国考全套网盘 秒发\n自制行测刷题计划表\niPhone 14 Pro 256G 95新">${esc(mem.shopText || '')}</textarea></div>
        <div class="row"><button class="btn acc lg" id="shop-go">${ic('search')}开始检查</button><button class="btn" id="shop-ex">${ic('sparkles')}放个例子</button><button class="btn" id="shop-clear">${ic('x')}清空</button><span class="sp"></span><button class="btn" id="bm-copy" title="闲鱼网页版打开「我发布的」，点书签就能一次读出全部标题">${ic('zap')}一键读取脚本</button><button class="btn" id="shop-csv" ${rows.length ? '' : 'disabled'}>${ic('down')}导出表格</button></div>
        ${mem.importMsg ? `<p class="cd-note">${ic('info')}${esc(mem.importMsg)}</p>` : `<p class="cd-note">${ic('lock')}只在这台电脑上检查，不上传，不需要登录账号。也可以把表格文件拖进输入框。</p>`}</section>`;
    if (!rows.length) return head + `<div class="st-empty anim">${[['pulse', '健康分', '一眼看店铺好坏'], ['ban', '要下架的', '红灯排在前面'], ['wand', '怎么改', '给一条能用的写法'], ['scale', '谁在投诉', '命中了哪家公司'], ['refresh', '老毛病', '反复出现的问题词'], ['plus', '新中招', '名单更新后才中的']].map(([i, t, d], n) => `<div class="se" style="--i:${n}"><span>${ic(i)}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
    const n = {red:0, amber:0, green:0}; rows.forEach(r => n[r.level]++);
    const total = rows.length, score = Math.max(0, Math.round(100 - 70 * n.red / total - 25 * n.amber / total)), grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D', gc = score >= 85 ? 'var(--grn)' : score >= 60 ? 'var(--amb)' : 'var(--acc)';
    const holders = new Map(), frags = new Map(); let freshHit = 0;
    for (const r of rows) { let f = false; for (const h of r.hits) { if (h.kind === 'copyright') { for (const c of h.record.companies) holders.set(c, (holders.get(c) || 0) + 1); if (NEW_IDS.has(h.record.id)) f = true; } const k = h.fragment.toLowerCase(); frags.set(k, (frags.get(k) || 0) + 1); } if (f) freshHit++; }
    const topH = [...holders.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3), topF = [...frags.entries()].filter(x => x[1] > 1).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const order = {red:0, amber:1, green:2}, sorted = [...rows].sort((a, b) => order[a.level] - order[b.level] || (b.meta.wants || 0) - (a.meta.wants || 0) || b.card.score - a.card.score);
    const reds = sorted.filter(r => r.level === 'red'), LI = {red:'ban', amber:'alert', green:'check'}, LT = {red:'建议下架', amber:'核对一下', green:'没问题'};
    const row = r => { const phys = (r.pb || []).length || r.brand || (PHYS_RX.test(r.text) && !VIRT_FORM.test(r.text)), rw = r.level !== 'green' && !phys ? rewriteFor(r) : null, banned = (r.pb || []).some(p => p.lv === 'ban'), isFresh = r.hits.some(h => h.kind === 'copyright' && NEW_IDS.has(h.record.id));
      return `<div class="dgr ${r.level}"><span class="dgl">${ic(LI[r.level])}</span><div class="dgm"><b>${esc(r.text)}</b>${isFresh ? ' <span class="b reg">新中招</span>' : ''}
        <div class="row">${r.hits.map(h => `<span class="frag ${h.kind === 'copyright' ? (h.match_type.startsWith('exact') ? 'red' : 'amber') : h.kind === 'banned' ? h.level : 'amber'}">${esc(h.fragment)}</span>`).join('')}${(r.pb || []).map(p => `<span class="b ${PLV[p.lv][1]}" title="${esc(p.why)}">${ic(PLV[p.lv][2])}${PLV[p.lv][0]}：${esc(p.n)}</span>`).join('')}${r.brand ? `<span class="b" title="${esc(r.brand.note)}">${ic('tag')}品牌货，备好凭证</span>` : ''}${!r.hits.length && !(r.pb || []).length ? '<span class="mute xs">没有命中问题词</span>' : ''}</div>
        ${banned ? `<div class="rw no">${ic('ban')}<span>这类东西不能卖，换标题也没用，直接下架。</span></div>` : ''}
        ${rw ? `<div class="rw">${ic('wand')}<span>可以改成：<b>${esc(rw.title)}</b></span><button class="ib" data-cpv="${esc(rw.title)}" title="复制">${ic('copy')}</button></div>` : ''}</div>
        <div class="dgx"><span class="b lv ${r.level}">${LT[r.level]}</span>${r.meta.price !== null ? `<small>¥${r.meta.price}${r.meta.wants !== null ? ' · ' + r.meta.wants + ' 人想要' : ''}</small>` : ''}${r.level !== 'green' && !banned ? `<button class="btn sm" data-pick="${esc(r.text)}">${ic('sparkles')}重新生成</button>` : ''}</div></div>`; };
    return head + `<div class="dg-top anim"><div class="dg-score"><div class="ring" style="--p:${score};--c:${gc}"><b>${score}</b></div><div><span class="g">${grade} 档</span><small>店铺健康分</small></div></div>
        ${[['red', 'ban', n.red, '建议下架'], ['amber', 'alert', n.amber, '核对一下'], ['green', 'check', n.green, '没问题'], [freshHit ? 'red' : '', 'plus', freshHit, '名单更新后新中招']].map(([c, i, v, t]) => `<div class="tile ${c}"><span class="ti">${ic(i)}</span><b>${v}</b><span>${t}</span></div>`).join('')}</div>
      <div class="heat anim"><i class="r" style="width:${n.red / total * 100}%"></i><i class="a" style="width:${n.amber / total * 100}%"></i><i class="g" style="width:${n.green / total * 100}%"></i></div>
      <div class="grid anim"><section class="card"><h3>${ic('scale')}谁在投诉这类东西</h3>${topH.length ? `<div class="fgrid">${topH.map(([c, k]) => holderHTML(c, `<span class="b risk">你的店命中 ${k} 条</span>`)).join('')}</div>` : `<p class="empty">${ic('check')}没有命中有投诉记录的公司</p>`}</section>
        <section class="card"><h3>${ic('refresh')}反复出现的问题词</h3>${topF.length ? `<div class="vars big">${topF.map(([k, c]) => `<span class="b risk">${esc(k)} × ${c}</span>`).join('')}</div><p class="cd-note">${ic('bulb')}同一个词出现多次，说明是写标题的习惯，以后都别用。</p>` : `<p class="empty">${ic('check')}没有反复出现的问题词</p>`}</section></div>
      <h2 class="sec-t anim">${ic('list')}逐条结果<span class="lab">${total} 条 · 最该处理的排前面</span></h2><div class="dgrs anim">${sorted.map(row).join('')}</div>
      ${reds.length ? `<section class="card mt anim"><h3>${ic('ban')}下架清单<span class="lab">${reds.length} 条</span></h3>${reds.map((r, i) => `<label class="checkbox"><input type="checkbox" data-off="${esc(r.text)}" ${mem.offSel.has(r.text) ? 'checked' : ''}><span><b class="pri">${i + 1}</b> ${esc(r.text)} <span class="mute xs">· ${esc((r.reasons || []).join('、'))}</span></span></label>`).join('')}<div class="row" style="margin-top:10px"><button class="btn sm" id="off-all">${ic('check')}全选</button><button class="btn sm dark" id="off-json" ${mem.offSel.size ? '' : 'disabled'}>${ic('down')}导出清单（${mem.offSel.size}）</button></div></section>` : ''}`;
  }
