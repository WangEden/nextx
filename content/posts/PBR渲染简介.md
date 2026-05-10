---
title: PBR渲染简介
excerpt: 关于阅读PBR论文的相关知识点总结
author: Wang Eden
date: 2026-05-10
tags:
  - 计算机图形学
  - 游戏引擎
category: 图形学
cover: /imgs/articleCover/PBR渲染简介.jpg
views: 12
featured: false
slug: PBR-Render
readTime: 10分钟
---

> PBR，即 Physics Based Render (基于物理的渲染), 旨在通过利用真实世界中光学物理规律的数学公式来计算游戏场景中光和物体表面的交互，由此来让画面的视觉效果更加真实。

PBR中有几个重要的核心概念，即微表面理论、能量守恒和菲涅耳效应，下面会对其进行详细讲述：

###### 微表面理论

微表面理论就是就是假设物体表面是由一个个细小的微表面构成的，通过微表面上的特定分布函数和其他的函数的积分来计算光对整个表面的影响。

微表面模型定义了其上的四个方向，他们分别是：（以下均是单位向量）

- N：法线方向，垂直于需要计算的表面；
- L：灯光方向，由物体指向光源，$cos\theta_L = L \cdot N$；
- V：视方向，摄像机看过去的方向，$cos\theta_V = V \cdot N$；
- H：视半角方向，实际上是为了让光线能反射到视方向的一个法线；
	- $H = norm(L+V)$；
	- $cos\theta_H = H \cdot N$；

![[Screenshot 2026-04-23 at 02.10.12 1.png]]

###### 镜面反射与漫反射

PBR的主要任务就是计算镜面反射和漫反射，而无论是漫反射还是镜面反射，都绕不开一个术语，叫 BRDF (Bidirectional Reflective Distribution Function) , 即双向反射分布函数，可以理解为一种模型，但本质上就是一个函数，定义了光照到物体表面后反射回来时，有多少比例的光和观察者的方向是一致的，输入就是入射光的方向 $l$ 和 视方向 $v$，输出就是反射光和视方向光平行的比例，也即反射率。

这个反射率就决定了一个物体看起来像一个金属、塑料还是木头。


==漫反射==比较简单，最常见的漫反射 BRDF就是

<u>朗伯（Lambertian）漫反射模型：</u>
$$f(l,v)=\frac{c_{diff}}{\pi}$$
其中，
$c_{diff}$ 表示漫反射率；
$f(\mathbf{l}, \mathbf{v})$ 代表双向反射分布函数 (BRDF)，描述了光线从入射方向 $\mathbf{l}$ 照射到物体表面后，有多少比例的光会向观察方向 $\mathbf{v}$ 反射；
$\pi$ 是一个归一化因子，由能量守恒定律得到，即，如果一个理想的漫反射表面接收到一定量的光能，它会将这些能量均匀地向半球空间的所有方向散射，而对半球空间进行积分求和，其积分结果正好是 $\pi$；

这个公式是最经典的理想漫反射公式，计算效率高，且能和IBL兼容，虽然它忽略了真实世界中边缘变亮（Retro-reflection）等细节，但由于其数学上的极度简洁和对全局光照技术的友好支持，它依然是工业界（如游戏引擎）的默认选择


==镜面反射==则较为复杂，在虚幻4引擎中使用的就是

<u>Cook-Torrance 微面元（Microfacet）镜面反射模型：</u>
$$f(\mathbf{l}, \mathbf{v}) = \frac{D(\mathbf{h}) F(\mathbf{v}, \mathbf{h}) G(\mathbf{l}, \mathbf{v}, \mathbf{h})}{4(\mathbf{n} \cdot \mathbf{l})(\mathbf{n} \cdot \mathbf{v})}$$
微面元理论：
该模型假设物体表面是由无数个肉眼看不见的、微小的镜面（Microfacets）组成
- 如果这些微小镜面的法线方向比较一致，表面就光滑，高光强且集中
- 如果微小镜面的法线方向杂乱无章，表面就粗糙，高光弱且分散

这三个核心项通常被称为 DFG 项：
D (Distribution) —— 法线分布函数（Normal distribution function，NDF）
- 含义：在当前点，有多少比例的微面元法线正好指向 半角向量 $\mathbf{h}$（即入射光 $\mathbf{l}$ 和观察方向 $\mathbf{v}$ 的中间方向）。
- 作用：决定了高光的形状和亮度。最常用的是 GGX 分布；
$$D(h) =\frac{α^2}{π ((n · h)^2 (α^2 − 1) + 1)^2}$$

F (Fresnel) —— 菲涅尔方程
- 含义：描述光线以不同角度射入表面时，反射光所占的比例。
- 现象：当你平视水面或地板时，反射最强；垂直看过去时，反射最弱。这就是菲涅尔效应。

![[Pasted image 20260423142740.png]]

G (Geometry) —— 几何遮蔽函数，是一个输出为 \[0, 1\]之间的数值，用于衡量有多少微表面被遮挡（反射光线无法到达视方向）以及有多少微表面处于阴影（入射光线无法到达微表面）
- 含义：由于表面是不平整的，微面元之间会互相遮挡。
	- Shadowing：光线射进来时被挡住，无法到达微面元。
	- Masking：反射光射出去时被挡住，无法到达眼睛。
- 作用：确保粗糙表面的能量守恒，防止边缘过亮。
- 输出：输出一个比值，反应有多少比例的光能成功完成反射；
Trowbridge-Reitz 分布，也叫 GGX，UE4中使用 Schlick-GGX，是对 Smith 模型的一种近似：
包含：$k = \frac{(Roughness + 1)^2}{8}$、$G_1(v)= \frac{n·v}{(n·v)(1−k)+k}$、$G(l, v, h) = G_1(l) G_1(v)$；
GGX的长尾巴：从中心离开后的数值下降到一定程度后，会以一种非常平缓的姿态向两边延伸，形成一段很长、很薄的“尾巴”，这在视觉上能实现高光边缘的光晕感；

蒙特卡洛积分 (Monte Carlo Integration) ：
$$\int_{H} L_i(\mathbf{l})f(\mathbf{l}, \mathbf{v}) \cos \theta_l d\mathbf{l} \approx \frac{1}{N} \sum_{k=1}^{N} \frac{L_i(\mathbf{l}_k)f(\mathbf{l}_k, \mathbf{v}) \cos \theta_{l_k}}{p(\mathbf{l}_k, \mathbf{v})}$$
- 左边：是一个连续积分，代表从半球空间 $H$ 射入的所有光的总反射。
- 右边：因为积分很难直接算，我们随机撒 $N$ 个采样点（样本），取平均值来逼近真实结果。
- $p(\mathbf{l}_k, \mathbf{v})$ (PDF)：概率密度函数。为了提高效率，我们不随机乱撒点，而是往高光最亮的地方多撒点，这叫 重要性采样 (Importance Sampling)。