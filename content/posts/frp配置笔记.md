back to [[Minecraft ModsUpdater]]；

---
title: "frp配置笔记"
excerpt: "记录frp-内网穿透工具的配置过程"
author: "Wang Eden"
date: "2025-06-10"
tags: ["配置", "内网穿透"]
category: "配置"
cover: "/imgs/articleCover/frp配置笔记.jpg"  # 放在 public 下，路径以 / 开头
views: 2437
featured: false
slug: "frp配置笔记"  # 可选；不写的话自动由文件名生成

---
###### 相关信息

阿里云服务器地址：
	47.117.109.226

frp下载地址：
	https://github.com/fatedier/frp

官方教程文档：
	https://gofrp.org/zh-cn/docs/examples/ssh/

###### 配置ssh和Minecraft服务器

配置过程：
1.将release中的包下载下来
	其中frpc和frpc.toml放入本地客户端
	frps和frps.toml放入云服务器
	通过```./frpc -c ./frpc.toml```即可运行
2.修改frps.toml和frpc.toml
	frps.toml通常只需要写上```bindPort = 7000```即可
	frpc.toml的内容如下：
	下面写入了远程ssh功能和Minecraft服务器功能的配置
	
```toml
serverAddr = "47.117.109.226"
serverPort = 7000

[[proxies]]
name = "ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 6000  # 阿里云映射端口

[[proxies]]
name = "minecraft"
type = "tcp"
localIP = "127.0.0.1"
localPort = 25565
remotePort = 25570  # 阿里云映射端口
```

其中远程映射端口还需要在阿里云的控制台中手动开放

3.直接通过启动命令启动，或者使用systemd创建服务启动
创建frps服务：
1. 使用文本编辑器 (如 vim) 在 `/etc/systemd/system` 目录下创建一个 `frps.service` 文件，用于配置 frps 服务。
	命令：```sudo vim /etc/systemd/system/frps.service```

2. 写入内容：

```toml
[Unit]
# 服务名称，可自定义
Description = frp server
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
# 启动frps的命令，需修改为您的frps的安装路径
ExecStart = /path/to/frps -c /path/to/frps.toml

[Install]
WantedBy = multi-user.target
```

1. 管理systemd服务的相关命令：

```bash
# 启动frp
sudo systemctl start frps
# 停止frp
sudo systemctl stop frps
# 重启frp
sudo systemctl restart frps
# 查看frp状态
sudo systemctl status frps
# 设置开机自启动
sudo systemctl enable frps
```

4.使用ssh命令连接内网穿透的远程内网主机：
该命令在vscode的remote-ssh插件中也可使用

```bash
ssh -p 6000 eden@47.117.109.226
# 或使用域名
ssh -p 6000 eden@wangeden.top
```

###### 配置Web服务器

frps.toml中改为：
```toml
bindPort = 7000
vhostHTTPPort = 8080
```

在阿里云上设置nginx反向代理frp

创建/etc/nginx/conf.d/frp_proxy.conf
写入：
```nginx
server {
    listen 80;
    server_name wangeden.top;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

执行 sudo systemctl reload nginx重新加载

客户端中，frpc.toml添加以下条目
```toml
[[proxies]]
name = "hexoTest"
type = "http"
localIP = "127.0.0.1"
localPort = 4000
customDomains = ["wangeden.top"]
```

重启即可

启用https
服务器上frps.toml添加
vhostHTTPSPort = 443

frpc客户端toml添加：
```toml
[[proxies]]
name = "test_htts2http"
type = "https"
customDomains = ["test.yourdomain.com"]

[proxies.plugin]
type = "https2http"
localAddr = "127.0.0.1:4000"

# HTTPS 证书相关的配置
crtPath = "./server.crt"
keyPath = "./server.key"
hostHeaderRewrite = "127.0.0.1"
requestHeaders.set.x-from-where = "frp"
```
证书参考下一节

###### 配置Web管理页面，添加安全证书等

frps.toml中添加：
```toml
webServer.addr = "0.0.0.0"
webServer.port = 7500
# dashboard 用户名密码，可选，默认为空
webServer.user = "admin"
webServer.password = "admin"

webServer.tls.certFile = "server.crt"
webServer.tls.keyFile = "server.key"
```

阿里云生成的TLS证书有三个文件：
wangeden.top_chain.crt  wangeden.top.key  wangeden.top_public.crt
crt使用top_public才能使用

客户端toml配置中添加：

```toml
webServer.addr = "127.0.0.1"
webServer.port = 7400
webServer.user = "admin"
webServer.password = "admin"

[[proxies]]
name = "admin_ui"
type = "tcp"
localPort = 7400
remotePort = 7400 # <--这里端口确实是填这个，不知道为什么，但访问还是7500
```

###### 为ssh连接添加免密登陆

在任意终端输入ssh-keygen -t rsa -b 4096 -C "your@email.com"
邮箱改成自己的就行了

这时候会生成两个文件：
id_rsa 和 id_rsa.pub

其中id_rsa是私钥，id_rsa.pub是公钥
将公钥放在内网被连接主机的～/.ssh/ 目录下

私钥放在自己机器的.ssh/目录下，若是Windows系统，则是C:/Users/XXX/.ssh目录

在目标主机中修改ssh配置
```bash
sudo nano /etc/ssh/sshd_config
```
修改以下内容：
```bash
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication no     # 可选，禁用密码登录
PermitRootLogin no            # 可选，禁用 root 登录
```

之后重启：
```bash
sudo systemctl restart ssh
```

在外部测试登陆
```bash
ssh -i ~/.ssh/id_rsa -p 6000 user@wangeden.top
```
可以实现免输入密码

在vscode中修改
修改~/.ssh/config文件，添加
```ssh
Host my-home
    HostName wangeden.top
    Port 6000
    User your_user
    IdentityFile ~/.ssh/id_rsa
```

即可在vscode中也实现免密登陆

