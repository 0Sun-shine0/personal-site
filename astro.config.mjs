import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 部署后把 site 换成你的真实地址：它决定 sitemap / RSS / canonical 里的绝对链接。
// 默认值对应 GitHub Pages 的用户主页仓库（仓库名必须是 0Sun-shine0.github.io）。
// 如果用 Cloudflare Pages / Vercel 或自己的域名，换成对应地址即可。
export default defineConfig({
  site: 'https://0sun-shine0.github.io',
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