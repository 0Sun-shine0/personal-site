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
    '我的方式不是刷教程，而是「边做边学」 —— 每学一个概念就把它做成一个真能跑起来的东西。小爪助手是目前的成果产出：一个「装完就能用」的桌面助手，待办、番茄钟、提醒、便签完全离线，AI 操作是可选的加成而不是门槛。',
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
  'TypeScript', 'Vite', 'DeepSeek API', 'MCP', 'PyAutoGUI', 'UI Automation', 'OpenCV',
  'MoviePy', 'PowerShell', 'R', 'Django', 'Java',
];

// 主推作品：完整四段式
export const featured = [
  {
    idx: '01',
    title: '小爪助手 · 常驻桌面的小助手',
    summary:
      '宠物只是它的脸。真正在干活的是待办、番茄钟、提醒、便签四件套 —— 完全离线、不用注册、数据只存本机；AI（看屏幕、替你点键鼠）是可选加成，配不配 API Key 都完整可用。',
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
  {
    idx: '02',
    title: 'T2Video-DCOT · 把一首诗词变成一段视频',
    summary:
      '给一首中国古典诗词生成一段连贯的视频：语言模型先把诗拆成分镜单元，再逐镜生成图像与视频片段，每一镜生成后做一致性验证，没通过的按失败原因修正后重生成，最后拼接成片。这个项目 2024 年动手写，当时没用版本控制；2026-02 为了重构先提交了一份备份，2026-09 才拆成模块。',
    problem:
      '文生视频有三个地方最容易露馅：一句诗里挤了好几个意象，模型只能画出个大概；镜头之间主体丢失，看着像换了部片子；生成完没人检查，画面糊了、几乎静止、亮度突变，程序也照样算成功。',
    approach:
      '用「动态思维链」把诗拆成可分镜的场景单元，关键是分镜数不固定：意象少于 2 个的相邻句合并（单独成镜画面信息量太低），超过 4 个的拆两镜。每一镜的提示词都携带前一镜已确定的画面状态，形成承接；每一镜生成后做跨媒体一致性验证，未通过就按失败原因生成修正要求再重生成，形成带反馈的链条。',
    result:
      '原本是一个 <b>1169 行的单文件</b>，方法逻辑、界面、接口调用全混在一起；而且文件是 UTF-16 编码，<b>别人 clone 下来根本跑不起来</b>。重构后拆成 <b>8 个模块</b>（分镜 / 提示词 / 视觉接口 / 拼接 / 验证 / 界面 / 账户 / 参数），补了 <b>230 个测试函数</b>、306 条断言，一致性验证做成 <b>6 项可计算指标</b>，并修掉 6 个影响实际功能的缺陷。',
    lesson:
      '验证指标上做了两处刻意的放弃：细节强度不用全局拉普拉斯方差 —— 水墨写意本来就大量留白，全局方差会把正常作品误判为模糊，改成统计边缘能量最强的分块；亮度连续性不用直方图相关系数 —— 低方差图像上那个系数会病态归零。最该修的一个缺陷是资源清理：它会递归遍历系统临时目录、删掉所有超过 24 小时的文件，而且在启动时自动跑。',
    metrics: ['1169 行 → 8 个模块', '230 个测试函数', '6 项一致性指标', '修掉 6 个缺陷'],
    tags: ['Python', 'DeepSeek API', '火山视觉 API', 'OpenCV'],
    link: 'https://github.com/0Sun-shine0/T2Video-DCOT',
  },
];

// 其他作品：轻量卡片
export const projects = [
  {
    idx: '03',
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
    idx: '04',
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