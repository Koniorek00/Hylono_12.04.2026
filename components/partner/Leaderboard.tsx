import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    name: string;
    avatar: string;
    xp: number;
    streak: number;
    isCurrentUser?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: 'Sarah M.', avatar: '👩‍⚕️', xp: 2450, streak: 12 },
    { rank: 2, name: 'Mike R.', avatar: '👨‍⚕️', xp: 2180, streak: 8 },
    { rank: 3, name: 'Dr. Chen', avatar: '🧑‍⚕️', xp: 1920, streak: 15 },
    { rank: 4, name: 'You', avatar: '🙂', xp: 1750, streak: 3, isCurrentUser: true },
    { rank: 5, name: 'Lisa K.', avatar: '👩‍🔬', xp: 1640, streak: 5 },
];

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1: return <Crown className="w-5 h-5 text-amber-500" />;
        case 2: return <Medal className="w-5 h-5 text-slate-400" />;
        case 3: return <Award className="w-5 h-5 text-amber-700" />;
        default: return <span className="text-slate-400 font-bold text-sm">#{rank}</span>;
    }
};

export const Leaderboard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-white" />
                <h3 className="font-bold text-white">Weekly Leaderboard</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {MOCK_LEADERBOARD.map((entry, idx) => (
                    <motion.div
                        key={entry.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex items-center gap-3 px-4 py-3 ${entry.isCurrentUser ? 'bg-cyan-50' : 'hover:bg-slate-50'} transition-colors`}
                    >
                        <div className="w-8 flex justify-center">
                            {getRankIcon(entry.rank)}
                        </div>
                        <span className="text-2xl">{entry.avatar}</span>
                        <div className="flex-1">
                            <span className={`font-medium ${entry.isCurrentUser ? 'text-cyan-700' : 'text-slate-700'}`}>
                                {entry.name}
                            </span>
                            {entry.isCurrentUser && (
                                <span className="ml-2 text-[10px] bg-cyan-500 text-white px-1.5 py-0.5 rounded-full uppercase">You</span>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-slate-900">{entry.xp.toLocaleString()} XP</div>
                            <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
                                <span className="text-orange-500">🔥</span> {entry.streak} day streak
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
