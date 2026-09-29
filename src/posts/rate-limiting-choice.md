---
title: 四种限流算法，我为什么选了最笨的那个
description: 固定窗口、滑动窗口、令牌桶、漏桶  四种都写过之后，我在项目里用的是看起来最简陋的固定窗口计数器。原因是它只需要回答一个问题：这 60 秒里我还能发几次。
date: 2024-08-11
tags: [算法, 限流, Python]
minutes: 9
---

我用的视觉生成接口有配额限制：**每分钟最多 N 次请求。** 超了会返回错误，而且重试还会把额度烧得更快。

所以得自己限流。四种经典算法我都写过一遍，最后留在项目里的是**看起来最简陋的那个**。这篇讲每种方法的问题在哪，以及为什么「笨」的方案反而合适。

## 先说结论

```python
class Throttle:
    """每分钟请求数上限。窗口内超了就等到窗口结束，不做排队堆积。"""

    def __init__(self, per_minute=None, sleep=time.sleep):
        self.per_minute = per_minute or settings.REQUESTS_PER_MINUTE
        self._sleep = sleep
        self._lock = threading.Lock()
        self._used = 0
        self._since = time.monotonic()

    def wait(self):
        """取一个请求名额；窗口已满则阻塞到窗口结束再取。"""
        while True:
            with self._lock:
                elapsed = time.monotonic() - self._since
                if elapsed >= 60:
                    self._used = 0
                    self._since = time.monotonic()
                    elapsed = 0.0
                if self._used < self.per_minute:
                    self._used += 1
                    return
                remaining = 60 - elapsed
            LOGGER.info("已达每分钟请求上限，等待 %.1fs", remaining)
            self._sleep(max(remaining, 0.0))
```

**固定窗口计数器。** 一个计数器、一个窗口开始时间、一把锁，二十行。

下面说为什么不是另外三种。

## 令牌桶：最精确，但有个代价我付不起

令牌桶的思路很漂亮：桶里以固定速率生成令牌，每个请求消耗一个，桶空就等。

```python
class TokenBucket:
    def __init__(self, rate, capacity):   # rate: 每秒几个；capacity: 桶多大
        self.rate, self.capacity = rate, capacity
        self.tokens, self.last = capacity, time.monotonic()

    def wait(self):
        while True:
            now = time.monotonic()
            self.tokens = min(self.capacity, self.tokens + (now - self.last) * self.rate)
            self.last = now
            if self.tokens >= 1:
                self.tokens -= 1
                return
            self._sleep((1 - self.tokens) / self.rate)
```

它有两个我喜欢的性质：

- **允许突发**（桶里攒了令牌可以一次用掉），这对「攒了 10 张图一起生成」的场景友好
- **长期速率严格**，不会像固定窗口那样在边界处翻倍

**为什么没用：它需要知道「速率」而不是「配额」。**

接口文档给的是「每分钟 N 次」，这是**配额**语义。要转成令牌桶的 rate，得做一次除法：`N / 60` 每秒。但这样一来：

- `N = 10` 时，rate = 0.167 令牌/秒，桶容量设多少？设 10 就允许瞬间打 10 发，可能触发服务端的并发限制
- 设小一点（比如 3），那「每分钟 10 次」的配额就用不满了

**配额是「窗口内总量」，令牌桶是「瞬时速率 + 突发容量」**  两个模型的参数对不上，我得多调一个 `capacity` 才能让它贴合文档，而这个数文档里没给。

固定窗口直接对应文档语义：**「这 60 秒里我还能发几次」**，一个数就够了。

## 滑动窗口：解决了一个我没遇到的问题

固定窗口有个著名缺陷：**边界处可能翻倍。**

假设限制是「每分钟 10 次」。如果在第 59 秒发 10 次，第 61 秒又发 10 次  这两批跨越了窗口边界，各自的窗口内都是合法的，但**实际 2 秒内发了 20 次**。

滑动窗口能解决：不按固定时间切分，而是永远看「过去 60 秒」。

```python
class SlidingWindow:
    def __init__(self, per_minute):
        self.per_minute = per_minute
        self.stamps = deque()          # 记录每次请求的时间戳

    def wait(self):
        while True:
            now = time.monotonic()
            while self.stamps and now - self.stamps[0] >= 60:
                self.stamps.popleft()   # 移除滑出窗口的
            if len(self.stamps) < self.per_minute:
                self.stamps.append(now)
                return
            self._sleep(60 - (now - self.stamps[0]))
```

它的内存是 O(N)（要存每次请求的时间戳），但 N 只有几十，无所谓。

**为什么没用：我的任务是串行批处理，不是高并发服务。**

边界翻倍这个问题的前提是「请求可能随时到达、分布不均」。而我的场景是：用户点「生成」，程序顺序地把 8 个镜头一个个发出去。**请求间隔是我自己控制的**，不会出现「第 59 秒打满 + 第 61 秒再打满」。

换句话说：滑动窗口解决的问题在我的场景里不存在。**为不会发生的情况写代码，是纯粹的负担。**

## 漏桶：最平滑，但我要的恰恰是不平滑

漏桶的核心是**恒定流出速率**  请求先进队列，然后以固定速度漏出。

```python
class LeakyBucket:
    def __init__(self, per_second):
        self.interval = 1 / per_second
        self.next_allowed = time.monotonic()

    def wait(self):
        now = time.monotonic()
        wait = max(0.0, self.next_allowed - now)
        self.next_allowed = max(now, self.next_allowed) + self.interval
        if wait > 0:
            self._sleep(wait)
```

它输出的是**完全均匀的请求流**。对网络设备来说这是优点（不冲击下游），但对我不是：

**我要的恰恰是不均匀。**

用户点了生成就去干别的了，程序应该**尽快把 8 个镜头发完**（在配额内），而不是老老实实每 6 秒发一个、拖成 48 秒。

固定窗口是这样的：前 10 个请求（配额内）**立刻发完**，第 11 个才开始等。这才是用户想要的。

## 我选了固定窗口之后，还要处理三个细节

选定了算法不等于写完了。有几处坑是实打实踩出来的：

### 一、窗口重置要在锁里，而且用单调时钟

```python
with self._lock:
    elapsed = time.monotonic() - self._since
    if elapsed >= 60:
        self._used = 0
        self._since = time.monotonic()
        elapsed = 0.0
```

两处细节：

- **重置必须在锁内**。否则两个线程可能同时判断「窗口已过」，各重置一次，`_used` 就乱了
- **用 `time.monotonic()` 不用 `time.time()`**。系统时钟被 NTP 校正或用户改时间时，`time.time()` 会跳变，而 `monotonic` 只会单调递增

### 二、等的时候要释放锁

看那段代码的缩进：

```python
with self._lock:
    # ... 判断能不能发 ...
    remaining = 60 - elapsed
#  锁在这里已经释放了
LOGGER.info("已达每分钟请求上限，等待 %.1fs", remaining)
self._sleep(max(remaining, 0.0))
```

**`sleep` 必须在 `with` 块外面。** 否则第一个线程睡 60 秒时，其他线程全堵在锁上  而它们本来也发不出去（配额满了），堵着只是浪费，还可能导致别的检查逻辑拿不到锁。

### 三、睡醒之后要重新判断，不能直接发

`wait()` 是 `while True` 循环，不是 `if`。原因是：

```python
remaining = 60 - elapsed
self._sleep(max(remaining, 0.0))
# 睡醒了，回到循环开头重新判断
```

睡醒之后**窗口可能已经被其他线程重置了、也可能还没到**。所以必须回到循环头重新检查，而不是直接认为「我睡够了就能发」。

如果写成 `if`，多线程下会漏配额检查。

## 一句话总结

四种算法没有优劣，只有**匹配不匹配**：

| 算法 | 适合 | 我为什么不用 |
|---|---|---|
| 固定窗口 | 配额语义、串行批处理 | → **用的这个** |
| 令牌桶 | 需要允许突发 + 严格长期速率 | 文档给的是配额，不是速率 |
| 滑动窗口 | 高并发、请求到达不均 | 我的请求间隔是自己控制的 |
| 漏桶 | 需要输出完全平滑 | 我要的恰恰是尽快发完 |

**先看清自己的场景是什么形状，再去挑算法。** 反过来做的话，就会写出一个「技术上更高级、但参数对不上业务」的实现。