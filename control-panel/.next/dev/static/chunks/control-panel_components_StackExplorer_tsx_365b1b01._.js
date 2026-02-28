(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/control-panel/components/StackExplorer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackExplorer",
    ()=>StackExplorer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const PHASE_ORDER = [
    "infrastructure",
    "1a",
    "1b",
    "1c",
    "2"
];
const PHASE_LABEL = {
    infrastructure: "Infrastructure",
    "1a": "Phase 1A",
    "1b": "Phase 1B",
    "1c": "Phase 1C",
    "2": "Phase 2"
};
const PHASE_COLOR = {
    infrastructure: "bg-violet-900/40 text-violet-300 border-violet-800/40",
    "1a": "bg-blue-900/40 text-blue-300 border-blue-800/40",
    "1b": "bg-cyan-900/40 text-cyan-300 border-cyan-800/40",
    "1c": "bg-teal-900/40 text-teal-300 border-teal-800/40",
    "2": "bg-indigo-900/40 text-indigo-300 border-indigo-800/40"
};
const VERDICT_COLOR = {
    ESSENTIAL: "bg-green-900/50 text-green-300 border-green-800/40",
    RECOMMENDED: "bg-amber-900/40 text-amber-300 border-amber-800/40"
};
const RISK_COLOR = {
    LOW: "text-green-400",
    MEDIUM: "text-yellow-400",
    HIGH: "text-red-400"
};
const DOMAIN_COLOR = {
    infrastructure: "text-violet-400",
    commerce: "text-emerald-400",
    fleet: "text-sky-400",
    iot: "text-cyan-400",
    crm: "text-orange-400",
    ai: "text-pink-400",
    marketing: "text-rose-400",
    education: "text-lime-400",
    health: "text-teal-400",
    security: "text-red-400",
    platform: "text-blue-400",
    bi: "text-yellow-400",
    internal: "text-gray-400"
};
function ServiceDetailPanel({ service, integrations, onClose }) {
    const flowsFrom = integrations.filter((f)=>f.source === service.id);
    const flowsTo = integrations.filter((f)=>f.target === service.id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1 pr-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-wrap mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-[10px] font-semibold px-1.5 py-0.5 rounded border ${PHASE_COLOR[service.phase] ?? "bg-gray-800 text-gray-300 border-gray-700"}`,
                                        children: PHASE_LABEL[service.phase] ?? service.phase
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 73,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-[10px] font-semibold px-1.5 py-0.5 rounded border ${VERDICT_COLOR[service.verdict] ?? "bg-gray-800 text-gray-300 border-gray-700"}`,
                                        children: service.verdict
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 80,
                                        columnNumber: 13
                                    }, this),
                                    service.buildFromSource && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-orange-900/40 text-orange-300 border-orange-800/40",
                                        children: "BUILD"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-white truncate",
                                children: service.name
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 font-mono mt-0.5",
                                children: service.id
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "text-gray-500 hover:text-gray-200 transition-colors text-lg leading-none flex-shrink-0 p-1 -mr-1",
                        "aria-label": "Close detail panel",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 py-4 space-y-5",
                children: [
                    service.role && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1",
                                children: "Role"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-300",
                                children: service.role
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800/60 rounded-lg px-3 py-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1",
                                        children: "Domain"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-sm font-semibold capitalize ${DOMAIN_COLOR[service.domain] ?? "text-gray-300"}`,
                                        children: service.domain
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800/60 rounded-lg px-3 py-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1",
                                        children: "Risk Level"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-sm font-semibold ${RISK_COLOR[service.riskLevel ?? "LOW"]}`,
                                        children: service.riskLevel ?? "LOW"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 125,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            service.defaultPort && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800/60 rounded-lg px-3 py-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1",
                                        children: "Default Port"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-mono text-gray-200",
                                        children: [
                                            ":",
                                            service.defaultPort
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this),
                            service.dockerImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800/60 rounded-lg px-3 py-2.5 col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1",
                                        children: "Docker Image"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-mono text-gray-300 break-all",
                                        children: service.dockerImage
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    service.riskNotes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-yellow-950/30 border border-yellow-800/30 rounded-lg px-3 py-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-semibold text-yellow-600 uppercase tracking-wide mb-1",
                                children: "⚠ Risk Notes"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-yellow-200/80",
                                children: service.riskNotes
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    service.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-800/40 border border-gray-700/40 rounded-lg px-3 py-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1",
                                children: "Notes"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-400",
                                children: service.notes
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 flex-wrap",
                        children: [
                            service.repository && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: service.repository,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-colors",
                                children: "GitHub ↗"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 162,
                                columnNumber: 13
                            }, this),
                            service.docsUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: service.docsUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-colors",
                                children: "Docs ↗"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this),
                            service.healthEndpoint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-500 font-mono",
                                children: service.healthEndpoint
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    flowsFrom.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-2",
                                children: [
                                    "Sends data to (",
                                    flowsFrom.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5",
                                children: flowsFrom.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-800/60 rounded-lg px-3 py-2 flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-blue-400 text-xs font-mono mt-0.5 flex-shrink-0",
                                                children: [
                                                    "→ ",
                                                    f.target
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                lineNumber: 197,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-300 truncate",
                                                        children: f.data
                                                    }, void 0, false, {
                                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] text-gray-600",
                                                        children: [
                                                            "via ",
                                                            f.via
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                        lineNumber: 200,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                lineNumber: 198,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 196,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this),
                    flowsTo.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-2",
                                children: [
                                    "Receives data from (",
                                    flowsTo.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5",
                                children: flowsTo.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-800/60 rounded-lg px-3 py-2 flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-purple-400 text-xs font-mono mt-0.5 flex-shrink-0",
                                                children: [
                                                    "← ",
                                                    f.source
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                lineNumber: 217,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-300 truncate",
                                                        children: f.data
                                                    }, void 0, false, {
                                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] text-gray-600",
                                                        children: [
                                                            "via ",
                                                            f.via
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                        lineNumber: 220,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                lineNumber: 218,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    flowsFrom.length === 0 && flowsTo.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1",
                                children: "Integrations"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-700",
                                children: "No integration flows defined."
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 231,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 229,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/control-panel/components/StackExplorer.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_c = ServiceDetailPanel;
function StackExplorer({ services, integrations }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [phaseFilter, setPhaseFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [verdictFilter, setVerdictFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StackExplorer.useMemo[filtered]": ()=>{
            const q = query.toLowerCase().trim();
            return services.filter({
                "StackExplorer.useMemo[filtered]": (s)=>{
                    if (phaseFilter !== "all" && s.phase !== phaseFilter) return false;
                    if (verdictFilter !== "all" && s.verdict !== verdictFilter) return false;
                    if (!q) return true;
                    return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || (s.role ?? "").toLowerCase().includes(q) || s.domain.toLowerCase().includes(q);
                }
            }["StackExplorer.useMemo[filtered]"]);
        }
    }["StackExplorer.useMemo[filtered]"], [
        services,
        query,
        phaseFilter,
        verdictFilter
    ]);
    const grouped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StackExplorer.useMemo[grouped]": ()=>{
            const map = {};
            for (const phase of PHASE_ORDER){
                const items = filtered.filter({
                    "StackExplorer.useMemo[grouped].items": (s)=>s.phase === phase
                }["StackExplorer.useMemo[grouped].items"]);
                if (items.length > 0) map[phase] = items;
            }
            return map;
        }
    }["StackExplorer.useMemo[grouped]"], [
        filtered
    ]);
    const selectedService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StackExplorer.useMemo[selectedService]": ()=>services.find({
                "StackExplorer.useMemo[selectedService]": (s)=>s.id === selectedId
            }["StackExplorer.useMemo[selectedService]"]) ?? null
    }["StackExplorer.useMemo[selectedService]"], [
        services,
        selectedId
    ]);
    const totalCount = services.length;
    const filteredCount = filtered.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-[calc(100vh-120px)] min-h-[500px] bg-gray-950 rounded-xl border border-gray-800 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex flex-col border-r border-gray-800 bg-gray-900/50 transition-all duration-200 ${selectedService ? "w-72 flex-shrink-0" : "flex-1"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 border-b border-gray-800 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-xs pointer-events-none",
                                        children: "🔍"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 288,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: query,
                                        onChange: (e)=>setQuery(e.target.value),
                                        placeholder: "Search services…",
                                        className: "w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-8 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:bg-gray-800 transition-colors"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 291,
                                        columnNumber: 13
                                    }, this),
                                    query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setQuery(""),
                                        className: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 text-xs",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 299,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 287,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: phaseFilter,
                                        onChange: (e)=>setPhaseFilter(e.target.value),
                                        className: "flex-1 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-400 focus:outline-none focus:border-blue-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "All Phases"
                                            }, void 0, false, {
                                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                lineNumber: 313,
                                                columnNumber: 15
                                            }, this),
                                            PHASE_ORDER.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: p,
                                                    children: PHASE_LABEL[p]
                                                }, p, false, {
                                                    fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 308,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: verdictFilter,
                                        onChange: (e)=>setVerdictFilter(e.target.value),
                                        className: "flex-1 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-400 focus:outline-none focus:border-blue-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "All Types"
                                            }, void 0, false, {
                                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                lineNumber: 325,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "ESSENTIAL",
                                                children: "Essential"
                                            }, void 0, false, {
                                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                lineNumber: 326,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "RECOMMENDED",
                                                children: "Recommended"
                                            }, void 0, false, {
                                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                lineNumber: 327,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 307,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-gray-700 px-0.5",
                                children: filteredCount === totalCount ? `${totalCount} services` : `${filteredCount} of ${totalCount} services`
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 330,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto",
                        children: Object.keys(grouped).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center h-full text-center px-6 py-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl mb-2",
                                    children: "🔍"
                                }, void 0, false, {
                                    fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                    lineNumber: 341,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500",
                                    children: "No services match"
                                }, void 0, false, {
                                    fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                    lineNumber: 342,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setQuery("");
                                        setPhaseFilter("all");
                                        setVerdictFilter("all");
                                    },
                                    className: "mt-3 text-xs text-blue-500 hover:text-blue-400",
                                    children: "Clear filters"
                                }, void 0, false, {
                                    fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                    lineNumber: 343,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/control-panel/components/StackExplorer.tsx",
                            lineNumber: 340,
                            columnNumber: 13
                        }, this) : Object.entries(grouped).map(([phase, items])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `sticky top-0 z-10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b border-t border-gray-800 ${PHASE_COLOR[phase] ?? "text-gray-500"} bg-gray-900`,
                                        children: [
                                            PHASE_LABEL[phase],
                                            " · ",
                                            items.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 354,
                                        columnNumber: 17
                                    }, this),
                                    items.map((svc)=>{
                                        const isSelected = selectedId === svc.id;
                                        const hasFlows = integrations.some((f)=>f.source === svc.id || f.target === svc.id);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedId(isSelected ? null : svc.id),
                                            className: `w-full text-left px-3 py-2 flex items-center gap-2 group border-b border-gray-800/60 transition-colors ${isSelected ? "bg-blue-900/30 border-l-2 border-l-blue-500" : "hover:bg-gray-800/50 border-l-2 border-l-transparent"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `w-1.5 h-1.5 rounded-full flex-shrink-0 ${svc.verdict === "ESSENTIAL" ? "bg-green-400" : "bg-amber-400"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                    lineNumber: 378,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: `text-xs font-medium truncate ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`,
                                                            children: svc.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                            lineNumber: 385,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-600 truncate font-mono",
                                                            children: svc.id
                                                        }, void 0, false, {
                                                            fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1 flex-shrink-0",
                                                    children: [
                                                        svc.buildFromSource && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[9px] px-1 py-0.5 rounded bg-orange-900/50 text-orange-400 border border-orange-800/40",
                                                            children: "BUILD"
                                                        }, void 0, false, {
                                                            fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                            lineNumber: 397,
                                                            columnNumber: 27
                                                        }, this),
                                                        hasFlows && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[9px] text-gray-600",
                                                            title: "Has integration flows",
                                                            children: "⇄"
                                                        }, void 0, false, {
                                                            fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                            lineNumber: 402,
                                                            columnNumber: 27
                                                        }, this),
                                                        (svc.riskLevel === "HIGH" || svc.riskLevel === "MEDIUM") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-[9px] ${RISK_COLOR[svc.riskLevel]}`,
                                                            title: `Risk: ${svc.riskLevel}`,
                                                            children: "⚠"
                                                        }, void 0, false, {
                                                            fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                                    lineNumber: 395,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, svc.id, true, {
                                            fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                            lineNumber: 368,
                                            columnNumber: 21
                                        }, this);
                                    })
                                ]
                            }, phase, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 352,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-2 border-t border-gray-800 flex items-center gap-3 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 text-[10px] text-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 426,
                                        columnNumber: 13
                                    }, this),
                                    " Essential"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 425,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 text-[10px] text-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                        lineNumber: 429,
                                        columnNumber: 13
                                    }, this),
                                    " Recommended"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 428,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-gray-700",
                                children: "⇄ Integrates"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 431,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-gray-700",
                                children: "⚠ Risk"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                                lineNumber: 432,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 424,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this),
            selectedService ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 bg-gray-900 min-w-0 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ServiceDetailPanel, {
                    service: selectedService,
                    integrations: integrations,
                    onClose: ()=>setSelectedId(null)
                }, void 0, false, {
                    fileName: "[project]/control-panel/components/StackExplorer.tsx",
                    lineNumber: 439,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                lineNumber: 438,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 hidden md:flex flex-col items-center justify-center text-center px-8 bg-gray-900/30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-4xl mb-3 opacity-20",
                        children: "◫"
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 447,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 max-w-xs",
                        children: "Select a service from the list to see its details, links, and integration flows."
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/StackExplorer.tsx",
                        lineNumber: 448,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/control-panel/components/StackExplorer.tsx",
                lineNumber: 446,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/control-panel/components/StackExplorer.tsx",
        lineNumber: 278,
        columnNumber: 5
    }, this);
}
_s(StackExplorer, "t5OR1HgPcqV/16IQJ0f+RMFi120=");
_c1 = StackExplorer;
var _c, _c1;
__turbopack_context__.k.register(_c, "ServiceDetailPanel");
__turbopack_context__.k.register(_c1, "StackExplorer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=control-panel_components_StackExplorer_tsx_365b1b01._.js.map