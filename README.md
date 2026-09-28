# 颐安的个人网站

纯静态个人站点：**Astro 7 + 手写 CSS**，没有前端框架、没有运行时依赖、没有分析脚本。
构建产物是纯 HTML/CSS/JS，扔到任何静态托管上都能跑。

站点主人：颐安 · GitHub [@0Sun-shine0](https://github.com/0Sun-shine0)

定位：**正在学 AI Agent**，方式「边做边学」 每学一个概念就做成一个能跑的工具，小爪助手是目前的成果产出。

## 站点内容从哪来

内容不是占位符，全部对着真实仓库写的：

| 来源 | 用在哪 |
| --- | --- |
| GitHub 全部 12 个仓库（名称、语言、star、README） | 作品页的项目卡片、早期作品列表 |
| 本地 `PawPet` 仓库（v2.4.0，81 次提交）的 README 与 `docs/` | 主推作品四段式、关于页、现在页、装备页 |
| PawPet README 的「五个踩过的坑」+ `docs/评审-小爪AI-Agent层.md` | 5 篇笔记（点击穿透 / BOM 数据丢失 / 权限审批链 / token 成本 / 打包发布） |

> **发布前请通读这 5 篇笔记。** 它们是从你自己项目的 README 和评审文档里整理成文的，
> 技术细节都来自源码和文档，但**行文口吻是我按「第一人称作者」写的** —— 如果某些
> 结论或细节你想改，直接改 `src/posts/*.md` 就行。

## 页面

| 页面 | 路径 | 内容 |
| --- | --- | --- |
| 首页 | `/` | 一句话定位、三个数字、代码窗口（审批链）、跑马灯、作品、最新笔记 |
| 作品 | `/projects` | 主推项目四段式 + 4 个其他作品 + 4 条早期作品 |
| 笔记列表 | `/blog` | 按时间排序，带标签 |
| 笔记详情 | `/blog/<slug>` | 目录、阅读进度条、代码高亮、表格 |
| 关于 | `/about` | 时间线（2018 → 2026）、我在关心什么、我不会什么 |
| 现在 | `/now` | 这个月在忙什么（三个月更新一次即可） |
| 装备 | `/uses` | 语言框架、运行环境、编辑器、打包发布 |
| 404 | `/404.html` | 自定义缺省页 |

体验细节：深浅色跟随系统并可手动切换（无闪烁）、移动端抽屉导航、滚动出现动画、
卡片鼠标跟随光、一键复制、RSS、sitemap、Open Graph 卡片。

## 快速开始

```bash
npm install
npm run build      # 生成到 dist/（12 秒）
npm run preview    # 本地预览 dist/（默认 http://localhost:4321）
```

部署到 Cloudflare Pages / Vercel / Netlify / GitHub Pages 时：

- **构建命令**：`npm run build`
- **输出目录**：`dist`

## 隐私：站内只用网名

站点里**没有真名**，公开身份统一是「颐安」。以下三处都已处理：

1. **页面内容**：`src/data/site.ts` 里的 `realName` 字段已删除；相关位置（页脚、
   关于页标题与描述、作品页描述、`og:image:alt`）一律只用 `site.name`。
2. **Git 提交身份**：本仓库已单独配置
   ```bash
   git config user.name  "颐安"
   git config user.email "maaikk@126.com"
   ```
   这是**仓库级**配置（写在 `.git/config` 里，不进版本库），只影响这个站点项目 
   你在别的项目里仍然可以用原来的身份。**换机器后记得重新执行这两行**，
   否则新提交会再次带上真实姓名和工作邮箱。
3. **历史记录**：仓库从未推送过，所以旧提交（含真名的作者字段与提交信息）已经
   用 `git commit-tree` 整体重写，旧对象也已 `gc` 清除。

> 关于第 3 点：如果这个仓库**已经推到过 GitHub**，改写本地历史是没用的 
> 远端和 GitHub 的缓存里仍然留着旧提交。那种情况下需要先删掉远端仓库重建，
> 或者用 `git push --force` 覆盖后再联系 GitHub 支持清理缓存。

## 联系方式（已在站内）

| 渠道 | 值 | 出现在 |
| --- | --- | --- |
| 邮箱 | maaikk@126.com | 页脚、关于页、文章侧栏、首页 CTA |
| 微信 | M2XWYMM | 页脚、关于页、文章侧栏、首页 CTA |
| QQ | 920422927 | 页脚、关于页、文章侧栏、首页 CTA |
| GitHub | [@0Sun-shine0](https://github.com/0Sun-shine0) | 页脚、关于页、首页、作品页 |
| 城市 | 湖北武汉 | 页脚、关于页、首页状态、现在页 |

这些都在 `src/data/site.ts` 里：`location` / `email` / `qq` / `wechat` / `github`，
另外 `contacts` 数组统一驱动所有复制按钮 —— **改一处，全站同步**。
（联系方式是公开信息，会出现在页面源码里，换号记得改这里。）

> 注意：站点已去掉 X / Twitter 的社交链接。`BaseLayout.astro` 里保留的
> `twitter:card` 是 OG 分享卡的 meta 协议名，不是社交账号，需要保留。

## 推送到 GitHub

仓库是**公开**的：https://github.com/0Sun-shine0/personal-site

远程地址用的是**带用户名的形式**：

```bash
git remote -v
# origin  https://0Sun-shine0@github.com/0Sun-shine0/personal-site.git
```

为什么多加这一段 `0Sun-shine0@` —— 因为开发机的全局 `~/.gitconfig` 里有一条
早先为了绕网络限制而加的改写规则：

```ini
[url "https://gitee.com/mirrors/"]
    insteadOf = https://github.com/
```

它会把**所有** github 地址偷偷改写成 gitee 镜像（而那个镜像是 404 的）。
带用户名的 URL 不以 `https://github.com/` 开头，因此不会被命中，能正常推到 GitHub。

> 想彻底去掉这个隐患：
>
> ```bash
> git config --global --unset-all url.https://gitee.com/mirrors/.insteadof
> git remote set-url origin https://github.com/0Sun-shine0/personal-site.git
> ```

### 日常推送

```bash
git add -A
git commit -m "你的改动"
git push
```

提示要密码时，密码处填 **Personal Access Token**（不是登录密码）。

## 部署

仓库是公开的，主流托管都能直接连：

- **Cloudflare Pages / Vercel / Netlify**：连接本仓库，构建命令 `npm run build`，输出目录 `dist`。
- **GitHub Pages**：注意发布路径取决于仓库名。
  - 若把仓库改名为 `0Sun-shine0.github.io`，会发布到根路径 `https://0sun-shine0.github.io/`，
    现在 `astro.config.mjs` 里的 `site` 正好就是这个值，不用改。
  - 若保持 `personal-site` 这个仓库名，会发布到子路径 `https://0Sun-shine0.github.io/personal-site/`，
    除了把 `site` 改成这个带子路径的地址，还要在 `astro.config.mjs` 里加 `base: '/personal-site'`。

## 上线前必须改的

1. **站点地址**：`astro.config.mjs` 里的 `site`（现在是 `https://0sun-shine0.github.io`）。
   它是 sitemap / RSS / canonical 的基准，按上面「部署」一节选定托管方式后填对应地址。
2. **`public/robots.txt`** 里的 Sitemap 地址，同步改成真实域名。
## 分享卡片（OG 图）

别人在微信 / QQ / X / Slack / 飞书里粘贴你的链接时，自动展开的那张预览图就是 OG 图
（Open Graph Image）。它由页面 `<head>` 里的 `og:image` 指定，内容就是
`public/og-cover.png`（**1200×630**）：

> 深色渐变底 + 「YI AN」+ 两行大字「把模型接上，把工具做顺。」+「AI TOOLS / DESKTOP & AGENT」+ 仓库地址

**为什么是 PNG 而不是 SVG**：微信、QQ、X 这类平台抓取分享图时对 SVG 支持很不一致
（多数直接不显示，卡片会退化成纯文字）。所以线上用的是 PNG，
`og-cover.svg` 保留为**可编辑的源文件**。

改完文字或配色后，重新生成 PNG 只要一条命令：

```bash
npm run og          # public/og-cover.svg  public/og-cover.png (1200x630)
npm run build
```

（这个脚本依赖 `sharp`；它是 Astro 的依赖，正常情况下已经装好了。）

## 建议补的一处

- **头像**：现在首页/关于页用的是首字母色块（`.avatar` / `.brand__mark` 显示 `YA`）。
  真人照片的可信度会明显更高 —— 图片放 `public/`，然后把对应标签换成 `<img>`。

## 目录结构

```
src/
 data/site.ts             站点配置：名字、邮箱、作品、笔记标签，全部内容都在这里
 posts/*.md               笔记（Markdown，frontmatter 见下）
 pages/
    index.astro         首页
    projects.astro      作品
    about.astro         关于
    now.astro           现在
    uses.astro          装备
    404.astro           缺省页
    rss.xml.ts          RSS 输出
    blog/
        index.astro     笔记列表
        [...slug].astro 笔记详情路由
 layouts/
    BaseLayout.astro    <head>、meta、导航、页脚
    PostLayout.astro    文章页骨架（目录 + 进度条）
 components/             Nav / Footer / Icon
 styles/global.css       全部样式（设计变量在文件开头）
 scripts/main.js         交互脚本（主题、抽屉、动画、复制、进度条）
 shims/picomatch.mjs     给 Vite 用的 ESM 垫片（见文末）
public/                     favicon.svg / og-cover.svg / robots.txt
scripts/fix-env-plugin.mjs —— 受限环境的构建适配（见文末）
```

## 怎么改内容

### 写一篇新笔记

在 `src/posts/` 新建 `.md`（文件名就是 URL）：

```markdown
---
title: 你的标题（尽量写成别人会搜的样子）
description: 一句话摘要，会出现在列表页、搜索引擎和 OG 卡片上
date: 2026-09-27
tags: [打包发布, PyInstaller]
minutes: 9
---

正文用 Markdown 写。`##` 标题会自动生成目录，代码块自动高亮，表格有样式。
```

### 改作品

`src/data/site.ts` 里有三块：

- `featured`：主推项目，字段是四段式（`problem` / `approach` / `result` / `lesson`）；
- `projects`：其他作品，字段是 `subtitle` / `points` / `note` / `stat`；
- `earlyWork`：早期作品，一行一条。

### 改配色

`src/styles/global.css` 开头的 `:root` 变量：`--brand`、`--brand-2` 决定主渐变，
`--bg` 系列决定底色。改两行就能换整个站的调性。

## 本地环境的两点说明（受管控环境特有）

1. **构建**：环境禁止 node 创建带管道的子进程（`spawn EPERM`），而 Astro 的 env 插件
   要用 esbuild 的子进程做 define 替换。`npm run build` 之前的 `prebuild` 钩子会跑
   `scripts/fix-env-plugin.mjs`，检测到该限制时把这一步换成等价的纯 JS 实现；
   **在正常机器上它会自动跳过**（打印「子进程可用，无需补丁」）。
2. **`npm run dev` 在受管控环境下不可用**：Vite 的 dev module runner 会把
   `picomatch`、`eventemitter3` 这类 CJS 依赖内联进 ESM 执行，报
   `require is not defined` / `Class extends value undefined`。
   `astro.config.mjs` 里的 `vite.resolve.alias` 已把 `picomatch` 指向 ESM 垫片，
   但后面还有别的 CJS 包，属于工具链兼容问题。
   **改完内容用 `npm run build && npm run preview` 看效果即可**（构建 12 秒）。