import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bold, Italic, Link2, Image, List, ListOrdered, Quote, Code,
    Type, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2,
    Tag, Save, Eye, EyeOff, Send, Undo, Redo, Sparkles, Shield,
    FileText, Microscope, Zap, Hash, Clock, Calendar, User,
    CheckCircle2, AlertTriangle, HelpCircle, Loader2, X
} from 'lucide-react';
import { MentionSuggestions, MentionEntity, MentionType, MENTION_CATEGORIES } from './MentionSuggestions';
import { sanitizePreviewContent } from '../../utils/sanitization';

// === BLOG EDITOR TYPES ===
export interface BlogDraft {
    id?: string;
    title: string;
    content: string;
    excerpt: string;
    category: 'HBOT' | 'PEMF' | 'RLT' | 'Hydrogen' | 'Protocols';
    tags: string[];
    trace_id?: string;
    status: 'draft' | 'review' | 'published';
    author?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface FormattingAction {
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    action: () => void;
}

// === BLOG EDITOR COMPONENT ===
export const BlogEditor: React.FC = () => {
    // State
    const [draft, setDraft] = useState<BlogDraft>({
        title: '',
        content: '',
        excerpt: '',
        category: 'HBOT',
        tags: [],
        status: 'draft'
    });

    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionCategory, setMentionCategory] = useState<MentionType | undefined>();
    const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
    const [isPreview, setIsPreview] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [readTime, setReadTime] = useState('0 min');
    const [showTraceSelector, setShowTraceSelector] = useState(false);

    const editorRef = useRef<HTMLTextAreaElement>(null);
    const mentionStartRef = useRef<number>(0);

    // Calculate word count and read time
    useEffect(() => {
        const words = draft.content.trim().split(/\s+/).filter(w => w).length;
        setWordCount(words);
        setReadTime(`${Math.max(1, Math.ceil(words / 200))} min`);
    }, [draft.content]);

    // === MENTION HANDLING ===
    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;

        setDraft(d => ({ ...d, content: value }));

        // Detect @ trigger
        const textBeforeCursor = value.substring(0, cursorPos);
        const atMatch = textBeforeCursor.match(/@(\w*)(:(\w*))?$/);

        if (atMatch) {
            mentionStartRef.current = cursorPos - atMatch[0].length;

            // Check if category prefix is specified
            const categoryPrefix = atMatch[1]?.toLowerCase();
            const query = atMatch[3] || '';

            // Match category prefix
            const matchedCategory = MENTION_CATEGORIES.find(
                cat => cat.key.toLowerCase().startsWith(categoryPrefix) ||
                    cat.shortcut.toLowerCase().includes(`@${categoryPrefix}`)
            );

            setMentionCategory(matchedCategory?.key);
            setMentionQuery(query || categoryPrefix);

            // Calculate dropdown position
            if (editorRef.current) {
                const rect = editorRef.current.getBoundingClientRect();
                // Simple approximation - in production, use a proper caret position library
                const lineHeight = 24;
                const charsPerLine = Math.floor(rect.width / 8);
                const lines = Math.floor(cursorPos / charsPerLine);

                setMentionPosition({
                    top: Math.min(lines * lineHeight + 40, rect.height - 100),
                    left: 20
                });
            }

            setShowMentions(true);
        } else {
            setShowMentions(false);
        }
    }, []);

    const handleMentionSelect = useCallback((entity: MentionEntity) => {
        const cursorPos = editorRef.current?.selectionStart || 0;
        const beforeMention = draft.content.substring(0, mentionStartRef.current);
        const afterMention = draft.content.substring(cursorPos);

        // Create mention syntax: [@Type:Label](link)
        const mentionText = `[@${entity.type}:${entity.label}](${entity.link || '#'})`;

        const newContent = beforeMention + mentionText + ' ' + afterMention;
        setDraft(d => ({ ...d, content: newContent }));
        setShowMentions(false);

        // Focus back to editor
        setTimeout(() => {
            if (editorRef.current) {
                const newPos = beforeMention.length + mentionText.length + 1;
                editorRef.current.focus();
                editorRef.current.setSelectionRange(newPos, newPos);
            }
        }, 0);
    }, [draft.content]);

    // === FORMATTING ACTIONS ===
    const insertFormat = useCallback((before: string, after: string = before) => {
        const editor = editorRef.current;
        if (!editor) return;

        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selected = draft.content.substring(start, end);
        const newContent =
            draft.content.substring(0, start) +
            before + selected + after +
            draft.content.substring(end);

        setDraft(d => ({ ...d, content: newContent }));

        setTimeout(() => {
            editor.focus();
            editor.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    }, [draft.content]);

    const formattingActions: FormattingAction[] = [
        { icon: <Bold size={16} />, label: 'Bold', shortcut: 'Ctrl+B', action: () => insertFormat('**') },
        { icon: <Italic size={16} />, label: 'Italic', shortcut: 'Ctrl+I', action: () => insertFormat('*') },
        { icon: <Link2 size={16} />, label: 'Link', shortcut: 'Ctrl+K', action: () => insertFormat('[', '](url)') },
        { icon: <Code size={16} />, label: 'Code', action: () => insertFormat('`') },
        { icon: <Quote size={16} />, label: 'Quote', action: () => insertFormat('\n> ', '\n') },
        { icon: <Heading1 size={16} />, label: 'H1', action: () => insertFormat('\n# ', '\n') },
        { icon: <Heading2 size={16} />, label: 'H2', action: () => insertFormat('\n## ', '\n') },
        { icon: <List size={16} />, label: 'Bullet List', action: () => insertFormat('\n- ', '\n') },
        { icon: <ListOrdered size={16} />, label: 'Numbered List', action: () => insertFormat('\n1. ', '\n') }
    ];

    // === TAG HANDLING ===
    const addTag = useCallback(() => {
        if (tagInput.trim() && !draft.tags.includes(tagInput.trim())) {
            setDraft(d => ({ ...d, tags: [...d.tags, tagInput.trim()] }));
            setTagInput('');
        }
    }, [tagInput, draft.tags]);

    const removeTag = useCallback((tag: string) => {
        setDraft(d => ({ ...d, tags: d.tags.filter(t => t !== tag) }));
    }, []);

    // === SAVE HANDLING ===
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setIsSaving(false);
        setDraft(d => ({ ...d, status: 'draft', updatedAt: new Date().toISOString() }));
    }, []);

    // === KEYBOARD SHORTCUTS ===
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault();
                        insertFormat('**');
                        break;
                    case 'i':
                        e.preventDefault();
                        insertFormat('*');
                        break;
                    case 'k':
                        e.preventDefault();
                        insertFormat('[', '](url)');
                        break;
                    case 's':
                        e.preventDefault();
                        handleSave();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [insertFormat, handleSave]);

    // === RENDER ===
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
        >
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">Article Editor</h2>
                        <p className="text-xs text-slate-500">Create evidence-based content</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${draft.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                            draft.status === 'review' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-200 text-slate-600'
                        }`}>
                        {draft.status}
                    </span>

                    {/* Preview Toggle */}
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`p-2 rounded-lg transition-all ${isPreview ? 'bg-cyan-100 text-cyan-700' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                            }`}
                    >
                        {isPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Draft
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Article Title..."
                    value={draft.title}
                    onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                    className="w-full text-3xl font-bold text-slate-900 placeholder:text-slate-300 outline-none mb-2 bg-transparent"
                />

                {/* Meta Row */}
                <div className="flex items-center gap-4 mb-6 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {readTime} read
                    </span>
                    <span className="flex items-center gap-1">
                        <Hash size={14} />
                        {wordCount} words
                    </span>

                    {/* Category Selector */}
                    <select
                        value={draft.category}
                        onChange={e => setDraft(d => ({ ...d, category: e.target.value as BlogDraft['category'] }))}
                        className="px-3 py-1 bg-slate-100 border-0 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                        {['HBOT', 'PEMF', 'RLT', 'Hydrogen', 'Protocols'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Trace ID Button */}
                    <button
                        onClick={() => setShowTraceSelector(!showTraceSelector)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${draft.trace_id
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                    >
                        <Shield size={12} />
                        {draft.trace_id || 'Add Trace ID'}
                    </button>
                </div>

                {/* Excerpt */}
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Excerpt (for previews)
                    </label>
                    <textarea
                        placeholder="Brief summary of the article..."
                        value={draft.excerpt}
                        onChange={e => setDraft(d => ({ ...d, excerpt: e.target.value }))}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 resize-none outline-none focus:border-cyan-300 transition-colors"
                        rows={2}
                    />
                </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 p-2 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                    {formattingActions.map((action, i) => (
                        <React.Fragment key={action.label}>
                            <button
                                onClick={action.action}
                                title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
                                className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 transition-all"
                            >
                                {action.icon}
                            </button>
                            {(i === 3 || i === 5) && <div className="w-px h-5 bg-slate-200 mx-1" />}
                        </React.Fragment>
                    ))}

                    <div className="flex-1" />

                    {/* @ Mention Button */}
                    <button
                        onClick={() => {
                            if (editorRef.current) {
                                const pos = editorRef.current.selectionStart;
                                const newContent = draft.content.substring(0, pos) + '@' + draft.content.substring(pos);
                                setDraft(d => ({ ...d, content: newContent }));
                                setTimeout(() => {
                                    editorRef.current?.focus();
                                    editorRef.current?.setSelectionRange(pos + 1, pos + 1);
                                }, 0);
                            }
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-bold hover:bg-cyan-100 transition-all"
                    >
                        <Sparkles size={14} />
                        Insert @Reference
                    </button>
                </div>

                {/* Editor Area */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {isPreview ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="min-h-[400px] p-6 bg-slate-50 border border-slate-200 rounded-xl prose prose-slate max-w-none"
                            >
                                <div dangerouslySetInnerHTML={{ __html: sanitizePreviewContent(formatPreview(draft.content)) }} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="editor"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative"
                            >
                                <textarea
                                    ref={editorRef}
                                    value={draft.content}
                                    onChange={handleContentChange}
                                    placeholder="Start writing... Use @ to reference devices, research, and documentation."
                                    className="w-full min-h-[400px] p-6 bg-white border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 resize-none outline-none focus:border-cyan-300 focus:ring-4 focus:ring-cyan-50 transition-all font-mono text-sm leading-relaxed"
                                />

                                {/* Mention Suggestions */}
                                <AnimatePresence>
                                    {showMentions && (
                                        <MentionSuggestions
                                            query={mentionQuery}
                                            category={mentionCategory}
                                            position={mentionPosition}
                                            onSelect={handleMentionSelect}
                                            onClose={() => setShowMentions(false)}
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tags */}
                <div className="mt-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Tags
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                        {draft.tags.map(tag => (
                            <span
                                key={tag}
                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
                            >
                                <Tag size={12} />
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 hover:text-red-500 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add tag..."
                            className="px-3 py-1.5 bg-transparent border border-dashed border-slate-300 rounded-lg text-xs outline-none focus:border-cyan-400 min-w-[100px]"
                        />
                    </div>
                </div>

                {/* @ Mention Helper */}
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                    <div className="flex items-start gap-3">
                        <HelpCircle size={16} className="text-cyan-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-cyan-900 text-sm mb-1">Quick Reference Guide</h4>
                            <p className="text-xs text-cyan-700 mb-3">
                                Type <code className="px-1.5 py-0.5 bg-white rounded font-mono">@</code> anywhere in your content to insert references:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {MENTION_CATEGORIES.map(cat => (
                                    <div key={cat.key} className="flex items-center gap-2 text-xs text-cyan-800">
                                        <span className="w-5 h-5 rounded bg-white flex items-center justify-center text-cyan-600">
                                            {cat.icon}
                                        </span>
                                        <code className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded">
                                            {cat.shortcut}
                                        </code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// === HELPER: Format preview content ===
function formatPreview(content: string): string {
    // Basic markdown to HTML conversion for preview
    return content
        // Headers
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-slate-900 mt-8 mb-4">$1</h1>')
        // Bold & Italic
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cyan-600 underline hover:text-cyan-800">$1</a>')
        // @Mentions - styled as chips
        .replace(/\[@(\w+):([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$3" class="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded-md text-sm font-medium no-underline hover:bg-cyan-200 transition-colors"><span class="opacity-60">@</span>$2</a>')
        // Blockquotes
        .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-cyan-400 pl-4 italic text-slate-600 my-4">$1</blockquote>')
        // Code
        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-sm">$1</code>')
        // Line breaks
        .replace(/\n/g, '<br />');
}

export default BlogEditor;
