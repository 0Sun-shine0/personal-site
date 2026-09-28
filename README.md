# 林默的个人网站

纯静态个人站点：**Astro 7 + 手写 CSS**，没有前端框架、没有运行时依赖、没有任何分析脚本。
构建产物是纯 HTML/CSS/JS，扔到任何静态托管上都能跑。

## 这个站有什么

| 页面 | 路径 | 内容 |
| --- | --- | --- |
| 首页 | `/` | 一句话定位、数据统计、代码窗口、精选作品、最新文章 |
| 作品 | `/projects` | 3 个案例，按「问题  方案  结果  反思」四段式写 |
| 文章列表 | `/blog` | 按时间排序，带标签 |
| 文章详情 | `/blog/<slug>` | 目录、阅读进度条、代码高亮、表格、结尾引导 |
| 关于 | `/about` | 经历时间线、我在关心什么、我不会什么 |
| 现在 | `/now` | 这个月在忙什么（三个月更新一次即可） |
| 装备 | `/uses` | 硬件、编辑器、技术栈、日常工具 |
| 404 | `/404.html` | 自定义缺省页 |

体验上的细节：深浅色跟随系统并可手动切换（无闪烁）、移动端抽屉导航、滚动出现动画、
卡片鼠标跟随光、一键复制邮箱、RSS 订阅、sitemap、Open Graph 卡片。

## 快速开始

```bash
npm install
npm run build      # 生成到 dist/
npm run preview    # 本地预览 dist/（默认 http://localhost:4321）
```

改了内容之后想看效果，就是这两步：`npm run build && npm run preview`（构建只要 12 秒）。

部署到 Cloudflare Pages / Vercel / Netlify 时：

- **构建命令**：`npm run build`
- **输出目录**：`dist`

上线前记得把 `astro.config.mjs` 里的 `site`、`public/robots.txt` 里的 Sitemap 地址、
以及 `src/data/site.ts` 里的邮箱和域名换成你自己的。

## 目录结构

```
src/
 data/site.ts             站点配置：名字、邮箱、社交、作品、跑马灯标签
 posts/*.md               文章（Markdown，frontmatter 见下）
 pages/
    index.astro         首页
    projects.astro      作品
    about.astro         关于
    now.astro           现在
    uses.astro          装备
    404.astro           缺省页
    rss.xml.ts          RSS 输出
    blog/
        index.astro     文章列表
        [...slug].astro 文章详情路由
 layouts/
    BaseLayout.astro    <head>、meta、导航、页脚
    PostLayout.astro    文章页骨架（目录 + 进度条）
 components/             Nav / Footer / Icon
 styles/global.css       全部样式（设计变量在文件开头）
 scripts/main.js         交互脚本（主题、抽屉、动画、复制、进度条）
public/                     favicon.svg / og-cover.svg / robots.txt
scripts/fix-env-plugin.mjs  受限环境的构建适配（见文末）
```

## 怎么改内容

### 1. 站点配置

`src/data/site.ts`  名字、职位、一句话定位、邮箱、GitHub、X、跑马灯关键词、
首页统计数字、以及三个作品案例，全部在这里改。

### 2. 写一篇文章

在 `src/posts/` 新建 `.md` 文件（文件名就是 URL）：

```markdown
---
title: 你的标题（尽量写成别人会搜的样子）
description: 一句话摘要，会出现在列表页、搜索引擎和 OG 卡片上
date: 2026-09-20
tags: [Go, 性能]
minutes: 8
---

正文用 Markdown 写。标题会自动生成目录，代码块自动高亮，表格有样式。
```

### 3. 换图标和分享图

`public/favicon.svg` 和 `public/og-cover.svg`。OG 图建议换成 1200630 的 PNG
（微信、X 对 SVG 支持不一致），换完把 `src/layouts/BaseLayout.astro` 里的
`/og-cover.svg` 改成新文件名。

### 4. 改配色

`src/styles/global.css` 开头的 `:root` 变量：`--brand`、`--brand-2` 决定主渐变，
`--bg` 系列决定底色。改两行就能换整个站的调性。

## 本地环境的两点说明

这个工作区是受管控环境，有两个坑已经绕过，记录下来免得以后困惑：

1. **构建**：环境禁止 node 创建带管道的子进程（`spawn EPERM`），而 Astro 的 env 插件
   要用 esbuild 的子进程做 define 替换。`npm run build` 之前的 `prebuild` 钩子会执行
   `scripts/fix-env-plugin.mjs`，在检测到该限制时把这一步换成等价的纯 JS 实现；
   在正常机器上它什么都不做（会打印「子进程可用，无需补丁」）。
2. **`npm run dev`（带热更新的开发服务器）在当前环境下不可用**：Vite 的 dev
   module runner 会把某些 CJS 依赖内联进 ESM 环境执行，报
   `require is not defined` / `Class extends value undefined`。
   这是工具链与受限环境的兼容问题，不影响构建产物。
   **改完内容用 `npm run build && npm run preview` 看效果即可**（构建 12 秒）。

## 待办（上线前）

- [ ] `src/data/site.ts` 换成你自己的信息（邮箱、GitHub、X、作品）
- [ ] `astro.config.mjs` 改 `site` 为真实域名
- [ ] `public/robots.txt` 里的 sitemap 地址改成真实域名
- [ ] 首页 `.avatar` 换成真人照片（现在用的是首字母色块）
- [ ] OG 图换成 PNG，提交到 Google Search Console / Bing 站长工具