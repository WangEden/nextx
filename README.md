This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

基于NextJs开发的一个Web应用, 还在开发阶段

网址：https://edenx.me

## 本地预览

```sh
npm ci
npm run dev
```

打开 http://localhost:3000，文库位于 `/archives`。`npm run build` 会检查类型并导出到 `out/`，继续兼容现有 GitHub Pages 发布流程。

导航和文章卡片使用投影、柔化提亮、边缘折射、着色、边缘光和文字六层材质。桌面 Chromium 浏览器按圆角轮廓弯折真实背景，并分别偏移 RGB 三个通道；手机和其他浏览器保留轻量的玻璃效果。Dock 会根据所在首屏照片的明暗调整着色。文库支持标题、摘要、标签搜索，以及分类和网格/列表切换。

点击卡片展开到全屏阅读；点击左上返回、右上关闭、正文末尾“返回卡片”或按 Esc 收起，并恢复原筛选条件、视图和滚动位置。浏览器前进后退也接入同一转场。支持 View Transition API 的浏览器使用共享元素动画，其余浏览器保留正常导航；系统启用“减少动态效果”时关闭动画。

## 更新图片和字体

站点直接提供预先压缩的 WebP 和 WOFF2，静态导出无需额外的图片服务。原图和原字体保存在原路径。替换背景或封面后，运行 `node scripts/optimize-images.mjs` 生成响应式图片；新增或改写文章后，可以运行以下命令把新字加入文楷分片。生成文件随项目保存，常规 `npm run build` 无需 Python。

```sh
python -m pip install "fonttools[woff]"
python scripts/optimize-fonts.py
```

未收录的字使用系统字体显示，直到重新生成分片。文章和代码用的分片在需要时才下载。
