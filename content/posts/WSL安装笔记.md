back to [[机械臂]]；

---
title: "WSL安装笔记"
excerpt: "记录WSL的安装过程"
author: "Wang Eden"
date: "2025-06-10"
tags: ["配置", "WSL"]
category: "配置"
cover: "/imgs/articleCover/WSL安装笔记.jpg"  # 放在 public 下，路径以 / 开头
views: 2437
featured: false
slug: "WSL安装笔记"  # 可选；不写的话自动由文件名生成

---
### 安装系统

微软商店下载即可

### 安装图形桌面

打开Windows功能，打开“适用于Linux的Windows子系统”和“虚拟机平台”

打开终端，依次输入以下命令：
```powershell
wsl --list --online
wsl --install -d <安装的版本全称>
```

以下在Ubuntu界面输入：
```bash
sudo apt-get update
```

回到终端输入：
```powershell
wsl -l -v
wsl --update
```

以管理员身份打开终端：
```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

在Ubuntu中输入:
```bash
lsb_release -a
sudo apt update && sudo apt -y upgrade
sudo apt install xrdp
sudo apt install -y xfce4
calc
exit
sudo apt install -y xfce4-goodies
sudo vi /etc/xrdp/startwm.sh
service xrdp status
sudo /etc/init.d/xrdp start
ip a 
sudo apt-get install xfce4-terminal
```
之后使用Windows自带的远程桌面即可访问

如果要安装gnome桌面则参考：
[wsl安装ubuntu并设置gnome图形界面详细步骤（win11+ubuntu18）-CSDN博客](https://blog.csdn.net/m0_51194302/article/details/127891929)

