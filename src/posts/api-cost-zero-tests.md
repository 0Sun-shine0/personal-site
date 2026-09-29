---
title: 测试怎么写才不花 API 钱
description: 我做的项目几乎全依赖外部接口 —— 语言模型、视觉生成、视频合成。跑一次全量测试要烧掉几十块。后来用了三层替身，现在本地跑 294 个用例，一分钱不花。
date: 2025-05-18
tags: [测试, Python, 工程实践]
minutes: 10
---

我有一个依赖外部接口的项目（语言模型 + 视觉生成 API），跑一次完整的端到端验证大概要花几十块。

这带来一个很实际的后果：**我会不自觉地少跑测试。**

- 改了一行提示词拼装逻辑，心想「这个不用整个跑一遍吧」
- 想着只测自己改的那部分，跳过不相关的
- 更糟的是，有时候会「先推上去，回头再说」

这不是意志力问题，是成本问题。只要测试有代价，人就会绕开它。

后来我把测试拆成三层替身，现在本地跑 **294 个用例、一分钱不花、一遍十几秒**。下面是具体做法。

## 第一层：伪造 HTTP 层

最外层的替身是**网络请求本身**。我不用 mock 库，而是手写两个小类 —— 因为我要控制的是「这次调用返回什么」，而不是「函数被调了几次」。

```python
class FakeResponse:
    def __init__(self, status_code=200, payload=None, text="", chunks=None):
        self.status_code = status_code
        self._payload = payload
        self.text = text if text else (json.dumps(payload) if payload is not None else "")
        self.headers = {"content-length": str(sum(len(c) for c in (chunks or [])))}
        self._chunks = chunks or []

    def json(self):
        if self._payload is None:
            raise ValueError("no json")     # 模拟不是 JSON 的响应
        return self._payload

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.HTTPError(f"HTTP {self.status_code}")

    def iter_content(self, chunk_size=8192):
        yield from self._chunks             # 流式下载
```

关键在 `FakeSession` —— 它**按顺序返回预设响应，并记录每次调用的参数**：

```python
class FakeSession:
    def __init__(self, responses=None, exception=None):
        self.responses = list(responses or [])
        self.exception = exception
        self.calls = []                     # 每次调用的 (方法, URL, 参数)

    def post(self, url, **kwargs):
        self.calls.append(("POST", url, kwargs))
        return self._next()
```

这样我既能**喂**各种响应（200 / 429 / 500 / 不是 JSON / 空 body），也能**查**请求发对了没有：

```python
def test_retries_on_429():
    session = FakeSession([
        FakeResponse(429),                  # 第一次：限流
        FakeResponse(200, {"ok": True}),    # 第二次：成功
    ])
    result = call_api(session=session)
    assert result["ok"] is True
    assert len(session.calls) == 2          # 确认重试了一次
```

**「按顺序返回」这件小事很关键。** 很多 bug 只在特定顺序下出现 —— 第一次成功、第二次限流、第三次超时。如果替身只能「永远返回同一个响应」，这类 bug 就测不出来。

## 第二层：合成素材

第二层替身是**输入文件**。项目要处理图像和视频，而真实素材是用户传的，不方便进仓库、也可能很大。

所以我**先生成素材**：

```python
def checkerboard(size=(180, 320), block=20, low=30, high=225):
    """高对比度棋盘格：结构明显，拉普拉斯方差大。"""
    height, width = size
    ys, xs = np.mgrid[0:height, 0:width]
    pattern = ((xs // block) + (ys // block)) % 2 == 0
    image = np.where(pattern, high, low).astype(np.uint8)
    return np.repeat(image[:, :, None], 3, axis=2)

def ball_frames(count=12, size=(180, 320), background=40):
    """小球横向移动，光流幅值明显。"""
    frames = []
    for index in range(count):
        frame = solid((background, background, background), size)
        cv2.circle(frame, (20 + index * 20, height // 2), 15, (0, 0, 230), -1)
        frames.append(frame)
    return frames
```

**每个素材都有明确的物理含义**，这样断言才有意义：

| 素材 | 用途 |
|---|---|
| 棋盘格 | 细节丰富  清晰度指标应该给高分 |
| 纯色 | 完全空白  清晰度指标应该给 0 |
| 小球移动 | 明显运动  光流幅值应该大于阈值 |
| 整段静止 | 冻住  光流幅值应该接近 0 |
| 噪点视频 | 帧间剧烈变化  帧间跳变应该报警 |

这就是我为什么坚持**自己生成而不是找样例文件**：我需要的是**已知答案**的素材，而不是好看的素材。

比如「清晰度指标对不对」这个问题，用真实照片测不出来 —— 我不知道那张照片「应该」得多少分。但棋盘格该得高分、纯色该得 0，这两条是确定的。

## 第三层：确定性

前两层解决了「不花钱」，第三层解决「测得准」。

**问题是：随机性会毁掉测试。**

- 生成素材时用了随机噪声 —— 每次跑结果不同 —— 断言时松时紧
- 视频编码器（H.264/H.265）是有损的 —— 同一份帧写出去再读回来，像素不完全一致
- 浮点运算在不同平台上有微小差异

所以素材生成必须**完全确定**：不用 `np.random`，所有图案都由坐标算出来；阈值留足余量，不贴边。

举个例子，我有一处判断「画面细节强度」的实现，阈值定在 1.0。测试里的素材得分是：

```
纯色      0.00  →  应该被拦下（余量 1.0）
平滑渐变  1.25  →  应该通过（余量 0.25）
```

渐变的 1.25 距阈值只有 0.25，**这个余量太薄**。视频编码器的微小差异就可能让它在 0.98 和 1.31 之间浮动，测试会变成薛定谔的。

所以我改用**棋盘格（91）和留白构图（56）**这类余量充足的素材测「应该通过」，纯色（0.00）测「应该拦下」。渐变只用来验证「平滑画面得分低」，不做阈值边界的断言。

**「用余量充足的素材测边界」是这层最重要的经验。**

## 三层叠起来之后

| | 之前 | 现在 |
|---|---|---|
| 单次全量测试成本 | 几十元 | **0** |
| 耗时 | 几分钟（等接口） | **十几秒** |
| 能测的异常 | 只有真实遇到的 | 429 / 500 / 超时 / 非 JSON / 空响应，都能造 |
| 敢不敢频繁跑 | 不敢 | 每次改完就跑 |

最后一行是最重要的变化。**测试的价值不在「覆盖率」，而在「你敢不敢随时跑它」。**

一个每次跑都要心疼一下的测试套件，实际覆盖率会无限趋近于零 —— 因为你不会跑它。

## 两个可能被质疑的点

**一、「你测的是替身，不是真实接口，有意义吗？」**

有意义，但要分清测什么：

- **替身能测的**：你的代码怎么处理各种响应 —— 重试逻辑、JSON 解析、限流退避、错误分类、状态机流转。**这才是你自己写的代码。**
- **替身不能测的**：接口本身变了、模型输出质量下降、签名算法过时。

后者需要**少量**的真实验证（我留了一个「手动跑一次」的脚本，发版前跑）。**把两者分开，别用真实调用来测自己的代码** —— 那既贵又慢，而且不稳定。

**二、「手写替身不如用 mock 库」**

mock 库适合「验证函数被调用」，我需要的是「验证我怎么处理返回值」。手写的是**数据结构**而不是**打桩**，读起来更像真实场景：

```python
FakeSession([FakeResponse(429), FakeResponse(200, {"ok": True})])
```

一眼能看出「第一次限流、第二次成功」。用 mock 库写同样的场景要铺三四行 `side_effect`。

**什么时候该换 mock 库**：需要断言调用次数、参数精确匹配、或者要 patch 掉全局函数时。我这两处都没有。