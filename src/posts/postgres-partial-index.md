---
title: PostgreSQL 部分索引：40 秒的查询压到 200 毫秒
description: 三亿行订单表上查"待处理"订单，加普通索引没用。用部分索引把 42GB 索引变成 180MB，顺便聊聊什么时候该怀疑你的 B-tree。
date: 2026-08-05
tags: [PostgreSQL, 索引, 性能]
minutes: 8
---

订单表 3.2 亿行，运营后台有个「待处理订单」列表：查最近两天、状态是 `PENDING` 的订单。

这条查询跑了 40 秒。而 `status` 上早就有索引了。

## 先看看计划，别急着加索引

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, user_id, amount, created_at
FROM orders
WHERE status = 'PENDING'
  AND created_at >= now() - interval '2 days'
ORDER BY created_at DESC
LIMIT 50;
```

结果很直白：

```
Limit  (cost=... rows=50) (actual time=39821.4..39821.5 rows=50 loops=1)
  ->  Sort  (...)
        ->  Seq Scan on orders  (...)
              Filter: ((status = 'PENDING') AND (created_at >= ...))
              Rows Removed by Filter: 318924771
Buffers: shared hit=214 read=11803426
```

顺序扫描扫了 3 亿行，从 1.1 万次磁盘读里捞出 50 条。问题出在这里：

- `PENDING` 只占全表的 **0.3%**，用普通 B-tree 索引查这种低选择率的条件，planner 会认为不如直接扫表（索引扫回表更贵）。
- 就算 planner 用了索引，`status` 上的索引在全表范围上是**均匀分布**的，找 50 条 `PENDING` 可能要在索引里翻很久。

## 部分索引：只给真正要查的那部分建索引

关键认识是：**这个查询永远只关心 `PENDING`。** 那就只给这部分建索引。

```sql
CREATE INDEX CONCURRENTLY idx_orders_pending_created_at
ON orders (created_at DESC)
WHERE status = 'PENDING';
```

三个细节：

- `WHERE status = 'PENDING'` 让索引只覆盖待处理的行，体积从 42GB 掉到 **180MB**。
- `created_at DESC` 对齐查询的排序，避免额外 Sort。
- `CONCURRENTLY` 不锁写，代价是慢一点，而且**不能在事务里执行**。

建完之后同一个查询：

```
Limit  (actual time=0.031..0.197 rows=50 loops=1)
  ->  Index Scan using idx_orders_pending_created_at on orders
        Buffers: shared hit=56
```

**40 秒  200 毫秒，缓冲区读取从 1180 万降到 56。**

## 用部分索引要注意的事

### 谓词必须出现在查询里

部分索引只有在查询条件能推出索引谓词时才会被使用。下面第一条能用上，第二条用不上：

```sql
-- 用得上
WHERE status = 'PENDING' AND created_at >= now() - interval '2 days'

-- 用不上：planner 无法证明 status 一定是 'PENDING'
WHERE status IN ('PENDING', 'PROCESSING')
  AND created_at >= now() - interval '2 days'
```

第二种情况如果确实常查，就再建一个覆盖两个状态的部分索引，或者用 `IN` 改成 `UNION ALL` 两个查询。

### 统计信息要跟着走

部分索引有自己的统计信息。刚建完索引如果计划还是不对，先手动分析：

```sql
ANALYZE orders;
```

### 索引也会膨胀

`PENDING` 的行会被处理掉，变成其他状态，但**索引里的死元组不会立刻消失**。autovacuum 能清理，但如果你的表更新非常频繁，值得定期看一眼：

```sql
SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE relname = 'orders'
ORDER BY pg_relation_size(indexrelid) DESC;
```

正常应该稳定在几百 MB。如果涨到几个 GB，说明 vacuum 跟不上。

## 什么时候该考虑部分索引

我把判断标准简化成三条：

| 情况 | 是否适合部分索引 |
| --- | --- |
| 查询条件固定包含某个低选择率的等值条件 | 非常适合 |
| 表很大，但真正需要快速访问的只是一小撮行 | 非常适合 |
| 状态分布均匀、各种状态都要查 | 不适合，考虑分区或者调整数据模型 |
| 条件里会出现 `IN (...)` 之类的组合 | 要小心，可能需要多个部分索引 |

顺便说一句：如果你的「待处理」列表其实只需要最近的数据，那么**按时间分区 + 部分索引**组合起来效果更好。这个我下次单独写。

## 一句话总结

索引不是越全越好。**先跑 `EXPLAIN (ANALYZE, BUFFERS)`，再问一句「这个索引真的需要覆盖全表吗」。**