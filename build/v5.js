
  // ===== v5：上新工作台。一个品 → 1/3/5/10 个上架版本（标题 / 主图 + 5 张副图 / 说明 / 定价 / 交付），虚拟和实物两套流程 =====
  const PLAT = {闲鱼:{tl:30, imgs:9, tip:'标题 30 字内，首图 1:1（常用规格，以发布页为准）'}, 小红书:{tl:20, imgs:18, tip:'标题 20 字内，首图 3:4 或 1:1（常用规格，以发布页为准）'}, 淘宝:{tl:30, imgs:5, tip:'标题 30 字内，主图 5 张（常用规格，以发布页为准）'}, 拼多多:{tl:30, imgs:10, tip:'标题 30 字内，轮播 10 张（常用规格，以发布页为准）'}};
  const FK = {
    template:{n:'模板清单', re:/模板|清单|表格|计划表|工具表|打卡|排期|手账|简历|ppt/i, items:['可编辑源文件', '使用说明 1 份', '填写示例 1 份'], who:['想直接套用的人', '没时间自己做的人', '刚入门的新手'], way:'file'},
    notes:{n:'自制笔记', re:/笔记|导图|整理|总结|框架|要点|手册|攻略/, items:['自制整理笔记 PDF', '框架图一张', '重点清单'], who:['想快速抓重点的人', '时间紧的人', '零基础入门的人'], way:'file'},
    tutorial:{n:'自录教程', re:/教程|讲解|录屏|教学|入门课|实操/, items:['自录讲解视频', '配套练习文件', '文字版步骤'], who:['想跟着做一遍的人', '看文字学不会的人', '零基础新手'], way:'file'},
    original:{n:'原创素材', re:/素材|壁纸|头像|插画|字体|音效|提示词|预设|贴纸|源码|脚本|表情包/, items:['原创源文件', '使用范围说明', '预览图'], who:['做内容缺素材的人', '想省设计时间的人', '个人使用者'], way:'file'},
    service:{n:'一对一服务', re:/答疑|陪跑|咨询|定制|代做|批改|诊断|辅导|陪练|修改|润色|安装|配置/, items:['一对一沟通需求', '按约定时间交付', '交付后答疑'], who:['卡在某一步的人', '想要针对性反馈的人', '没时间自己摸索的人'], way:'service'},
  };
  const WAYS = {
    file:{way:'无需寄送 · 付款后发文件', time:'拍下即发，当天内', steps:[['cart', '买家拍下'], ['zap', '发文件或提取方式'], ['check', '确认收货']], reply:'感谢下单，文件已发，请查收。有看不懂的地方直接问我，7 天内答疑。'},
    service:{way:'人工服务 · 平台内沟通', time:'24 小时内开始', steps:[['chat', '拍下说需求'], ['clock', '约定时间交付'], ['check', '确认后收货']], reply:'感谢下单。请把你的具体情况发我，我看完后跟你约交付时间。'},
    ship:{way:'快递 / 同城面交', time:'48 小时内发出', steps:[['camera', '发货前拍视频'], ['truck', '快递或面交'], ['check', '买家验货签收']], reply:'已拍下，我今天打包，发货前会拍一段开箱前视频，单号稍后发你。'},
  };
  const ANG_V = [
    ['pain', '痛点直击', 'target', '{P} 不知道从哪下手就看它', '不知道从哪开始？', '很多人卡在第一步：不知道从哪下手。这份东西就是为这个准备的。'],
    ['list', '清单一图', 'list', '{P} 内容清单见图 一套配齐', '一套配齐', '里面有什么，我都列在下面和图里了，拍之前可以先看清楚。'],
    ['who', '人群定位', 'users', '{W}适用 {P} 照着做就行', '{W}适用', '专门给{W}准备的，不用再自己到处找、到处拼。'],
    ['pace', '节奏感', 'clock', '{P} 每天半小时 一步步来', '每天半小时', '按每天半小时的节奏排好了，不用一次看完，跟着走就行。'],
    ['rush', '急用场景', 'zap', '急用可拍 {P} 当天就能用上', '当天能用', '急用的可以直接拍，当天就能用上。'],
    ['save', '省时对比', 'trend', '省下自己摸索的时间 {P}', '省下摸索时间', '自己从头摸索要花好几天，这份是我已经走过一遍整理出来的。'],
    ['self', '自用背书', 'heart', '自用款 {P} 本人原创整理', '自用款', '这是我自己一直在用的，本人原创整理，现在分享出来。'],
    ['combo', '超值组合', 'gift', '{P}+使用说明+答疑 一起给', '附说明和答疑', '不只是文件，使用说明和答疑一起给，不会用可以问。'],
    ['easy', '新手友好', 'bulb', '新手友好 {P} 带示例好上手', '新手友好', '带示例，新手也能看懂，照着例子改就能用。'],
    ['custom', '可定制', 'wand', '{P} 可按你的情况调整', '可按需调整', '如果你的情况比较特殊，拍下后告诉我，我按你的情况调整。'],
  ];
  const ANG_P = [
    ['plain', '参数直给', 'tag', '{P} {C} 自用闲置 实拍', '自用闲置', '自用闲置，图片全部实拍。', ''],
    ['full', '配件齐全', 'box', '{P} {C} 配件齐全 支持验货', '配件齐全', '配件齐全，清单见下方。支持平台验货。', '配件确实齐全才用'],
    ['up', '换新出', 'refresh', '换新出 {P} {C} 功能正常', '换新出', '换了新的，这台闲置下来。功能一切正常。', ''],
    ['flaw', '瑕疵透明', 'eye', '{P} {C} 瑕疵如图 介意慎拍', '瑕疵都拍了', '瑕疵位置都单独拍了近照，放在前几张，介意的请慎拍。', ''],
    ['proof', '凭证在手', 'file', '个人自用 {P} {C} 有购买凭证', '有购买凭证', '个人自用，购买凭证还在，可以给你看。', '有凭证才用'],
    ['meet', '同城面交', 'users', '{P} {C} 同城可面交 当面验', '可面交', '同城可以面交，当面验货，满意再付。', ''],
    ['deal', '诚心可议', 'coin', '闲置转让 {P} {C} 诚心要可小刀', '诚心可小刀', '闲置转让，诚心要的可以小刀，不议大刀。', ''],
    ['detail', '所见即所得', 'camera', '{P} {C} 细节全拍了 所见即所得', '细节全拍', '正面、背面、侧面、接口、瑕疵都拍了，所见即所得。', ''],
    ['light', '用得少', 'clock', '用得少 {P} {C} 包装盒都在', '用得少', '买来用得很少，包装盒都在。', '盒子确实在才用'],
    ['safe', '平台验货', 'shield', '{P} {C} 走平台验货 放心拍', '走平台验货', '可以走平台验货，验完再确认，双方都放心。', ''],
  ];
  const CONDS = ['全新未拆', '99新', '95新', '9成新', '8成新', '有瑕疵'];
  const HARD_RX = /约炮|特服|外围女|包夜|陪睡|楼凤|裸聊|usdt|泰达币|换u|跑分|翻墙|vpn|机场节点|科学上网|梯子节点|sheerid|代过认证|四件套|黑u|枪支|弹药|冰毒|大麻|k粉|lsd|博彩|赌博|代孕|假证|办证/i;
  const PHYS_RX = /iphone|ipad|macbook|手机|平板|电脑|笔记本|显卡|主机|耳机|相机|镜头|手表|包包|球鞋|鞋|公路车|山地车|电动车|单车|家具|沙发|桌子|椅子|冰箱|洗衣机|空调|电视|音箱|外套|裙|玩具|吉他琴|手办|盲盒|卡牌|谷子|吧唧|switch|ps5|xbox|键盘|显示器|无人机|香水|口红|乐高|自行车|衣|裤|闲置|成新|二手/i;
  const CAT_RX = [['phone', /iphone|手机|ipad|平板|华为|小米|oppo|vivo/i], ['pc', /macbook|电脑|笔记本|显卡|cpu|主板|显示器|键盘/i], ['cam', /相机|镜头|微单|单反|gopro|无人机/i], ['console', /switch|ps5|ps4|xbox|游戏机|掌机/i], ['elec', /耳机|音箱|airpods|充电|路由/i], ['lux', /包包|lv|gucci|香奈儿|爱马仕/i], ['watch', /手表|腕表/], ['shoe', /球鞋|aj|yeezy|鞋/i], ['goods', /谷子|吧唧|立牌|周边/], ['toy', /手办|盲盒|乐高|模型/], ['card', /卡牌|球星卡|宝可梦卡/], ['beauty', /口红|香水|面霜|精华|小样/], ['pet', /猫|狗|宠物/],
    ['ai', /chatgpt|gpt|claude|gemini|midjourney|提示词|ai/i], ['gongkao', /国考|省考|公考|行测|申论|考编|教资|考证/], ['lang', /英语|雅思|托福|日语|四六级|单词/], ['k12', /小学|初中|高中|中考|高考|幼儿/], ['ecom', /小红书|起号|运营|选品|带货|闲鱼|电商/], ['design', /ppt|简历|字体|素材|海报|模板/i], ['soft', /软件|编程|python|代码|源码|excel/i], ['fin', /理财|基金|会计|cpa/i], ['health', /健身|减脂|瑜伽|食谱/], ['art', /吉他|钢琴|绘画|摄影|书法/], ['game', /游戏|steam|原神|王者/i], ['member', /会员|vip|兑换码/i]];
  const S = store.get('sjb-studio', {});
  Object.assign(S, {kind:S.kind || 'auto', ck:S.ck || '', fk:S.fk || '', cond:S.cond || '95新', pts:S.pts || '', price:S.price || '', chan:S.chan || '', flaw:S.flaw || '', n:[1, 3, 5, 10].includes(S.n) ? S.n : 5, open:0, more:false, photos:[], refs:[], samp:[], comp:[], cmp:'', info:'', bucket:'', ai:{}, busy:{}, edits:{}, selN:false, selP:false, run:'', pend:false, mix:null});
  // 文案走 DeepSeek，生图走 APIMart（提交任务 → 轮询 → 取图）。密钥：浏览器里填的优先，其次读同目录 keys.local.js
  const KEYS = window.SJB_KEYS || {};
  const AI = Object.assign({tb:'https://api.deepseek.com', tk:'', tm:'deepseek-flash', ib:'https://api.apimart.ai', ik:'', im:'gpt-image-2'}, store.get('sjb-ai2', {}));
  const tkey = () => AI.tk || KEYS.deepseek || '', ikey = () => AI.ik || KEYS.apimart || '';
  let plansCache = {key:'', v:null};

  const FALLP = {ai:'AI工具使用', member:'会员权益对比', game:'游戏攻略', soft:'软件使用', res:'资料整理', acct:'账号安全'};
  const redHit = h => h.kind === 'copyright' ? ['exact_name', 'exact_company'].includes(h.match_type) : h.kind === 'slang' ? (h.liveness === 'killed' || h.risk === 'danger' || h.policy === 'grey') : h.level === 'red';
  // 实物的品牌型号就是商品本身，不按版权名单拦；暗语和拦截词照查
  // 平台名当主题写（如「小红书起号模板」）不算碰别人的名字
  const PLAT_OK = /^(小红书|抖音|闲鱼|淘宝|拼多多|快手|b站|哔哩哔哩|公众号|视频号)$/i;
  window.SJB_LV = (t, v) => lvOf(t, v);
  function lvOf(text, virt) { const r = lint(text), hits = virt ? r.hits.filter(h => !(h.kind === 'copyright' && PLAT_OK.test(h.fragment))) : r.hits.filter(h => h.kind !== 'copyright'); return {hits, level:!hits.length ? 'green' : hits.some(redHit) ? 'red' : 'amber'}; }
  function stInfo(name) {
    const raw = lint(name), hard = HARD_RX.test(name);
    let cat = catOf(S.ck); const rec = worstRecord(raw.hits);
    if (!cat) { const m = CAT_RX.find(([, rx]) => rx.test(name)); if (m) cat = catOf(m[0]); }
    if (!cat && rec) cat = CATS.find(c => c.domains.includes(rec.category)) || null;
    const pr = physRule(name), banHit = pr.ban.find(r => r.lv === 'ban');
    const kind = S.kind !== 'auto' ? S.kind : pr.ban.length || pr.brand ? 'physical' : cat ? cat.kind : PHYS_RX.test(name) ? 'physical' : 'virtual';
    const virt = kind === 'virtual', res = lvOf(name, virt);
    const redWord = SA.redline.find(r => r.variants.some(v => v.length >= 2 && name.toLowerCase().includes(v.toLowerCase())));
    let P = name.trim(), fixed = false;
    if (res.hits.length) { P = deriveTopic(name, res.hits); fixed = true; if ((P.match(/[\u4e00-\u9fa5]/g) || []).length < 2 && virt) P = (cat && FALLP[cat.key]) || (rec && CAT_TOPIC[rec.category]) || '实用资料'; if (!P) P = name.trim(); }
    P = P.replace(/\s+/g, ' ').slice(0, 18);
    let fk = S.fk && FK[S.fk] ? S.fk : Object.keys(FK).find(k => FK[k].re.test(P)) || '';
    const hasForm = !!Object.keys(FK).find(k => FK[k].re.test(P));
    if (virt) { if (!fk) fk = 'notes'; if (!hasForm) P = P + FK[fk].n.replace('自制', '').replace('一对一', '答疑'); if (fixed && !/自制|原创|自录/.test(P)) P = '自制' + P; }
    const stop = hard ? '这个题材属于红线，不出方案' : banHit ? `「${banHit.n}」不能卖：${banHit.why}` : cat && cat.stance === 'warn' ? `「${cat.name}」只做警示，不出方案` : '';
    return {name, res, cat, kind, P, fk, fixed, stop, redWord, pr};
  }
  function fitTitle(tpl, vars, max, virt = true) {
    let t = tpl.replace(/\{(\w)\}/g, (_, k) => vars[k] || '').replace(/\s+/g, ' ').trim();
    if (t.length > max) { const segs = t.split(' '); while (segs.length > 1 && segs.join(' ').length > max) { let i = segs.length - 1; while (i >= 0 && segs[i].includes(vars.P)) i--; if (i < 0) break; segs.splice(i, 1); } t = segs.join(' '); if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, '') || t.slice(0, max); }
    for (let n = 0; n < 4; n++) { const r = lvOf(t, virt); if (r.level === 'green') return t; for (const h of r.hits) t = t.replace(h.fragment, ''); t = t.replace(/\s+/g, ' ').trim(); }
    return t;
  }
  const lines = s => String(s || '').split(/\n|；|;/).map(x => x.trim()).filter(Boolean);
  function buildPlans(info) { return buildAll(info).slice(0, S.n); }
  function buildAll(info) {
    const pf = PLAT[state.platform], virt = info.kind === 'virtual', user = lines(S.pts);
    const tree = info.cat && info.cat.tree, W = tree === 'study' ? '上班族备考' : tree === 'ops' ? '新手卖家' : '零基础';
    const price = parseFloat(S.price) || 0;
    if (virt) {
      const f = FK[info.fk], way = WAYS[f.way], rule = PRICE_RULES[info.fk] || PRICE_RULES.notes;
      const mid = Math.round((rule.low + rule.high) / 2) - 0.1, tiers = price ? [Math.max(1, Math.round(price * 0.7 * 10) / 10), price, Math.round(price * 1.5)] : [rule.low, mid, rule.high];
      const items = user.length ? user : f.items;
      return ANG_V.map(([k, n, icon, tpl, slogan, opener], i) => {
        const title = fitTitle(tpl, {P:info.P, W}, pf.tl), p = tiers[[1, 0, 1, 1, 1, 1, 0, 2, 0, 2][i]];
        const sec = {what:`【商品介绍】\n${info.P}，${info.fk === 'service' ? '我本人提供的服务' : '本人自制原创'}。${opener.replace('{W}', W)}`, has:`【你会拿到】\n${items.map((x, j) => `${j + 1}. ${x}`).join('\n')}`, who:`【适合谁】\n${f.who.map(x => '· ' + x).join('\n')}`, send:`【怎么发货】\n${way.way}。${way.time}。`, note:`【购买须知】\n· ${f.way === 'file' ? '虚拟商品可复制，发出后不支持退换，拍前请看清内容。' : '服务开始前可以取消，开始后按进度结算。'}\n· 内容为本人自制，不含任何第三方课程、文件、账号。\n· 有问题先联系我，在线就回。`};
        const order = [['what', 'has', 'who', 'send', 'note'], ['has', 'what', 'send', 'note'], ['who', 'what', 'has', 'send', 'note'], ['what', 'has', 'send', 'who', 'note']][i % 4];
        return {i, key:k, angle:n, icon, title, price:p, tiers, items, who:f.who, way, slogan:slogan.replace('{W}', W), desc:order.map(x => sec[x]).join('\n\n'), need:'', lay:i, virt:true, P:info.P, tags:[f.n, way === WAYS.file ? '拍下即发' : '一对一', '本人原创'], rule:rule.note};
      });
    }
    const way = WAYS.ship, C = S.cond, items = user.length ? user : ['主机 / 本体', '原装配件（填你有的）', '包装盒（有就写）'];
    const tiers = price ? [Math.round(price * 0.92), price, Math.round(price * 1.08)] : [0, 0, 0];
    const out = ANG_P.map(([k, n, icon, tpl, slogan, opener, need], i) => {
      const title = fitTitle(tpl, {P:info.P, C}, pf.tl, false);
      const desc = [`【转让原因】\n${opener}`, `【成色】\n${C}。${S.flaw ? '瑕疵：' + S.flaw : '（写清使用多久、有没有维修过、瑕疵在哪）'}`, `【配件】\n${items.map(x => '· ' + x).join('\n')}`, `【入手渠道】\n${S.chan || '（写在哪买的、什么时候买的）'}`, `【交易方式】\n· 只在平台内沟通和付款。\n· 发货前拍打包视频，记下机身编号。\n· ${k === 'meet' ? '同城优先面交，当面验货。' : '快递发出，支持平台验货。'}`].join('\n\n');
      return {i, key:k, angle:n, icon, title, price:tiers[[1, 1, 1, 0, 2, 1, 2, 1, 2, 1][i]], tiers, items, who:[], way, slogan, desc, need, lay:i, virt:false, P:info.P, C, tags:[C, '实拍', k === 'meet' ? '可面交' : '支持验货'], rule:'在闲鱼搜同型号同成色，取中间价；急出按低一档'};
    });
    // 品名太长时模板会被裁成一样的，换短写法保证每条不同
    const P2 = info.P.split(' ').length > 2 ? info.P.split(' ').slice(0, -1).join(' ') : info.P;
    const seen = new Set(); out.forEach(p => { if (seen.has(p.title)) for (const alt of [`${info.P} ${p.slogan}`, `${p.slogan} ${info.P}`, `${P2} ${C} ${p.slogan}`, `${p.slogan} ${P2} ${C}`, `${P2} ${p.slogan}`, `${p.slogan} ${P2}`, `${P2} ${C} 实拍`, `${P2} ${C} 闲置`, `自用 ${P2} ${C}`]) { const t = alt.trim(); if (t.length <= pf.tl && !seen.has(t) && lvOf(t, false).level === 'green') { p.title = t; break; } } seen.add(p.title); });
    return out;
  }

  // ---------- 画图：10 套主图版式 + 5 类副图，1080×1080 ----------
  const PALS = [['#ff5533', '#fff', '#ffe14d', '#1a1a1a'], ['#ffffff', '#141414', '#1f6feb', '#eaf2ff'], ['#0f172a', '#fff', '#38e0a8', '#1e293b'], ['#ffd84d', '#161616', '#ff4d4d', '#fff'], ['#f3ecdf', '#2b2118', '#c0392b', '#fff'], ['#1f6feb', '#fff', '#ffd84d', '#0b3a8f'], ['#141210', '#f6e7c1', '#d9a441', '#26221c'], ['#eafaf1', '#0d3b2a', '#0f8a63', '#fff'], ['#6d3fa8', '#fff', '#ffcf5c', '#4b2580'], ['#fff5f0', '#1c1c1c', '#ff5533', '#fff']];
  const FONT = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif';
  const onC = h => { const n = parseInt(h.slice(1), 16); return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 150 ? '#111' : '#fff'; };
  const rr = (c, x, y, w, h, r, fill, stroke) => { c.beginPath(); c.roundRect(x, y, w, h, r); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 4; c.stroke(); } };
  function tx(c, text, x, y, o = {}) {
    let size = o.size || 60; const maxW = o.maxW || 900, maxL = o.maxL || 3; let ls;
    for (;;) { c.font = `${o.w || 800} ${size}px ${FONT}`; ls = wrapText(c, text, maxW); if (ls.length <= maxL || size <= (o.min || 30)) break; size -= 6; }
    ls = ls.slice(0, maxL); c.fillStyle = o.color || '#000'; c.textAlign = o.align || 'left'; c.textBaseline = 'top';
    const lh = size * (o.lh || 1.22); ls.forEach((l, i) => c.fillText(l, x, y + i * lh)); return y + ls.length * lh;
  }
  const pill = (c, text, x, y, bg, fg, size = 34) => { c.font = `700 ${size}px ${FONT}`; const w = c.measureText(text).width + size * 1.3; rr(c, x, y, w, size * 1.9, size, bg); c.fillStyle = fg; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(text, x + size * 0.65, y + size * 0.98); return x + w + 16; };
  function docMock(c, x, y, w, h, ac, rot = 0) { c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,.22)'; c.shadowBlur = 40; c.shadowOffsetY = 16; rr(c, -w / 2, -h / 2, w, h, 18, '#fff'); c.shadowColor = 'transparent'; rr(c, -w / 2 + 34, -h / 2 + 36, w * 0.5, 26, 8, ac); for (let i = 0; i < 6; i++) { const yy = -h / 2 + 100 + i * (h - 150) / 6; rr(c, -w / 2 + 34, yy, 26, 26, 6, null, ac); rr(c, -w / 2 + 78, yy + 4, (w - 130) * [0.9, 0.7, 0.82, 0.6, 0.88, 0.5][i], 18, 6, '#e3e3e3'); } c.restore(); }
  function drawMain(c, p) {
    const [bg, fg, ac, alt] = PALS[p.lay], W = 1080, tags = p.tags;
    c.fillStyle = bg; c.fillRect(0, 0, W, W);
    const tagRow = (y, x = 70) => { let xx = x; tags.forEach(t => { xx = pill(c, t, xx, y, ac, onC(ac), 32); }); };
    const L = p.lay % 5;
    if (L === 0) { pill(c, p.slogan, 70, 80, fg, bg, 38); const y = tx(c, p.P, 70, 230, {size:150, maxW:940, maxL:3, color:fg, w:900, min:84}); rr(c, 70, y + 26, 300, 20, 10, ac); c.globalAlpha = 0.14; c.fillStyle = fg; c.beginPath(); c.arc(960, 900, 300, 0, 7); c.fill(); c.globalAlpha = 1; tagRow(940); }
    else if (L === 1) { rr(c, 0, 0, 54, W, 0, ac); tx(c, p.P, 120, 90, {size:104, maxW:880, maxL:2, color:fg, w:900, min:64}); p.items.slice(0, 4).forEach((it, i) => { const y = 400 + i * 132; rr(c, 120, y, 880, 108, 26, alt); c.fillStyle = ac; c.beginPath(); c.arc(180, y + 54, 26, 0, 7); c.fill(); c.strokeStyle = onC(ac); c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(168, y + 55); c.lineTo(177, y + 65); c.lineTo(194, y + 44); c.stroke(); tx(c, it, 230, y + 30, {size:44, maxW:740, maxL:1, color:onC(alt), w:700, min:30}); }); tagRow(960, 120); }
    else if (L === 2) { c.fillStyle = alt; c.beginPath(); c.arc(820, 620, 430, 0, 7); c.fill(); docMock(c, 560, 330, 430, 580, ac, 0.07); docMock(c, 500, 380, 430, 580, ac, -0.05); tx(c, p.P, 70, 90, {size:112, maxW:800, maxL:2, color:fg, w:900, min:66}); pill(c, p.slogan, 70, 400, ac, onC(ac), 40); tags.forEach((t, i) => { tx(c, '· ' + t, 70, 540 + i * 78, {size:46, maxW:400, maxL:1, color:fg, w:700}); }); }
    else if (L === 3) { rr(c, 0, 0, W, 600, 0, bg); tx(c, p.P, 70, 110, {size:128, maxW:940, maxL:2, color:fg, w:900, min:72}); pill(c, p.slogan, 70, 450, ac, onC(ac), 40); rr(c, 0, 620, W, 460, 0, alt); tags.forEach((t, i) => { const x = 70 + i * 320; rr(c, x, 700, 290, 290, 36, bg); tx(c, String(i + 1).padStart(2, '0'), x + 34, 734, {size:70, color:ac, w:900}); tx(c, t, x + 34, 850, {size:50, maxW:230, maxL:2, color:onC(bg), w:800, min:34}); }); }
    else { c.save(); c.translate(540, 560); c.rotate(-0.035); c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = 50; c.shadowOffsetY = 20; rr(c, -420, -400, 840, 800, 26, alt === '#fff' ? '#fff' : alt); c.shadowColor = 'transparent'; rr(c, -90, -430, 180, 60, 8, ac); c.restore(); const ink = alt === '#fff' ? '#1c1c1c' : fg; const y = tx(c, p.P, 180, 280, {size:112, maxW:720, maxL:3, color:ink, w:900, min:64}); rr(c, 180, y + 24, 720, 6, 3, ac); tx(c, p.slogan, 180, y + 64, {size:56, maxW:720, maxL:1, color:ac, w:800}); let xx = 180; tags.slice(0, 2).forEach(t => { xx = pill(c, t, xx, 820, ink, onC(ink), 32); }); }
  }
  function drawPhoto(c, p, img) {
    const [bg, fg, ac] = PALS[p.lay], W = 1080;
    c.fillStyle = '#eee'; c.fillRect(0, 0, W, W);
    if (img) { const s = Math.max(W / img.width, W / img.height), w = img.width * s, h = img.height * s; c.drawImage(img, (W - w) / 2, (W - h) / 2, w, h); }
    else { c.fillStyle = '#f1f1ee'; c.fillRect(0, 0, W, W); c.setLineDash([22, 16]); rr(c, 90, 90, 900, 720, 40, null, '#b9b7b0'); c.setLineDash([]); tx(c, '这里放你的实拍图', 540, 380, {size:64, color:'#7a776f', align:'center'}); tx(c, ['正面 45°，自然光', '背面全景', '屏幕点亮', '瑕疵近拍', '铭牌与机身编号', '配件全家福', '侧面接口', '包装盒', '上手比例', '购买凭证'][p.lay], 540, 480, {size:46, color:'#a09d94', align:'center', w:600}); }
    const L = p.lay % 3;
    if (L === 0) { const g = c.createLinearGradient(0, 760, 0, W); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.78)'); c.fillStyle = g; c.fillRect(0, 760, W, 320); tx(c, p.P, 60, 900, {size:68, maxW:760, maxL:1, color:'#fff', w:900, min:40}); pill(c, p.C, 60, 990, ac, onC(ac), 34); pill(c, p.slogan, 250, 990, '#fff', '#111', 34); }
    else if (L === 1) { rr(c, 0, 860, W, 220, 0, bg); tx(c, p.P, 60, 890, {size:66, maxW:960, maxL:1, color:fg, w:900, min:40}); pill(c, p.C, 60, 986, ac, onC(ac), 32); pill(c, p.slogan, 240, 986, fg, bg, 32); }
    else { pill(c, p.C, 50, 50, ac, onC(ac), 44); rr(c, 50, 930, 980, 110, 30, 'rgba(255,255,255,.94)'); tx(c, p.P + ' · ' + p.slogan, 90, 958, {size:50, maxW:900, maxL:1, color:'#141414', w:800, min:32}); }
  }
  function drawSub(c, p, slot) {
    const [bg0, , ac0] = PALS[p.lay], W = 1080, ac = ['#ffe14d', '#ffd84d', '#ffcf5c', '#38e0a8'].includes(ac0) ? (bg0 === '#ffd84d' ? '#ff4d4d' : '#1f6feb') : ac0;
    c.fillStyle = '#fafaf7'; c.fillRect(0, 0, W, W); rr(c, 0, 0, W, 16, 0, ac);
    const head = (t, s) => { tx(c, t, 80, 90, {size:84, color:'#151515', w:900}); rr(c, 80, 204, 120, 12, 6, ac); if (s) tx(c, s, 80, 240, {size:38, color:'#77746c', w:500, maxW:920, maxL:1}); };
    const rows = (arr, mode) => arr.slice(0, 5).forEach((t, i) => { const y = 330 + i * 140; rr(c, 80, y, 920, 116, 28, '#fff', '#ecebe6'); c.fillStyle = ac; c.beginPath(); c.arc(148, y + 58, 34, 0, 7); c.fill(); if (mode === 'num') tx(c, String(i + 1), 148, y + 34, {size:42, color:'#fff', align:'center', w:900}); else { c.strokeStyle = '#fff'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(133, y + 59); c.lineTo(144, y + 71); c.lineTo(165, y + 46); c.stroke(); } tx(c, t, 210, y + 34, {size:44, maxW:760, maxL:1, color:'#1c1c1c', w:700, min:28}); });
    if (slot === 'list') { head(p.virt ? '你会拿到' : '配件清单', p.P); rows(p.items, 'num'); }
    else if (slot === 'who') { head(p.virt ? '适合谁' : '成色说明', p.virt ? '' : p.C); rows(p.virt ? p.who : [p.C, S.flaw ? '瑕疵：' + S.flaw : '瑕疵位置见实拍图', '功能正常，可当面测试', '无拆修（按实际填写）'], 'check'); }
    else if (slot === 'preview') { head(p.virt ? '内容预览' : '拍摄清单', p.virt ? '换成你的真实截图再发布' : '按这个顺序拍，前几张放瑕疵'); if (p.virt) { docMock(c, 150, 330, 380, 560, ac, -0.04); docMock(c, 560, 360, 380, 560, ac, 0.05); } else rows(['正面、背面、侧面各一张', '瑕疵位置单独近拍', '铭牌、机身编号、凭证', '配件全家福', '不加滤镜，不用网图'], 'num'); }
    else if (slot === 'flow') { head(p.virt ? '怎么发货' : '怎么交易', p.way.way); p.way.steps.forEach(([, t], i) => { const x = 80 + i * 320; rr(c, x, 400, 280, 380, 36, '#fff', '#ecebe6'); c.fillStyle = ac; c.beginPath(); c.arc(x + 140, 520, 70, 0, 7); c.fill(); tx(c, String(i + 1), x + 140, 476, {size:84, color:'#fff', align:'center', w:900}); tx(c, t, x + 140, 640, {size:42, maxW:240, maxL:2, color:'#1c1c1c', align:'center', w:800, min:30}); if (i < 2) { c.strokeStyle = ac; c.lineWidth = 8; c.beginPath(); c.moveTo(x + 288, 590); c.lineTo(x + 312, 590); c.stroke(); } }); pill(c, p.way.time, 80, 860, ac, '#fff', 40); }
    else { head('购买须知', ''); rows(p.virt ? ['虚拟商品发出后不支持退换', '内容为本人自制原创', '不含第三方课程和文件', '有问题先联系，在线就回'] : ['只在平台内沟通付款', '发货前拍开箱前视频', '支持平台验货', '签收前请当面检查'], 'check'); }
  }
  const SLOTS = [['main', '主图'], ['list', '清单'], ['who', '人群'], ['preview', '预览'], ['flow', '发货'], ['note', '须知']];
  function paintOne(cv) {
    const [i, slot] = cv.dataset.cv.split(':'), p = plansCache.v && plansCache.v[+i]; if (!p) return;
    const ai = S.ai[cv.dataset.cv];
    if (ai) { const w = ai.img.naturalWidth || 1080, h = ai.img.naturalHeight || 1080; cv.width = 1080; cv.height = Math.round(1080 * h / w); cv.style.aspectRatio = w + ' / ' + h; cv.getContext('2d').drawImage(ai.img, 0, 0, cv.width, cv.height); return; }
    if (cv.height !== 1080) cv.height = 1080; cv.style.aspectRatio = ''; const c = cv.getContext('2d');
    if (slot === 'main') { if (p.virt) drawMain(c, p); else drawPhoto(c, p, S.photos.length ? S.photos[p.i % S.photos.length] : null); }
    else drawSub(c, p, slot);
  }
  function paintStudio() { document.querySelectorAll('canvas[data-cv]').forEach(paintOne); }
  const ALLS = [...SLOTS, ['x6', '副图 6'], ['x7', '副图 7'], ['x8', '副图 8']];
  const SLOT_NAME = Object.fromEntries(ALLS);
  // 带了同行的图：带来几张就做几张（主图 + 副图），不超过平台能发的张数，最多 9 张；没带就是固定 6 张
  const peerN = () => Math.min(S.samp.filter(u => !(/^data:/.test(u) && !S.peerUp)).length, ALLS.length, (PLAT[state.platform] || {imgs:9}).imgs);
  const slotsOf = p => (p && p.virt && peerN() ? ALLS.filter((x, k) => k < peerN() || (k < SLOTS.length && S.ai[p.i + ':' + x[0]])) : SLOTS);   // 旧记录里多出来的图照样显示
  const setN = virt => (virt && peerN() ? peerN() : SLOTS.length);
  function dlCanvas(cv, name) { cv.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }, 'image/png'); }
  const AR = {闲鱼:'3:4', 小红书:'3:4', 淘宝:'1:1', 拼多多:'1:1'};
  const VS = ['浅色木纹书桌，旁边有一杯咖啡', '白色书桌，旁边有台灯和便利贴', '宿舍书桌，旁边有水杯和耳机', '铺着米色桌布的餐桌，旁边有一小盆绿植', '灰色办公桌，旁边露出键盘一角', '窗边的小桌', '深色木桌，旁边有一副眼镜', '床边小桌', '图书馆长桌，旁边有几本合上的书，书脊上没有字', '飘窗上的小茶几', '格子桌布的小方桌', '白色床单上', '浅灰色沙发上，旁边有个抱枕', '木地板上，旁边有一个帆布包', '阳台的折叠桌', '咖啡店的圆桌，旁边有一杯拿铁', '奶油色的梳妆台', '黑色电脑桌，旁边有鼠标', '铺着牛皮纸的桌面', '大理石纹的台面', '藤编小茶几', '自习室的隔板桌', '厨房的白色岛台一角', '儿童房的小书桌，旁边有彩色铅笔', '榻榻米上的矮桌', '绿色切割垫板上，旁边有尺子', '落地窗边的地毯上', '工位隔板旁的桌面，贴着几张空白便签', '原木长凳上', '浅蓝色书桌，旁边有一个笔筒'];
  const PS = ['浅色木桌上', '白色床单上', '米色沙发扶手旁', '书桌上，旁边露出键盘一角', '木地板上', '窗台上', '灰色地毯上', '餐桌上，旁边有一个水杯', '手拿着，背景是家里客厅，虚化', '手拿着，背景是书桌，虚化', '玄关柜上', '阳台小桌上', '飘窗垫上', '茶几上', '电视柜上', '格子桌布上', '床头柜上', '浅色瓷砖地面上'];
  const LIGHT = ['白天窗边的自然光', '晚上暖色的台灯光', '阴天柔和的散射光', '下午斜照进来的阳光，有一点影子'];
  const COMP = ['从正上方俯拍', '斜 45 度俯拍', '平视近拍', '近一点拍，背景略微虚化', '稍远一点拍，带一点周围环境'];
  const FILL = ['五', '六', '七'];
  const DEV = ['一台打开的笔记本电脑', '一台斜放的平板电脑', '一台立在支架上的平板电脑', '一台显示器'];
  const PROMO_STYLE = ['高饱和纯色背景的大字报海报', '白底加一个强调色的极简海报', '手账拼贴风，有纸胶带和贴纸元素', '深色背景加荧光色点缀的科技感海报', '杂志封面式排版', '便利贴加手写批注风格', '扁平插画加 3D 小图标点缀', '复古报纸排版', '撞色色块分区的版式', '浅色渐变背景加圆角卡片'];
  const LAYOUTS = ['标题在上、主视觉在下', '左边文字、右边图形', '大标题居中，四周点缀小图标', '上下分成两块色块', '卡片堆叠式，标题压在卡片上', '斜向分割的版面', '标题在左上，要点竖排在右侧', '大号数字或符号做视觉重点，标题在旁边'];
  const FONTS = ['粗黑体大标题', '圆润的圆体标题', '宋体大标题配黑体小字', '粗黑体标题加一处手写体点缀', '窄长的压缩黑体标题', '带描边的粗体标题'];
  // 小红书：风格和版式取自 baoyu-xhs-images（去掉了手写实拍那一种，虚拟商品不做实拍感）
  const XHS_STYLE = ['甜美可爱风：粉色系，圆润贴纸、爱心和星星点缀', '清新自然风：薄荷绿和浅蓝，干净留白', '温暖治愈风：奶油色和暖橙，柔和光晕', '强冲击风：高饱和撞色，粗描边大字', '极简高级风：黑白灰加一个点缀色，大量留白', '复古怀旧风：做旧纸张质感，虚线边框', '波普活力风：亮色色块，漫画爆炸贴', 'Notion 手绘线条风：白底黑色手绘线稿，少量淡彩', '黑板粉笔风：深色黑板底，彩色粉笔字和简笔画'];
  const XHS_UI = [['甜美可爱', '粉色、贴纸、爱心', '#ffd3e0', '#ff7aa8'], ['清新自然', '薄荷绿、浅蓝、留白', '#d7f3e6', '#6cc5b0'], ['温暖治愈', '奶油色、暖橙', '#fdebd0', '#f0a35e'], ['强冲击', '撞色、粗描边大字', '#ffe14d', '#ff3b30'], ['极简高级', '黑白灰加一点颜色', '#f2f2f2', '#1a1a1a'], ['复古怀旧', '做旧纸张、虚线框', '#ead9b8', '#9c6b3f'], ['波普活力', '亮色块、漫画爆炸贴', '#3ec6ff', '#ff4fa3'], ['手绘线条', '白底黑线稿、淡彩', '#ffffff', '#333333'], ['黑板粉笔', '黑板底、粉笔字', '#2f4a3e', '#f6e58d']];
  const XST_SHOW = false;                                                           // 小红书风格选择先不放出来（用户 2026-11-13：先随机，以后再放）；改成 true 就恢复那排卡片
  const xst = () => (XST_SHOW && Number.isInteger(S.xst) && S.xst >= 0 && S.xst < XHS_STYLE.length ? S.xst : -1);
  const XHS_LAY = ['留白式：只放一两个要点，冲击力优先', '均衡式：三四个要点分块排', '知识卡式：要点排成小卡片，密而有序', '清单式：带序号竖排', '左右对比式', '流程式：几步用箭头串起来', '思维导图式：中心向外发散', '四象限式'];
  const MAIN_V = ['promo', 'screen', 'print', 'hand', 'collage'], SUB_PHOTO = ['using', 'pages', 'detail', 'files', 'screen2', 'hand2'], SUB_TA = ['flow', 'note'], SUB_TB = ['toc', 'points', 'who'];
  const TYPE_NAME = {promo:'AI 主图', embed:'AI 主图 · 嵌了真实截图', embed2:'截图讲解', shot:'真实截图 · 原样', redo:'在参考图上改', core:'核心卖点', intro:'简介', screen:'拍屏幕', print:'打印实拍', hand:'手持', collage:'样张拼图', using:'使用场景', pages:'样张平铺', detail:'局部特写', files:'文件列表', screen2:'屏幕展示', hand2:'手机展示', flow:'怎么发货', note:'购买须知', toc:'目录便签', points:'你会拿到', who:'适合谁', scene:'场景图'};
  const NEEDS_PAGE = ['promo', 'screen', 'print', 'hand', 'collage', 'using', 'pages', 'detail', 'screen2', 'hand2'];
  const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  // 虚拟商品：卖家自己的真实截图怎么放进 AI 图里（每套换一种）
  const EMBED = ['放进一台正面平视的平板电脑屏幕里，设备外框是扁平插画风', '放进一台打开的笔记本电脑屏幕里，设备外框是扁平插画风', '放进一部竖着的手机屏幕里，设备外框是扁平插画风', '做成一张带圆角和柔和投影的卡片，略微倾斜放着', '做成两三张错开叠放的卡片，最上面一张是这张截图', '放进一个浏览器窗口样式的框里，顶部有三个小圆点', '做成拍立得相片的样子，四角贴着纸胶带', '做成一张被回形针夹住的纸页，边上露出第二页的一角', '放在一个文件夹图标里探出半截'];
  const EMBED_POS = ['放在画面正中间，标题在它上方', '放在画面下半部分，标题压在上半部分', '放在画面右侧，标题和要点在左侧', '放在画面左侧，标题和要点在右侧', '放在画面中间偏下，标题斜着跨过左上角'];
  const SHOT_HEAD = ['里面长这样', '实际内容截图', '打开就是这样', '先看看内容', '内容一览'];
  let emSeq = [];
  // 参考图分两种：卖家自己传的（真实截图，可以原样用）和从同行那里带过来的（只照着重做，不原样用）
  const isOwn = u => /^data:/.test(u) && !S.peerUp;
  const ownShots = () => S.samp.filter(isOwn), peerRefs = () => S.samp.filter(u => !isOwn(u));
  // 一个版本的出图配方：主图类型、场景、光线、构图、留白、文字方式都随机；最近用过的「类型+场景」不再抽
  function mixOne(i, virt, mainType) {
    const recent = store.get('sjb-recent', []), ar = AR[state.platform] || '1:1', r = {};
    if (!virt) { const sc = shuf(PS), l = pick(LIGHT); SLOTS.forEach(([sl], k) => { r[i + ':' + sl] = {t:'scene', scene:sc[k], light:k ? pick(LIGHT) : l, dist:pick(['商品占画面大约六成', '镜头近一点，商品占画面八成', '镜头远一点，带一点周围环境', '商品放在画面中间偏下', '镜头略微俯视']), ar}; }); return r; }
    // 虚拟商品：全部是平面设计的介绍图。每套抽一套风格、排版、字体；最近用过的组合不再抽
    const xhs = state.platform === '小红书', SP = xhs ? XHS_STYLE : PROMO_STYLE, LP = xhs ? XHS_LAY : LAYOUTS;
    const fix = xhs && xst() >= 0 ? XHS_STYLE[xst()] : '';                          // 小红书：用户自己挑了风格就用挑的，没挑才随机
    let ps = fix || pick(SP), lay = pick(xhs ? XHS_LAY.slice(0, 2) : LP); for (let k = 0; k < 8 && recent.includes(ps + '|' + lay); k++) { ps = fix || pick(SP); lay = pick(xhs ? XHS_LAY.slice(0, 2) : LP); }
    const font = pick(FONTS); let subs = shuf(['points', 'who', 'flow', 'note', 'core']);
    // 卖家传了自己的截图：主图是 AI 图，多数情况把一张真实截图嵌在中间；副图里夹 1 到 3 张原样的真实截图，再加一张「截图讲解」，其余是 AI 介绍卡。每套的嵌法、位置、顺序、用哪张截图都不同
    const own = ownShots().length; if (!emSeq.length) emSeq = shuf(EMBED);
    const mainT = own && Math.random() < .8 ? 'embed' : 'promo'; let si = i;
    r[i + ':main'] = {t:mainT, ps, lay, font, ar, xhs, si:si++, frame:emSeq[i % emSeq.length], pos:pick(EMBED_POS)};
    if (own) { const nShot = Math.min(own, 3, 1 + Math.floor(Math.random() * 3)), mixed = [...Array(nShot).fill('shot'), ...(Math.random() < .65 ? ['embed2'] : [])]; subs = shuf([...mixed, ...['flow', ...shuf(['points', 'who', 'note', 'core'])].slice(0, 5 - mixed.length)]); }
    ALLS.slice(1).forEach(([sl], k) => { const t = subs[k] || 'core'; r[i + ':' + sl] = Object.assign({t, ps, lay:pick(xhs ? XHS_LAY.slice(1) : LAYOUTS), font, ar:ar === '1:1' ? '1:1' : pick(['3:4', '3:4', '1:1'])}, t === 'shot' || t === 'embed2' ? {si:si++, frame:emSeq[(i + k + 1) % emSeq.length], head:pick(SHOT_HEAD)} : {}); });
    store.set('sjb-recent', [ps + '|' + lay, ...recent].slice(0, 40));
    return r;
  }
  function mkMix(n, virt) { emSeq = shuf(EMBED); const r = {}; for (let i = 0; i < n; i++) Object.assign(r, mixOne(i, virt)); return {r}; }
  const rc = (p, slot) => (S.mix && S.mix.r && S.mix.r[p.i + ':' + slot] && (!p.virt || S.mix.r[p.i + ':' + slot].lay) ? S.mix.r[p.i + ':' + slot] : null) || {t:p.virt ? (slot === 'main' ? 'promo' : {list:'points', who:'who', preview:'core', flow:'flow', note:'note'}[slot]) : 'scene', scene:PS[0], light:LIGHT[0], ps:PROMO_STYLE[0], lay:LAYOUTS[0], font:FONTS[0], dist:'商品占画面大约六成', ar:AR[state.platform] || '1:1'};
  // 带了同行的图：第 1 张改成主图，后面每一张对应改成一张副图，带来几张就改几张
  const refOf = (p, slot) => { const k = ALLS.findIndex(x => x[0] === slot); return p.virt && k >= 0 && k < peerN() ? peerRefs()[k] || '' : ''; };
  // 副图的比例跟着它对应的那张参考图走（竖图出 3:4，其余出 1:1）；主图按平台的常用比例
  const REFAR = {}; const refAr = u => new Promise(ok => { if (!u || REFAR[u]) return ok(); const im = new Image(); im.onload = () => { REFAR[u] = im.naturalWidth / im.naturalHeight < .87 ? '3:4' : '1:1'; ok(); }; im.onerror = () => ok(); im.src = u; });
  // 这个位置要用的那张卖家自己的截图（配方里记的是第几张，按现有张数轮着取）
  const shotOf = (p, slot) => { const own = ownShots(), r = rc(p, slot); return p.virt && own.length && Number.isInteger(r.si) ? own[r.si % own.length] : ''; };
  const SHOT_T = ['shot', 'embed', 'embed2'];
  // 「你会拿到」这张卡只有在卖家写了、或 AI 从说明里提取到了清单时才出；否则换成一张简介卡，不印编出来的清单
  const hasItems = () => !!S.pts || !!(S.aiItems && S.aiItems.key === plansCache.key);
  const effT = (p, slot) => { if (refOf(p, slot)) return 'redo'; let t = rc(p, slot).t; if (SHOT_T.includes(t) && !shotOf(p, slot)) t = t === 'embed' ? 'promo' : 'core'; return t === 'points' && !hasItems() ? 'intro' : t; };
  const NOTE4 = ['虚拟商品发出后不支持退换', '内容为本人自制原创', '不含第三方课程和文件', '有问题先联系，在线就回'];
  // 图上要印的字：先过违禁词、投诉名单、暗语库，命中的片段直接删掉
  const safeTxt = t => { let x = String(t || ''); for (let k = 0; k < 3; k++) { const h = lvOf(x, true).hits; if (!h.length) break; for (const y of h) x = x.split(y.fragment).join(''); } return x.replace(/\s+/g, ' ').trim(); };
  // 图上的大标题：优先用文案 AI 改写出来的短标题；没有就用改写后的商品标题截短；都没有才用品名
  const headOf = p => { const e = S.edits[plansCache.key + p.i] || {}; return (e.head || (e.title ? String(e.title).split(/[ ，,｜|]/)[0].slice(0, 16) : '') || p.P); };
  function imgTexts(p, slot) {
    if (!p.virt) return [];
    const t = effT(p, slot), H = headOf(p);
    if (t === 'shot') return [];
    const raw = t === 'redo' ? (slot === 'main' ? [H] : []) : {promo:[H, p.slogan, ...p.tags], embed:[H, p.slogan, ...p.tags.slice(0, 2)], embed2:[rc(p, slot).head || SHOT_HEAD[0], ...p.tags.slice(0, 3)], shot:[], core:[p.slogan, ...p.tags], intro:[H, p.slogan], flow:['怎么发货', ...p.way.steps.map(x => x[1]), p.way.time], note:['购买须知', ...NOTE4], points:['你会拿到', ...p.items], who:['适合谁', ...p.who]}[t] || [p.P];
    return raw.map(safeTxt).filter(Boolean);
  }
  const q4 = a => a.map((x, i) => `${i + 1}.「${x}」`).join(' ');
  // 一张图的完整任务：提示词 + 参考图 + 比例。字没通过检查就不出图
  function imgJob(p, slot) {
    const r0 = rc(p, slot), main = slot === 'main', r = !main && p.virt && REFAR[refOf(p, slot)] ? Object.assign({}, r0, {ar:REFAR[refOf(p, slot)]}) : r0, shape = r.ar === '1:1' ? '1:1 方图' : '3:4 竖图';
    if (!p.virt) return {size:r.ar, refs:S.refs.slice(0, 3), prompt:`参考图是卖家本人用手机拍的商品实拍。请生成一张新的手机实拍照片，${shape}：把参考图里的这件商品原样放在「${r.scene}」，${r.light}，${r.dist}，拍摄角度和参考图基本一致。必须保持商品本体和参考图完全一样：外形比例、颜色、材质、商标和机身上的字、接口和按键位置、划痕磨损和使用痕迹，一处都不能改；不美化，不修掉瑕疵，不补全参考图里看不到的面，不增加参考图里没有的配件、包装盒和赠品。商品不变形、不拉伸，商品上原有的字保持清晰不扭曲。要像普通人随手拍的：轻微噪点，构图不必完美，不要影棚布光，不要海报感，商品不要撑满画面。图上不加任何文字、水印、贴纸、边框、价格。`};
    const T = imgTexts(p, slot), bad = lvOf(T.join(' '), true).hits; if (bad.length) throw new Error('图片上的字没通过检查：' + bad.map(h => h.fragment).join('、'));
    const t = effT(p, slot), ref = refOf(p, slot), mainAi = S.ai[p.i + ':main'], refs = [], notes = [];
    const design = `风格：${r.ps}。排版：${r.lay}。字体：${r.font}。`;
    const flat = '这是虚拟商品的介绍图，是平面设计，不是照片：不要出现桌面、手、打印出来的纸、相机实拍的场景，不要让人以为卖的是纸质实物。';
    if (!main && t !== 'redo' && mainAi && /^https?:/.test(mainAi.url)) { refs.push(mainAi.url); notes.push(`第 ${refs.length} 张参考图是这套图已经做好的主图：沿用它的配色、字体和装饰元素，让整套图像一家的；不要照搬它上面的文字`); }
    let body;
    if (t === 'redo') {
      refs.push(ref); const k = refs.length;
      body = `电商虚拟商品${main ? '主图' : '详情图'}，${shape}。直接在第 ${k} 张参考图上修改，不要重新设计一张：版式结构、分几块、每块的位置和大小、图标和示意图的位置都和参考图保持一样，讲内容的文字原样保留；参考图是照片就保持照片的样子，是平面设计就保持平面设计。只改这几处：一、配色和字体换一套（风格：${r.ps}。字体：${r.font}。）。${main ? `二、大标题换成「${T[0]}」，放在原来标题的位置，参考图上原来的标题不要出现。三、` : '二、'}参考图里的品牌标志、店名、账号名、水印、二维码、联系方式、价格、销量数字，以及「最、第一、官方、正版、全网、包过」这类词，一律去掉，空出来的位置用背景补平。`;
    } else if (t === 'embed' || t === 'embed2') {
      refs.push(shotOf(p, slot)); const k = refs.length;
      const keep = `第 ${k} 张参考图是这件商品的真实内容截图：把它${r.frame}，${t === 'embed' ? r.pos : '放在画面中间偏下'}，占画面四到五成。截图里的内容原样保留：不重画、不改字、不加字、不模糊、不拉伸，不裁掉主要内容。截图以外的部分才是平面设计。`;
      body = (t === 'embed'
        ? `电商虚拟商品主图，${shape}。${design}大标题「${T[0]}」${T[1] ? `，副标题「${T[1]}」` : ''}${T.length > 2 ? `，两个小标签：${T.slice(2).map(x => '「' + x + '」').join('')}` : ''}。${keep}背景、标题、标签和少量装饰图形围绕截图排，不要盖住截图。`
        : `电商虚拟商品详情图，${shape}。${design}上方大字「${T[0]}」。${keep}${T.length > 1 ? `截图旁边有 ${T.length - 1} 个指向它的标注气泡：${q4(T.slice(1))}。` : ''}`)
        + '整张图是平面设计，不是照片：不要出现桌面、手、相机实拍的场景。';
    } else {
      const card = '版面留白充足，不要塞满，字大而清楚。';
      body = {
        promo:`电商虚拟商品主图，${shape}。${design}只讲清这件商品的核心：大标题「${T[0]}」${T[1] ? `，副标题「${T[1]}」` : ''}${T.length > 2 ? `，下面一排小标签：${T.slice(2).map(x => '「' + x + '」').join('')}` : ''}。主视觉用简洁的图标或界面示意图形（只有线条和色块，没有可读的小字）。${card}`,
        core:`电商虚拟商品详情图，${shape}。${design}一张讲核心卖点的图：${T[0] ? `大字「${T[0]}」，` : ''}下面是 ${Math.max(T.length - 1, 0)} 个并排的要点块：${q4(T.slice(1))}。每个要点配一个简单图标。${card}`,
        intro:`电商虚拟商品详情图，${shape}。${design}一张简介卡：大字「${T[0]}」${T[1] ? `，下面一行「${T[1]}」` : ''}，配一个简单的图标或示意图形。${card}`,
        points:`电商虚拟商品详情图，${shape}。${design}大标题「${T[0]}」，下面是带序号的 ${T.length - 1} 行：${q4(T.slice(1))}。${card}`,
        who:`电商虚拟商品详情图，${shape}。${design}大标题「${T[0]}」，下面是带对勾的 ${T.length - 1} 行：${q4(T.slice(1))}。${card}`,
        flow:`电商虚拟商品详情图，${shape}。${design}大标题「${T[0]}」，下面是三个带编号的步骤，用箭头连起来：${q4(T.slice(1, 4))}。${T[4] ? `底部一个圆角标签「${T[4]}」。` : ''}${card}`,
        note:`电商虚拟商品详情图，${shape}。${design}大标题「${T[0]}」，下面是带对勾的 ${T.length - 1} 行：${q4(T.slice(1))}。${card}`,
      }[t] + flat;
    }
    const tail = t === 'embed' || t === 'embed2' ? `文字要求：除了上面引号里的字和截图里原有的字，不出现任何其他文字、数字、英文、价格；引号里的字逐字照写，无错字，边缘清楚不模糊。不出现任何品牌标志、人脸、水印、二维码、联系方式、平台名字。画面不变形、不拉伸。`
      : t === 'redo' ? `文字要求：只保留参考图里讲内容的字${T.length ? '和上面引号里的字' : ''}，不新增别的文字、英文、价格；字要清楚，无错字，边缘不模糊。不出现水印、二维码、联系方式、平台名字。画面不变形、不拉伸。`
      : `文字要求：除了上面引号里的字，不出现任何其他文字、数字、英文、价格；引号里的字逐字照写，无错字，边缘清楚不模糊。不出现任何品牌标志、人脸、水印、二维码、联系方式、平台名字。画面不变形、不拉伸。`;
    return {size:r.ar, refs, prompt:body + (notes.length ? '参考图说明：' + notes.join('；') + '。' : '') + tail};
  }
  const imgPrompt = (p, slot) => imgJob(p, slot).prompt;
  const IMGC = {}, ick = (p, slot) => p.P + '|' + p.key + '|' + slot;

  // ---------- 页面 ----------
  const seg = (attr, opts, cur) => `<div class="sg4">${opts.map(([v, t, i]) => `<button class="${v === cur ? 'on' : ''}" data-${attr}="${esc(v)}">${i ? ic(i) : ''}${esc(t)}</button>`).join('')}</div>`;
  function renderStudio() {
    const q = state.q.trim();
    const pre = q ? stInfo(q) : null, phys = S.kind === 'physical' || (pre && !pre.stop && pre.kind === 'physical');
    const miss = [!q && '填品名', !S.selP && '选平台', !S.selN && '选数量', phys && !S.photos.length && '传参考图'].filter(Boolean);
    const NCARD = [[1, '1 套', '只发一条'], [3, '3 套', '小量试一试'], [5, '5 套', '常规，多角度'], [10, '10 套', '多发几条，看哪条好卖']];
    const top = `<section class="st-top st-steps anim">
      <div class="stp${q ? ' done' : ''}"><span class="no">1</span><div class="stp-b"><h3>卖什么</h3>
        <div class="bigin"><span class="bi">${ic('box')}</span><input id="st-q" type="text" value="${esc(q)}" placeholder="输入品名，例如：自制国考行测刷题计划表 / iPhone 14 Pro 256G" autocomplete="off" aria-label="品名"></div>
        <label class="fld st-info"><span>${ic('file')}还知道什么，都写在这里（可以不填）</span><textarea id="st-info" rows="4" placeholder="想到什么写什么，不用分栏，例如：\n里面有 30 天排期表、每日打卡页、使用说明\n想卖 19.9\n95 新，边框有一处磕碰\n\n从闲鱼带商品过来时，对方的说明也会自动放在这里">${esc(S.info)}</textarea></label>
        <div class="st-opts">${seg('stk', [['auto', '自动判断', 'wand'], ['virtual', '虚拟商品', 'file'], ['physical', '实物', 'box']], S.kind)}<button class="btn sm" id="ai-set2">${ic('bot')}AI ${tkey() && ikey() ? '已接入' : tkey() || ikey() ? '接了一半' : '未接入'}</button><span class="mdl-now" title="点左边的按钮可以换模型">文案 <code>${esc(AI.tm)}</code> · 生图 <code>${esc(AI.im)}</code></span></div>
        ${(() => { const arr = phys ? S.refs : S.samp;
          return `<div class="refbox"><label class="up${arr.length ? ' has' : ''}">${ic('camera')}<b>${arr.length ? `参考图 ${arr.length} 张，点这里重选` : phys ? '参考图（必传）' : '参考图（可选）'}</b><small>点这里选图、把图片拖进来、或截图后直接按 Ctrl+V / ⌘V 粘贴，最多 ${phys ? 4 : 9} 张。${phys ? '传你要卖的这件商品的照片，AI 只换场景和光线，商品本身照图来，不改外观和瑕疵。' : '强烈建议传几张你自己商品的内容截图（目录、内页、文件列表）：AI 主图会把截图嵌进去，副图里也会夹几张原样截图，看着真实。同行的图用书签带过来：它有几张就出几张，每张都在原图上直接改，不原样用。'}</small><input id="st-photos" type="file" accept="image/*" multiple hidden></label>
            ${arr.length ? `<div class="thumbs">${arr.map((u, i) => `<span class="th"><img src="${esc(u)}" alt="参考图 ${i + 1}">${phys ? '' : `<i class="who ${isOwn(u) ? 'own' : ''}">${isOwn(u) ? '原样用' : '在它上面改'}</i>`}<button class="thx" data-rmph="${i}" title="删掉这张">×</button></span>`).join('')}</div>` : ''}
            ${!phys && arr.some(u => /^data:/.test(u)) ? `<div class="own-sw"><span>你传的图是：</span><button class="${S.peerUp ? '' : 'on'}" data-peerup="0">${ic('check')}我自己商品的截图<small>会原样放进图里</small></button><button class="${S.peerUp ? 'on' : ''}" data-peerup="1">${ic('eye')}别人的图<small>有几张改几张，不原样用</small></button></div>` : ''}
            <details class="bmbox"><summary>${ic('link')}想参考闲鱼、小红书、淘宝、拼多多上的某一条？一键把它的标题、说明、图片带过来</summary><ol><li>把这个按钮<b>拖到浏览器的收藏夹栏</b>（只用做一次）：<a class="btn sm bm" href="${esc(BM_ITEM)}" title="拖到收藏夹栏">带到上架宝</a><button class="btn sm" data-cpv="${esc(BM_ITEM)}">拖不了就复制代码</button></li><li>在你自己的浏览器里打开那条商品（或小红书笔记）的详情页，点收藏夹里的「带到上架宝」。闲鱼、小红书、淘宝、天猫、拼多多的网页版都行。</li><li>回到这一页，直接按 Ctrl+V / ⌘V。标题填到「卖什么」，文字说明进下面的信息框，图片进参考图。然后选平台、选数量，点生成，就会照着这条商品做一份你自己的。</li></ol><p class="cd-note">${ic('info')}它只在你点的那一刻读当前页面，不碰你的账号和登录信息。照着做的意思是：结构、卖点、版式跟它一样，句子重新写；图是在它的原图上改配色、字体和标题，它有几张就出几张。原样照搬会被判重复铺货或被投诉盗图；改过的图离原图近，发之前自己再看一眼。</p></details></div>`; })()}
        </div></div>
      <div class="stp${S.selP ? ' done' : ''}"><span class="no">2</span><div class="stp-b"><h3>发到哪个平台<em>必选</em></h3>
        <div class="pcards">${Object.entries(PLAT).map(([k, v]) => `<button class="pcard${S.selP && state.platform === k ? ' on' : ''}" data-stp="${k}"><b>${k}</b><small>标题 ${v.tl} 字内 · 最多 ${v.imgs} 张图</small></button>`).join('')}</div>${XST_SHOW && S.selP && state.platform === '小红书' && !phys ? `<div class="xst"><p class="xst-h">小红书图片风格<small>不选就每套随机抽一种</small></p><div class="xst-g"><button class="xsc${xst() < 0 ? ' on' : ''}" data-xst="-1"><i class="sw rnd"></i><b>随机</b><small>每套不一样</small></button>${XHS_UI.map((u, k) => `<button class="xsc${xst() === k ? ' on' : ''}" data-xst="${k}"><i class="sw" style="background:linear-gradient(135deg,${u[2]} 0 55%,${u[3]} 55%)"></i><b>${u[0]}</b><small>${u[1]}</small></button>`).join('')}</div></div>` : ''}</div></div>
      <div class="stp${S.selN ? ' done' : ''}"><span class="no">3</span><div class="stp-b"><h3>做几套<em>必选</em></h3>
        <div class="pcards">${NCARD.map(([n, t, d]) => `<button class="pcard${S.selN && S.n === n ? ' on' : ''}" data-stn="${n}"><b>${t}</b><small>${d}</small></button>`).join('')}</div>
        <p class="st-tip">${ic('info')}一套就是一条能单独发布的商品，标题、说明、图片各不相同。</p></div></div>
      <div class="st-run"><div class="st-btns"><button class="btn acc xl${miss.length ? ' off' : ''}" id="st-go">${ic('sparkles')}先出主图<small>推荐 · ${S.selN ? `画 ${S.n} 张` : '每套 1 张'}</small></button><button class="btn xl ghost${miss.length ? ' off' : ''}" id="st-go-all">${ic('layers')}一次出全套<small>${S.selN ? `画 ${S.n * setN(!phys)} 张` : `每套 ${setN(!phys)} 张`}</small></button></div>
        <p class="st-miss">${miss.length ? '还差：' + miss.join('、') : `${state.platform} · ${S.n} 套 · ${phys ? '实物' : '虚拟商品'}，可以生成了`}</p>
        <p class="st-tip">${ic('bulb')}建议先出主图定风格，满意了再出副图，更省钱。副图会跟着主图的风格走。</p></div>
      <details class="st-rules"><summary>${ic('shield')}标题、说明、图片是按什么规则生成的</summary><ul>
        <li><b>哪些东西不能卖</b>：按《闲鱼社区信息发布规范》（2023-06-26 生效版）第三条、第四条。命中就直接不生成。</li>
        <li><b>怎么写不扣分</b>：按《闲鱼社区管理规范（试行）》第七节。不引导站外交易，不用变体字规避审核，描述必须和实物一致。</li>
        <li><b>不能出现的词</b>：${(BANNED.terms.length + (X.banned_extra ? X.banned_extra.terms.length : 0)).toLocaleString()} 个违禁词、${records.length.toLocaleString()} 个被投诉过的名字、暗语库里已被平台拦的写法。标题、说明、图片上的字，生成前查一遍，生成后再查一遍，命中就换掉或删掉。</li>
        <li><b>夸大词</b>：按广告法，不写「最、第一、顶级、官方、正版、包过」这类词。</li>
        <li><b>图片</b>：图上只印检查过的那几行字，不让 AI 自己加字。实物图以你上传的实拍为准，不改商品本体，不修掉瑕疵。</li>
        <li><b>不是官方规定、是经验的部分</b>：标题怎么排、说明分几段、定价区间、各平台的字数和图片张数。这些以发布页为准。</li></ul></details></section>`;
    if (!q || (S.run === '' && !S.pend)) { if (!q) return top + `<div class="st-empty anim">${[['shield', '先体检', '违禁词、版权名、暗语'], ['type', '标题', '每套换一个角度'], ['image', '图片', '主图 + 5 张副图'], ['file', '说明', '按平台格式分段'], ['coin', '三档定价', '引流 / 主推 / 利润'], ['truck', '交付发货', '流程 + 自动回复']].map(([i, t, d], n) => `<div class="se" style="--i:${n}"><span>${ic(i)}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>` + histHtml();
      return top + histHtml(); }
    const info = stInfo(q), lv = info.res.level;
    infoDerive(); const key = JSON.stringify([q, S.n, state.platform, S.kind, S.info]);
    if (S.pend) { S.pend = false; S.run = key; S.runAt = Date.now(); S.runId = S.runAt.toString(36) + Math.random().toString(36).slice(2, 6); S.noGen = ''; S.restore = null; S.mixNew = true; }
    if (S.run !== key) return top + (S.run ? `<p class="st-tip anim">${ic('info')}你改了品名、平台、数量或补充信息，点上面的「生成」重新出。</p>` : '') + histHtml();
    if (plansCache.key !== key) { plansCache = {key, v:info.stop ? null : buildPlans(info)}; if (S.fresh && plansCache.v) { plansCache.v.forEach(pp => ALLS.forEach(([sl]) => { delete IMGC[ick(pp, sl)]; })); Object.keys(S.edits).forEach(k => { if (k.startsWith(key)) delete S.edits[k]; }); } if (plansCache.v && S.aiItems && S.aiItems.key === key && !S.pts) plansCache.v.forEach(pp => { pp.items = S.aiItems.it; }); S.fresh = false; if (S.mixNew && plansCache.v) { S.mix = mkMix(plansCache.v.length, plansCache.v[0].virt); S.mixNew = false; } S.ai = {}; S.open = 0; if (plansCache.v) plansCache.v.forEach((p, i) => slotsOf(p).forEach(([sl]) => { const c = IMGC[ick(p, sl)]; if (c) S.ai[i + ':' + sl] = c; })); if (S.restore) { Object.assign(S.ai, S.restore); if (plansCache.v) Object.entries(S.restore).forEach(([id, a]) => { const [i, sl] = id.split(':'); if (plansCache.v[+i]) IMGC[ick(plansCache.v[+i], sl)] = a; }); S.restore = null; }
      G.on = G.done = false; if (plansCache.v && S.noGen !== key) setTimeout(() => { if (plansCache.key === key) runGen(key); }, 60); }
    const plans = plansCache.v;
    const risk = `<section class="st-risk ${info.stop ? 'red' : lv} anim"><span class="lamp">${ic(info.stop || lv === 'red' ? 'ban' : lv === 'amber' ? 'alert' : 'check')}</span><div><b>${info.stop ? esc(info.stop) : lv === 'green' ? (info.pr.ban.length ? '可以发，但有条件，先看下面的提醒' : '体检通过，直接出方案') : '原名不能直接用，已换成合规写法'}</b>
        <div class="row">${info.res.hits.slice(0, 6).map(h => `<span class="frag ${h.kind === 'copyright' ? 'red' : 'amber'}">${esc(h.fragment)}</span>`).join('')}${info.fixed && !info.stop ? `${ic('arrow')}<span class="b reg">${esc(info.P)}</span>` : ''}${info.redWord && !info.stop ? `<span class="b vio" title="这个词在平台上也被当作暗语用，标题里写清实物信息">${ic('eye')}「${esc(info.redWord.variants.find(v => q.toLowerCase().includes(v.toLowerCase())))}」也是暗语</span>` : ''}</div></div>
      <div class="st-meta"><span class="b slate">${ic(info.kind === 'virtual' ? 'file' : 'box')}${info.kind === 'virtual' ? '虚拟 · ' + FK[info.fk].n : '实物 · ' + esc(S.cond)}</span>${info.cat ? `<button class="b bbtn" ${navAttr({p:'cat', ck:info.cat.key})}>${catIcon(info.cat)}${esc(info.cat.name)}档案</button>` : ''}<span class="b">${ic('info')}${esc(PLAT[state.platform].tip)}</span></div></section>`;
    const prs = info.stop ? [] : info.pr.ban;
    const risk2 = risk + (prs.length || (info.pr.brand && !info.stop) ? `<section class="st-pr anim">${prs.map(r => `<div><span class="b ${PLV[r.lv][1]}">${ic(PLV[r.lv][2])}${PLV[r.lv][0]}</span><b>${esc(r.n)}</b><span>${esc(r.why)}</span></div>`).join('')}${info.pr.brand && !info.stop ? `<div><span class="b">${ic('tag')}品牌货</span><b>要备好：${esc(info.pr.brand.need)}</b><span>${esc(info.pr.brand.note)}</span></div>` : ''}</section>` : '');
    if (!plans) return top + risk2 + `<section class="card anim"><h3>${ic('compass')}换个方向</h3><div class="row">${CATS.filter(c => c.stance === 'ok').slice(0, 10).map(c => `<button class="chip" ${navAttr({p:'cat', ck:c.key})}>${catIcon(c)}${esc(c.name)}</button>`).join('')}</div></section>`;
    const o = Math.min(S.open, plans.length - 1), p = plans[o], ed = S.edits[key + o] || {};
    const title = ed.title || p.title, desc = ed.desc || p.desc, tl = PLAT[state.platform].tl, tlint = lvOf(title, p.virt).level, dl = lvOf(desc, p.virt), dred = dl.hits.filter(redHit).map(h => h.fragment);
    const grid = `<div class="plans">${plans.map(x => `<button class="plan${x.i === o ? ' on' : ''}" data-plan="${x.i}" style="--i:${x.i}"><canvas data-cv="${x.i}:main" width="1080" height="1080"></canvas><span class="pa">${ic(x.icon)}${String(x.i + 1).padStart(2, '0')} ${x.angle}</span><span class="pt">${esc((S.edits[key + x.i] || {}).title || x.title)}</span><span class="pp">${x.price ? '¥' + x.price : '待定价'}${x.need ? `<i title="${esc(x.need)}">${ic('info')}</i>` : ''}</span></button>`).join('')}</div>`;
    const imgHits = p.virt ? lvOf(slotsOf(p).flatMap(([sl]) => imgTexts(p, sl)).join(' '), true).hits.map(h => h.fragment) : [], imgOk = !imgHits.length;
    const chk = [[title.length <= tl, `标题 ${title.length}/${tl} 字`], [tlint === 'green', '标题体检' + LV[tlint]], [!dred.length, dred.length ? '说明里有红灯词：' + dred.slice(0, 3).join('、') : '说明无红灯词'], [imgOk, imgOk ? (p.virt ? '图片上的字已检查，无违禁词' : '实物图不加文字') : '图片上有违禁词：' + imgHits.slice(0, 3).join('、')], [p.virt || S.photos.length > 0, p.virt ? `主图 ${AR[state.platform]} · 共 ${slotsOf(p).length} 张（${state.platform}最多 ${PLAT[state.platform].imgs} 张）` : S.photos.length ? `参考图 ${S.photos.length} 张` : '还没传参考图'], [!!p.price, p.price ? '已定价' : '填一个想卖的价']];
    if (p.virt) { const hd = headOf(p), same = hd === p.P; chk.push([!same, same ? '主图上的大标题还是原来的品名（文案 AI 没给出改写），生成前先让 AI 重写文案' : `主图大标题用的是改写后的「${hd}」`]); }
    if (p.virt && peerRefs().length) chk.push([false, `这一套的 ${peerN()} 张图都是在同行的图上直接改的，图上的字来自原图，程序没法提前检查。发布前每张都看一眼：有没有残留的店名、水印、联系方式`]);
    if (p.virt && ownShots().length) chk.push([false, '这一套里用了你自己的真实截图。截图里的字程序没法检查：自己看一眼有没有别人的名字、水印、二维码、联系方式']);
    if (!p.virt) { const given = [state.q, infoParts()[0]].join(' '), inv = ['包装盒', '发票', '保修', '贴膜', '保护壳', '一手', '国行', '未拆', '无拆', '电池健康', '全套配件', '原装配件', '正规渠道'].filter(w => desc.replace(/【待补[^】]*】/g, '').includes(w) && !given.includes(w)), todo = (desc.match(/【待补[^】]*】/g) || []).length; chk.push([!inv.length, inv.length ? '说明里有你没提供的信息，请核对：' + inv.join('、') : '说明里没有多写的信息'], [!todo, todo ? `说明里还有 ${todo} 处【待补】要你填` : '没有待补项']); }
    const detail = `<section class="st-d anim" id="st-d"><div class="st-l"><div class="st-h"><span class="pa big">${ic(p.icon)}第 ${o + 1} 套 · ${p.angle}</span>${p.need ? `<span class="b vio">${ic('info')}${esc(p.need)}</span>` : ''}</div>
        <div class="gal"><figure class="g0${S.busy[o + ':main'] ? ' busy' : ''}"><canvas data-cv="${o}:main" width="1080" height="1080"></canvas><figcaption>${ic('image')}${state.platform === '小红书' ? '封面' : '主图'}${p.virt && S.ai[o + ':main'] ? ' · ' + (TYPE_NAME[effT(p, 'main')] || '') : ''}<button class="ib" data-dl="${o}:main" title="下载">${ic('down')}</button>${S.ai[o + ':main'] ? '' : '<i class="tpl">模板图</i>'}</figcaption></figure>
          ${slotsOf(p).slice(1).map(([s, n]) => `<figure class="${S.busy[o + ':' + s] ? 'busy' : ''}"><canvas data-cv="${o}:${s}" width="1080" height="1080"></canvas><figcaption>${p.virt ? (S.ai[o + ':' + s] ? TYPE_NAME[effT(p, s)] || n : n) : (S.ai[o + ':' + s] ? {list:'场景 2', who:'场景 3', preview:'场景 4', flow:'场景 5', note:'场景 6'} : {list:'配件', who:'成色', preview:'拍摄', flow:'交易', note:'须知'})[s]}<button class="ib" data-dl="${o}:${s}" title="下载">${ic('down')}</button>${S.ai[o + ':' + s] ? '' : '<i class="tpl">模板图</i>'}</figcaption></figure>`).join('')}</div>
        <div class="st-next">${!ikey() ? `<span class="b vio">${ic('alert')}没填生图密钥，现在是模板图</span>` : !S.ai[o + ':main'] ? `<span class="b">${ic('clock')}主图${S.busy[o + ':main'] ? '正在画' : '还没画出来'}</span><button class="btn" id="st-remain"${S.busy[o + ':main'] ? ' disabled' : ''}>${ic('sparkles')}画主图</button>` : slotsOf(p).slice(1).every(([sl]) => S.ai[o + ':' + sl]) ? `<span class="b reg">${ic('check')}这一套 ${slotsOf(p).length} 张图都画好了</span><button class="btn" id="st-remain">${ic('sparkles')}换一张主图</button>` : `<button class="btn acc" id="st-aiall"${slotsOf(p).slice(1).some(([sl]) => S.busy[o + ':' + sl]) ? ' disabled' : ''}>${ic('sparkles')}${refOf(p, 'main') ? `主图满意，把剩下 ${slotsOf(p).length - 1} 张副图也改出来` : '主图满意，按这个风格画 5 张副图'}</button><button class="btn" id="st-remain"${S.busy[o + ':main'] ? ' disabled' : ''}>${ic('sparkles')}不满意，换一张主图</button>`}</div>
        <div class="row"><button class="btn" id="st-dlall">${ic('down')}下载 ${slotsOf(p).length} 张图</button>${!p.virt ? `<span class="b">${ic('camera')}瑕疵图请用你自己拍的原图，放在后面几张</span>` : `<span class="b wrapb">${ic('info')}${ownShots().length ? 'AI 图和你的真实截图混着排，每套的排法不一样；真实截图原样使用，不花出图费' : peerRefs().length ? `你带来 ${peerRefs().length} 张同行的图，这一套就出 ${peerN()} 张：每张都是在对应那张原图上直接改的，版式不动，换配色、字体和主图标题` : '没有截图：全部是 AI 按品名和卖点做的介绍图。传几张自己的内容截图，图会真实很多'}</span>`}</div></div>
      <div class="st-r">
        <div class="blk4"><h4>${ic('type')}标题<span class="cnt ${title.length > tl ? 'bad' : ''}">${title.length}/${tl}</span><span class="b lv ${tlint}">${LV[tlint]}</span><button class="ib" data-cp="st-title" title="复制">${ic('copy')}</button></h4><input id="st-title" class="tin" type="text" value="${esc(title)}" maxlength="60"></div>
        <div class="blk4"><h4>${ic('file')}说明<button class="ib" data-cp="st-desc" title="复制">${ic('copy')}</button></h4><textarea id="st-desc" rows="13">${esc(desc)}</textarea></div>
        <div class="two4"><div class="blk4"><h4>${ic('coin')}定价</h4>${p.price ? `<div class="tiers">${[['引流', 0], ['主推', 1], ['利润', 2]].map(([n, i]) => `<span class="${p.tiers[i] === p.price ? 'on' : ''}"><small>${n}</small><b>¥${p.tiers[i]}</b></span>`).join('')}</div>` : `<p class="empty">${ic('coin')}在「补充信息」填想卖的价</p>`}<p class="cd-note">${ic('bulb')}${esc(p.rule)}</p></div>
          <div class="blk4"><h4>${ic('truck')}交付</h4><div class="flow4">${p.way.steps.map(([i, t]) => `<span>${ic(i)}${t}</span>`).join(ic('chevron', 'sep'))}</div><p class="kvl">${ic('box')}${esc(p.way.way)}</p><p class="kvl">${ic('clock')}${esc(p.way.time)}</p></div></div>
        <div class="blk4"><h4>${ic('chat')}拍下后自动回复<button class="ib" data-cpv="${esc(p.way.reply)}" title="复制">${ic('copy')}</button></h4><p class="rp">${esc(p.way.reply)}</p></div>
        <div class="blk4"><h4>${ic('shield')}发布前检查</h4><div class="chk">${chk.map(([ok, t]) => `<span class="${ok ? 'ok' : 'no'}">${ic(ok ? 'check' : 'alert')}${esc(t)}</span>`).join('')}</div></div>
        <div class="row"><button class="btn acc" id="st-cpall">${ic('copy')}复制整套文案</button><button class="btn" id="st-ai-text">${ic('bot')}AI 重写文案</button><button class="btn" id="st-save">${ic('save')}存入我的品</button></div></div></section>`;
    const tip = p.virt ? '每条的标题、图、说明都要不一样；内容完全相同的重复发，闲鱼会按重复铺货处理' : '同一件闲置只能发一条，从里面挑一个角度；有多件或多个规格才分开发';
    return top + risk2 + genBar() + `<h2 class="sec-t anim">${ic('layers')}${plans.length} 套上架内容<span class="lab">${plans.length > 1 ? '点一张看整套' : ''}</span></h2><p class="st-tip anim">${ic('info')}${tip}</p>` + (plans.length > 1 ? grid : '') + detail + histHtml();
  }

  // ---------- AI：文案 DeepSeek（chat/completions），生图 APIMart（images/generations → tasks/{id}） ----------
  const TM_OPTS = [['deepseek-flash', '快，适合日常'], ['deepseek-v4-pro', '更强，慢一些']];
  function aiModal() {
    const m = $('modal'); m.hidden = false;
    const f = (id, lab, v, ph, type = 'text') => `<label class="fld"><span>${lab}</span><input id="${id}" type="${type}" value="${esc(v || '')}" placeholder="${ph}" autocomplete="off"></label>`;
    const st = (ok, local) => `<span class="b ${ok ? 'reg' : 'vio'}">${ic(ok ? 'check' : 'alert')}${ok ? (local ? '已读到本机密钥' : '已填') : '还没填'}</span>`;
    m.innerHTML = `<div class="mbox anim"><h3>${ic('bot')}AI 设置<button class="ib" id="ai-x">${ic('x')}</button></h3>
      <h4>${ic('type')}写文案 · DeepSeek${st(tkey(), !AI.tk)}</h4>${f('ai-tk', '密钥', AI.tk, KEYS.deepseek ? '已读到本机密钥，可不填' : 'sk-...  在 platform.deepseek.com 申请', 'password')}
      <div class="mdl-pick" role="radiogroup" aria-label="文案模型"><span>模型</span>${TM_OPTS.map(([id, tip]) => `<button type="button" class="${AI.tm === id ? 'on' : ''}" data-tm="${id}"><code>${id}</code><small>${tip}</small></button>`).join('')}${TM_OPTS.some(x => x[0] === AI.tm) ? '' : `<button type="button" class="on" data-tm="${esc(AI.tm)}"><code>${esc(AI.tm)}</code><small>自己填的</small></button>`}<input id="ai-tm" type="hidden" value="${esc(AI.tm)}"></div>
      <h4>${ic('image')}生图 · APIMart（GPT Image）${st(ikey(), !AI.ik)}</h4>${f('ai-ik', '密钥', AI.ik, KEYS.apimart ? '已读到本机密钥，可不填' : 'sk-...', 'password')}
      <div class="mdl-pick"><span>模型</span><b class="mdl-id"><code>${esc(AI.im)}</code><small>${AI.im === 'gpt-image-2' ? '和这台电脑上默认用的一样' : '自己改过的'}</small></b></div>
      <details class="adv"><summary>${ic('sliders')}接口地址和模型</summary><div class="st-g">${f('ai-tb', '文案接口', AI.tb, 'https://api.deepseek.com')}${f('ai-ib', '生图接口', AI.ib, 'https://api.apimart.ai')}${f('ai-im', '生图模型', AI.im, 'gpt-image-2')}</div></details>
      <p class="cd-note">${ic('lock')}密钥只存在这台电脑，只发给上面两个接口。不填也能用：标题、说明、图片由本地模板生成。</p>
      <div class="row"><button class="btn acc" id="ai-save">${ic('save')}保存</button><button class="btn" id="ai-clear">清空</button></div></div>`;
  }
  const apiBase = b => b.trim().replace(/\/+$/, '').replace(/\/v1$/, '');
  async function jfetch(url, opt) { const r = await fetch(url, opt), t = await r.text(); let j = {}; try { j = JSON.parse(t); } catch (e) {} if (!r.ok) throw new Error((j.error && (j.error.message || j.error)) || j.message || j.msg || '接口返回 ' + r.status); return j; }
  async function aiText(auto) {
    if (!tkey()) { if (auto === true) return false; aiModal(); return toast('先填 DeepSeek 密钥'); }
    const plans = plansCache.v, key = plansCache.key; if (!plans) return;
    const btn = $('st-ai-text') || {classList:{add() {}, remove() {}}}; btn.disabled = true; btn.classList.add('busy'); if (auto !== true) toast('AI 正在写文案，约 10 到 30 秒');
    const tl = PLAT[state.platform].tl, n = plans.length, virt = plans[0].virt;
    const hasRef = !!infoParts()[1].trim();
    const sys = `你是${state.platform}资深卖家，熟悉平台发布规范。为同一个商品写 ${n} 套上架文案，每套对应一个给定的切入角度，${n} 套的标题和说明要明显不同，不能只换几个字。
硬性要求：
1. 标题 ${tl - 6} 到 ${tl} 个字，尽量写满。信息顺序：${virt ? '是什么 + 给谁用 + 亮点' : '品牌型号 + 成色 + 亮点'}。标题里要带买家会搜的词：品类词、用途、适用人群${virt ? '、文件形式（如可编辑、电子版）' : '、规格'}，每套用的搜索词不要完全一样。
2. ${virt ? '不出现任何品牌名、机构名、课程名、老师名、软件会员名。' : '品牌型号照实写，不写「原单」「高仿」「复刻」这类词。'}
3. 不用极限词和夸大词：最、第一、顶级、官方、正版、全网、包过、必过、稳赚、100%。
4. 不引导站外交易：不出现微信、QQ、加V、私聊、链接、二维码、其他平台名。
5. 不用谐音字、拼音缩写、拆字、符号隔开等方式写词，全部用正常的字。
6. ${virt ? (hasRef ? '这是虚拟商品，卖家要照「参考商品」做一份同样的。说明就拿参考商品的说明当底稿来改写：它讲了哪些内容、先后顺序怎样、怎么分段，都保留；每一句换一种说法，不能整句照抄。不要另外套一套固定小标题，不要自己加「里面有什么」这类参考说明里没有的清单。' : '这是虚拟商品，没有参考说明：按品名写一段产品介绍，讲清它是什么、能解决什么问题、适合谁、怎么发货。不要编具体的文件清单、页数、数量、格式；卖家在「卖家写的信息」里写了有什么，才写有什么。') + '不承诺效果（提分、上岸、通过、赚钱）。' : '只写用户给出的事实。用户没给的信息一律不要自己编，包括：有没有包装盒、发票、保修、贴膜、保护壳、配件有哪些、购买时间和渠道、是否自用一手、是否拆修、电池情况、使用时长。这些没给就写成「【待补：配件有哪些】」这样的占位，让卖家自己填。'}
7. ${virt ? '说明口语化，' + (hasRef ? '长短和参考说明差不多；' : '全文 120 到 260 字，可以用【这是什么】【适合谁】【怎么发货】这样的小标题分段；') + '最后单独加一行：「虚拟商品，发出后不支持退换。」' : '说明用【小标题】分段，口语化，每段两到四行，全文 150 到 300 字。小标题固定为：【宝贝情况】【成色和瑕疵】【配件】【入手渠道】【发货】。【宝贝情况】只写型号规格本身。【发货】只写「平台内沟通，按平台流程发货」，不承诺面交、视频、包邮。'}
8. 「卖家写的信息」是卖家随手写的一段话，你自己分辨里面哪些是这件商品的事实（里面有什么、配件、成色、瑕疵、价格、入手渠道），按事实写进文案。
9. 「参考商品」里的品牌名、店名、联系方式、微信号、销量、价格、站外链接一律不带进来；里面的极限词和夸大词也要换掉。${virt ? '' : '实物的参考商品只用来学写法：它说的成色、配件、渠道是它那件的，不是这件的，不要写进来。'}
10. 每一套再给一个 head：印在主图上的大标题，8 到 14 个字，一眼看懂卖的是什么；说法要和「商品」原来的写法、也和参考商品的标题明显不同，不能照抄；同样不能有上面禁止的词。
只输出 JSON 对象：{"items":[],"plans":[{"title":"","desc":"","head":""}]}。items 是买家能拿到的东西${virt ? '' : '（主体和配件）'}，最多 5 条，每条 12 个字以内，只从「卖家写的信息」${virt ? '和「参考商品」的说明' : ''}里提取，里面没写就给空数组，不要自己编。plans 共 ${n} 项，顺序与给定角度一致${virt && hasRef ? '；每一套都是对参考说明的一次不同改写' : ''}。`;
    const usr = JSON.stringify({商品:plans[0].P, 类型:virt ? '虚拟商品（本人自制）' : '实物闲置', 成色:plans[0].C || undefined, 包含:S.pts ? plans[0].items : undefined, 瑕疵:S.flaw || undefined, 入手渠道:S.chan || undefined, 交付:plans[0].way.way, 角度:plans.map(p => p.angle), 卖家写的信息:infoParts()[0].trim().slice(0, 2000) || undefined, 参考商品:infoParts()[1].trim().slice(0, 2500) || undefined});
    try {
      let aiItems = null;
      const call = async msgs => {
        const body = {model:AI.tm, messages:msgs, response_format:{type:'json_object'}, max_tokens:8000};
        if (/deepseek/i.test(AI.tb)) body.thinking = {type:'disabled'};
        const j = await jfetch(apiBase(AI.tb) + '/chat/completions', {method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer ' + tkey()}, body:JSON.stringify(body)});
        const txt = j.choices[0].message.content, o = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
        if (!Array.isArray(o) && Array.isArray(o.items) && o.items.length) aiItems = o.items;
        return (Array.isArray(o) ? o : o.plans || []).slice(0, n).map(x => ({title:String(x.title || '').trim(), desc:String(x.desc || '').trim(), head:String(x.head || '').trim()}));
      };
      const badOf = x => [...new Set([...lvOf(x.title, virt).hits, ...lvOf(x.desc, virt).hits.filter(redHit)].map(h => h.fragment))];
      const msgs = [{role:'system', content:sys}, {role:'user', content:usr}];
      let arr = await call(msgs), bad = arr.map(badOf);
      if (bad.some(b => b.length)) {   // 让 AI 自己把被拦的词换掉，再检查一次
        const fix = await call([...msgs, {role:'assistant', content:JSON.stringify({plans:arr})}, {role:'user', content:'下面这些词平台会拦，不能出现在标题和说明里：' + bad.map((b, i) => b.length ? `第 ${i + 1} 套：${b.join('、')}` : '').filter(Boolean).join('；') + `。把它们换成意思相近的普通说法，或者直接删掉，句子保持通顺，其余内容不变。标题仍然不超过 ${tl} 个字。按同样的 JSON 格式重新输出全部 ${n} 套。`}]).catch(() => []);
        arr = arr.map((x, i) => fix[i] && fix[i].title && badOf(fix[i]).length < bad[i].length ? fix[i] : x); if (fix.length) arr = arr.map((x, i) => fix[i] && fix[i].title && !badOf(fix[i]).length ? fix[i] : x);
      }
      if (aiItems && !S.pts) { const it = aiItems.map(x => safeTxt(String(x)).slice(0, 16)).filter(Boolean).slice(0, 5); if (it.length) { plans.forEach(pp => { pp.items = it; }); S.aiItems = {key, it}; } }
      let ok = 0; arr.forEach((x, i) => {
        let t = x.title, d = x.desc;
        for (const h of lvOf(t, virt).hits) t = t.split(h.fragment).join('');          // 还剩的问题词直接删掉
        for (const h of lvOf(d, virt).hits.filter(redHit)) d = d.split(h.fragment).join('');
        t = t.replace(/\s+/g, ' ').trim();
        if (t.length > tl) { const cut = t.slice(0, tl), k = Math.max(cut.lastIndexOf('，'), cut.lastIndexOf(' '), cut.lastIndexOf('、')); t = (k >= tl - 10 ? cut.slice(0, k) : cut).trim(); }
        (window.SJB_DBG = window.SJB_DBG || []).push({i, t, len:t.length, th:lvOf(t, virt).hits.map(h => h.kind + ':' + h.fragment), dh:lvOf(d, virt).hits.filter(redHit).map(h => h.kind + ':' + h.fragment), d0:x.desc.slice(0, 60)});
        if (t.length >= 8 && t.length <= tl && lvOf(t, virt).level === 'green' && !lvOf(d, virt).hits.some(redHit)) { const hd = safeTxt(x.head || '').replace(/[「」"]/g, '').slice(0, 16); S.edits[key + i] = {title:t, desc:d || plans[i].desc, head:hd.length >= 4 ? hd : ''}; ok++; }
      });
      toast(`AI 写了 ${arr.length} 套，${ok} 套通过检查${ok < arr.length ? '，其余保留模板稿' : ''}`); G.textMsg = `${ok}/${n} 套`; render(); histSave(); return ok > 0;
    } catch (e) { G.textMsg = e.message; toast('AI 文案失败：' + e.message); btn.disabled = false; btn.classList.remove('busy'); const b2 = $('st-ai-text'); if (b2) { b2.disabled = false; b2.classList.remove('busy'); } }
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const loadImg = (src, cors) => new Promise((ok, no) => { const img = new Image(); if (cors) img.crossOrigin = 'anonymous'; img.onload = () => ok(img); img.onerror = () => no(new Error('图片加载失败')); img.src = src; });
  async function genImage(prompt, refs, size) {
    const base = apiBase(AI.ib), H = {'Content-Type':'application/json', Authorization:'Bearer ' + ikey()};
    if (!/apimart/i.test(base)) { const d = (await jfetch(base + '/v1/images/generations', {method:'POST', headers:H, body:JSON.stringify({model:AI.im, prompt, size:'1024x1024', n:1})})).data[0]; return d.b64_json ? 'data:image/png;base64,' + d.b64_json : d.url; }
    const sub = await jfetch(base + '/v1/images/generations', {method:'POST', headers:H, body:JSON.stringify(Object.assign({model:AI.im, prompt, n:1, size:size || '1:1', resolution:'1k'}, refs && refs.length ? {image_urls:refs} : {}))});
    const d0 = Array.isArray(sub.data) ? sub.data[0] : sub.data, id = sub.task_id || sub.id || (d0 && (d0.task_id || d0.id)); if (!id) throw new Error(sub.message || sub.msg || '没拿到任务号');
    for (let i = 0; i < 120; i++) {
      await sleep(3000);
      const t = (await jfetch(base + '/v1/tasks/' + encodeURIComponent(id), {headers:H})).data; if (!t) continue;
      const stt = String(t.status || '').toLowerCase();
      if (stt === 'completed') { const im = t.result && t.result.images && t.result.images[0], u = im && (Array.isArray(im.url) ? im.url[0] : im.url); if (!u) throw new Error('任务完成但没有图片'); return u; }
      if (stt === 'failed' || stt === 'cancelled') throw new Error((t.error && (t.error.message || t.error)) || t.message || '任务失败');
    }
    throw new Error('等了 6 分钟还没出图');
  }
  async function aiImage(id, quiet) {
    const [i, slot] = id.split(':'), p = plansCache.v[+i], key = plansCache.key;
    if (p.virt && effT(p, slot) === 'shot') {   // 真实截图：原样放进这一套，不调生图接口、不花钱
      try { const url = shotOf(p, slot), img = await loadImg(url, false); IMGC[ick(p, slot)] = {img, url, taint:false, raw:true}; if (plansCache.key === key) S.ai[id] = IMGC[ick(p, slot)]; histSave(); return true; } catch (e) { G.imgMsg = '截图没读出来'; return false; } finally { delete S.busy[id]; if (state.p === 'pick') paintStudio(); }
    }
    if (!ikey()) { aiModal(); toast('先填生图密钥'); return false; }
    if (!p.virt && !S.refs.length) { toast('先传参考图'); return false; }
    const fig = () => { const cv = document.querySelector(`.st-d canvas[data-cv="${id}"]`); return cv && cv.closest('figure'); };
    S.busy[id] = 1; const f0 = fig(); if (f0) f0.classList.add('busy');
    try {
      if (p.virt && slot !== 'main') await refAr(refOf(p, slot));
      const job = imgJob(p, slot), url = await genImage(job.prompt, job.refs, job.size); let img, taint = false;
      try { img = await loadImg(url, true); } catch (e) { img = await loadImg(url, false); taint = true; }
      IMGC[ick(p, slot)] = {img, url, taint}; if (plansCache.key === key) S.ai[id] = IMGC[ick(p, slot)];
      if (!quiet) toast('已生成');
      return true;
    } catch (e) { G.imgMsg = e.message; toast('生图失败：' + e.message); return false; }
    finally { histSave(); delete S.busy[id]; const f = fig(); if (f) f.classList.remove('busy'); if (state.p === 'pick') paintStudio(); }
  }
  const BM_ITEM = 'javascript:' + "(()=>{const h=location.hostname,plat=/goofish|xianyu|2\\.taobao/.test(h)?'闲鱼':/xiaohongshu|xhslink/.test(h)?'小红书':/taobao|tmall/.test(h)?'淘宝':/yangkeduo|pinduoduo/.test(h)?'拼多多':'';const skip='[class*=\"feeds\"],[class*=\"sidebar\"],[class*=\"footer\"],[class*=\"header\"],[class*=\"recommend\"],[class*=\"comment\"],[class*=\"Comment\"],[class*=\"Recommend\"],[class*=\"avatar\"]';const inMain=e=>!e.closest(skip);const txt=e=>e?(e.innerText||'').replace(/ /g,' ').trim():'';const first=sel=>[...document.querySelectorAll(sel)].filter(inMain).map(txt).filter(Boolean)[0]||'';const longest=sel=>[...document.querySelectorAll(sel)].filter(inMain).map(txt).sort((a,b)=>b.length-a.length)[0]||'';const meta=n=>(document.querySelector('meta[property=\"'+n+'\"],meta[name=\"'+n+'\"]')||{}).content||'';const GEN=/^(参数信息|商品详情|宝贝详情|图文详情|产品参数|商品参数|规格参数|商品评价|用户评价|宝贝评价|买家评价|本店推荐|店铺推荐|看了又看|猜你喜欢|为你推荐|商品信息|基本信息|详情|评价|推荐|参数|小红书.*社区.*|淘宝网?|天猫.*|拼多多.*|闲鱼.*|登录.*)$/;const okT=t=>{t=String(t||'').split('\\n')[0].trim();return t.length>=5&&t.length<=120&&!GEN.test(t)?t:''};const pickT=sel=>[...document.querySelectorAll(sel)].filter(inMain).map(e=>okT(txt(e))).filter(Boolean).sort((a,b)=>b.length-a.length)[0]||'';const tabT=okT(String(document.title||'').replace(/\\s*[-–—_|]\\s*(淘宝网?|天猫.*|tmall.*|taobao.*|小红书.*|拼多多.*|闲鱼.*)\\s*$/i,'').trim());let title='',d='',imgSel='img';if(plat==='闲鱼'){d=[...document.querySelectorAll('[class*=\"desc--\"],[class*=\"item-desc\"],[class*=\"detail-desc\"]')].filter(e=>inMain(e)&&!/price/i.test(String(e.className))).map(txt).sort((a,b)=>b.length-a.length)[0]||'';title=(d.split('\\n').map(s=>s.trim()).filter(Boolean)[0]||'')}else if(plat==='小红书'){title=okT(first('#detail-title'))||tabT||pickT('[class*=\"note-content\"] [class*=\"title\"]');d=longest('#detail-desc,[class*=\"note-content\"] [class*=\"desc\"],[class*=\"note-text\"]');imgSel='.swiper-slide img,[class*=\"note-slider\"] img,[class*=\"media-container\"] img,[class*=\"img-container\"] img'}else if(plat==='淘宝'){title=tabT||pickT('[class*=\"mainTitle\"],[class*=\"MainTitle\"],h1');d=longest('[class*=\"baseDropsInfo\"],[class*=\"paramsInfo\"],[class*=\"attributes\"],[class*=\"Attrs\"]');imgSel='[class*=\"thumbnail\"] img,[class*=\"Thumbnail\"] img,[class*=\"mainPic\"] img,[class*=\"picGallery\"] img,[class*=\"PicGallery\"] img,[class*=\"descV8\"] img,[class*=\"desc-root\"] img'}else if(plat==='拼多多'){title=pickT('[class*=\"goods-name\"],[class*=\"GoodsName\"],[class*=\"goodsName\"]')||tabT||pickT('h1');d=longest('[class*=\"goods-detail\"],[class*=\"detail-desc\"],[class*=\"GoodsDetail\"]')}if(!title)title=okT(meta('og:title'))||tabT||pickT('h1');if(d.length<8)d=meta('og:description')||meta('description')||[...document.querySelectorAll('main div,main p,article p,div')].filter(e=>inMain(e)&&e.children.length<4).map(txt).filter(t=>t.length>20&&t.length<3000).sort((a,b)=>b.length-a.length)[0]||'';const pr=([...document.querySelectorAll('[class*=\"price\"],[class*=\"Price\"]')].filter(inMain).map(txt).join(' ').match(/[¥￥]\\s*([\\d,]+(?:\\.\\d+)?)/)||[])[1]||'';const clean=u=>{u=String(u||'');if(u.startsWith('//'))u='https:'+u;u=u.replace(/^http:/,'https:');return /alicdn|tbcdn/.test(u)?u.replace(/(\\.(?:jpe?g|png|webp|heic))_.*$/i,'$1'):u};const seen=new Set(),imgs=[];const grab=list=>{for(const im of list){const u=clean(im.currentSrc||im.src||im.getAttribute('data-src'));if(!/^https:/.test(u)||!inMain(im))continue;if(im.naturalWidth&&(im.naturalWidth<300||im.naturalHeight<300))continue;if(/-tps-\\d+-\\d+|avatar|logo|icon|emoji|sprite/i.test(u))continue;const k=plat==='小红书'?u:u.split('?')[0];if(seen.has(k))continue;seen.add(k);imgs.push(k)}};grab(document.querySelectorAll(imgSel));if(imgs.length<1)grab(document.images);if(!title&&plat!=='闲鱼')title=(d.split('\\n').map(s=>s.replace(/#\\S+/g,'').trim()).filter(s=>s.length>=5)[0]||'');title=String(title).split('\\n')[0].trim().slice(0,60);const out=JSON.stringify({sjb:'item',v:2,platform:plat,url:location.href.split('#')[0].slice(0,300),title,desc:d.slice(0,3000),price:pr,images:imgs.slice(0,9)});const done=()=>alert('已复制'+(plat?'这条'+plat+'内容':'这个页面')+'：标题「'+(title.slice(0,16)||'没读到')+(title.length>16?'…':'')+'」，说明 '+d.length+' 字，图片 '+Math.min(imgs.length,9)+' 张。\\n回到上架宝的「上新」页，直接按 Ctrl+V / ⌘V。'+(d.length<8&&!imgs.length?'\\n\\n没读到内容：请确认这是商品或笔记的详情页，并且页面已经加载完。':''));const fb=()=>{const t=document.createElement('textarea');t.value=out;t.style.cssText='position:fixed;left:0;top:0;opacity:0';document.body.appendChild(t);t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}t.remove();if(ok)done();else prompt('自动复制没成功，请手动全选复制下面这段，再回上架宝粘贴：',out)};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(out).then(done,fb);else fb();})()";
  const HIST = []; let hdb = null, hTimer = 0;
  const hOpen = () => new Promise((ok, no) => { if (hdb) return ok(hdb); const r = indexedDB.open('sjb-hist', 1); r.onupgradeneeded = () => r.result.createObjectStore('runs', {keyPath:'id'}); r.onsuccess = () => ok(hdb = r.result); r.onerror = () => no(r.error); });
  const hTx = async (mode, fn) => { const db = await hOpen(); return new Promise((ok, no) => { const tx = db.transaction('runs', mode), rq = fn(tx.objectStore('runs')); tx.oncomplete = () => ok(rq && rq.result); tx.onerror = () => no(tx.error); }); };
  const hMeta = r => ({id:r.id, at:r.at, q:r.q, platform:r.platform, n:r.n, virt:r.virt, thumb:r.thumb, imgs:Object.keys(r.images || {}).length, title:r.title});
  const hWhen = t => { const d = new Date(t), z = x => String(x).padStart(2, '0'); return `${d.getMonth() + 1}月${d.getDate()}日 ${z(d.getHours())}:${z(d.getMinutes())}`; };
  async function histLoad() { try { const all = await hTx('readonly', st => st.getAll()); HIST.length = 0; all.sort((a, b) => b.at - a.at).forEach(r => HIST.push(hMeta(r))); histUpd(); } catch (e) {} }
  const HLOCAL = (window.SJB_HIST_LOCAL || []).map(r => ({id:r.id, at:r.at, q:r.title, files:r.files, local:true, imgs:r.files.length, thumb:r.files[0]}));
  const HV = {tab:'all', view:''};
  function histHtml() { return ''; }
  function histDrawer() {
    const all = [...HIST, ...HLOCAL].sort((a, b) => b.at - a.at), tabs = [['all', '全部', all.length], ['virt', '虚拟商品', HIST.filter(h => h.virt).length], ['phys', '实物', HIST.filter(h => !h.virt).length], ['local', '找回的图', HLOCAL.length]];
    const list = all.filter(h => HV.tab === 'all' || (HV.tab === 'local' ? h.local : !h.local && (HV.tab === 'virt') === !!h.virt));
    const v = HV.view && HLOCAL.find(h => h.id === HV.view);
    const body = v ? `<button class="btn sm" data-hback="1">${ic('arrow')}返回列表</button><p class="hv-t"><b>${esc(v.q)}</b><small>点图片看原图；原图在项目里的「生成图片找回」文件夹</small></p><div class="hwall">${v.files.map(f => `<a href="${esc(encodeURI(f))}" target="_blank" rel="noopener"><img src="${esc(encodeURI(f))}" alt="" loading="lazy"></a>`).join('')}</div>`
      : `<div class="htabs">${tabs.map(([k, t, n]) => `<button class="${HV.tab === k ? 'on' : ''}" data-htab="${k}">${t}<i>${n}</i></button>`).join('')}</div>
        ${list.length ? `<div class="hlist">${list.map(h => `<div class="hc"><button class="hth" ${h.local ? `data-hview="${h.id}"` : `data-hopen="${h.id}"`} title="打开">${h.thumb ? `<img src="${esc(h.local ? encodeURI(h.thumb) : h.thumb)}" alt="" loading="lazy">` : ic('image')}</button><div class="hb"><b>${esc(h.q)}</b><small>${h.local ? `找回的图 · ${h.imgs} 张` : `${h.virt ? '虚拟商品' : '实物'} · ${esc(h.platform)} · ${h.n} 套 · ${h.imgs} 张图`}</small><small>${hWhen(h.at)}</small><div class="row">${h.local ? `<button class="btn sm" data-hview="${h.id}">${ic('eye')}看图</button>` : `<button class="btn sm" data-hopen="${h.id}">${ic('eye')}打开</button><button class="btn sm" data-hdel="${h.id}">删除</button>`}</div></div></div>`).join('')}</div>` : `<p class="empty">${ic('clock')}这一类还没有记录</p>`}
        <p class="cd-note">${ic('info')}每次生成的标题、说明、图片会自动存在这台电脑的这个浏览器里，打开记录不会重新花钱。清除浏览器数据会丢，重要的图请下载到电脑。</p>`;
    return `<div class="hd-h"><b>${ic('clock')}历史记录</b><button class="ib" data-hclose="1" title="关闭">×</button></div><div class="hd-b">${body}</div>`;
  }
  function histShow(on) { let el = $('hist-drawer'); if (!el) { el = document.createElement('aside'); el.id = 'hist-drawer'; el.className = 'hdrawer'; document.body.appendChild(el); } if (on === false) { el.classList.remove('open'); return; } el.innerHTML = histDrawer(); el.classList.add('open'); }
  function histUpd() { const n = $('hist-n'); if (n) n.textContent = HIST.length + HLOCAL.length || ''; const el = $('hist-drawer'); if (el && el.classList.contains('open')) el.innerHTML = histDrawer(); const ad = $('about-data'); if (ad) ad.textContent = `${num(records.length)} 个被投诉名字 · ${num(BANNED_ALL.length)} 个违禁词 · ${num(SA.counts.variants)} 种暗语写法`; }
  const imgBlob = img => new Promise(ok => { try { const w = img.naturalWidth || 1080, h = img.naturalHeight || 1080, c = document.createElement('canvas'); c.width = 1080; c.height = Math.round(1080 * h / w); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); c.toBlob(b => ok(b), 'image/jpeg', .9); } catch (e) { ok(null); } });
  const histSave = () => { clearTimeout(hTimer); hTimer = setTimeout(histSaveNow, 500); };
  async function histSaveNow() {
    const plans = plansCache.v, key = plansCache.key; if (!plans || !S.runId || S.run !== key) return;
    try {
      const images = {}; let thumb = '';
      for (let i = 0; i < plans.length; i++) for (const [sl] of ALLS) { const id = i + ':' + sl, a = S.ai[id]; if (!a) continue; if (!a.blob && !a.taint) a.blob = await imgBlob(a.img); images[id] = {url:a.url, blob:a.blob || null}; }
      const m = S.ai['0:main'] || Object.values(S.ai)[0];
      if (m) { try { const c = document.createElement('canvas'); c.width = c.height = 240; const w = m.img.naturalWidth || 1, h = m.img.naturalHeight || 1, k = Math.min(w, h); c.getContext('2d').drawImage(m.img, (w - k) / 2, 0, k, k, 0, 0, 240, 240); thumb = c.toDataURL('image/jpeg', .8); } catch (e) { thumb = /^https?:/.test(m.url) ? m.url : ''; } }
      const rec = {id:S.runId, at:S.runAt, key, q:state.q, platform:state.platform, n:S.n, virt:plans[0].virt, par:{kind:S.kind, ck:S.ck, fk:S.fk, cond:S.cond, pts:S.pts, price:S.price, chan:S.chan, info:S.info}, aiItems:S.aiItems && S.aiItems.key === key ? S.aiItems.it : null, mix:S.mix, refs:S.refs, samp:S.samp, comp:S.comp, edits:plans.map((p, i) => S.edits[key + i] || null), title:(S.edits[key + '0'] || {}).title || plans[0].title, images, thumb};
      await hTx('readwrite', st => st.put(rec));
      const k = HIST.findIndex(h => h.id === rec.id); if (k >= 0) HIST[k] = hMeta(rec); else HIST.unshift(hMeta(rec)); histUpd();
    } catch (e) { console.warn('记录没存上', e); }
  }
  async function histOpen(id) {
    const r = await hTx('readonly', st => st.get(id)); if (!r) return toast('这条记录找不到了');
    const res = {}; let lost = 0;
    for (const [k, v] of Object.entries(r.images || {})) { try { const src = v.blob ? URL.createObjectURL(v.blob) : v.url; res[k] = {img:await loadImg(src, false), url:v.url, taint:!v.blob, blob:v.blob || null}; } catch (e) { lost++; } }
    Object.assign(S, {info:''}, r.par, {aiItems:r.aiItems ? {key:r.key, it:r.aiItems} : null, n:r.n, selN:true, selP:true, run:r.key, pend:false, full:false, mix:r.mix, refs:r.refs || [], samp:r.samp || [], comp:r.comp || [], mixNew:false, runId:r.id, runAt:r.at, restore:res, noGen:r.key, open:0});
    S.photos = await Promise.all((r.refs || []).map(u => loadImg(u, false).catch(() => null))).then(a => a.filter(Boolean));
    (r.edits || []).forEach((e, i) => { if (e) S.edits[r.key + i] = e; });
    plansCache = {key:'', v:null}; G.on = G.done = false;
    histShow(false); go({p:'pick', q:r.q, platform:r.platform}); render(); scrollTo({top:0, behavior:'smooth'});
    toast(lost ? `已打开，有 ${lost} 张图的链接过期了` : '已打开这次生成的内容');
  }
  async function histDel(id) { await hTx('readwrite', st => st.delete(id)); const k = HIST.findIndex(h => h.id === id); if (k >= 0) HIST.splice(k, 1); histUpd(); toast('已删除'); }
  histLoad(); histUpd();
  const G = {key:'', on:false, done:false, text:'skip', textMsg:'', imgMsg:'', imgT:0, imgD:0, imgF:0, t0:0, t1:0, timer:0};
  function genBar() {
    const plans = plansCache.v; if (!plans) return '<div id="st-gen"></div>';
    if (!G.on && !G.done) return '<div id="st-gen"></div>';
    if (G.text === 'nokey' && !G.imgT) return `<section id="st-gen" class="gen warn"><div class="gen-h"><b>${ic('alert')}还没填 AI 密钥，下面是模板稿，不是 AI 写的</b><button class="btn sm" id="ai-set2">去填密钥</button></div></section>`;
    const units = (G.text === 'skip' || G.text === 'nokey' ? 0 : 1) + G.imgT, fin = (G.text === 'ok' || G.text === 'fail' ? 1 : 0) + G.imgD + G.imgF, sec = Math.round(((G.on ? Date.now() : G.t1) - G.t0) / 1000);
    const pct = !units ? 100 : G.on ? Math.min(97, Math.round((fin + (units - fin) * Math.min(.8, sec / 120)) / units * 100)) : 100;
    const tx = {run:['run', 'DeepSeek 正在写标题和说明'], ok:['ok', '标题和说明已写好（' + G.textMsg + '通过检查）'], fail:['fail', '文案失败：' + G.textMsg], skip:['ok', G.sub ? '文案不变' : '文案已是你改过的版本'], nokey:['fail', '没填 DeepSeek 密钥，文案是模板稿']}[G.text];
    const im = !G.imgT ? (ikey() ? ['ok', '主图已生成过'] : ['fail', '没填生图密钥，图片是模板图']) : G.imgD + G.imgF < G.imgT ? ['run', G.full ? `正在画全套图 ${G.imgD}/${G.imgT} 张（先主图，再按主图风格画副图）` : G.sub ? `正在画第 ${G.sub} 套的副图 ${G.imgD}/${G.imgT} 张` : `正在画主图 ${G.imgD}/${G.imgT} 张（每套 1 张）`] : G.imgF ? ['fail', `图片完成 ${G.imgD}/${G.imgT} 张，${G.imgF} 张失败：${G.imgMsg}`] : ['ok', G.full ? `全套 ${G.imgT} 张图已画好，图上的字已检查` : G.sub ? `第 ${G.sub} 套的 ${G.imgT} 张副图已画好` : `${G.imgT} 张主图已画好，图上的字已检查。看中哪一套，再点主图下面的按钮出副图`];
    return `<section id="st-gen" class="gen ${G.on ? 'on' : 'fin'}"><div class="gen-h"><b>${ic(G.on ? 'sparkles' : 'check')}${G.on ? (G.full ? '正在生成全套：先写文案，再画主图和副图' : '正在生成：先写文案，再画每套的主图') : '生成完成'}</b><span>${pct}% · ${G.on ? '已用' : '用时'} ${sec} 秒</span></div>
      <div class="gen-bar"><i style="width:${pct}%"></i></div>
      <div class="gen-steps"><span class="${tx[0]}">${ic('type')}${esc(tx[1])}</span><span class="${im[0]}">${ic('image')}${esc(im[1])}</span></div></section>`;
  }
  function genUpd() { const el = $('st-gen'); if (el) el.outerHTML = genBar(); }
  async function runGen(key) {
    const plans = plansCache.v, virt = plans[0].virt, o = S.open;
    const ids = ikey() && (virt || S.refs.length) ? plans.map((p, i) => i + ':main').filter(id => !S.ai[id] && !S.busy[id]) : [];
    const edited = Object.keys(S.edits).some(k => k.startsWith(key));
    const full = !!S.full && ids.length > 0, subOf = i => slotsOf(plans[i]).slice(1).map(([sl]) => i + ':' + sl).filter(id => !S.ai[id] && !S.busy[id]);
    Object.assign(G, {key, sub:0, full, on:true, done:false, text:edited ? 'skip' : tkey() ? 'run' : 'nokey', textMsg:'', imgMsg:'', imgT:ids.length + (full ? plans.reduce((n, p, i) => n + subOf(i).length, 0) : 0), imgD:0, imgF:0, t0:Date.now()});
    clearInterval(G.timer); G.timer = setInterval(() => { if (G.on && state.p === 'pick') genUpd(); }, 1000); genUpd();
    const jobs = []; if (G.text === 'run') { const ok = await aiText(true); if (G.key !== key) return; G.text = ok ? 'ok' : 'fail'; if (!ok && !G.textMsg) G.textMsg = 'AI 写的没通过检查'; genUpd(); }
    const q = ids.slice(), worker = async () => { while (q.length) { const id = q.shift(), ok = await aiImage(id, true); if (G.key === key) { ok ? G.imgD++ : G.imgF++; genUpd(); } } };
    for (let i = 0; i < Math.min(6, ids.length); i++) jobs.push(worker());
    await Promise.all(jobs); if (G.key !== key) return;
    if (full) {   // 主图定了风格，再按主图画副图
      if (state.p === 'pick') { stKeepEdit(); render(); }
      const q2 = []; plans.forEach((p, i) => { const sub = subOf(i); if (S.ai[i + ':main']) q2.push(...sub); else { G.imgF += sub.length; } }); q2.forEach(id => { S.busy[id] = 1; }); genUpd();
      const w2 = async () => { while (q2.length) { const id = q2.shift(), ok = await aiImage(id, true); if (G.key === key) { ok ? G.imgD++ : G.imgF++; genUpd(); } } };
      await Promise.all(Array.from({length:Math.min(6, q2.length)}, w2)); if (G.key !== key) return;
    }
    G.on = false; G.done = true; G.t1 = Date.now(); clearInterval(G.timer); if (state.p === 'pick') { stKeepEdit(); render(); }
    histSave(); if (units(G)) toast('生成完成，已存入右上角的历史记录');
  }
  const units = g => (g.text === 'run' || g.text === 'ok' || g.text === 'fail' ? 1 : 0) + g.imgT;
  async function aiImageAll() {
    const o = S.open, b = $('st-aiall'); if (!ikey()) { aiModal(); return toast('先填生图密钥'); }
    if (!S.ai[o + ':main']) return toast('先等主图画出来');
    const ids = slotsOf(plansCache.v[o]).slice(1).map(([s]) => o + ':' + s).filter(id => !S.ai[id] && !S.busy[id]); if (!ids.length) return;
    if (b) b.disabled = true; const key = plansCache.key;
    Object.assign(G, {key, full:false, on:true, done:false, text:'skip', imgT:ids.length, imgD:0, imgF:0, imgMsg:'', t0:Date.now(), sub:o + 1});
    clearInterval(G.timer); G.timer = setInterval(() => { if (G.on && state.p === 'pick') genUpd(); }, 1000); genUpd(); ids.forEach(id => { S.busy[id] = 1; });
    await Promise.all(ids.map(id => aiImage(id, true).then(ok => { if (G.key === key) { ok ? G.imgD++ : G.imgF++; genUpd(); } })));
    if (G.key !== key) return; G.on = false; G.done = true; G.t1 = Date.now(); clearInterval(G.timer); render(); toast(`副图完成 ${G.imgD}/${ids.length} 张`);
  }
  async function reMain() { const o = S.open, id = o + ':main', p = plansCache.v[o]; if (!ikey()) { aiModal(); return toast('先填生图密钥'); } delete S.ai[id]; delete IMGC[ick(p, 'main')]; ALLS.slice(1).forEach(([sl]) => { delete S.ai[o + ':' + sl]; delete IMGC[ick(p, sl)]; }); if (S.mix && S.mix.r) Object.assign(S.mix.r, mixOne(o, p.virt)); S.busy[id] = 1; render(); toast('正在换一张主图，约 1 分钟'); await aiImage(id, true); render(); }

  // ---------- 事件 ----------
  // 信息框分两段：「【参考商品】」之前是卖家自己写的（当事实用），之后是带过来的同行商品（只当参考）
  const infoParts = () => { const t = S.info || '', k = t.indexOf('【参考商品】'); return k < 0 ? [t, ''] : [t.slice(0, k), t.slice(k)]; };
  function infoDerive() {
    const [own, ref] = infoParts(), ls = lines(own), all = own + '\n' + ref;
    const pm = own.match(/(?:想卖|卖|定价|价格|售价)[^\d¥￥\n]{0,6}[¥￥]?\s*(\d+(?:\.\d+)?)/) || own.match(/[¥￥]\s*(\d+(?:\.\d+)?)/) || own.match(/(\d+(?:\.\d+)?)\s*(?:元|块)/) || ref.match(/价格[:：]\s*(\d+(?:\.\d+)?)/);
    S.price = pm ? pm[1] : '';
    S.cond = (own.replace(/\s/g, '').match(/全新未拆|99新|95新|9成新|8成新|有瑕疵/) || [''])[0] || '成色见图';
    S.flaw = (ls.find(l => /瑕疵|划痕|磕碰|磨损|掉漆|裂痕/.test(l) && !/无瑕疵|没有瑕疵|无划痕/.test(l)) || '').replace(/^.*?(?:瑕疵|问题)[:：]\s*/, '').slice(0, 40);
    S.chan = (ls.find(l => /购于|入手|买的|官网|专柜|京东|旗舰店/.test(l)) || '').slice(0, 30);
    const im = own.match(/(?:包含|里面有|内含|含有|配件有?|能拿到|会拿到)[:：]?\s*([^\n]+)/);
    S.pts = im ? im[1].split(/[、，,；;]/).map(x => x.trim().replace(/[。.]$/, '')).filter(x => x && x.length <= 16).slice(0, 5).join('\n') : '';
    S.ck = ''; S.fk = ''; S.cmp = all.trim();
  }
  function stRead() { const v = id => { const el = $(id); return el ? el.value : undefined; }; { const el = $('st-info'); if (el) S.info = el.value.slice(0, 6000); } infoDerive(); for (const [k, id] of [['pts', 'st-pts-x'], ['price', 'st-price'], ['ck', 'st-cat'], ['fk', 'st-fk'], ['cond', 'st-cond'], ['chan', 'st-chan'], ['flaw', 'st-flaw']]) { const x = v(id); if (x !== undefined) S[k] = x.trim(); } store.set('sjb-studio', {n:S.n, kind:S.kind}); return (v('st-q') || '').trim().slice(0, 300); }
  // 实拍图：选文件、粘贴截图、拖进来都行，最多 4 张
  // 书签脚本带来的闲鱼商品：说明进「同行文案」，图片进参考图
  async function itemIn(o) {
    const q = stRead(), pre = q ? stInfo(q) : null, phys = S.kind === 'physical' || (pre && !pre.stop && pre.kind === 'physical');
    const title = String(o.title || '').replace(/[\u200b\ufeff]/g, '').split('\n')[0].trim().slice(0, 60);
    let desc = String(o.desc || '').replace(/[\u200b\ufeff]/g, '').trim(); if (title && desc.startsWith(title)) desc = desc.slice(title.length).trim();   // 闲鱼的说明第一行就是标题，去掉不重复
    desc = desc.slice(0, 1500);
    const setQ = !!title && !q, q2 = setQ ? title : q;                                   // 标题放到最上面的「卖什么」；已经填了品名就不覆盖
    if (desc || o.price) { const el = $('st-info'); if (el) S.info = el.value; S.info = (infoParts()[0].trimEnd() + '\n\n【参考商品】' + (o.price ? '\n价格：' + String(o.price).replace(/[^\d.]/g, '') + ' 元' : '') + (desc ? '\n' + desc : '')).trim().slice(0, 6000); infoDerive(); }
    const urls = (Array.isArray(o.images) ? o.images : []).filter(u => /^https:\/\//.test(u)).slice(0, 9); let n = 0;
    if (phys) { for (const u of urls) { if (S.photos.length >= 4) break; try { S.photos.push(await loadImg(u, false)); S.refs.push(u); n++; } catch (err) {} } }
    else { const room = Math.max(0, 9 - S.samp.length); S.samp.push(...urls.slice(0, room)); n = Math.min(urls.length, room); }
    go({p:'pick', q:q2}); render(); const got = [setQ && '标题填到了「卖什么」', !setQ && title && '「卖什么」已有内容，标题没覆盖', desc && '说明进了信息框', n && n + ' 张图进了参考图'].filter(Boolean); toast(got.length ? '已带入：' + got.join('，') : '这段内容里没有读到标题、说明和图片');
  }
  const toRef = im => { const k = Math.min(1, 1280 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', .88); };
  function addPhotos(files, replace) {
    const fs = [...(files || [])].filter(f => f && /^image\//.test(f.type)); if (!fs.length) return toast('没有读到图片');
    const q = (($('st-q') || {}).value || state.q || '').trim(), pre = q ? stInfo(q) : null, phys = S.kind === 'physical' || (pre && !pre.stop && pre.kind === 'physical');
    const bk = phys ? 'photos' : 'samp';
    Promise.all(fs.map(f => new Promise(ok => { const img = new Image(); img.onload = () => ok(img); img.onerror = () => ok(null); img.src = URL.createObjectURL(f); }))).then(imgs => {
      imgs = imgs.filter(Boolean); let over = false;
      if (bk === 'photos') { const all = [...(replace ? [] : S.photos), ...imgs]; over = all.length > 4; S.photos = all.slice(0, 4); S.refs = S.photos.map(toRef); S.kind = 'physical'; }
      else { const all = [...(replace ? [] : S[bk]), ...imgs.map(toRef)]; over = all.length > 9; S[bk] = all.slice(0, 9); }
      S.bucket = bk; stSync(); toast(over ? `最多 ${bk === 'photos' ? 4 : 9} 张，已保留前面的` : `已加入参考图，共 ${(bk === 'photos' ? S.refs : S[bk]).length} 张`);
    });
  }
  document.addEventListener('paste', e => { if (state.p !== 'pick') return; const tx = e.clipboardData ? e.clipboardData.getData('text') : ''; if (tx && /"sjb"\s*:\s*"item"/.test(tx)) { let o = null; try { o = JSON.parse(tx.slice(tx.indexOf('{'), tx.lastIndexOf('}') + 1)); } catch (err) {} if (o && o.sjb === 'item') { e.preventDefault(); return itemIn(o); } } const fs = [...((e.clipboardData && e.clipboardData.items) || [])].filter(it => it.kind === 'file' && /^image\//.test(it.type)).map(it => it.getAsFile()); if (!fs.length) return; e.preventDefault(); addPhotos(fs, false); });
  const dropBox = e => state.p === 'pick' && e.dataTransfer && [...e.dataTransfer.types].includes('Files') ? (e.target.closest && e.target.closest('.st-top')) : null;
  document.addEventListener('dragover', e => { const b = dropBox(e); if (!b) return; e.preventDefault(); const u = b.querySelector('.up'); if (u) u.classList.add('drag'); });
  document.addEventListener('dragleave', e => { if (e.target.closest && !e.relatedTarget) document.querySelectorAll('.up.drag').forEach(u => u.classList.remove('drag')); });
  document.addEventListener('drop', e => { const b = dropBox(e); if (!b) return; e.preventDefault(); document.querySelectorAll('.up.drag').forEach(u => u.classList.remove('drag')); addPhotos(e.dataTransfer.files, false); });
  const stSync = () => { const q = stRead(); go({p:'pick', q}); render(); };
  const stGo = full => { const q = stRead(), pre = q ? stInfo(q) : null, phys = S.kind === 'physical' || (pre && !pre.stop && pre.kind === 'physical'); const miss = [!q && '填品名', !S.selP && '选平台', !S.selN && '选数量', phys && !S.photos.length && '传参考图'].filter(Boolean); if (miss.length) { go({p:'pick', q}); render(); return toast('还差：' + miss.join('、')); } S.pend = true; S.fresh = true; plansCache = {key:'', v:null}; S.full = full === true; S.open = 0; go({p:'pick', q}); render(); };
  function stKeepEdit() { const t = $('st-title'), d = $('st-desc'); if (t && d && plansCache.v) { S.edits[plansCache.key + S.open] = Object.assign({}, S.edits[plansCache.key + S.open], {title:t.value.trim() || plansCache.v[S.open].title, desc:d.value}); histSave(); } }
  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
    if (b.id === 'st-go') stGo(false);
    else if (b.id === 'st-go-all') stGo(true);
    else if (d.stp !== undefined) { const q = stRead(); S.selP = true; go({p:'pick', q, platform:d.stp}); render(); }
    else if (d.stk !== undefined) { S.kind = d.stk; stSync(); }
    else if (d.xst !== undefined) { S.xst = +d.xst; stSync(); toast(S.xst < 0 ? '风格改回随机' : '风格选了「' + XHS_UI[S.xst][0] + '」' + (S.run ? '，点生成后生效' : '')); }
    else if (d.peerup !== undefined) { S.peerUp = d.peerup === '1'; stSync(); }
    else if (d.stn !== undefined) { S.n = +d.stn; S.selN = true; S.open = 0; stSync(); }
    else if (b.id === 'hist-btn') { HV.view = ''; histShow(!($('hist-drawer') && $('hist-drawer').classList.contains('open'))); }
    else if (d.hclose !== undefined) histShow(false);
    else if (d.htab !== undefined) { HV.tab = d.htab; histShow(true); }
    else if (d.hview !== undefined) { HV.view = d.hview; histShow(true); }
    else if (d.hback !== undefined) { HV.view = ''; histShow(true); }
    else if (d.hopen !== undefined) histOpen(d.hopen);
    else if (d.hdel !== undefined) histDel(d.hdel);
    else if (d.rmph !== undefined) { const q0 = stRead(), pre0 = q0 ? stInfo(q0) : null, ph0 = S.kind === 'physical' || (pre0 && !pre0.stop && pre0.kind === 'physical'); if (ph0) { S.photos.splice(+d.rmph, 1); S.refs.splice(+d.rmph, 1); } else S.samp.splice(+d.rmph, 1); stSync(); }
    else if (b.id === 'st-more') { stRead(); S.more = !S.more; render(); }
    else if (d.plan !== undefined) { stKeepEdit(); S.open = +d.plan; render(); const el = $('st-d'); if (el && el.getBoundingClientRect().top > innerHeight * 0.7) el.scrollIntoView({behavior:'smooth', block:'start'}); }
    else if (d.dl !== undefined) { const cv = document.querySelector(`.st-d canvas[data-cv="${d.dl}"]`), [i, s] = d.dl.split(':'), a = S.ai[d.dl]; if (a && a.taint) window.open(a.url, '_blank', 'noopener'); else dlCanvas(cv, `第${+i + 1}套_${SLOT_NAME[s]}.png`); }
    else if (b.id === 'st-dlall') document.querySelectorAll('.st-d canvas[data-cv]').forEach((cv, n) => setTimeout(() => { const [i, s] = cv.dataset.cv.split(':'); const a = S.ai[cv.dataset.cv]; if (a && a.taint) window.open(a.url, '_blank', 'noopener'); else dlCanvas(cv, `第${+i + 1}套_${n + 1}${SLOT_NAME[s]}.png`); }, n * 250));
    else if (d.cp !== undefined) copyText($(d.cp).value);
    else if (d.cpv !== undefined) copyText(d.cpv);
    else if (b.id === 'st-cpall') { const p = plansCache.v[S.open]; copyText(`【标题】\n${$('st-title').value}\n\n【说明】\n${$('st-desc').value}\n\n【定价】${p.price ? '¥' + p.price : '待定'}\n【发货】${p.way.way}，${p.way.time}\n【自动回复】${p.way.reply}`); }
    else if (b.id === 'st-save') { const p = plansCache.v[S.open], t = $('st-title').value, items = store.get('sjb-items', []).filter(x => x.name !== state.q); items.unshift({name:state.q, title:t, level:lvOf(t, p.virt).level, at:new Date().toISOString(), plan:S.open}); store.set('sjb-items', items.slice(0, 50)); toast('已存入我的品'); }
    else if (b.id === 'st-ai-text') { stKeepEdit(); aiText(); }
    else if (d.aiimg !== undefined) aiImage(d.aiimg);
    else if (b.id === 'st-aiall') aiImageAll();
    else if (b.id === 'st-remain') reMain();
    else if (b.dataset.tm !== undefined && b.closest('.mdl-pick')) { $('ai-tm').value = b.dataset.tm; b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); }
    else if (b.id === 'ai-set' || b.id === 'ai-set2') aiModal();
    else if (b.id === 'ai-x') $('modal').hidden = true;
    else if (b.id === 'ai-save' || b.id === 'ai-clear') { for (const k of ['tb', 'tm', 'tk', 'ib', 'im', 'ik']) AI[k] = b.id === 'ai-clear' && /k$/.test(k) ? '' : $('ai-' + k).value.trim() || AI[k]; store.set('sjb-ai2', AI); $('modal').hidden = true; toast(b.id === 'ai-clear' ? '密钥已清空' : '已保存'); if (state.p === 'pick') render(); }
  });
  document.addEventListener('click', e => { if (e.target.id === 'modal') e.target.hidden = true; const bm = e.target.closest && e.target.closest('a.bm'); if (bm) { e.preventDefault(); toast('别在这里点：把它拖到浏览器的收藏夹栏，到闲鱼商品页再点'); } });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'st-q') stGo(); else if (e.key === 'Escape') $('modal').hidden = true; });
  document.addEventListener('change', e => {
    const t = e.target;
    if (['st-cat', 'st-fk', 'st-cond'].includes(t.id)) stSync();
    else if (t.id === 'st-title' || t.id === 'st-desc') { stKeepEdit(); render(); }
    else if (t.id === 'st-photos') { addPhotos(t.files, true); }
  });
