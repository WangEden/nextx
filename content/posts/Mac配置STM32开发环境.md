---
title: "MacOS配置STM32开发环境(Hal库)"
excerpt: "记录Mac配置STM32 Hal库开发环境的过程"
author: "Wang Eden"
date: "2025-12-05"
tags: ["配置", "MacOS", "STM32"]
category: "配置"
cover: "/imgs/articleCover/Mac配置STM32开发环境.jpg"
views: 12
featured: false
slug: "MacOS-config-stm32-hal"
readTime: "3分钟"

---
本文参考以下三篇博客：
[Mac配置STM32开发环境](https://blog.csdn.net/weixin_45427512/article/details/147692806)；
[stm32f407zgt6引脚功能定义](https://blog.csdn.net/u011510016/article/details/100404880)；
[HAL库开发OLED](https://blog.csdn.net/weixin_43329283/article/details/126865004)；


### 下载软件和工具


1、STM32CubeMX；

前往ST官网下载安装即可：
[STM32CubeMX下载](https://www.st.com.cn/content/st_com/zh/stm32cubemx.license=1705797247627.product=STM32CubeMX-Lin.version=6.10.0.html#st-get-software)


2、VS Code；

浏览器搜索安装即可；


3、arm-none-eabi-gcc；

前往此github仓库：
[Xpack版的交叉编译器](https://github.com/xpack-dev-tools/arm-none-eabi-gcc-xpack/releases)


下载后得到名如`xpack-arm-none-eabi-gcc-14.2.1-1.1-darwin-arm64.tar.gz`的压缩包，将其移动到Library文件夹中解压：

```zsh
mkdir -p ~/Library/xPacks/arm-none-eabi-gcc
cd ~/Library/xPacks/arm-none-eabi-gcc

tar xvf ~/Downloads/xpack-arm-none-eabi-gcc-14.2.1-1.1-darwin-arm64.tar.gz

# 若要把此目录设为已读以保护文件不被修改，可以执行以下命令
chmod -R -w xpack-arm-none-eabi-gcc-14.2.1-1.1
```

之后修改环境变量：

```zsh
vim ~/.zshrc
# 在最底下添加以下内容
export PATH="$HOME/Library/xPacks/arm-none-eabi-gcc/xpack-arm-none-eabi-gcc-14.2.1-1.1/bin:$PATH"
# 然后:wq保存退出后source一下
source ~/.zshrc
```

之后输入命令检查，当前链接的交叉编译器是`Library`目录下的

```zsh
which arm-none-eabi-gcc
arm-none-eabi-gcc --version
echo | arm-none-eabi-gcc -xc -E -v -
```

如果弹出“Apple无法验证arm-none-eabi-gcc是否包含可能危害Mac安全...”的弹窗，不要点击“移到废纸篓”，点击左边的“完成”，然后在命令行输入以下内容(注意其中的目录需根据之前的安装路径决定，因为可能因时间变化，你下载的默认版本会不同)：

```zsh
TOOLCHAIN=~/Library/xPacks/arm-none-eabi-gcc/xpack-arm-none-eabi-gcc-14.2.1-1.1

# 对整个工具链目录去掉隔离标记
xattr -r -d com.apple.quarantine "$TOOLCHAIN"
```

之后再执行`arm-none-eabi-gcc --version`就不会弹出验证弹窗了


4、Open-OCD；

直接命令行执行即可：
```zsh
brew install open-ocd
```


### VS Code插件安装（可选）


在VS Code中搜索并安装以下插件即可
1、Cortex-Debug
2、C/C++
3、C/C++ Extension Pack


### CubeMX项目配置


1.打开CubeMX，点击File → New Project来新建项目：

![[截屏2025-12-05 20.30.31.png]]

2.在打开的项目中选择自己所用的板子，这里以STM32F407ZGT6为例子

![[截屏2025-12-05 20.32.49.png]]

3.依次按图中箭头所示点击，来开启外部晶振高速时钟

![[截屏2025-12-05 20.35.02.png]]

4.再开启I2C，因为本文使用的OLED是I2C方式驱动的

![[截屏2025-12-05 20.36.45.png]]

5.之后切换到时钟页面，将此处频率改为168Mhz，CubeMX会自动修改之后的分频（不得不说用HAL开发，能用CubeMX配置是真方便，以前用标准库，代码一行一行配置，如果不熟悉很容易出错）

![[截屏2025-12-05 20.38.30.png]]

6.之后切换到项目管理页面，项目名称可以随便取，Toolchain这里记得要选Makefile

![[截屏2025-12-05 20.41.23.png]]

7.切换到第二个选项，勾上这个，之后点击生成代码即可完成配置，之后如果不启用新的外设，都可以不用再打开CubeMX

![[截屏2025-12-05 20.44.43.png]]


### Makefile修改及OpenOCD配置


之后在终端打开项目文件夹，如果前面都配置完了，是可以直接make编译的，并且能在build目录下得到.elf文件
直接输入：

```zsh
make
```

如果最后显示这些内容，那说明之前的环境都没有配错

```zsh
_FLASH.ld  -lc -lm -lnosys  -Wl,-Map=build/OLED.map,--cref -Wl,--gc-sections -o build/OLED.elf
arm-none-eabi-size build/OLED.elf
   text   data     bss     dec     hex filename
   4912     12   1652   6576   19b0 build/OLED.elf
arm-none-eabi-objcopy -O ihex build/OLED.elf build/OLED.hex
arm-none-eabi-objcopy -O binary -S build/OLED.elf build/OLED.bin
```

之后进行OpenOCD的配置，在项目根目录下创建xxx.cfg，OpenOCD就是根据这个文件的规则进行烧录的，本文用的是STLink，可以参考以下配置，至于这些配置的含义，可以询问AI

```cfg
# stm32f407zgt6.cfg（文件名）

source [find interface/stlink.cfg]
transport select hla_swd
adapter speed 4000

set CHIPNAME stm32f407zgt6
source [find target/stm32f4x.cfg]
reset_config srst_only srst_nogate

init
reset halt
```

可以在Makefile中添加以下内容，这样就手动在命令行输入OpenOCD的命令了，也就是在Makefile这个文件的最后，EOF标签之前输入

```makefile
#######################################
# flashing
#######################################
flash:
  make
  openocd -f stm32f407zgt6.cfg -c "program build/car.elf verify reset exit"
```

这样之后烧录的时候，直接输入下面这个命令就行了

```zsh
make flash
```

在烧录后如果显示下面这些，特别是看到`Programming Finished`，那就说明没问题，程序已经烧录进去了，不用在意Info的信息，那个可能是cfg那个文件的频率设置的有问题，OpenOCD在识别了我们的芯片后自动改好了

```zsh
** Programming Started ** 
Info : device id = 0x100f6413 
Info : flash size = 1024 KiB 
** Programming Finished ** 
** Verify Started ** 
** Verified OK ** 
** Resetting Target ** 
Info : Unable to match requested speed 2000 kHz, using 1800 kHz 
Info : Unable to match requested speed 2000 kHz, using 1800 kHz 
shutdown command invoked
```


### 示例代码编写

这部分我直接照搬了别人的代码，参考博客的链接在文章开头已经给出。

在查阅了芯片手册后（实际上本文是直接搜了别人的博客看的），STM32F407ZGTx的引脚定义中，PB6对应了I2C的SCL，PB7对应了SDA，将对应的线连好即可。

然后在根目录创建OLED文件夹，根据那篇博客创建并编写好`oled.c`、`oled.h`、`font.h`即可，我的目录结构如下，可供参考

```zsh
├── OLED
│   ├── Inc
│   │   ├── font.h
│   │   └── oled.h
│   └── oled.c
```

然后要在Makefile文件中，把自己编写的文件包含进去，
源文件就在这里添加：

```makefile
######################################
# source
######################################
# C sources
C_SOURCES = \
OLED/oled.c \
Core/Src/main.c \
Core/Src/stm32f4xx_it.c \
...
```

头文件就在这部分添加：

```makefile
# C includes
C_INCLUDES = \
-IOLED/Inc \
-ICore/Inc \
-IDrivers/STM32F4xx_HAL_Driver/Inc \
...
```

最后记得在主程序`Core/Src/main.c`中修改代码时，要在类似`User Code`这类标签之间修改，否则之后要添加新的外设，使用CubeMX重新生成代码时，会将自己编写的代码删除
```c
/* USER CODE BEGIN 2 */
OLED_Init();
OLED_Clear();
/* USER CODE END 2 */

...

/* Infinite loop */
/* USER CODE BEGIN WHILE */
while (1)
{
	OLED_ShowString(10,2,"Hello World",8);
/* USER CODE END WHILE */
...
```

最后在命令行中，输入`make`进行编译，再输入`make flash`进行烧录即可，最终效果如下

![[bb1526eb5a390ce3d75e8e075903921d.jpg]]
