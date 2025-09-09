---
title: "Yolov8中添加SA注意力机制"
excerpt: "记录了在Yolov8网络中添加注意力机制模块的过程"
author: "Wang Eden"
date: "2025-05-26"
tags: ["计算机视觉", "深度学习", "Yolov8"]
category: "视觉"
cover: "/imgs/articleCover/Yolov8中添加SA注意力机制.jpg"
views: 2437
featured: false
slug: "Yolov8中添加SA注意力机制"

---
###### 步骤

1.卸载库中的ultralytics
```bash
pip uninstall ultralytics
pip uninstall ultralytics-thop
```

2.找到ultralytics/ultralytics/nn/modules路径
创建SA.py
内容为：
```Python
import numpy as np
import torch
from torch import nn
from torch.nn import init
from torch.nn.parameter import Parameter

class ShuffleAttention(nn.Module):
    def __init__(self, channel=512, out_channel=512, reduction=16, G=8):
        super().__init__()
        self.G = G
        self.channel = channel
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.gn = nn.GroupNorm(channel // (2 * G), channel // (2 * G))
        self.cweight = Parameter(torch.zeros(1, channel // (2 * G), 1, 1))
        self.cbias = Parameter(torch.ones(1, channel // (2 * G), 1, 1))
        self.sweight = Parameter(torch.zeros(1, channel // (2 * G), 1, 1))
        self.sbias = Parameter(torch.ones(1, channel // (2 * G), 1, 1))
        self.sigmoid = nn.Sigmoid()
    def init_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                init.kaiming_normal_(m.weight, mode='fan_out')
                if m.bias is not None:
                    init.constant_(m.bias, 0)
            elif isinstance(m, nn.BatchNorm2d):
                init.constant_(m.weight, 1)
                init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                init.normal_(m.weight, std=0.001)
                if m.bias is not None:
                    init.constant_(m.bias, 0)
    @staticmethod
    def channel_shuffle(x, groups):
        b, c, h, w = x.shape
        x = x.reshape(b, groups, -1, h, w)
        x = x.permute(0, 2, 1, 3, 4)
        # flatten
        x = x.reshape(b, -1, h, w)
        return x
    def forward(self, x):
        b, c, h, w = x.size()
        # group into subfeatures
        x = x.view(b * self.G, -1, h, w)  # bs*G,c//G,h,w
        # channel_split
        x_0, x_1 = x.chunk(2, dim=1)  # bs*G,c//(2*G),h,w
        # channel attention
        x_channel = self.avg_pool(x_0)  # bs*G,c//(2*G),1,1
        x_channel = self.cweight * x_channel + self.cbias  # bs*G,c//(2*G),1,1
        x_channel = x_0 * self.sigmoid(x_channel)
        # spatial attention
        x_spatial = self.gn(x_1)  # bs*G,c//(2*G),h,w
        x_spatial = self.sweight * x_spatial + self.sbias  # bs*G,c//(2*G),h,w
        x_spatial = x_1 * self.sigmoid(x_spatial)  # bs*G,c//(2*G),h,w
        # concatenate along channel axis
        out = torch.cat([x_channel, x_spatial], dim=1)  # bs*G,c//G,h,w
        out = out.contiguous().view(b, -1, h, w)
        # channel shuffle
        out = self.channel_shuffle(out, 2)
        return out
```

3.在同一路径下修改init.py文件
添加
```Python
from .SA import ShuffleAttention
```
并修改__all__变量
```Python
将 "ShuffleAttention" 加到 __all__中
```

4.找到ultralytics/ultralytics/nn/tasks.py文件
添加
```Python
from ultralytics.nn.modules import ShuffleAttention
```
并找到这一行代码
```Python
elif m is torch.nn.BatchNorm2d:
	args = [ch[f]]
```
在其上方添加以下代码
```Python
elif m is ShuffleAttention: # add shuffle attention
	c1, c2 = ch[f], args[0]
	if c2 != nc:  # if c2 not equal to number of classes (i.e. for Classify() output)  
		c2 = make_divisible(min(c2, max_channels) * width, 8)
	args = [c1, c2, *args[1:]]
```

5.修改yaml配置文件
复制一份ultralytics/ultralytics/cfg/models/v8/yolov8.yaml文件
命名为yolov8-SA.yaml,并修改为以下内容，也可以自行修改。
```yaml
# Ultralytics 🚀 AGPL-3.0 License - https://ultralytics.com/license
# Ultralytics YOLOv8 object detection model with P3/8 - P5/32 outputs
# Model docs: https://docs.ultralytics.com/models/yolov8
# Task docs: https://docs.ultralytics.com/tasks/detect

# Parameters
nc: 80 # number of classes
scales: # model compound scaling constants, i.e. 'model=yolov8n.yaml' will call yolov8.yaml with scale 'n'
  # [depth, width, max_channels]
  n: [0.33, 0.25, 1024] # YOLOv8n summary: 129 layers, 3157200 parameters, 3157184 gradients, 8.9 GFLOPS
  s: [0.33, 0.50, 1024] # YOLOv8s summary: 129 layers, 11166560 parameters, 11166544 gradients, 28.8 GFLOPS
  m: [0.67, 0.75, 768] # YOLOv8m summary: 169 layers, 25902640 parameters, 25902624 gradients, 79.3 GFLOPS
  l: [1.00, 1.00, 512] # YOLOv8l summary: 209 layers, 43691520 parameters, 43691504 gradients, 165.7 GFLOPS
  x: [1.00, 1.25, 512] # YOLOv8x summary: 209 layers, 68229648 parameters, 68229632 gradients, 258.5 GFLOPS
  
# YOLOv8.0n backbone
backbone:
  # [from, repeats, module, args]
  - [-1, 1, Conv, [64, 3, 2]] # 0-P1/2
  - [-1, 1, Conv, [128, 3, 2]] # 1-P2/4
  - [-1, 3, C2f, [128, True]]
  - [-1, 1, Conv, [256, 3, 2]] # 3-P3/8
  - [-1, 6, C2f, [256, True]]
  - [-1, 1, Conv, [512, 3, 2]] # 5-P4/16
  - [-1, 6, C2f, [512, True]]
  - [-1, 1, Conv, [1024, 3, 2]] # 7-P5/32
  - [-1, 3, C2f, [1024, True]]
  - [-1, 3, ShuffleAttention, [1024]]
  - [-1, 1, SPPF, [1024, 5]] # 9

# YOLOv8.0n head
head:
  - [-1, 1, nn.Upsample, [None, 2, "nearest"]]
  - [[-1, 6], 1, Concat, [1]] # cat backbone P4
  - [-1, 3, C2f, [512]] # 12
  
  - [-1, 1, nn.Upsample, [None, 2, "nearest"]]
  - [[-1, 4], 1, Concat, [1]] # cat backbone P3
  - [-1, 3, C2f, [256]] # 15 (P3/8-small)

  - [-1, 1, ShuffleAttention, [256, 16, 8]]
  - [-1, 1, Conv, [256, 3, 2]]
  - [[-1, 12], 1, Concat, [1]] # cat head P4
  - [-1, 3, C2f, [512]] # 18 (P4/16-medium)
  
  - [-1, 1, ShuffleAttention, [512, 16, 8]]
  - [-1, 1, Conv, [512, 3, 2]]
  - [[-1, 9], 1, Concat, [1]] # cat head P5
  - [-1, 3, C2f, [1024]] # 21 (P5/32-large)

  - [[15, 18, 21], 1, Detect, [nc]] # Detect(P3, P4, P5)
```

6.修改训练脚本：
注释 # model = YOLO("pre_weight/yolov8n.pt")
该代码会反序列化模型，使修改后的模型失效
正确加载预训练权重的方法是：
```
import torch
# Load a model
model = YOLO("ultralytics/cfg/models/v8/YOLOv8-SA.yaml")  # build a new model from scratch
ckpt = torch.load("pre_weight/yolov8n.pt", map_location="cpu")
state = ckpt["model"].float().state_dict()
model.model.load_state_dict(state, strict=False)    # 只匹配同名层
```
