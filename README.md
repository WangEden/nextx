This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

基于NextJs开发的一个Web应用, 还在开发阶段

网址：https://edenx.me

## 本地预览

```sh
npm ci
npm run dev
```

打开 http://localhost:3000，文库位于 `/archives`。`npm run build` 会检查类型并导出到 `out/`，继续兼容现有 GitHub Pages 发布流程。

导航和文章卡片采用液态玻璃材质，适配深浅色与手机屏幕。文库支持标题、摘要、标签搜索，以及分类和网格/列表切换。

点击卡片展开到全屏阅读；点击左上返回、右上关闭、正文末尾“返回卡片”或按 Esc 收起，并恢复原筛选条件、视图和滚动位置。浏览器前进后退也接入同一转场。支持 View Transition API 的浏览器使用共享元素动画，其余浏览器保留正常导航；系统启用“减少动态效果”时关闭动画。
