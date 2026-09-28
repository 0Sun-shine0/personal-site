#!/usr/bin/env node
/**
 * 受限环境适配脚本（npm run build 前会自动执行，也可以手动 node scripts/fix-env-plugin.mjs）
 *
 * 背景：Astro 的 env 插件会用 esbuild 的「子进程服务」来做 import.meta.env 的 define 替换。
 * 但有些受限环境（容器 / 沙箱 / 强管控的杀软）不允许 node 创建带管道的子进程，
 * 于是构建会在 spawn EPERM 上直接失败。
 *
 * 这个脚本检测到该情况时，会把该插件里的 replaceDefine 替换成等价的纯 JS 实现
 * （只做词边界替换，不启动任何子进程）。在正常机器上它什么都不做。
 * node_modules 不会进版本库，所以换机器后重跑一次 install 再执行本脚本即可。
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginPath = path.join(root, 'node_modules/astro/dist/env/vite-plugin-import-meta-env.js');
const MARK = '[sandbox-patch]';

const PURE_JS = [
  'async function replaceDefine(code, id, define, config) {',
  '  // [sandbox-patch] 纯 JS 版 define 替换，等价于 esbuild.transform({ define })，不需要子进程',
  '  const replacementMarkers = {};',
  '  const env = define["import.meta.env"];',
  '  if (env) {',
  '    const marker = "__astro_import_meta_env" + "_".repeat(env.length - 23);',
  '    replacementMarkers[marker] = env;',
  '    define = { ...define, "import.meta.env": marker };',
  '  }',
  '  let out = code;',
  '  for (const key of Object.keys(define)) {',
  '    const pattern = "(?<![\\\\w$.])" + key.split(".").join("\\.") + "\\\\b";',
  '    const value = define[key];',
  '    out = out.replace(new RegExp(pattern, "g"), () => value);',
  '  }',
  '  for (const marker in replacementMarkers) {',
  '    out = out.split(marker).join(replacementMarkers[marker]);',
  '  }',
  '  return { code: out, map: null };',
  '}',
].join('\n');

/** 能不能创建带管道的子进程？不能就说明是受限环境。 */
function canSpawnWithPipes() {
  const r = spawnSync(process.execPath, ['-v'], { stdio: ['pipe', 'pipe', 'pipe'] });
  return !r.error;
}

function applyPatch() {
  const src = fs.readFileSync(pluginPath, 'utf8');
  if (src.includes(MARK)) {
    console.log('[fix-env-plugin] 补丁已在位，跳过。');
    return;
  }
  const re = /async function replaceDefine\([\s\S]*?\n\}/;
  if (!re.test(src)) {
    console.warn('[fix-env-plugin] 没找到 replaceDefine（Astro 版本可能变了），跳过。构建若失败请看本文件注释。');
    return;
  }
  fs.copyFileSync(pluginPath, pluginPath + '.orig');
  fs.writeFileSync(pluginPath, src.replace(re, PURE_JS), 'utf8');
  console.log('[fix-env-plugin] 已把 esbuild define 替换成纯 JS 实现（原文件备份为 .orig）。');
}

if (!fs.existsSync(pluginPath)) {
  console.log('[fix-env-plugin] 还没装 astro，跳过。');
  process.exit(0);
}
if (canSpawnWithPipes()) {
  console.log('[fix-env-plugin] 子进程可用，无需补丁。');
  process.exit(0);
}
console.log('[fix-env-plugin] 检测到受限环境：node 无法创建带管道的子进程。');
applyPatch();