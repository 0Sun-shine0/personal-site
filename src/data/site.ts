// ===========================================================================
// 站点配置  上线前只需要改这个文件
// ===========================================================================

export const site = {
  name: '林默',
  nameEn: 'Lin Mo',
  initials: 'LM',
  role: '后端工程师',
  tagline: '专注高并发交易系统的性能优化',
  email: 'hi@linmo.dev',          // 改这里
  github: 'https://github.com/linmo',
  x: 'https://x.com/linmo_dev',
  location: '杭州',
  status: '在职  开放远程合作',
  // 首页那句话说清你是谁、帮谁、做什么
  headline: '我写 Go 和 PostgreSQL，',
  headlineAccent: '让交易系统在高压下不掉链子。',
  intro:
    '8 年后端经验，做过撮合、清算、对账。我把踩过的坑写成能直接抄的排查笔记，帮刚接手存量系统的同行少加几个班。',
};

export const navItems = [
  { href: '/projects', label: '作品' },
  { href: '/blog', label: '文章' },
  { href: '/about', label: '关于' },
  { href: '/now', label: '现在' },
  { href: '/uses', label: '装备' },
];

export const stats = [
  { num: '8 年', label: '后端 / 分布式' },
  { num: '34k', label: '单机 QPS 峰值' },
  { num: '4.2ms', label: 'P99 延迟' },
];

// 首页跑马灯
export const techStack = [
  'Go', 'PostgreSQL', 'Redis', 'Kafka', 'gRPC', 'ClickHouse',
  'Kubernetes', 'Prometheus', 'OpenTelemetry', 'Linux', 'etcd', 'Grafana',
];

// 作品的「四段式」：问题 / 方案 / 结果 / 反思
export const projects = [
  {
    idx: '01',
    title: '撮合引擎热路径重构',
    summary: '行情突发行情下延迟抖动、偶发丢单，最后定位到热路径上的对象分配和一把大锁。',
    problem:
      '单机撮合 P99 抖动到 38ms，行情突发行情下偶发丢单。压测能过，但一到大行情就顶不住。',
    approach:
      '把订单簿换成数组索引 + 无锁环形队列，热路径零分配；锁按价格档位分段，热点账户单独走快速路径。',
    result:
      'P99 从 <b>38ms 降到 4.2ms</b>，GC 停顿次数 -97%，单机峰值从 8k 提到 <b>34k QPS</b>。',
    lesson:
      '一开始我打算整体重写成 Rust，两周后 profiling 发现瓶颈只集中在 3 个函数里。先量再改。',
    metrics: ['P99 -89%', 'GC 停顿 -97%', 'QPS 4.2'],
    tags: ['Go', 'pprof', '无锁队列'],
  },
  {
    idx: '02',
    title: '对账系统：6 小时压到 22 分钟',
    summary: '每日对账跑到天亮，出差异还要人工翻流水。改成账期切片并行 + 差异自动归因。',
    problem:
      '对账任务串行执行，凌晨开始跑到上午才结束；一旦有差异，人工翻流水定位平均要 3 小时。',
    approach:
      '按账期切片并行计算，SQL 窗口函数做差异定位，差异按 6 类规则自动归因并生成排查线索。',
    result:
      '全量对账 <b>22 分钟</b>跑完，人工排查从 3 小时/天降到 20 分钟以内。',
    lesson:
      '并行度一开始开到 32，把数据库 IO 打满，整体反而更慢。最后定在 8，配合限流才稳。',
    metrics: ['耗时 -94%', '人工排查 -89%', '差异自动归因 6 类'],
    tags: ['PostgreSQL', '窗口函数', '任务编排'],
  },
  {
    idx: '03',
    title: '一条命令起本地全栈环境',
    summary: '新人配环境要两天，写了个 CLI 把依赖、迁移、种子数据全包了。',
    problem:
      '新人入职要手动装 7 个服务、跑一堆迁移脚本，平均两天才能跑起来，中间全靠老人口述。',
    approach:
      '用 Go 写 CLI，封装 docker compose、依赖健康检查、迁移和种子数据，失败时给出可操作的报错。',
    result:
      '本地环境 <b>30 分钟</b>可跑通，新人上手从 2 天缩到半天。',
    lesson:
      '文档写得太晚，前十来个同事还是得靠我口述。工具和文档应该一起交。',
    metrics: ['上手 2 天  半天', '7 个服务一条命令', '新人覆盖 20+'],
    tags: ['Go', 'Docker', 'DX'],
  },
];
// 统一的日期显示：无论 frontmatter 里是字符串还是 Date 对象，都输出 YYYY-MM-DD
export const fmtDate = (d: unknown) => new Date(d as string).toISOString().slice(0, 10);