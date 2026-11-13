#!/usr/bin/env python3
"""暗语全量词典：把八个来源整体并进上架宝的资料库，按「虚拟 / 实物 / 交易话术」分开。

来源（原始副本都在 build/sources/，抓取说明见 fetched.txt 与 *.commit.txt）：
  awesome      Domainsun/awesome-chinese-secondhand-slang  data/slang-dictionary.json（MIT）
  helper       memos-im/xianyu-slang-helper                data/dictionary.source.json（仓库无 LICENSE）
  anyu         anyu.luckhub.cc 站内独有词条（awesome 作者的网站，未入仓库）
  translator   xianfanhuang/xianyu-slang-translator        data/slang-dictionary.json（MIT）
  heihua       ImAi10086/xianyu-heihua                      app.js 里的 terms 数组（MIT）
  gaoqian      gaoqian2580.com/tools/xianyu-slang           页面内嵌 90 条（聚合站，未声明）
  xianyuheihua xianyuheihua.com /api/terms                  众包 208 条（未声明）
  searchsharp  search-sharp.com /api/products               众包 383 条，叫法带赞踩（未声明）

政策：雷达 scripts/import_slang.py 的 HARD / GREY 规则照用，再补三条 HARD（翻墙节点、虚拟货币换汇、代过认证）
和一条 GREY（盗版破解）。HARD 整条不进词典，但保留在 redline 里，供工具箱「红线警示」页展示；
GREY 保留并标注，不给替代词；烟酒另标「网络销售受限」。
雷达只取虚拟商品分类（184 条）供标题体检用；这里是全量查阅，体检范围不变。
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / 'sources'
sys.path.insert(0, '/Users/ys/kuaitu/咸鱼雷达/scripts')
import import_slang as radar  # noqa: E402  复用 HARD/GREY 规则与变体清洗

FETCHED = '2026-11-09'
KIND_NAMES = {'virtual': '虚拟商品', 'physical': '实物商品', 'talk': '交易话术'}
SOURCE_META = {
    'awesome': dict(name='awesome-chinese-secondhand-slang', repo='Domainsun/awesome-chinese-secondhand-slang', license='MIT', file='data/slang-dictionary.json', kind='仓库'),
    'helper': dict(name='xianyu-slang-helper（闲鱼词典插件）', repo='memos-im/xianyu-slang-helper', license='未声明（仓库无 LICENSE）', file='data/dictionary.source.json', kind='仓库'),
    'anyu': dict(name='anyu.luckhub.cc 站内独有', repo='anyu.luckhub.cc', license='未声明', file='slang/<slug> 页面', kind='网站'),
    'translator': dict(name='xianyu-slang-translator（闲鱼黑话翻译器）', repo='xianfanhuang/xianyu-slang-translator', license='MIT', file='data/slang-dictionary.json', kind='仓库'),
    'heihua': dict(name='xianyu-heihua（闲鱼黑话）', repo='ImAi10086/xianyu-heihua', license='MIT', file='app.js terms[]', kind='仓库'),
    'gaoqian': dict(name='gaoqian2580 闲鱼黑话工具页', repo='gaoqian2580.com/tools/xianyu-slang', license='未声明（聚合站）', file='页面内嵌数据', kind='网站'),
    'xianyuheihua': dict(name='xianyuheihua.com 闲鱼黑话词典', repo='xianyuheihua.com', license='未声明（网友投稿）', file='/api/terms', kind='网站'),
    'searchsharp': dict(name='SearchSharp', repo='search-sharp.com', license='未声明（众包投票）', file='/api/products', kind='网站'),
    'guide': dict(name='闲鱼虚拟品指南 违规词表', repo='本地文件（商品违禁词.txt / 平台盗版违规词.txt）', license='未声明（卖家整理，未核验）', file='build/sources/candidates/xianyu-guide/', kind='本地文件', fetched='2026-11-13'),
}

# ---------- 分类映射 ----------
AWESOME_CATS = {
    'ai-services': ('AI 服务', 'virtual'), 'digital-assets': ('数字资产与会员拼车', 'virtual'),
    'virtual-resources': ('虚拟资源', 'virtual'), 'game-accounts': ('游戏账号', 'virtual'),
    'academic-services': ('学术代写', 'virtual'), 'network-tools': ('网络工具', 'virtual'),
    'social-traffic': ('社交流量', 'virtual'), 'traffic-growth': ('涨粉引流', 'virtual'),
    'xiaohongshu-matrix': ('小红书矩阵', 'virtual'), 'ticket-voucher': ('票券卡密', 'virtual'),
    'digital-phone': ('手机与平板', 'physical'), 'pc-hardware': ('电脑硬件', 'physical'),
    'digital-hardware': ('数码硬件', 'physical'), 'hardware-mods': ('硬件改装', 'physical'),
    'camera-optics': ('相机与镜头', 'physical'), 'anime-goods': ('谷圈 / 二次元周边', 'physical'),
    'anime-fandom': ('谷圈 / 二次元周边', 'physical'), 'luxury-fashion': ('奢侈品与箱包', 'physical'),
    'streetwear-luxury': ('潮牌与奢侈品', 'physical'), 'watches-jewelry': ('名表与珠宝', 'physical'),
    'shoes-sneakers': ('球鞋', 'physical'), 'pets-plants': ('宠物与植物', 'physical'),
    'beauty-cosmetics': ('美妆护肤', 'physical'), 'vehicles': ('车辆', 'physical'),
    'condition-slang': ('成色描述', 'talk'), 'trading-terms': ('交易话术', 'talk'),
    'evasion-contact': ('站外引流', 'talk'), 'general-slang': ('通用话术', 'talk'), 'rules': ('交易规则', 'talk'),
}
HELPER_KIND = {
    'games': 'virtual', 'ai-services': 'virtual', 'internet': 'virtual', 'virtual-goods': 'virtual',
    'account-trade': 'virtual', 'task-fraud': 'virtual', 'non-goods': 'virtual',
    'electronics': 'physical', 'luxury': 'physical', 'tobacco-alcohol': 'physical', 'sneakers': 'physical',
    'toys': 'physical', 'anime-goods': 'physical', 'trading-cards': 'physical',
    'condition': 'talk', 'negotiation': 'talk', 'red-flags': 'talk', 'source': 'talk', 'marketing': 'talk',
    'transaction': 'talk', 'off-platform': 'talk',
    'community': None,
}
TRANSLATOR_KIND = {'condition': 'talk', 'bargain': 'talk', 'trading': 'talk', 'seller_hint': 'talk', 'high_risk': 'talk', 'category_slang': None}
GAOQIAN_CATS = {'trading': ('砍价与交易', 'talk'), 'hardware': ('手机数码', 'physical'), 'ai': ('AI 与会员', 'virtual'), 'anime': ('谷圈二次元', 'physical'),
                'gaming': ('游戏主机', None), 'security': ('防封暗语', 'talk'), 'fashion': ('潮牌美妆', 'physical')}
XYHH_KIND = {'话术暗示': 'talk', '交易规则': 'talk', '商品成色': 'talk', '私域引导': 'talk', '图片暗号': 'talk', '账号与身份': 'virtual',
             '商品名称': None, '品类谐音': None, '字母缩写': None, '特服暗示': 'talk'}
# 把「暗语 → 含义」反过来存成「含义 → 暗语」的分类：含义短就是商品名
XYHH_NAME_IS_MEANING = {'商品名称', '品类谐音', '账号与身份', '字母缩写'}
RISK_WORDS = {'高危风控词': 'danger', '需留心水分': 'warning', '合规安全词': 'safe', '高': 'danger', '中': 'warning', '低': 'safe', 'high': 'danger', 'medium': 'warning', 'low': 'safe'}
LIVE_WORDS = {'现行可用': 'active', '抽检限流': 'watching', '平台拦截': 'killed'}

VIRTUAL_RX = re.compile(r'账号|账户|会员|订阅|代充|充值|代付|直充|网盘|云盘|课件|课程|网课|笔记|源码|脚本|代做|代写|论文|辅导|涨粉|养号|云控|去重|\bapi\b|\bkey\b|\bai\b|车队|拼车|车位|兑换码|cdk|steam|转区|咨询|代缴|挂靠|流媒体|netflix|spotify|youtube|disney|notion|office|adobe|毕设|刷题|全套|引流|私信|独享|合租|模型|部署|编程|软件|教程|解封|邮箱|gpt|chatgpt|claude|gemini|codex|cursor|copilot|midjourney|openai|telegram|\btg\b|小号|老号|q币|点卡|话费|流量|电子书|pdf|模板|素材|外挂|辅助|代练|陪玩|会员号|视频会员|激活|序列号|vpn|翻墙|机场|节点', re.I)
PHYSICAL_RX = re.compile(r'显卡|主机|手机|iphone|ipad|\bmac|笔记本|电脑|耳机|手表|名表|包\b|箱包|鞋|衣|裤|娃|手办|盲盒|卡牌|烟|酒|茶叶|汽车|车辆|相机|镜头|无人机|键盘|鼠标|显示器|硬盘|主板|cpu|nas|路由|数码|首饰|黄金|钻|翡翠|香水|口红|美妆|小样|球鞋|球衣|谷子|吧唧|屏幕|电芯|中框|卡贴|植物|多肉|宠物|猫|狗|公仔|模型车|乐高|游戏机|switch|ps5|xbox|机$', re.I)
COMMON_EXTRA = {'盐', '燕', '谷', '罐', '推', '担', '肾', '捆', '粥', '白菜', '水果', '那个', '大作', '箱说', '成色', '毕业', '下水', '上车', '车位', '骨折', '包邮', '自提', '秒了', '传家宝', '老哥', '学生', '捡漏', '正规', '好女孩', '成功', '上班', '坐牢', '打工', '真理', '酒', '谁', '黑洞', '攻', '大果', '典', '卫星', '国内', '暗网', '路由器', '高尔夫', '群主', '科技', '失败', '成功之母'}
TOBACCO_RX = re.compile(r'烟|酒|雪茄|茅台|五粮液|中华|软中|硬中|和天下', re.I)

# 雷达规则抓不到、但你定了要整条进红线页的题材
EXTRA_HARD = [
    ('色情/特殊服务', re.compile(r'伴游|约聊|涉黄|擦边|特服|上门服务|陪睡|包夜|空降|外围女|洗浴切口|酥妻|租赁女友|租女友', re.I)),
    ('翻墙/代理节点', re.compile(r'\bvpn\b|翻墙|科学上网|机场节点|梯子|小火箭|shadowrocket|\bclash\b|节点订阅|网络节点|魔法上网|v2ray|trojan|\bssr\b|轻功|梯云踪', re.I)),
    ('虚拟货币/换汇', re.compile(r'usdt|泰达币|u换r|换u\b|跑u\b|虚拟货币|虚拟硬币|比特币|\bbtc\b|以太坊|\beth\b|冷钱包|加密货币|加密u\b|币圈|姨太', re.I)),
    ('代过认证/伪造身份', re.compile(r'sheerid|代过认证|认证代过|学生认证代|假学生证|学籍证明|伪造|海外身份|身份证照|实名代', re.I)),
]
EXTRA_GREY = [
    ('盗版/破解', re.compile(r'破解|盗版|直播源|\biptv\b|pt站|pt账号|私密pt|保种|注册机|免激活|绿色版|电视家', re.I)),
]
GPU_RX = re.compile(r'显卡|矿卡|矿机')  # 「以太坊矿卡」是显卡，不是币
# 红线题材 → 一句话后果（写给运营小白看，不夸大）
REDLINE_CONSEQUENCE = {
    '色情/特殊服务': '涉违法。平台封号并可能移交，不止下架。',
    '毒品/管制药': '涉刑事犯罪。平台封号并移交公安。',
    '武器弹药': '涉刑事犯罪。平台封号并移交公安。',
    '赌博': '涉违法。平台封号，资金可能被冻结。',
    '盗号/洗钱/黑产': '涉刑事犯罪。参与者银行卡可能被司法冻结。',
    '涉未成年': '涉刑事犯罪。平台零容忍，直接移交。',
    '翻墙/代理节点': '涉违法。平台秒封并拉黑设备，没有合规写法。',
    '虚拟货币/换汇': '国内禁止。极易卷入洗钱，银行卡会被冻结。',
    '代过认证/伪造身份': '伪造证明属违法。买家主账号也会被连带封禁。',
}


def classify(tokens):
    for label, rx in radar.POLICY_HARD:
        if any(rx.search(t) for t in tokens):
            return 'hard', label
    for label, rx in EXTRA_HARD:
        if any(rx.search(t) and not (label == '虚拟货币/换汇' and GPU_RX.search(t)) for t in tokens):
            return 'hard', label
    for label, rx in radar.POLICY_GREY:
        if any(rx.search(t) for t in tokens):
            return 'grey', label
    for label, rx in EXTRA_GREY:
        if any(rx.search(t) for t in tokens):
            return 'grey', label
    return '', ''


def clean(values):
    out = radar.clean_variants(values)
    return [v for v in out if v not in COMMON_EXTRA]


def policy_of(name, variants, cat=''):
    level, label = classify([name, *variants])
    if name in radar.POLICY_OVERRIDE_NONE:
        level, label = '', ''
    if level != 'hard' and (cat == 'tobacco-alcohol' or (cat == 'community' and TOBACCO_RX.search(name) and '烟' in name)):
        level, label = 'grey', '烟酒（网络销售受限）'
    return level, label


def policy_split(name, variants, cat='', expl=''):
    """名字（含释义）命中 HARD → 整条进红线；只有少数写法命中 → 剔掉那些写法、词条保留。
    返回 (level, label, 保留的写法)。"""
    tokens = [name, expl] if expl else [name]
    lvl, label = classify(tokens)
    if name in radar.POLICY_OVERRIDE_NONE:
        lvl, label = '', ''
    if lvl == 'hard':
        return 'hard', label, variants
    hits = [v for v in variants if classify([v])[0] == 'hard']
    # 名字本身已是灰色题材（如「外挂」）：不因个别写法升级成红线，只剔写法
    if hits and lvl != 'grey' and (len(hits) >= 3 or len(hits) * 2 >= len(variants)):
        return 'hard', classify(hits)[1], variants
    keep = [v for v in variants if v not in hits]
    level, label = policy_of(name, keep + ([expl] if expl else []), cat)
    return level, label, keep


def guess_kind(name, variants, default='physical'):
    """按关键词猜虚实。返回 (kind, guessed)。两边都不像的：default；default=None 表示交给调用方。"""
    text = name + ' ' + ' '.join(variants[:10])
    v, p = bool(VIRTUAL_RX.search(text)), bool(PHYSICAL_RX.search(name))
    if v and not p:
        return 'virtual', True
    if p and not v:
        return 'physical', True
    if v and p:
        return ('virtual' if VIRTUAL_RX.search(name) else 'physical'), True
    return default, True


def strip_paren(s):
    """「妖机 (iPhone)」→ ('妖机', 'iPhone')"""
    m = re.match(r'^(.*?)\s*[（(]([^()（）]+)[)）]\s*$', s)
    return (m.group(1).strip(), m.group(2).strip()) if m else (s.strip(), '')


class Book:
    def __init__(self):
        self.terms, self.index, self.seen, self.redline = [], {}, set(), []

    def take(self, variants):
        out = []
        for v in variants:
            k = v.lower()
            if k in self.seen:
                continue
            self.seen.add(k); out.append(v)
        return out

    def find(self, name, variants=(), by_variant=False):
        t = self.index.get(name.lower())
        if t or not by_variant:
            return t
        for v in variants:
            t = self.index.get(v.lower())
            if t:
                return t
        return None

    def drop(self, name, label, variants, src, **fields):
        self.redline.append(dict(name=name, label=label, variants=variants, source=src, consequence=REDLINE_CONSEQUENCE.get(label, '平台直接封号处理。'), **fields))

    def put(self, name, variants, kind, category, category_name, src, by_variant=False, **fields):
        """并入或新建。返回 (term, created)。"""
        name = name.strip()
        if not name:
            return None, False
        t = self.find(name, variants, by_variant)
        extra = self.take(variants)
        if t:
            t['variants'].extend(extra)
            if src not in t['source']:
                t['source'].append(src)
            for k, v in fields.items():
                if k in ('guessed', 'review'):
                    continue  # 并入已有词条时，不让后来源的猜测覆盖已有分类
                if k == 'votes':
                    t['votes'] = max(t.get('votes', 0), v)
                elif k in ('successors', 'platforms'):
                    for x in v:
                        if x not in t[k]:
                            t[k].append(x)
                elif v and not t.get(k):
                    t[k] = v
            for v in extra:
                self.index[v.lower()] = t
            return t, False
        if not extra and name.lower() in self.seen:
            return None, False
        base = dict(name=name, variants=extra, category=category, category_name=category_name, kind=kind,
                    liveness='', risk='', explanation='', seller_intent='', buyer_advice='', seller_advice='',
                    successors=[], trend='', platforms=[], policy='', policy_label='', votes=0, source=[src], guessed=False)
        base.update(fields)
        self.terms.append(base)
        self.index[name.lower()] = base
        for v in extra:
            self.index[v.lower()] = base
        return base, True


def load(name):
    return json.loads((SRC / name).read_text(encoding='utf-8'))


def build(radar_names, searchsharp_min_score=3):
    b = Book()

    # 1. awesome：满配字段
    a = load('awesome.slang-dictionary.json')
    for e in a:
        cat = e.get('category') or ''
        cn, kind = AWESOME_CATS.get(cat, (cat, None))
        name = str(e.get('standardName') or '').strip()
        level, label, variants = policy_split(name, clean(e.get('slangVariants') or []), cat)
        if level == 'hard':
            b.drop(name, label, variants, 'awesome', category_name=cn, explanation=(e.get('explanation') or '').strip(), buyer_advice=(e.get('buyerAdvice') or '').strip()); continue
        guessed = kind is None
        if guessed:
            kind, _ = guess_kind(name, variants)
        b.put(name, variants, kind, cat, cn, 'awesome', liveness=e.get('liveness') or '', risk=e.get('riskLevel') or '',
              explanation=(e.get('explanation') or '').strip(), seller_intent=(e.get('sellerIntent') or '').strip(),
              buyer_advice=(e.get('buyerAdvice') or '').strip(), seller_advice=(e.get('sellerAdvice') or '').strip(),
              successors=clean(e.get('successorSlang') or []), trend=(e.get('activeTrend') or '').strip(),
              platforms=list(e.get('platforms') or []), policy=level, policy_label=label,
              votes=int(e.get('upvotes') or 0) - int(e.get('downvotes') or 0), guessed=guessed)

    # 2. anyu 站内独有：字段同 awesome
    for e in load('anyu.extra.json'):
        cat = e.get('category') or ''
        cn, kind = AWESOME_CATS.get(cat, (cat, None))
        name = str(e.get('standardName') or '').strip()
        level, label, variants = policy_split(name, clean(e.get('slangVariants') or []), cat)
        if level == 'hard':
            b.drop(name, label, variants, 'anyu', category_name=cn, explanation=(e.get('explanation') or '').strip(), buyer_advice=(e.get('buyerAdvice') or '').strip()); continue
        if kind is None:
            kind, _ = guess_kind(name, variants)
        b.put(name, variants, kind, cat, cn, 'anyu', liveness=LIVE_WORDS.get(e.get('liveLabel', ''), ''), risk=RISK_WORDS.get(e.get('riskLabel', ''), ''),
              explanation=e.get('explanation', ''), seller_intent=e.get('sellerIntent', ''), buyer_advice=e.get('buyerAdvice', ''),
              seller_advice=e.get('sellerAdvice', ''), platforms=['闲鱼', '小红书'], policy=level, policy_label=label)

    # 3. helper：只有名字和写法；社区补充按名字并入 awesome
    h = load('helper.dictionary.source.json')
    for c in h.get('categories', []):
        cid = c.get('id') or ''
        kind = HELPER_KIND.get(cid)
        for name, variants in (c.get('entries') or {}).items():
            name = str(name).strip()
            level, label, variants = policy_split(name, clean(variants or []), cid)
            if level == 'hard':
                b.drop(name, label, variants, 'helper', category_name=c.get('name', cid)); continue
            guessed = kind is None
            k = kind or guess_kind(name, variants)[0]
            b.put(name, variants, k, cid, c.get('name', cid), 'helper', policy=level, policy_label=label, guessed=guessed)

    # 4. translator：一句释义，无写法；品类谐音是「暗语 → 正常名」
    tr = load('translator.slang-dictionary.json')
    for cid, c in tr.get('categories', {}).items():
        kind = TRANSLATOR_KIND.get(cid, 'talk'); risk = RISK_WORDS.get(c.get('risk', ''), '')
        for term, meaning in (c.get('entries') or {}).items():
            term, meaning = term.strip(), str(meaning).strip()
            if cid == 'category_slang':
                name, _ = strip_paren(meaning)
                level, label, variants = policy_split(name, clean([term]))
                if level == 'hard':
                    b.drop(name, label, variants, 'translator', category_name='品类谐音'); continue
                k, g = guess_kind(name, variants)
                b.put(name, variants, k, cid, c.get('name', cid), 'translator', by_variant=True, policy=level, policy_label=label, risk=risk, guessed=g)
            else:
                level, label, _ = policy_split(term, [], expl=meaning)
                if level == 'hard':
                    b.drop(term, label, [], 'translator', category_name=c.get('name', cid), explanation=meaning); continue
                b.put(term, [], kind, cid, c.get('name', cid), 'translator', by_variant=True, explanation=meaning, risk=risk, policy=level, policy_label=label)

    # 5. heihua：翻译 / 信号 / 下一步 / 风险
    for t in load('heihua.terms.json'):
        name = t.get('term', '').strip()
        level, label, variants = policy_split(name, clean(t.get('aliases') or []))
        if level == 'hard':
            b.drop(name, label, variants, 'heihua', category_name=t.get('categoryLabel', '')); continue
        advice = ' '.join(x for x in (t.get('signal', ''), t.get('action', '')) if x)
        b.put(name, variants, 'talk', t.get('category', ''), t.get('categoryLabel', ''), 'heihua', by_variant=True,
              explanation=t.get('translation', ''), buyer_advice=advice, risk=RISK_WORDS.get(t.get('risk', ''), ''), policy=level, policy_label=label)

    # 6. gaoqian：「名 / 别名 (说明)」+ aliases
    for e in load('gaoqian.entries.json'):
        raw = e.get('name', ''); cat = e.get('category', '')
        cn, kind = GAOQIAN_CATS.get(cat, (cat, None))
        head, note = strip_paren(raw)
        parts = [p.strip() for p in head.split('/') if p.strip()]
        name = parts[0] if parts else raw
        level, label, variants = policy_split(name, clean(parts[1:] + list(e.get('aliases') or [])))
        if level == 'hard':
            b.drop(name, label, variants, 'gaoqian', category_name=cn); continue
        guessed = kind is None
        k = kind or guess_kind(name, variants)[0]
        b.put(name, variants, k, cat, cn, 'gaoqian', by_variant=True, explanation=note, policy=level, policy_label=label, guessed=guessed)

    # 7. xianyuheihua：词条名是暗语，含义是正常名；特服暗示整组进红线
    for g in load('xianyuheihua.terms.json'):
        for s in g.get('senses', []):
            term, meaning, cat = s.get('term', '').strip(), s.get('meaning', '').strip(), s.get('category_name', '')
            aliases = [x.strip() for x in re.split(r'[、,，/]', s.get('aliases') or '') if x.strip()]
            votes = int(s.get('likes') or 0) - int(s.get('dislikes') or 0)
            if cat == '特服暗示':
                b.drop(term, '色情/特殊服务', clean(aliases), 'xianyuheihua', category_name=cat, explanation=meaning); continue
            if cat in XYHH_NAME_IS_MEANING and len(meaning) <= 14:
                name, variants, expl = meaning, clean([term] + aliases), ''
            else:
                name, variants, expl = term, clean(aliases), meaning
            level, label, variants = policy_split(name, variants, expl=expl)
            if level == 'hard':
                b.drop(name, label, variants, 'xianyuheihua', category_name=cat, explanation=expl); continue
            kind = XYHH_KIND.get(cat)
            guessed = kind is None
            k = kind or guess_kind(name, variants)[0]
            b.put(name, variants, k, cat, cat, 'xianyuheihua', by_variant=True, explanation=expl, votes=votes, policy=level, policy_label=label, guessed=guessed, since=(s.get('created_at') or '')[:10])

    # 8. SearchSharp：商品名 + 带赞踩的叫法，净赞达标才收
    for p in load('searchsharp.products.json'):
        name = str(p.get('name') or '').strip()
        aliases = [x if isinstance(x, str) else x.get('text', '') for x in (p.get('aliases') or [])]
        kws = [(k.get('text', ''), int(k.get('up') or 0) - int(k.get('down') or 0)) for k in (p.get('keywords') or []) if isinstance(k, dict)]
        good = [t for t, sc in kws if sc >= searchsharp_min_score]
        level, label, variants = policy_split(name, clean(aliases + good))
        if level == 'hard':
            b.drop(name, label, variants, 'searchsharp', category_name='社区叫法'); continue
        if not variants and not b.find(name):
            continue
        k, _ = guess_kind(name, variants, default=None)
        if k is None:
            k, cn = 'talk', '网络梗与代称'
        else:
            cn = '社区叫法'
        b.put(name, variants, k, 'community', cn, 'searchsharp', by_variant=True, votes=max([sc for _, sc in kws], default=0), policy=level, policy_label=label, guessed=True, description=(p.get('description') or '').strip())

    terms = [t for t in b.terms if t['variants'] or t['explanation']]
    order = {'virtual': 0, 'talk': 1, 'physical': 2}
    live = {'killed': 0, 'watching': 1, 'active': 2, '': 3}
    terms.sort(key=lambda t: (order[t['kind']], live.get(t['liveness'], 3), t['category_name'], -t['votes'], t['name']))
    for i, t in enumerate(terms, 1):
        t['id'] = f'A{i:04d}'
        t['in_radar'] = t['name'] in radar_names
        t['review'] = bool(t['guessed'])  # 虚实靠规则猜的：待核
        t.pop('description', None)
    import guide_extra  # 指南里的红线补充（赌博、色情），只进红线警示
    for name, label, variants, expl in guide_extra.REDLINE:
        if not b.find(name, variants, True) and not any(r['name'] == name for r in b.redline):
            b.drop(name, label, variants, 'guide', category_name=label, explanation=expl, buyer_advice='')
    for i, r in enumerate(b.redline, 1):
        r['id'] = f'R{i:03d}'
    counts = {k: {'terms': sum(1 for t in terms if t['kind'] == k), 'variants': sum(len(t['variants']) for t in terms if t['kind'] == k)} for k in KIND_NAMES}
    commits = {n: (SRC / f'{n}.commit.txt').read_text().strip() for n in ('awesome', 'helper') if (SRC / f'{n}.commit.txt').exists()}
    sources = []
    for key, m in SOURCE_META.items():
        n = sum(1 for t in terms if key in t['source'])
        sources.append(dict(key=key, **{**m, 'fetched': m.get('fetched', FETCHED)}, commit=commits.get(key, ''), terms=n, redline=sum(1 for r in b.redline if r['source'] == key)))
    redline_groups = {}
    for r in b.redline:
        redline_groups.setdefault(r['label'], 0); redline_groups[r['label']] += 1
    return dict(
        kinds=KIND_NAMES,
        sources=sources,
        policy='HARD 档（色情服务、毒品、武器、赌博、盗号洗钱、涉未成年、翻墙节点、虚拟货币、代过认证）整条不进词典，收进工具箱「红线警示」；GREY 档（假货、黑产工具、烟酒、医疗减肥、黄牛、盗版破解）保留并标注，不给替代词。单字、1 到 3 位字母数字、日常常用词的写法已剔除；SearchSharp 的叫法只收净赞 3 以上。',
        counts=dict(terms=len(terms), variants=sum(len(t['variants']) for t in terms), by_kind=counts, redline=len(b.redline), review=sum(1 for t in terms if t['review']), with_text=sum(1 for t in terms if t['explanation'])),
        redline=b.redline, redline_groups=redline_groups, redline_consequence=REDLINE_CONSEQUENCE,
        terms=terms,
    )


def raw_sources():
    """各来源的原始词条，不做题材筛选、不清洗写法，供情报库「按来源看」整份展示。
    统一成 {n:名称, v:[写法], c:分类, e:释义, m:{其它字段}}。"""
    def row(n, v=(), c='', e='', **m):
        return dict(n=str(n).strip(), v=[str(x).strip() for x in v if str(x).strip()], c=c, e=str(e or '').strip(), m={k: x for k, x in m.items() if x})
    out = {}
    def full(e):
        return row(e.get('standardName', ''), e.get('slangVariants') or [], AWESOME_CATS.get(e.get('category') or '', (e.get('category') or '',))[0], e.get('explanation', ''),
                   卖家意图=e.get('sellerIntent', ''), 买家建议=e.get('buyerAdvice', ''), 卖家建议=e.get('sellerAdvice', ''), 接替写法='、'.join(e.get('successorSlang') or []),
                   现状=e.get('activeTrend', ''), 平台='、'.join(e.get('platforms') or []), 状态=LIVE.get(e.get('liveness') or '', e.get('liveLabel', '')), 风险=e.get('riskLevel') or e.get('riskLabel', ''),
                   赞踩=(f"{e.get('upvotes')}/{e.get('downvotes') or 0}" if e.get('upvotes') else ''))
    out['awesome'] = [full(e) for e in load('awesome.slang-dictionary.json')]
    out['anyu'] = [full(e) for e in load('anyu.extra.json')]
    out['helper'] = [row(n, v, c.get('name', c.get('id', ''))) for c in load('helper.dictionary.source.json').get('categories', []) for n, v in (c.get('entries') or {}).items()]
    out['translator'] = [row(t, [], c.get('name', cid), m, 风险=c.get('risk', '')) for cid, c in load('translator.slang-dictionary.json').get('categories', {}).items() for t, m in (c.get('entries') or {}).items()]
    out['heihua'] = [row(t.get('term', ''), t.get('aliases') or [], t.get('categoryLabel', ''), t.get('translation', ''), 信号=t.get('signal', ''), 下一步=t.get('action', ''), 风险=t.get('risk', '')) for t in load('heihua.terms.json')]
    out['gaoqian'] = [row(e.get('name', ''), e.get('aliases') or [], GAOQIAN_CATS.get(e.get('category', ''), (e.get('category', ''),))[0]) for e in load('gaoqian.entries.json')]
    out['xianyuheihua'] = [row(s.get('term', ''), [x for x in re.split(r'[、,，/]', s.get('aliases') or '')], s.get('category_name', ''), s.get('meaning', ''), 赞踩=f"{s.get('likes') or 0}/{s.get('dislikes') or 0}", 投稿=(s.get('created_at') or '')[:10]) for g in load('xianyuheihua.terms.json') for s in g.get('senses', [])]
    ss = []
    for p in load('searchsharp.products.json'):
        al = [x if isinstance(x, str) else x.get('text', '') for x in (p.get('aliases') or [])]
        kw = [k for k in (p.get('keywords') or []) if isinstance(k, dict)]
        ss.append(row(p.get('name', ''), al + [k.get('text', '') for k in kw], '众包叫法', p.get('description', ''), 赞踩明细='、'.join(f"{k.get('text','')} {int(k.get('up') or 0)}/{int(k.get('down') or 0)}" for k in kw)))
    out['searchsharp'] = ss
    return {k: [r for r in v if r['n']] for k, v in out.items()}

LIVE = {'killed': '被拦', 'watching': '抽检', 'active': '可搜'}


def write_review(data):
    """给人过的待核清单：虚实靠猜、或没有任何说明的词条。"""
    rows = ['id\t虚实\t分类\t名称\t来源\t写法（前 6）']
    for t in data['terms']:
        if t['review']:
            rows.append('\t'.join([t['id'], KIND_NAMES[t['kind']], t['category_name'], t['name'], '+'.join(t['source']), '、'.join(t['variants'][:6])]))
    (SRC / 'review_待核.tsv').write_text('\n'.join(rows) + '\n', encoding='utf-8')
    return len(rows) - 1


if __name__ == '__main__':
    import collections
    data = build(set())
    print(json.dumps(data['counts'], ensure_ascii=False))
    print('redline groups', data['redline_groups'])
    for r in data['redline']:
        print('  RED', r['label'], '|', r['name'][:40], '|', '+'.join([r['source']]))
    print('sources', [(s['key'], s['terms']) for s in data['sources']])
    print(collections.Counter((t['kind'], t['category_name']) for t in data['terms']).most_common(60))
    print('review rows', write_review(data))
