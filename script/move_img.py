#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import shutil
from pathlib import Path

# 项目根目录（script 位于根目录 /script）
ROOT = Path(__file__).resolve().parent.parent

POSTS_DIR = ROOT / "content" / "posts"
SRC_IMG_DIR = ROOT / "public" / "imgs" / "assets_src"
DST_IMG_DIR = ROOT / "public" / "imgs" / "assets"

DST_IMG_DIR.mkdir(parents=True, exist_ok=True)

# Obsidian 图片引用格式：![[filename.png]]
IMG_PATTERN = re.compile(r'!\[\[([^\]]+)\]\]')

referenced_images = set()

# 扫描所有 md 文件，提取图片名
for md_file in POSTS_DIR.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="ignore")
    for match in IMG_PATTERN.findall(text):
        referenced_images.add(match.strip())

# 复制被引用的图片
for img_name in referenced_images:
    src = SRC_IMG_DIR / img_name
    dst = DST_IMG_DIR / img_name
    if src.exists() and src.is_file():
        shutil.copy2(src, dst)

