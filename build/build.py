#!/usr/bin/env python3
"""构建上架宝原型：单文件离线 HTML。数据取自同机的 咸鱼雷达 公开资产，引擎复用雷达网页的匹配代码。标准库即可。"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / 'index.html'
RADAR = Path('/Users/ys/kuaitu/咸鱼雷达')
sys.path.insert(0, str(RADAR / 'scripts'))
sys.path.insert(0, str(HERE))
from build_web import web_data  # noqa: E402  雷达的公开字段过滤
import seed, seed2, seed3, seed4, slang_full, banned_extra, guide_extra  # noqa: E402

def inert(obj):
    t = json.dumps(obj, ensure_ascii=False, separators=(',', ':'))
    return t.replace('&', '\\u0026').replace('<', '\\u003c').replace('>', '\\u003e').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')

def load(name):
    return json.loads((RADAR / 'assets' / name).read_text(encoding='utf-8'))

db = load('risk-names.json')
public = web_data(db)
guide_ids = guide_extra.apply_names(public['records'])  # 《闲鱼虚拟品指南》违规词表里的新词条，只进上架宝
guide_extra.apply_phys(seed4.PHYS_BAN)
rules = load('handling-rules.json')
slang = load('slang-terms.json')
banned = load('banned-terms.json')
slang_all = slang_full.build({t['name'] for t in slang['terms']})
slang_full.write_review(slang_all)
raw_sources = slang_full.raw_sources()
banned_more = banned_extra.build([t['term'] for t in banned['terms']])
_guide_b = guide_extra.banned([t['term'] for t in banned['terms']] + [t['term'] for t in banned_more['terms']])
banned_more['groups'].update(_guide_b['groups']); banned_more['terms'] += _guide_b['terms']

# 名单增量：与上一版基线比对（只取 id，不读来源字段）
baseline = RADAR / 'local-data/_master_backup_before_20261107.json'
new_ids, prev_version = [], '上一版'
if baseline.exists():
    base = json.loads(baseline.read_text(encoding='utf-8'))
    base_ids = {r['id'] for r in base['records']}
    new_ids = [r['id'] for r in public['records'] if r['id'] not in base_ids]
    prev_version = base.get('updated_at', prev_version)
new_ids = list(dict.fromkeys(new_ids + guide_ids))

# 行话词典自检：可用词与慎用词不能包含任何违禁词或暗语写法，否则标题生成会自相矛盾
low = lambda s: s.lower().replace(' ', '')
bad_terms = {low(t['term']) for t in banned['terms']}
bad_terms |= {low(v) for t in slang['terms'] for v in t.get('variants', []) if t.get('liveness') == 'killed' or t.get('risk') == 'danger' or t.get('policy') == 'grey'}
for j in seed2.JARGON:
    if j['status'] == 'ban':
        continue
    hit = [b for b in bad_terms if len(b) >= 2 and b in low(j['word'])]
    assert not hit, f"行话「{j['word']}」包含拦截词 {hit}"
cat_keys = {c['key'] for c in seed2.CATEGORY_TREE} | {'*'}
for j in seed2.JARGON:
    assert j['cat'] in cat_keys, j
for c in seed2.CATEGORY_TREE:
    for d in c['domains']:
        assert d in seed.FORMS or d in {r['category'] for r in public['records']}, d

# 品类表自检：领域和暗语分类必须真实存在，键不重复
_doms = {r['category'] for r in public['records']}
_slcats = {(t['kind'], t['category_name']) for t in slang_all['terms']}
assert len({c['key'] for c in seed3.CATS}) == len(seed3.CATS)
for c in seed3.CATS:
    for d in c['domains']:
        assert d in _doms, (c['key'], d)
    for n in c['slang']:
        assert (c['kind'], n) in _slcats, (c['key'], n)
    assert c['mkey'] in seed.MATRIX and (not c['tree'] or c['tree'] in cat_keys), c['key']
assert all(any(c['key'] == h for c in seed3.CATS) for h in seed3.HOT)
_used = {d for c in seed3.CATS for d in c['domains']}
assert not (_doms - _used), _doms - _used

extra = {
    'forms': seed.FORMS, 'cat_topic': seed.CAT_TOPIC,
    'holders': {k: {'type': v[0], 'note': v[1]} for k, v in seed.HOLDERS.items()},
    'matrix': seed.MATRIX, 'ambig': seed.AMBIG, 'rescue': seed.RESCUE,
    'shop_examples': seed.SHOP_EXAMPLES, 'word_examples': seed.WORD_EXAMPLES, 'chat_examples': seed.CHAT_EXAMPLES, 'pick_examples': seed.PICK_EXAMPLES,
    'new_ids': new_ids, 'prev_version': prev_version,
    'tree': seed2.CATEGORY_TREE, 'jargon': seed2.JARGON, 'price_rules': seed2.PRICE_RULES, 'scripts': seed2.SCRIPTS, 'faq': seed2.FAQ,
    'jargon_kinds': seed2.JARGON_KINDS, 'jargon_domains': seed2.JARGON_DOMAINS, 'bookmarklet': seed2.BOOKMARKLET, 'market_sources': seed2.MARKET_SOURCES, 'changelog': seed2.CHANGELOG, 'today': seed2.TODAY,
    'banned_version': banned.get('version', ''), 'slang_version': slang.get('version', ''),
    'cats': seed3.CATS, 'hot': seed3.HOT, 'ideas': seed3.IDEAS, 'suffixes': seed3.SUFFIXES, 'physical_forms': seed3.PHYSICAL_FORMS, 'physical_shots': seed3.PHYSICAL_SHOTS, 'phys_ban': seed4.PHYS_BAN, 'phys_brand': seed4.PHYS_BRAND, 'phys_qual': seed4.PHYS_QUAL, 'fake_words': seed4.FAKE_WORDS, 'phys_pen': seed4.PHYS_PEN, 'phys_src': seed4.PHYS_SRC,
    'slang_all': slang_all, 'raw_sources': raw_sources, 'banned_extra': banned_more, 'banned_groups': banned['groups'], 'banned_notice': banned.get('notice', ''), 'slang_notice': slang.get('notice', ''),
}

# 引擎：从雷达 web/app.js 切出纯函数段（归一化、伪装识别、处置卡、标题体检）
app = (RADAR / 'web/app.js').read_text(encoding='utf-8')
def seg(start, end):
    i = app.index(start); j = app.index(end, i); return app[i:j]
ENGINE = seg('  const $ = id => document.getElementById(id);', '  const tabNames = {') \
       + seg('  // Mirrors scripts/handling.py', '  // ===== 标题体检') \
       + seg('  // ===== 标题体检', '  function renderLint()')
for must in ('function lint(', 'function cardHTML(', 'function advise(', 'const FILLERS'):
    assert must in ENGINE, must

parts = {
    '/*__STYLES__*/': (HERE / 'styles.css').read_text(encoding='utf-8'),
    '/*__DATABASE__*/': inert(public),
    '/*__RULES__*/': inert(rules),
    '/*__SLANG__*/': inert(slang),
    '/*__BANNED__*/': inert(banned),
    '/*__PINYIN__*/': inert(load('pinyin-table.json')),
    '/*__EXTRA__*/': inert(extra),
    '/*__ENGINE__*/': ENGINE,
    '/*__APP__*/': (HERE / 'app.js').read_text(encoding='utf-8').replace('/*__V3__*/', (HERE / 'v3.js').read_text(encoding='utf-8') + (HERE / 'v4.js').read_text(encoding='utf-8') + (HERE / 'v5.js').read_text(encoding='utf-8') + (HERE / 'v6.js').read_text(encoding='utf-8') + (HERE / 'v7.js').read_text(encoding='utf-8')),
}
template = (HERE / 'template.html').read_text(encoding='utf-8')
for m in parts:
    assert template.count(m) == 1, m
html = re.sub(r'/\*__(?:STYLES|DATABASE|RULES|SLANG|BANNED|PINYIN|EXTRA|ENGINE|APP)__\*/', lambda m: parts[m[0]], template)
OUT.write_text(html, encoding='utf-8')
(HERE.parent / '书签脚本.js').write_text('// 上架宝书签脚本：在闲鱼网页版页面上读取当前页商品。把下面整行（含 javascript:）存成收藏夹网址即可。\njavascript:' + seed2.BOOKMARKLET + '\n', encoding='utf-8')
print(f'Built {OUT} ({len(html.encode("utf-8")):,} bytes) slang={slang_all["counts"]["terms"]}/{slang_all["counts"]["variants"]} redline={slang_all["counts"]["redline"]} banned_extra={len(banned_more["terms"])} records={len(public["records"])} guide={len(guide_ids)} new={len(new_ids)} forms={len(seed.FORMS)} jargon={len(seed2.JARGON)} tree={len(seed2.CATEGORY_TREE)}')
