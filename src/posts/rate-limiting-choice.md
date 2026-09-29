---
title: 四种限流算法，我为什么选了最笨的那个
description: 2024 年第一次做需要限流的项目，我把四种经典算法都抄了一遍，最后用了最简陋的固定窗口计数器。真实原因是：只有它我完全看得懂。
date: 2024-08-11
tags: [算法, 限流, Python]
minutes: 9
---

2024 年我做过一个调用外部接口的项目，接口有配额限制：**每分钟最多 N 次**。超了会返回错误。

所以要自己在客户端限一下速。当时我第一次接触「限流」这个词，只知道大概有几种经典算法，具体怎么用没概念。

下面记录一下我抄四种算法的过程，以及最后为什么选了个最简陋的。

## 先说最后用的东西

```python
class Throttle:
    """每分钟请求数上限。窗口内超了就等到窗口结束。"""

    def __init__(self, per_minute=None, sleep=time.sleep):
        self.per_minute = per_minute or settings.REQUESTS_PER_MINUTE
        self._sleep = sleep
        self._lock = threading.Lock()
        self._used = 0
        self._since = time.monotonic()

    def wait(self):
        """拿一个名额；满了就等到窗口结束。"""
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
            self._sleep(max(remaining, 0.0))
```

就是个计数器：记录这一分钟内已经发了几次，再加一个窗口开始时间。满 60 秒就归零。

叫它「固定窗口计数器」，是后来查资料才知道的名字。当时我只是觉得这个最容易写。

## 我把四种都抄了一遍

下面按我抄的顺序写。代码可能写得不好，有的地方当时也没完全理解。

### 令牌桶

令牌桶大概是这样：有个桶，里面按固定速率生成「令牌」，每个请求要先拿一个令牌，拿不到就等。

```python
class TokenBucket:
    def __init__(self, rate, capacity):
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

这段逻辑我照着网上写的，能跑，但**有两个参数我不知道该填多少**：`rate`（每秒几个令牌）和 `capacity`（桶多大）。

接口文档只说了「每分钟 N 次」。我要把它换算成每秒，就是 `N / 60`。可是 `N = 10` 的时候，每秒才 0.167 个，那桶设多大？设 10 就相当于允许一口气发 10 次，可能被服务端判定成并发太高；设小一点又用不满配额。

我调了半天，感觉是在瞎猜。**这两个参数我确实不懂该怎么定，所以后来就不敢用了。**

### 滑动窗口

这个的思路我大概明白：不用固定的 60 秒切分，而是永远看「过去 60 秒」。

```python
class SlidingWindow:
    def __init__(self, per_minute):
        self.per_minute = per_minute
        self.stamps = deque()

    def wait(self):
        while True:
            now = time.monotonic()
            while self.stamps and now - self.stamps[0] >= 60:
                self.stamps.popleft()
            if len(self.stamps) < self.per_minute:
                self.stamps.append(now)
                return
            self._sleep(60 - (now - self.stamps[0]))
```

看资料的时候，我看到说固定窗口有个毛病：**边界处可能超发。**

意思是限制每分钟 10 次，如果我在第 59 秒连发 10 次，第 61 秒又发 10 次，两次跨了窗口边界，各自都合法，但实际 2 秒里发了 20 次。

这个问题我理解了，然后就纠结了很久「我会不会也这样」。

**后来发现我不会。** 因为我的程序是用户点一下「生成」，然后按顺序把 8 个请求发出去，发完就没了。请求间隔是我自己控制的，不会出现「掐着第 59 秒打满」这种事。

不过当时我不太确定这个判断对不对，所以还是把它写完了。

### 漏桶

漏桶我写得最不顺。大概意思是请求先排队，然后按固定速度「漏」出去。

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

写完测了一下，发现它会把请求拉得很均匀。

但我这里不需要均匀：用户点完生成就去干别的了，程序应该**尽快发完**（在配额内），而不是老老实实每 6 秒发一个、拖成 48 秒。

这个倒是很快就判断出来了，因为效果一跑就能感觉到。

## 为什么最后选了最笨的

说老实话，主要原因是**只有固定窗口计数器我完全看得懂**。

它的逻辑就是「这 60 秒里我还剩几次名额」，跟接口文档说的一模一样，不用换算，不用估参数。

其他三个当然更「专业」，但我当时的情况是：

- 令牌桶：不知道两个参数该填什么
- 滑动窗口：不确定自己会不会遇到边界超发（现在知道不会，但当时不确定）
- 漏桶：效果跑出来就知道不合适

选的不是最好的，是**我能确认它是对的**那个。

## 选完之后踩的三个坑

不过「简单」不等于「一次写对」。有几次是我自己没想清楚。

### 一、窗口重置忘了放锁里

我第一版是这样的：

```python
def wait(self):
    elapsed = time.monotonic() - self._since      # 没加锁
    if elapsed >= 60:
        self._used = 0
        self._since = time.monotonic()
    # ...
```

单线程跑没事，后来程序里有多线程，就出现了「计数不对」的情况。

原因是两个线程可能同时判断「窗口过了」，各重置一次 —— 我重置完你也有重置，`_used` 就乱了。

加上锁之后正常了。**这个错我当时不太明白为什么，是后来学并发的时候才想通的。**

### 二、`time.time()` 换成 `monotonic()`

这个也是看别人代码学到的。

我原来用的是 `time.time()`，后来改成 `time.monotonic()`。原因是系统时间可能会被校正（比如 NTP 同步、或者用户手动改时间），`time.time()` 会跳变，而 `monotonic()` 只会一直往前走。

我没实际遇到过这个问题，但听起来有道理，就改了。

### 三、sleep 得放在锁外面

```python
with self._lock:
    # ... 判断能不能发 ...
    remaining = 60 - elapsed
# 锁到这里已经释放了
self._sleep(max(remaining, 0.0))
```

这个是我写的时候注意到的：如果 `sleep` 写在 `with` 里面，第一个线程睡 60 秒的时候，其他线程全都堵在锁上动不了。

而且 `wait()` 要写成 `while True` 循环，不能写 `if` —— 睡醒了得回去重新看一眼还能不能发，因为这段时间里名额可能已经被别人抢走了。

## 最后

写完这四种之后，我对限流的理解还是很浅。

但有个感受是：**这些算法不是越复杂越好用，是看你的场景需不需要它解决的问题。**

对我来说，请求是顺序发出去的，一次几十个，用完就完了。这种场景下花时间调令牌桶的桶大小，不太值。

当然也可能是我理解得不够，以后遇到更复杂的情况，说不定还是得回来学。