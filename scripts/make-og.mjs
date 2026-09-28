#!/usr/bin/env node
/**
 * 把 public/og-cover.svg 渲染成 public/og-cover.png（分享卡片必须用位图）。
 *
 *   node scripts/make-og.mjs
 *
 * 为什么要有这一步：OG 图是给微信 / QQ / X / Slack 这类平台抓的，
 * 它们对 SVG 的支持很不一致（多数直接不认），所以线上必须用 PNG。
 * SVG 作为「可编辑的源文件」保留，改完文字跑一次这个脚本就行。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = path.join(root, 'public/og-cover.svg');
const png = path.join(root, 'public/og-cover.png');
const W = 1200;
const H = 630;

if (!fs.existsSync(svg)) {
  console.error('[make-og] 找不到 public/og-cover.svg');
  process.exit(1);
}

let sharp;
try {
  // sharp 是 astro 的依赖，正常情况下可以直接用；没有就给出可操作的提示
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error('[make-og] 需要 sharp 才能渲染：npm i -D sharp');
  process.exit(1);
}

const buf = await sharp(fs.readFileSync(svg), { density: 96 })
  .resize(W, H, { fit: 'fill' })
  .png({ compressionLevel: 9 })
  .toBuffer();

fs.writeFileSync(png, buf);
console.log(`[make-og] 已生成 ${path.relative(root, png)}  ${W}x${H}  ${(buf.length / 1024).toFixed(0)}KB`);