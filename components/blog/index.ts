/**
 * Blog Components Index
 * 
 * This module exports all blog-related components for the Knowledge Hub.
 * 
 * Components:
 * - MentionSuggestions: @ mention autocomplete dropdown
 * - BlogEditor: Rich text editor with @ mentions for writers
 * - ArticleReader: Immersive full-screen article reader for readers
 * 
 * Usage:
 * 
 * In articles, use the following mention syntax:
 * - @machine:HBOT - Links to device pages
 * - @research:study-id - Links to research studies
 * - @docs:getting-started - Links to documentation
 * - @protocol:superhuman - Links to protocol pages
 * - @knowledge:HBOT - Links to knowledge packs
 * - @article:1 - Links to other blog posts
 */

export { MentionSuggestions, getAllMentionEntities, MENTION_CATEGORIES } from './MentionSuggestions';
export type { MentionEntity, MentionType } from './MentionSuggestions';

export { BlogEditor } from './BlogEditor';
export type { BlogDraft } from './BlogEditor';

export { ArticleReader } from './ArticleReader';
