#!/usr/bin/env python3
"""打包上架宝：先构建网页，再把网页放进技能包，同步到本机 Claude 技能目录，最后出两个压缩包。标准库即可。

  python3 build/pack.py

产出（dist/，不进仓库）：
  上架宝_网页_<日期>.zip      只有网页和使用说明，发给内测群用
  上架宝_全套_<日期>.zip      网页 + 技能包（skill/shangjiabao）+ 书签脚本
不会打包 keys.local.js、history.local.js、同行商品、生成的图片。
"""
import shutil, subprocess, sys, time, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SKILL = ROOT / 'skill' / 'shangjiabao'
INSTALLED = Path.home() / '.claude' / 'skills' / 'shangjiabao'
DIST = ROOT / 'dist'
DAY = time.strftime('%Y%m%d')

subprocess.run([sys.executable, str(HERE / 'build.py')], check=True)
html = ROOT / 'index.html'
text = html.read_text(encoding='utf-8')
import re
assert not re.search(r'sk-[A-Za-z0-9_-]{20,}', text), '网页里出现了疑似密钥'
kf = ROOT / 'keys.local.js'
if kf.exists():
    for k in re.findall(r"'([A-Za-z0-9_-]{20,})'", kf.read_text(encoding='utf-8')):
        assert k not in text, '网页里出现了本机密钥'

(SKILL / 'assets').mkdir(parents=True, exist_ok=True)
shutil.copy2(html, SKILL / 'assets' / '上架宝.html')
shutil.copy2(ROOT / '书签脚本_带商品.js', SKILL / 'assets' / '书签脚本_带商品.js')

if INSTALLED.exists():
    shutil.rmtree(INSTALLED)
shutil.copytree(SKILL, INSTALLED, ignore=shutil.ignore_patterns('__pycache__', '.DS_Store'))

README = (ROOT / '内测素材' / '使用说明.txt')
DIST.mkdir(exist_ok=True)


def add_tree(z, folder, prefix):
    for f in sorted(folder.rglob('*')):
        if f.is_file() and '__pycache__' not in f.parts and f.name != '.DS_Store':
            z.write(f, f'{prefix}/{f.relative_to(folder)}')


web = DIST / f'上架宝_网页_{DAY}.zip'
with zipfile.ZipFile(web, 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(html, '上架宝/上架宝.html')
    if README.exists():
        z.write(README, '上架宝/使用说明.txt')

full = DIST / f'上架宝_全套_{DAY}.zip'
with zipfile.ZipFile(full, 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(html, '上架宝/上架宝.html')
    if README.exists():
        z.write(README, '上架宝/使用说明.txt')
    z.write(ROOT / '书签脚本_带商品.js', '上架宝/书签脚本_带商品.js')
    add_tree(z, SKILL, '上架宝/skill/shangjiabao')

for f in (web, full):
    print(f'{f}  {f.stat().st_size / 1e6:.1f} MB  {len(zipfile.ZipFile(f).namelist())} 个文件')
print(f'技能已同步到 {INSTALLED}')
