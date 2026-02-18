import React from 'react';

interface VersionSelectorProps {
    currentVersion: string;
    onVersionChange: (v: string) => void;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({ currentVersion, onVersionChange }) => {
    return (
        <div className="fixed top-24 right-6 z-50">
            <select
                value={currentVersion}
                onChange={(e) => onVersionChange(e.target.value)}
                className="bg-white/80 backdrop-blur-md border border-[#E0DED6] rounded-lg px-3 py-1 text-sm font-medium text-[#1A1A1A] shadow-lg cursor-pointer hover:border-[#0A6E6E] focus:outline-none focus:ring-1 focus:ring-[#0A6E6E]"
            >
                <option value="v1">Version 1 (Loki Mode)</option>
                <option value="v2" disabled>Version 2 (Coming Soon)</option>
                <option value="v3" disabled>Version 3 (Coming Soon)</option>
            </select>
        </div>
    );
};
