import React from 'react';
import { motion } from 'framer-motion';

interface SkillRadarChartProps {
    skills: {
        name: string;
        score: number; // 0-100
        icon: string;
    }[];
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ skills }) => {
    const centerX = 120;
    const centerY = 120;
    const maxRadius = 100;
    const levels = [25, 50, 75, 100];

    const getPointOnCircle = (angle: number, radius: number) => {
        const radian = (angle - 90) * (Math.PI / 180);
        return {
            x: centerX + radius * Math.cos(radian),
            y: centerY + radius * Math.sin(radian)
        };
    };

    const angleStep = 360 / skills.length;

    const polygonPoints = skills.map((skill, i) => {
        const angle = i * angleStep;
        const radius = (skill.score / 100) * maxRadius;
        const point = getPointOnCircle(angle, radius);
        return `${point.x},${point.y}`;
    }).join(' ');

    return (
        <div className="relative">
            <svg viewBox="0 0 240 240" className="w-full h-full max-w-[280px] mx-auto">
                {/* Grid Circles */}
                {levels.map((level) => (
                    <circle
                        key={level}
                        cx={centerX}
                        cy={centerY}
                        r={(level / 100) * maxRadius}
                        fill="none"
                        stroke="rgba(148, 163, 184, 0.2)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis Lines */}
                {skills.map((_, i) => {
                    const angle = i * angleStep;
                    const endPoint = getPointOnCircle(angle, maxRadius);
                    return (
                        <line
                            key={i}
                            x1={centerX}
                            y1={centerY}
                            x2={endPoint.x}
                            y2={endPoint.y}
                            stroke="rgba(148, 163, 184, 0.2)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Skill Polygon */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    points={polygonPoints}
                    fill="rgba(6, 182, 212, 0.3)"
                    stroke="rgb(6, 182, 212)"
                    strokeWidth="2"
                />

                {/* Skill Labels */}
                {skills.map((skill, i) => {
                    const angle = i * angleStep;
                    const labelPoint = getPointOnCircle(angle, maxRadius + 20);
                    return (
                        <g key={skill.name}>
                            <text
                                x={labelPoint.x}
                                y={labelPoint.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] fill-slate-600 font-medium"
                            >
                                {skill.icon}
                            </text>
                            <text
                                x={labelPoint.x}
                                y={labelPoint.y + 12}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[8px] fill-slate-500"
                            >
                                {skill.name}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-1.5 text-xs">
                        <span>{skill.icon}</span>
                        <span className="text-slate-600">{skill.name}:</span>
                        <span className={`font-bold ${skill.score >= 80 ? 'text-emerald-600' : skill.score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                            {skill.score}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
