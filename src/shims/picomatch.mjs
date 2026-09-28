/**
 * picomatch 是纯 CJS 包，而 Vite 的 dev module runner 会在 ESM 环境里内联它，
 * 于是 `require is not defined`。
 * 这里用 createRequire 把真正的 CJS 实现包一层，对上层暴露同样的 ESM 接口。
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const picomatch = require('picomatch');

export default picomatch;
export const isMatch = picomatch.isMatch;
export const makeRe = picomatch.makeRe;
export const scan = picomatch.scan;
export const parse = picomatch.parse;
export const test = picomatch.test;
export const constants = picomatch.constants;