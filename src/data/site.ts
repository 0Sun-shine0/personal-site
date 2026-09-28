// ===========================================================================
// 站点配置 —— 内容都从这里来，改这一个文件就能改整站
// 注意：下面的联系方式是公开信息（会出现在页面源码里），换号记得同步改这里
// ===========================================================================

export const site = {
  name: '颐安',
  initials: 'YA',
  role: 'AI Agent 学习与实践',
  tagline: '边学边做，把每个概念都做成能跑的东西',
  headline: '我在学 AI Agent，',
  headlineAccent: '学到的东西都做成了能跑的成品。',
  intro:
    '我的方式不是刷教程，而是「边做边学」 每学一个概念就把它做成一个真能跑起来的东西。小爪助手是目前的成果产出：一个「装完就能用」的桌面助手，待办、番茄钟、提醒、便签完全离线，AI 操作是可选的加成而不是门槛。',
  location: '湖北武汉',
  email: 'maaikk@126.com',
  qq: '920422927',
  wechat: 'M2XWYMM',
  github: 'https://github.com/0Sun-shine0',
  status: '在用 14 天把小爪助手推到 v2.4.0',
};

// 联系方式：页面上的复制按钮和「联系我」卡片都用这一份，改一处即可
export const contacts = [
  { key: 'email', label: '邮箱', value: 'maaikk@126.com', icon: 'mail' },
  { key: 'wechat', label: '微信', value: 'M2XWYMM', icon: 'wechat' },
  { key: 'qq', label: 'QQ', value: '920422927', icon: 'chat' },
];

export const navItems = [
  { href: '/projects', label: '作品' },
  { href: '/blog', label: '笔记' },
  { href: '/about', label: '关于' },
  { href: '/now', label: '现在' },
  { href: '/uses', label: '装备' },
];

export const stats = [
  { num: 'v2.4.0', label: '小爪助手当前版本' },
  { num: '4.1 万行', label: 'Python（小爪助手）' },
  { num: '107 个', label: '自测脚本' },
];

// 首页跑马灯
export const techStack = [
  'Python', 'PySide6', 'Qt Quick / QML', 'PyInstaller', 'Electron', 'React',
  'TypeScript', 'Vite', 'DeepSeek API', 'MCP', 'PyAutoGUI', 'UI Automation',
  'PowerShell', 'R', 'Django', 'Java',
];

// 主推作品：完整四段式
export const featured = [
  {
    idx: '01',
    title: '小爪助手 — 常驻桌面的小助手',
    summary:
      '宠物只是它的脸。真正在干活的是待办、番茄钟、提醒、便签四件套 — 完全离线、不用注册、数据只存本机；AI（看屏幕、替你点键鼠）是可选加成，配不配 API Key 都完整可用。',
    problem:
      '给自己做个桌面助手，但市面上的选择很极端：要么只有一只宠物、不解决任何实际问题；要么是个配好一堆东西才能跑的 AI 壳子，新用户第一次打开就卡在「还没有配置模型」上，然后关掉。',
    approach:
      '把「装完就能用」当第一原则：四个核心功能完全不联网、数据全部落在自己电脑上，AI 单独成层、没配也能用。界面上用 PySide6 + Qt Quick/QML 做 GPU 渲染的矢量画面（真圆角、真阴影、60fps 缓动），而不是 tkinter 那种带锯齿的 GDI 线条。宠物有 4 套形象可随时切换。',
    result:
      '14 天 81 次提交做到 v2.4.0：Python <b>150 个文件 4.1 万行</b>、QML <b>27 个文件 1 万行</b>，而运行依赖只有 <b>一个</b>（PySide6-Essentials）。一条命令产出单文件安装程序（约 120MB）和绿色版；安装向导、卸载器都是用 tkinter 自己写的，不依赖 Inno Setup。打包前会先跑 <b>107 个自测脚本</b>（其中 50 个是回归测试），不通过就不出包。',
    lesson:
      '最早的版本是 tkinter 写的：宠物坐标写死（每次启动都回原位）、待办只渲染最后 5 条（第 6 条看不见也删不掉）、双击启动两次会出现两只猫、直接覆盖写 JSON（写一半崩了就丢数据）。重写一遍之后我的结论是 —— 桌面工具的难点从来不是功能，而是「装完就能用」和「数据不会丢」这两件枯燥的事。',
    metrics: ['v2.4.0', '14 天 81 次提交', '4.1 万行 Python', '运行依赖只有 1 个'],
    tags: ['Python', 'PySide6', 'Qt Quick / QML', 'PyInstaller'],
    link: 'https://github.com/0Sun-shine0/PawPet',
  },
];

// 其他作品：轻量卡片
export const projects = [
  {
    idx: '02',
    title: 'AI 智能桌面操作员',
    subtitle: '用自然语言指挥电脑：DeepSeek 拆解任务，CNN 看屏幕，然后真的去点鼠标键盘。',
    points: [
      'DeepSeek API 做自然语言理解与任务分解',
      '增强 CNN 模型分析屏幕内容、识别 UI 元素',
      '鼠标点击 / 键盘输入 / 拖拽 / 滚轮',
      '复杂任务的自动化工作流（如文档写作）',
      'PyQt6 图形界面；训练脚本支持 AMP 混合精度与 checkpoint 续训',
    ],
    stack: ['Python', 'PyQt6', '视觉模型', 'DeepSeek API'],
    stat: '2024-06 起，迭代到现在',
    status: '持续迭代中',
    note:
      '这是我第一次做「让 AI 操作电脑」。识别这块做得还行，但它没回答一个更根本的问题：用户凭什么敢把键鼠交出去？这个坑后来长成了小爪助手的权限分级。',
    link: 'https://github.com/0Sun-shine0/AI-computer-desk-operator',
  },
  {
    idx: '03',
    title: 'DeepSeek Reasonix GUI',
    subtitle: '给 DeepSeek 原生的编程 Agent（Reasonix CLI）套一个 Electron 桌面图形界面。',
    points: [
      '可视化 Chat 与会话管理：创建 / 切换 / 重命名 / 删除',
      '工作区文件树、代码 Diff 预览、内嵌 xterm.js 终端',
      'MCP 服务器、Skills、Memory 三块管理面板',
      'Plan → Checkpoint → Revision 的审批流程可视化',
      'K 命令面板、明暗主题、Jobs 状态栏、token 上下文面板',
    ],
    stack: ['Electron 35', 'React 19', 'TypeScript 5', 'Vite 5'],
    stat: '5 stars，主体 3 天写完',
    status: '半成品（README 里我自己这么写的）',
    note:
      '做完的结论有点反直觉：把 CLI 的能力清单在 GUI 里复刻一遍，性价比并不高。Agent 真正被需要的位置是用户已有的工作流里，而不是多开一个窗口。',
    link: 'https://github.com/0Sun-shine0/DeepSeek_Reasonix_GUI',
  },
  {
    idx: '04',
    title: 'T2Video-DCOT · 文生视频',
    subtitle: '基于动态思维链（DCOT）的文生视频：文本 → 三层解析 → 图像序列 → 视频。',
    points: [
      '意象层 / 物理层 / 风格层三层深度解析',
      'DeepSeek API 解析文本，字节跳动视觉 API 生成图像',
      '内置物理规律校验 — 运动要符合真实物理法则',
      '跨媒体一致性检查：文本、图像、视频三者风格对齐',
      'MoviePy 本地高质量拼接，自动清理临时资源',
    ],
    stack: ['Python', 'tkinter', 'MoviePy', 'DeepSeek API'],
    stat: '1 star · MIT',
    status: '研究性项目',
    note:
      '我最想验证的一点是把「物理规律」写进生成流程：视频生成最容易露馅的地方，就是物体不守物理。一致性和物理约束比单纯的画质更影响能不能用。',
    link: 'https://github.com/0Sun-shine0/T2Video-DCOT',
  },
  {
    idx: '05',
    title: 'C 盘清理工具',
    subtitle: '一个 PowerShell 脚本，清掉那些删了没风险、攒着能占几个 G 的东西。',
    points: [
      '临时文件夹、Windows 更新缓存、回收站',
      'Chrome / Edge 浏览器缓存',
      'Windows 日志与 Prefetch',
      '逐项打印清理结果，只动临时文件和缓存',
    ],
    stack: ['PowerShell', 'Windows 10 / 11'],
    stat: '1 star · MIT',
    status: '完成，日常在用',
    note:
      '写它的理由很朴素：每次帮同事清 C 盘都要重复一模一样的一套动作。手重复第三遍的时候就该写脚本了。',
    link: 'https://github.com/0Sun-shine0/c-drive-cleanup',
  },
];

// 早期作品：一行一条
export const earlyWork = [
  {
    year: '2024',
    title: 'YiTiTong · 艺体通抢课脚本',
    desc: '给还在学校的同学写的抢课脚本，1 star —— 收过最好笑的 star。',
    stack: ['脚本'],
    link: 'https://github.com/0Sun-shine0/YiTiTong',
  },
  {
    year: '2022',
    title: 'hd_django_sever · 小程序后端基础架构',
    desc: 'Django 做的后端脚手架：内置用户体系、后台管理、API 文档、统一响应体、异常集中处理、JWT、日志与 Sentry。MIT，1 star。',
    stack: ['Django', 'Python'],
    link: 'https://github.com/0Sun-shine0/hd_django_sever',
  },
  {
    year: '2023',
    title: 'OnlineBooks · 图书管理系统',
    desc: 'JSP + Servlet + Tomcat 9 + MySQL 的课程项目：开借书服务、登记图书、记录借出。',
    stack: ['Java', 'JSP', 'MySQL'],
    link: 'https://github.com/0Sun-shine0/OnlineBooks',
  },
  {
    year: '2018',
    title: 'LibraryManager · 图书馆管理系统',
    desc: 'Java AWT（不是 Swing）+ Access 数据库，还得用 32 位 JDK 才能跑。我最早的仓库，1 star。',
    stack: ['Java', 'Access'],
    link: 'https://github.com/0Sun-shine0/LibraryManager',
  },
];

// 统一的日期显示
export const fmtDate = (d: unknown) => new Date(d as string).toISOString().slice(0, 10);