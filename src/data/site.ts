// ===========================================================================
// 站点配置 —— 内容都从这里来，改这一个文件就能改整站
// 注意：下面的联系方式是公开信息（会出现在页面源码里），换号记得同步改这里
// ===========================================================================

export const site = {
  name: '颐安',
  initials: 'YA',
  role: 'AI',
  tagline: '做出来的东西都真的能跑',
  headline: '在学 AI Agent，',
  headlineAccent: '在做桌面工具。',
  intro:
    '这里放我做过的项目和踩过的坑，偶尔也折腾点别的。',
  location: '湖北武汉',
  email: 'maaikk@126.com',
  qq: '920422927',
  wechat: 'M2XWYMM',
  github: 'https://github.com/0Sun-shine0',
  status: '最近在给小爪助手补自动更新',
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
  { num: '两周', label: '88 次提交' },
  { num: '2.1 万行', label: '应用代码' },
  { num: '1 个', label: '运行依赖' },
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
    title: '小爪助手 · 我主导做的桌面工具',
    summary:
      '本质是个住在你桌面上的小宠物。宠物只是它的皮囊，背地里是个干活的工具 —— 待办、番茄钟、提醒、便签都有。不用注册也不联网，数据全搁在本机；AI 功能你不配也能跑，完全不影响日常使用。',
    problem:
      '想给自己做个天天会用的桌面助手。找了一圈，合适的不好找：要么只有一只宠物、什么也不解决；要么是个 AI 壳子，第一次打开就卡在「还没配置模型」上。',
    approach:
      '所以先把待办、番茄钟、提醒、便签做成完全不依赖网络和密钥，AI 单独一层。界面用 PySide6 + Qt Quick 重写过一遍 —— 第一版是 tkinter 写的，画不出不带锯齿的圆角。',
    result:
      '9 月 14 日开工，两周提交了 <b>88 次</b>，做到 v2.4.0。代码量涨得挺快：<b>37 个 Python 文件大概 2.1 万行</b>，又写了 <b>108 个自测脚本大概 2.9 万行</b>；界面用了 <b>28 个 QML 文件约 1.1 万行</b>。运行时极其干净，只依赖一个 PySide6-Essentials。打包、安装、卸载被我串成了一条命令，每次发布前自动把自测跑一遍。',
    lesson:
      '做下来最花时间的不是功能，是那些用起来别扭的地方：宠物一重启就回原位、待办超过 5 条看不见、双击两次开出两只、写 JSON 写到一半崩了会丢数据。模型能不能调工具只是开头，工具本身靠不靠得住是后面的活。',
    metrics: ['v2.4.0', '两周 88 次提交', '2.1 万行应用代码', '运行依赖只有 1 个'],
    tags: ['Python', 'PySide6', 'Qt Quick / QML', 'PyInstaller'],
    link: 'https://github.com/0Sun-shine0/PawPet',
  },
  {
    idx: '02',
    title: 'T2Video-DCOT · 把诗词做成视频',
    summary:
      '输入一首古诗词，拆成分镜，逐镜生成图像和视频，最后拼成一段片子。2024 年动手写的，一直没进版本控制；2026 年补上 Git，随后把 2207 行的单文件拆成 8 个模块、加上测试。',
    problem:
      '一首诗里常常塞着好几个画面，直接丢给模型只会得到一个模糊的大概；镜头之间还会丢主体。更麻烦的是画面糊了、几乎不动，程序却当成生成成功。',
    approach:
      '把诗拆成场景单元，分镜数量跟着意象走：太少就合并，太密就拆开。每一镜带上上一镜已经定下来的画面，生成完立刻检查，没过只重试一轮 —— 同一个镜头反复重试太烧额度。',
    result:
      '重构前，这玩意儿是个 <b>2207 行</b>的单文件：方法逻辑、UI 和接口全糊在一起。拆成 <b>8 个模块</b>后，顺手补了 <b>230 个测试函数、294 个用例、303 条断言</b>；之前的一致性检查就是「看起来像在验证」，后来被我换成了 <b>6 项能算出来的指标</b>；顺便清掉 <b>10 处</b>问题。最离谱的一个：程序启动时竟然会去删系统临时目录里超过 24 小时的文件。',
    lesson:
      '最值得记的不是拆模块，是把「看起来像验证」的东西真换成了验证。原来那段拿轮廓个数去比关键词个数 —— 这两个数没有任何可比性；界面上写着「物理验证」，代码里根本没这回事。后来我把这类规矩写成了代码卫生测试（禁止 print、禁止裸 except、禁止横幅注释），第一次跑就抓出我自己刚写的 9 处 —— 靠自觉真的不行。',
    metrics: ['2207 行 → 8 个模块', '294 个测试用例', '303 条断言', '清掉 10 处问题'],
    tags: ['Python', 'DeepSeek API', '火山视觉 API', 'OpenCV'],
    link: 'https://github.com/0Sun-shine0/T2Video-DCOT',
  },
];

// 其他作品：轻量卡片
export const projects = [
  {
    idx: '03',
    title: '桌面操作员',
    subtitle: '把一句话变成一连串鼠标和键盘操作。做它的时候第一次认真想「权限」这件事。',
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
      '第一次让程序替我操作电脑。识别部分做得还行，但真正难的是让人放心把键鼠交出去 —— 后来小爪助手里的权限分级，是从这儿开始的。',
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
      '做完发现，把 CLI 那一套在窗口里复刻一遍并不划算。多开一个窗口，不会让人多出一个工作流 —— 真正用得上的功能得长在你本来就在用的流程里。',
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
      '理由很朴素：每次帮同事清 C 盘都要重复同一套动作。手重复到第三遍的时候，就该写脚本了。',
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
