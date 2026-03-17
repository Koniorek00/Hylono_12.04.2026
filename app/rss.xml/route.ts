import { BLOG_POSTS } from '@/constants/content';
import { env } from '@/lib/env';
import { getBlogPublishedIsoDate, toBlogSlug } from '@/lib/blog';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET() {
  const posts = BLOG_POSTS.map((post) => {
    const slug = toBlogSlug(post.title);
    const url = `${SITE_URL}/blog/${slug}`;
    const publishedDate =
      getBlogPublishedIsoDate(post.date) ?? new Date('2026-01-01T00:00:00.000Z').toISOString();

    return {
      ...post,
      slug,
      url,
      publishedDate,
    };
  }).sort(
    (left, right) =>
      new Date(right.publishedDate).valueOf() - new Date(left.publishedDate).valueOf()
  );

  const latestBuildDate = posts[0]?.publishedDate ?? new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Hylono Blog - Research Notes and Wellness Guidance</title>
    <link>${SITE_URL}/blog</link>
    <description>Latest Hylono articles covering wellness technology research notes, protocol guidance, and product planning.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(latestBuildDate).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>Hylono Next.js feed</generator>
    <managingEditor>contact@hylono.com (Hylono Editorial Team)</managingEditor>
    <webMaster>tech@hylono.com (Hylono Tech Team)</webMaster>
    <ttl>60</ttl>
    <image>
      <url>${SITE_URL}/logo.svg</url>
      <title>Hylono Blog</title>
      <link>${SITE_URL}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
${posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${post.url}</link>
      <guid>${post.url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <author>contact@hylono.com (Hylono Editorial Team)</author>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${new Date(post.publishedDate).toUTCString()}</pubDate>
      <content:encoded><![CDATA[${post.excerpt}]]></content:encoded>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
