// ===========================================================================
// 站点配置 —— 内容都从这里来，改这一个文件就能改整站
// 注意：下面的联系方式是公开信息（会出现在页面源码里），换号记得同步改这里
// ===========================================================================

export const site = {
  name: '颐安',
  initials: 'YA',
  role: 'AI Agent 学习与实践',
  tagline: '在做东西里学习 AI Agent',
  headline: '我在接触 AI Agent，',
  headlineAccent: '小爪助手是我边学边做的成果。',
  intro:
    '我在武汉，正在接触和学习 AI Agent。小爪助手是我把工具调用、屏幕识别、权限和上下文这些概念真正做起来的一个成果；我把项目克隆下来，边运行、边学习、边整理。这里主要记录这条路上的项目和问题。',
  location: '湖北武汉',
  email: 'maaikk@126.com',
  qq: '920422927',
  wechat: 'M2XWYMM',
  github: 'https://github.com/0Sun-shine0',
  status: '最近在继续学习和整理小爪助手',
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
  'OpenCV', 'MoviePy', 'PowerShell', 'Git', 'Windows',
];

// 主推作品：完整四段式
export const featured = [
  {
    idx: '01',
    title: '小爪助手 · 我的 Agent 学习成果',
    summary:
      '接触 AI Agent 之后，我把小爪助手克隆下来作为主要的学习项目。它表面上是一只桌面宠物，里面练习的是工具调用、屏幕识别、键鼠操作、权限确认和上下文管理。',
    problem:
      '我不想只停留在看概念和聊天演示，想把 Agent 真正放进一个能运行的桌面工具里。小爪助手刚好把模型、工具、界面和本地数据放在了同一个项目里。',
    approach:
      '我从工具调用开始，一点点看懂屏幕识别、键鼠操作、权限确认和上下文管理是怎么连起来的。待办、番茄钟、提醒和便签保持离线运行，数据只存本机；AI 能力单独接入，不影响基础功能。',
    result:
      '把项目克隆下来后，我用 14 天提交了 81 次，整理到 v2.4.0。现在项目有 <b>150 个 Python 文件、4.1 万行代码</b>，QML 还有 <b>27 个文件、1 万行左右</b>；打包、安装和卸载也整理成了一条命令，发布前会跑完 <b>107 个自测脚本</b>。',
    lesson:
      '小爪让我看到，学习 Agent 不只是把模型接上：宠物每次启动回到原位、待办超过 5 条看不见、双击开出两只、写 JSON 时可能丢数据，这些都是真实体验的一部分。模型能不能调用工具只是开始，工具是否可靠同样重要。',
    metrics: ['v2.4.0', '14 天 81 次提交', '4.1 万行 Python', '运行依赖只有 1 个'],
    tags: ['Python', 'PySide6', 'Qt Quick / QML', 'PyInstaller'],
    link: 'https://github.com/0Sun-shine0/PawPet',
  },
  {
    idx: '02',
    title: 'T2Video-DCOT · 把诗词做成视频',
    summary:
      '输入一首古诗词，先拆成分镜，再逐镜生成图像和视频，最后拼成一段完整的片子。这个项目 2024 年就开始写了，后来才补上 Git、模块拆分和测试。',
    problem:
      '一首诗里经常塞着好几个画面，直接生成很容易只得到一个模糊的大概。镜头之间还会丢掉主体，画面糊了、几乎不动，程序却可能把它当成成功。',
    approach:
      '我把诗拆成场景单元，分镜数量跟意象多少走：内容太少就合并，太密就拆开。每一镜都会带上前一镜已经确定的画面状态，生成后立即做检查；没通过只重试一轮，不让同一个镜头无限消耗额度。',
    result:
      '原来是一个 <b>2207 行的单文件</b>，重构后拆成 <b>8 个模块</b>，补了 <b>230 个测试函数、294 个用例和 303 条断言</b>。一致性检查换成了 <b>6 项可计算指标</b>，还修掉了 <b>8 个实际缺陷</b>。重构时也顺手发现，原来的依赖文件编码和内容都不对，照着安装根本跑不起来。',
    lesson:
      '这次最值得记的不是拆模块，而是把“看起来像验证”的东西真的拿出来验证。原来的检查把轮廓数量和关键词数量硬放在一起，界面还写了代码里不存在的“物理验证”。另外，启动时清理整个系统临时目录也被我删掉了：一个视频工具不该替别的程序做清理。',
    metrics: ['2207 行 → 8 个模块', '230 个测试函数', '6 项一致性指标', '修掉 8 个缺陷'],
    tags: ['Python', 'DeepSeek API', '火山视觉 API', 'OpenCV'],
    link: 'https://github.com/0Sun-shine0/T2Video-DCOT',
  },
];

// 其他作品：轻量卡片
export const projects = [
  {
    idx: '03',
    title: '桌面操作员',
    subtitle: '把自然语言变成一连串鼠标和键盘操作，也让我第一次认真考虑“权限”这件事。',
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
      '这是我第一次让程序替人操作电脑。识别部分做得还可以，但真正难的是让人放心把键鼠交出去。后来小爪助手里的权限分级，就是从这里开始的。',
    link: 'https://github.com/0Sun-shine0/AI-computer-desk-operator',
  },
  {
    idx: '04',
    title: 'DeepSeek Reasonix GUI',
    subtitle: '给 Reasonix CLI 做的 Electron 图形界面，试着把命令行里的工作流放进窗口里。',
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
      '做完之后发现，完整复刻 CLI 的功能并不划算。一个新窗口不一定能改善原来的工作流，真正有用的功能应该出现在用户已经在做的事情里。',
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

// 关注过的开源项目：一行一条
// ---------------------------------------------------------------------------
// 关注过的开源项目：这些**不是我的作品**，是学习阶段关注过的项目，
// fork 到自己账号里方便查阅。署名与版权属于原作者，
// 所以链接一律指向上游仓库，不指向我的 fork。
// ---------------------------------------------------------------------------
export const followedProjects = [
  {
    title: 'OnlineBooks · Java 图书管理系统',
    by: 'GongShengyue',
    desc: 'JSP + Servlet + Tomcat 9 + MySQL 的图书管理课程项目：开借书服务、登记图书、登记借出。上游 543 stars。',
    link: 'https://github.com/GongShengyue/OnlineBooks',
  },
  {
    title: 'LibraryManager · 图书馆管理系统',
    by: 'uboger',
    desc: 'Java AWT（不是 Swing）+ Access 数据库，需要 32 位 JDK 才能跑。2016 年创建的项目，上游 349 stars。',
    link: 'https://github.com/uboger/LibraryManager',
  },
  {
    title: 'hd_django_sever · 小程序后端基础架构',
    by: 'Bruce-7',
    desc: 'Django 后端脚手架：用户体系、后台管理、API 文档、统一响应体、异常集中处理、JWT、日志与 Sentry。MIT 许可。',
    link: 'https://github.com/Bruce-7/hd_django_sever',
  },
  {
    title: 'YiTiTong · 艺体通抢课脚本',
    by: 'SakuraPuare',
    desc: '给 HBUAS 的同学写的艺体通抢课脚本，一个很小但完整的 Python 自动化脚本。',
    link: 'https://github.com/SakuraPuare/YiTiTong',
  },
];

// 统一的日期显示
export const fmtDate = (d: unknown) => new Date(d as string).toISOString().slice(0, 10);
