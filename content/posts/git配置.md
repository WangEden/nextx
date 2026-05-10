---
title: "git配置"
excerpt: "记录git的配置过程"
author: "Eden"
date: "2025-06-12"
tags: ["配置", "git"]
category: "配置"
cover: "/imgs/articleCover/git配置.jpg"  # 放在 public 下，路径以 / 开头
views: 2437
featured: false
slug: "git-config-note"  # 可选；不写的话自动由文件名生成
readTime: "1分钟"

---

配置密钥
```bash
git config --global user.name "WangEden"
git config --global user.email "wangeden_@outlook.com"
ssh-keygen -t rsa -b 4096 -C "wangeden_@outlook.com" -f ~/.ssh/id_rsa_github
```

在github上配置
```bash
cat ~/.ssh/id_rsa_github.pub
```
之后把输出的内容贴到github的SSH and GPG keys项中

测试连接：
```bash
ssh -T git@github.com
```

如果失败，手动在 config 中添加
```bash
vim ~/.ssh/config
# 添加
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_github
```
