import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 部署后把 site 改成你的真实域名：它决定 sitemap / RSS / canonical 里的绝对链接
export default defineConfig({
  site: 'https://linmo.dev',
  integrations: [sitemap()],
  server: { port: 4321 },
  vite: {
    resolve: {
      alias: {
        // picomatch 是纯 CJS 包，某些环境下 dev 服务器会在 ESM 运行器里内联它，
        // 报 "require is not defined"。指向 ESM 垫片即可（构建不受影响）。
        picomatch: fileURLToPath(new URL('./src/shims/picomatch.mjs', import.meta.url)),
      },
    },
  },
});