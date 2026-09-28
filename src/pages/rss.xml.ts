import type { APIContext } from 'astro';
import { site } from '../data/site';

const mods = import.meta.glob('../posts/*.md', { eager: true }) as Record<string, any>;

const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function GET(context: APIContext) {
  const base = (context.site ?? new URL('https://linmo.dev')).href.replace(/\/$/, '');

  const items = Object.entries(mods)
    .map(([path, m]) => {
      const fm = m.frontmatter ?? {};
      const slug = path.split('/').pop()!.replace(/\.md$/, '');
      return { slug, ...fm };
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${base}/blog/${p.slug}/</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} 的技术笔记</title>
    <link>${base}/blog/</link>
    <description>${esc(site.tagline)}</description>
    <language>zh-cn</language>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}