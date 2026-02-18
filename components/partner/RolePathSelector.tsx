import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Stethoscope, DollarSign, ChevronRight, Check } from 'lucide-react';

type Role = 'operator' | 'manager' | 'sales';

interface RolePath {
    id: Role;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    modules: string[];
    estimatedTime: string;
}

const ROLE_PATHS: RolePath[] = [
    {
        id: 'operator',
        title: 'Operator Track',
        description: 'Master technical procedures and safety protocols',
        icon: <Stethoscope className="w-6 h-6" />,
        color: 'from-cyan-500 to-blue-600',
        modules: ['Chamber Prep', 'Pressurization', 'Emergency Response', 'Client Monitoring', 'Simulator Training'],
        estimatedTime: '2-3 hours'
    },
    {
        id: 'manager',
        title: 'Manager Track',
        description: 'Business operations, compliance, and team leadership',
        icon: <Briefcase className="w-6 h-6" />,
        color: 'from-purple-500 to-indigo-600',
        modules: ['Compliance Essentials', 'Team Management', 'Quality Assurance', 'Reporting & Analytics', 'Incident Handling'],
        estimatedTime: '3-4 hours'
    },
    {
        id: 'sales',
        title: 'Sales Track',
        description: 'Benefits, objection handling, and client conversion',
        icon: <DollarSign className="w-6 h-6" />,
        color: 'from-emerald-500 to-teal-600',
        modules: ['Benefits Overview', 'Client Consultation', 'Objection Handling', 'Upselling Techniques', 'Follow-up Strategies'],
        estimatedTime: '1.5-2 hours'
    }
];

interface RolePathSelectorProps {
    onSelectPath?: (role: Role) => void;
}

export const RolePathSelector: React.FC<RolePathSelectorProps> = ({ onSelectPath }) => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [hoveredRole, setHoveredRole] = useState<Role | null>(null);

    const handleSelect = (role: Role) => {
        setSelectedRole(role);
        onSelectPath?.(role);
    };

    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Choose Your Learning Path</h3>
                <p className="text-sm text-slate-500">Select a track based on your role for personalized content</p>
            </div>

            <div className="grid gap-4">
                {ROLE_PATHS.map((path) => (
                    <motion.button
                        key={path.id}
                        onHoverStart={() => setHoveredRole(path.id)}
                        onHoverEnd={() => setHoveredRole(null)}
                        onClick={() => handleSelect(path.id)}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden
                            ${selectedRole === path.id
                                ? 'border-cyan-500 bg-cyan-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        {/* Background Gradient on Hover */}
                        <AnimatePresence>
                            {hoveredRole === path.id && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.05 }}
                                    exit={{ opacity: 0 }}
                                    className={`absolute inset-0 bg-gradient-to-r ${path.color}`}
                                />
                            )}
                        </AnimatePresence>

                        <div className="relative flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${path.color} text-white shadow-lg`}>
                                {path.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-slate-900">{path.title}</h4>
                                    {selectedRole === path.id ? (
                                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 mb-2">{path.description}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {path.modules.slice(0, 3).map((mod) => (
                                        <span key={mod} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                            {mod}
                                        </span>
                                    ))}
                                    {path.modules.length > 3 && (
                                        <span className="text-[10px] text-slate-400">+{path.modules.length - 3} more</span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-400">⏱ {path.estimatedTime}</span>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {selectedRole && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
                >
                    <p className="text-sm text-emerald-700">
                        ✓ Great choice! Your content is now personalized for the <strong>{ROLE_PATHS.find(p => p.id === selectedRole)?.title}</strong>.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
