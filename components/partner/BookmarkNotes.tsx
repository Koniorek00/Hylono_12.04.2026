import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, StickyNote, X, Plus, Trash2 } from 'lucide-react';

interface BookmarkNote {
    id: string;
    timestamp: number; // percentage
    note: string;
    createdAt: string;
}

interface BookmarkNotesProps {
    videoId: string;
    currentProgress: number;
    onSeek?: (timestamp: number) => void;
}

export const BookmarkNotes: React.FC<BookmarkNotesProps> = ({ videoId, currentProgress, onSeek }) => {
    const [bookmarks, setBookmarks] = useState<BookmarkNote[]>([
        { id: '1', timestamp: 25, note: 'Important safety tip here!', createdAt: '2 min ago' },
        { id: '2', timestamp: 60, note: 'Remember this sequence', createdAt: '1 min ago' }
    ]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [newNote, setNewNote] = useState('');

    const addBookmark = () => {
        if (!newNote.trim()) return;

        const bookmark: BookmarkNote = {
            id: Date.now().toString(),
            timestamp: Math.round(currentProgress),
            note: newNote,
            createdAt: 'Just now'
        };

        setBookmarks(prev => [...prev, bookmark].sort((a, b) => a.timestamp - b.timestamp));
        setNewNote('');
    };

    const removeBookmark = (id: string) => {
        setBookmarks(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                    ${isExpanded
                        ? 'bg-amber-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
            >
                {bookmarks.length > 0 ? (
                    <BookmarkCheck className="w-4 h-4" />
                ) : (
                    <Bookmark className="w-4 h-4" />
                )}
                <span>{bookmarks.length} Notes</span>
            </button>

            {/* Expanded Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-2 w-72 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden"
                    >
                        <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white">
                                <StickyNote className="w-4 h-4 text-amber-400" />
                                <span className="font-medium text-sm">My Notes</span>
                            </div>
                            <button onClick={() => setIsExpanded(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Notes List */}
                        <div className="max-h-48 overflow-y-auto">
                            {bookmarks.length === 0 ? (
                                <div className="p-4 text-center text-slate-500 text-sm">
                                    No bookmarks yet. Add one below!
                                </div>
                            ) : (
                                bookmarks.map((bm) => (
                                    <div
                                        key={bm.id}
                                        className="p-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <button
                                                onClick={() => onSeek?.(bm.timestamp)}
                                                className="flex-1 text-left"
                                            >
                                                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
                                                    @{bm.timestamp}%
                                                </span>
                                                <p className="text-sm text-white mt-1">{bm.note}</p>
                                                <span className="text-[10px] text-slate-500">{bm.createdAt}</span>
                                            </button>
                                            <button
                                                onClick={() => removeBookmark(bm.id)}
                                                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Note */}
                        <div className="p-3 bg-slate-800 border-t border-slate-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addBookmark()}
                                    placeholder={`Add note at ${Math.round(currentProgress)}%...`}
                                    className="flex-1 px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    onClick={addBookmark}
                                    disabled={!newNote.trim()}
                                    className="p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
