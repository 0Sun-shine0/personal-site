---
title: Go 服务 P99 抖动，先别急着换语言
description: 从 38ms 抖到 4.2ms 的完整排查过程：怎么用 pprof 定位、三类最常见的原因（热路径分配、锁竞争、GOMAXPROCS 与容器限额不匹配），以及每一步怎么验证效果。
date: 2026-07-18
tags: [Go, 性能, pprof]
minutes: 9
---

去年我们撮合服务的延迟出了个很典型的毛病：**压测环境 P99 只有 4ms，一到大行情就跳到 38ms，而且每分钟要抖几次。**

第一次看到这个图，我的第一反应和大多数人一样：Go 的 GC 不行，要不要重写成 C++？后来发现，这个念头差点让我白干两个月。

## 先量，别猜

排查延迟问题我只信三样东西：火焰图、运行时指标、压测对比。

Go 自带的方式是把 pprof 挂上：

```go
import _ "net/http/pprof"

go func() {
    // 生产环境记得绑内网地址，别暴露到公网
    log.Println(http.ListenAndServe("127.0.0.1:6060", nil))
}()
```

然后抓 30 秒的 CPU 样本：

```bash
go tool pprof -http=:8080 'http://127.0.0.1:6060/debug/pprof/profile?seconds=30'
```

但**光看 CPU 是不够的**  延迟抖动很多时候 CPU 占用并不高。这时候要看运行时指标：

```go
import "runtime/metrics"

// 关注这两个：
//   /gc/pauses:seconds        GC 停顿分布
//   /sched/latencies:seconds  调度延迟分布
samples := []metrics.Sample{
    {Name: "/gc/pauses:seconds"},
    {Name: "/sched/latencies:seconds"},
}
metrics.Read(samples)
```

这两个指标把方向直接分成了两半：GC 停顿高  内存问题；调度延迟高  CPU 配额或者锁的问题。

## 真凶一：热路径上的分配

火焰图上第一眼看到的是 `runtime.mallocgc` 占了 18%。顺着调用链找上去，是订单结构体在每次撮合时都重新分配：

```go
// 改之前：每笔订单都分配
func (e *Engine) onOrder(raw []byte) {
    od := &Order{}          // 一秒钟几万个
    od.Decode(raw)
    e.match(od)
}
```

订单结构体不小（带价格档位和标记位），一秒几万个对象，GC 就被推着一直跑。改成从预先分配的环形缓冲里取：

```go
// 改之后：零分配
func (e *Engine) onOrder(raw []byte) {
    od := e.pool.Next()      // 预分配数组 + 游标，无锁
    od.Decode(raw)           // Decode 内部复用已有切片
    e.match(od)
    od.Reset()
}
```

验证方式不用猜，压测时看 `-benchmem`：

```bash
go test -run '^$' -bench BenchmarkMatch -benchmem
# 改之前: 480 ns/op   768 B/op   9 allocs/op
# 改之后: 121 ns/op     0 B/op   0 allocs/op
```

这一步把 P99 从 38ms 压到 19ms 左右，抖动频率明显下降，但还没根治。

## 真凶二：保护整个订单簿的那把锁

撮合引擎里我们用一把 `sync.Mutex` 保护订单簿。行情不激烈时没人抢，一到大行情，所有 goroutine 都堵在这把锁上。

锁的问题不能靠 CPU 火焰图看，要用互斥锁 profile：

```go
runtime.SetMutexProfileFraction(1)   // 生产上采样率调低一点，开销不小
```

```bash
go tool pprof -http=:8080 'http://127.0.0.1:6060/debug/pprof/mutex'
```

结论很清楚：`match` 阶段的锁等待占了 34%。解法是按价格档位分段，只锁当前档位：

```go
// 改之前：一把大锁
e.mu.Lock()
e.book.Match(od)
e.mu.Unlock()

// 改之后：按档位分段，同档位才互斥
shard := e.shards[od.Price>>6 & (shardCount-1)]
shard.mu.Lock()
shard.Match(od)
shard.mu.Unlock()
```

P99 到 11ms。到这一步我已经很满意了，但线上还有偶发的尖刺。

## 真凶三：GOMAXPROCS 和容器限额不一致

最后这个问题最阴，也最常见。

我们的容器限制是 4 核，但 `GOMAXPROCS` 读的是**宿主机的 CPU 数**  那一批机器是 64 核。也就是说 Go 调度器以为自己有 64 个 P，开了 64 个并行任务去抢 4 核的配额。

证据在调度延迟指标里：`/sched/latencies:seconds` 的 P99 高达 20ms 以上。CPU 使用率反而不高，因为大量时间花在等配额和线程切换上。

改法是一行：

```go
import _ "go.uber.org/automaxprocs"   // 自动按 cgroup 限额设置 GOMAXPROCS
```

或者直接在部署里加环境变量：

```yaml
env:
  - name: GOMAXPROCS
    value: "4"
```

就这一行，P99 从 11ms 掉到 **4.2ms**，尖刺基本消失。

## 各路改动的效果

| 改动 | P99 | 说明 |
| --- | --- | --- |
| 基线 | 38ms | 每分钟抖几次 |
| 热路径零分配 | 19ms | 分配次数 9  0 |
| 锁分段 | 11ms | 锁等待从 34% 降到 6% |
| GOMAXPROCS 对齐 | 4.2ms | 调度延迟 P99 20ms  0.4ms |

## 反思

我一开始想整体重写成 Rust，还写了一版原型。两周后做了 profiling，发现瓶颈集中在三个函数里  换语言大概能把最后那 4ms 再压一半，但前面这 34ms 跟语言没关系。

后来我给自己定了条规矩：**延迟问题在拿到火焰图和运行时指标之前，不许讨论技术选型。**

## 排查清单

遇到 P99 抖动时我会按顺序过一遍：

1. 抓 30 秒 CPU profile，看 `runtime.mallocgc` 占比是否异常。
2. 打开 mutex profile，看锁等待占比。
3. 读 `/gc/pauses:seconds`：停顿是不是长尾。
4. 读 `/sched/latencies:seconds`：调度延迟是否超过 1ms。
5. 对比 `GOMAXPROCS` 和容器 CPU 限额。
6. 最后才看代码里有没有明显的 O(n) 扫描。