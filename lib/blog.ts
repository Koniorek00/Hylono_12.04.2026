import { BLOG_POSTS, type BlogPost } from '@/constants/content';

export const toBlogSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const blogPostsBySlug = BLOG_POSTS.reduce<Record<string, BlogPost>>((acc, post) => {
  acc[toBlogSlug(post.title)] = post;
  return acc;
}, {});

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => blogPostsBySlug[slug];

export const getBlogPublishedIsoDate = (rawDate: string): string | null => {
  const parsed = new Date(rawDate);
  return Number.isNaN(parsed.valueOf()) ? null : parsed.toISOString();
};
