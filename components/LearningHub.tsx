import React from 'react';
import { Course } from '../types';
import { BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react';

interface LearningHubProps {
    courses: Course[];
}

export const LearningHub: React.FC<LearningHubProps> = ({ courses }) => {
    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-3">
                    <BookOpen className="text-gray-900" size={20} />
                    <span className="futuristic-font">Hylono Academy</span>
                </h3>
                <span className="text-[10px] uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                    Proprietary IP
                </span>
            </div>

            <div className="space-y-6">
                {courses.map((course) => (
                    <div key={course.id} className={`p-4 rounded-xl border transition-all hover:shadow-md ${course.locked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 hover:border-black'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-sm mb-1">{course.title}</h4>
                                <p className="text-xs text-gray-500 line-clamp-1">{course.description}</p>
                            </div>
                            {course.locked ? (
                                <Lock size={14} className="text-gray-400" />
                            ) : (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    {course.progress}% Complete
                                </span>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                            <div
                                className="h-full bg-gray-900 rounded-full transition-all duration-1000"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>

                        {/* Modules Preview */}
                        {!course.locked && (
                            <div className="space-y-2">
                                {course.modules.slice(0, 2).map((mod) => (
                                    <div key={mod.title} className="flex items-center justify-between text-xs text-gray-600">
                                        <div className="flex items-center gap-2">
                                            {mod.completed ? <CheckCircle size={12} className="text-emerald-500" /> : <PlayCircle size={12} className="text-gray-400" />}
                                            <span>{mod.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {course.locked && (
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mt-2">
                                <Lock size={10} /> Requires {course.title.includes('Advanced') ? 'Level 2' : 'Device'} Access
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                View All Certifications
            </button>
        </div>
    );
};
