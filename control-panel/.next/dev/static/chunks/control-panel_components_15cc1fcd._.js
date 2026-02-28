(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/control-panel/components/ServiceGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServiceGrid",
    ()=>ServiceGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
const DOMAIN_COLORS = {
    commerce: "bg-emerald-500",
    fleet: "bg-amber-500",
    iot: "bg-blue-500",
    crm: "bg-purple-500",
    ai: "bg-pink-500",
    marketing: "bg-orange-500",
    education: "bg-cyan-500",
    health: "bg-red-500",
    security: "bg-indigo-500",
    platform: "bg-teal-500",
    bi: "bg-violet-500",
    internal: "bg-gray-500",
    infrastructure: "bg-gray-400"
};
const DOMAIN_DESC = {
    commerce: "E-commerce, billing, payments",
    fleet: "Equipment tracking, lending, scheduling",
    iot: "Device telemetry, MQTT, dashboards",
    crm: "Customer relationships, notifications, signatures",
    ai: "Search, RAG, recommendations",
    marketing: "Email, surveys, communities",
    education: "LMS, training, documentation",
    health: "Telehealth, wearables, medical records",
    security: "IAM, monitoring, compliance",
    platform: "Automation, orchestration, API gateway",
    bi: "Analytics, dashboards",
    internal: "Internal tools, wikis",
    infrastructure: "Core services: DB, cache, storage"
};
const PHASE_LABELS = {
    infrastructure: "Infrastructure",
    "1a": "Phase 1A — Commerce, Fleet, CRM, IAM",
    "1b": "Phase 1B — IoT, AI, Education, Health",
    "1c": "Phase 1C — Marketing, Platform, Security",
    "2": "Phase 2 — Recommended Additions"
};
const PHASE_ORDER = [
    "infrastructure",
    "1a",
    "1b",
    "1c",
    "2"
];
const ALL_DOMAINS = [
    "infrastructure",
    "commerce",
    "fleet",
    "iot",
    "crm",
    "ai",
    "marketing",
    "education",
    "health",
    "security",
    "platform",
    "bi",
    "internal"
];
const SELECT_CLS = "bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-blue-500";
// ── Card view ────────────────────────────────────────────────────────────────
function ServiceCard({ svc }) {
    _s();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const domainColor = DOMAIN_COLORS[svc.domain] ?? "bg-gray-500";
    const isHighRisk = svc.riskLevel === "HIGH" || svc.riskLevel === "MEDIUM";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gray-900 border border-gray-800 rounded-lg flex flex-col hover:border-gray-600 transition-colors cursor-pointer",
        onClick: ()=>setExpanded(!expanded),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 flex flex-col gap-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-gray-100 text-sm truncate",
                                                children: svc.name
                                            }, void 0, false, {
                                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                                lineNumber: 71,
                                                columnNumber: 15
                                            }, this),
                                            isHighRisk && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                title: svc.riskNotes ?? `Risk: ${svc.riskLevel}`,
                                                className: "text-yellow-400 text-xs flex-shrink-0",
                                                children: "⚠"
                                            }, void 0, false, {
                                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                                lineNumber: 73,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 70,
                                        columnNumber: 13
                                    }, this),
                                    svc.role && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-0.5 truncate",
                                        children: svc.role
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 76,
                                        columnNumber: 26
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${svc.verdict === "ESSENTIAL" ? "bg-green-900 text-green-300 border border-green-700" : "bg-amber-900 text-amber-300 border border-amber-700"}`,
                                children: svc.verdict === "ESSENTIAL" ? "E" : "R"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `${domainColor} text-white text-xs font-medium px-1.5 py-0.5 rounded`,
                                children: svc.domain
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            svc.defaultPort && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-600 font-mono",
                                children: [
                                    ":",
                                    svc.defaultPort
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 90,
                                columnNumber: 31
                            }, this),
                            svc.buildFromSource && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-orange-400 border border-orange-800 rounded px-1 py-0.5",
                                children: "src"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 pt-1 border-t border-gray-800",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: svc.repository,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                onClick: (e)=>e.stopPropagation(),
                                className: "text-xs text-blue-400 hover:text-blue-300 transition-colors",
                                children: "GitHub ↗"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            svc.docsUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: svc.docsUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                onClick: (e)=>e.stopPropagation(),
                                className: "text-xs text-gray-500 hover:text-gray-300 transition-colors",
                                children: "Docs ↗"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4 pt-2 border-t border-gray-800 bg-gray-900/50 space-y-1.5",
                children: [
                    svc.dockerImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5",
                                children: "image"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 118,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "text-xs text-cyan-400 font-mono break-all",
                                children: svc.dockerImage
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 119,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 117,
                        columnNumber: 13
                    }, this),
                    svc.buildFromSource && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5",
                                children: "build"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 124,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-orange-400",
                                children: "Must build from source — no official image"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 125,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 123,
                        columnNumber: 13
                    }, this),
                    svc.riskNotes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5",
                                children: "risk"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 130,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-yellow-400",
                                children: svc.riskNotes
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 131,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 129,
                        columnNumber: 13
                    }, this),
                    svc.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5",
                                children: "notes"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 136,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: svc.notes
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 137,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 135,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5",
                                children: "domain"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: DOMAIN_DESC[svc.domain] ?? svc.domain
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5",
                                children: "id"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "text-xs text-gray-600 font-mono",
                                children: svc.id
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(ServiceCard, "DuL5jiiQQFgbn7gBKAyxwS/H4Ek=");
_c = ServiceCard;
// ── Compact row view ─────────────────────────────────────────────────────────
function ServiceRow({ svc }) {
    _s1();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dotColor = DOMAIN_COLORS[svc.domain] ?? "bg-gray-500";
    const isHighRisk = svc.riskLevel === "HIGH" || svc.riskLevel === "MEDIUM";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors text-xs",
                onClick: ()=>setExpanded(!expanded),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-3 py-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`
                                }, void 0, false, {
                                    fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium text-gray-100",
                                    children: svc.name
                                }, void 0, false, {
                                    fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this),
                                isHighRisk && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-yellow-400",
                                    title: svc.riskNotes ?? "Elevated risk",
                                    children: "⚠"
                                }, void 0, false, {
                                    fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                    lineNumber: 171,
                                    columnNumber: 28
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-3 py-2 text-gray-500 hidden sm:table-cell truncate max-w-48",
                        children: svc.role ?? "—"
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-3 py-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: svc.verdict === "ESSENTIAL" ? "text-green-400 font-semibold" : "text-amber-400",
                            children: svc.verdict === "ESSENTIAL" ? "✓" : "○"
                        }, void 0, false, {
                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-3 py-2 text-gray-600 font-mono hidden md:table-cell",
                        children: svc.defaultPort ? `:${svc.defaultPort}` : ""
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-3 py-2 hidden lg:table-cell",
                        children: svc.buildFromSource && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-orange-400",
                            children: "src"
                        }, void 0, false, {
                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                            lineNumber: 182,
                            columnNumber: 35
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-3 py-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: svc.repository,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            onClick: (e)=>e.stopPropagation(),
                            className: "text-blue-400 hover:text-blue-300",
                            children: "GH ↗"
                        }, void 0, false, {
                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "border-b border-gray-800 bg-gray-900/60",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                    colSpan: 6,
                    className: "px-4 py-2.5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-x-6 gap-y-1 text-xs",
                        children: [
                            svc.dockerImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-600",
                                        children: "image:"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 195,
                                        columnNumber: 23
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        className: "text-cyan-400 font-mono",
                                        children: svc.dockerImage
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 195,
                                        columnNumber: 69
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 195,
                                columnNumber: 17
                            }, this),
                            svc.riskNotes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-600",
                                        children: "risk:"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 198,
                                        columnNumber: 23
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-yellow-400",
                                        children: svc.riskNotes
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 198,
                                        columnNumber: 68
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 198,
                                columnNumber: 17
                            }, this),
                            svc.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-600",
                                        children: "note:"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 201,
                                        columnNumber: 23
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: svc.notes
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 201,
                                        columnNumber: 68
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 201,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-600",
                                        children: "id:"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 203,
                                        columnNumber: 21
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        className: "text-gray-600 font-mono",
                                        children: svc.id
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 203,
                                        columnNumber: 64
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 203,
                                columnNumber: 15
                            }, this),
                            svc.docsUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: svc.docsUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                onClick: (e)=>e.stopPropagation(),
                                className: "text-gray-500 hover:text-gray-300",
                                children: "Docs ↗"
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 205,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 193,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                    lineNumber: 192,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                lineNumber: 191,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s1(ServiceRow, "DuL5jiiQQFgbn7gBKAyxwS/H4Ek=");
_c1 = ServiceRow;
function ServiceGrid({ services }) {
    _s2();
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterDomain, setFilterDomain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [filterPhase, setFilterPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [filterVerdict, setFilterVerdict] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [compact, setCompact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const searchRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // "/" focuses search
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServiceGrid.useEffect": ()=>{
            const handler = {
                "ServiceGrid.useEffect.handler": (e)=>{
                    const tag = e.target.tagName;
                    if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
                        e.preventDefault();
                        searchRef.current?.focus();
                        searchRef.current?.select();
                    }
                }
            }["ServiceGrid.useEffect.handler"];
            window.addEventListener("keydown", handler);
            return ({
                "ServiceGrid.useEffect": ()=>window.removeEventListener("keydown", handler)
            })["ServiceGrid.useEffect"];
        }
    }["ServiceGrid.useEffect"], []);
    const clearAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ServiceGrid.useCallback[clearAll]": ()=>{
            setSearch("");
            setFilterDomain("all");
            setFilterPhase("all");
            setFilterVerdict("all");
        }
    }["ServiceGrid.useCallback[clearAll]"], []);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ServiceGrid.useMemo[filtered]": ()=>{
            return services.filter({
                "ServiceGrid.useMemo[filtered]": (s)=>{
                    const q = search.toLowerCase();
                    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.role?.toLowerCase().includes(q) || s.domain.includes(q);
                    const matchDomain = filterDomain === "all" || s.domain === filterDomain;
                    const matchPhase = filterPhase === "all" || s.phase === filterPhase;
                    const matchVerdict = filterVerdict === "all" || s.verdict === filterVerdict;
                    return matchSearch && matchDomain && matchPhase && matchVerdict;
                }
            }["ServiceGrid.useMemo[filtered]"]);
        }
    }["ServiceGrid.useMemo[filtered]"], [
        services,
        search,
        filterDomain,
        filterPhase,
        filterVerdict
    ]);
    const byPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ServiceGrid.useMemo[byPhase]": ()=>{
            const map = {};
            for (const p of PHASE_ORDER)map[p] = filtered.filter({
                "ServiceGrid.useMemo[byPhase]": (s)=>s.phase === p
            }["ServiceGrid.useMemo[byPhase]"]);
            return map;
        }
    }["ServiceGrid.useMemo[byPhase]"], [
        filtered
    ]);
    const activeFilters = (search ? 1 : 0) + (filterDomain !== "all" ? 1 : 0) + (filterPhase !== "all" ? 1 : 0) + (filterVerdict !== "all" ? 1 : 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-900 border border-gray-800 rounded-xl p-3 mb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-40 relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: searchRef,
                                        type: "text",
                                        value: search,
                                        onChange: (e)=>setSearch(e.target.value),
                                        placeholder: "🔍 Search  /",
                                        className: "w-full bg-gray-800 border border-gray-700 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    search && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSearch(""),
                                        className: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 text-xs",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: filterPhase,
                                onChange: (e)=>setFilterPhase(e.target.value),
                                className: SELECT_CLS,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "All phases"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 289,
                                        columnNumber: 13
                                    }, this),
                                    PHASE_ORDER.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: p,
                                            children: p === "infrastructure" ? "Infrastructure" : `Phase ${p.toUpperCase()}`
                                        }, p, false, {
                                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                            lineNumber: 291,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 288,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: filterDomain,
                                onChange: (e)=>setFilterDomain(e.target.value),
                                className: SELECT_CLS,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "All domains"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 296,
                                        columnNumber: 13
                                    }, this),
                                    ALL_DOMAINS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: d,
                                            children: d
                                        }, d, false, {
                                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                            lineNumber: 297,
                                            columnNumber: 37
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: filterVerdict,
                                onChange: (e)=>setFilterVerdict(e.target.value),
                                className: SELECT_CLS,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "All"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "ESSENTIAL",
                                        children: "Essential"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 302,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "RECOMMENDED",
                                        children: "Recommended"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            activeFilters > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearAll,
                                className: "text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded-lg px-3 py-2 transition-colors",
                                children: [
                                    "✕ ",
                                    activeFilters
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center bg-gray-800 border border-gray-700 rounded-lg p-0.5 gap-0.5 ml-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCompact(false),
                                        title: "Card view",
                                        className: `px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${!compact ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`,
                                        children: "⊞"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 314,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCompact(true),
                                        title: "Table view",
                                        className: `px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${compact ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`,
                                        children: "☰"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 318,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 313,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-600",
                                children: filtered.length !== services.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-blue-400 font-medium",
                                            children: filtered.length
                                        }, void 0, false, {
                                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                            lineNumber: 329,
                                            columnNumber: 19
                                        }, this),
                                        " of ",
                                        services.length
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        services.length,
                                        " services"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 ml-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-700",
                                        children: "↓"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 334,
                                        columnNumber: 13
                                    }, this),
                                    PHASE_ORDER.map((p)=>{
                                        const count = byPhase[p]?.length ?? 0;
                                        if (count === 0) return null;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `#phase-${p}`,
                                            className: "text-xs text-gray-600 hover:text-blue-400 transition-colors font-mono",
                                            children: p === "infrastructure" ? "infra" : p
                                        }, p, false, {
                                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                            lineNumber: 339,
                                            columnNumber: 17
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-gray-800 overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-900 text-gray-600 uppercase text-xs tracking-wide border-b border-gray-800",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "Service"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 355,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2 hidden sm:table-cell",
                                        children: "Role"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 356,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        title: "✓ = Essential  ○ = Recommended",
                                        children: "E"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 357,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2 hidden md:table-cell",
                                        children: "Port"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2 hidden lg:table-cell",
                                        children: "Src"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 359,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2",
                                        children: "Repo"
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 360,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 354,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                            lineNumber: 353,
                            columnNumber: 13
                        }, this),
                        PHASE_ORDER.map((phase)=>{
                            const svcs = byPhase[phase];
                            if (!svcs || svcs.length === 0) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                id: `phase-${phase}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "bg-gray-950",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 6,
                                            className: "px-3 py-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-semibold text-gray-500 uppercase tracking-widest",
                                                children: [
                                                    PHASE_LABELS[phase],
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-700 font-normal",
                                                        children: [
                                                            "(",
                                                            svcs.length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                                        lineNumber: 371,
                                                        columnNumber: 47
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                                lineNumber: 370,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                            lineNumber: 369,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 368,
                                        columnNumber: 19
                                    }, this),
                                    svcs.map((svc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ServiceRow, {
                                            svc: svc
                                        }, svc.id, false, {
                                            fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                            lineNumber: 375,
                                            columnNumber: 38
                                        }, this))
                                ]
                            }, phase, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 367,
                                columnNumber: 17
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                    lineNumber: 352,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                lineNumber: 351,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: PHASE_ORDER.map((phase)=>{
                    const svcs = byPhase[phase];
                    if (!svcs || svcs.length === 0) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        id: `phase-${phase}`,
                        className: "mb-8 scroll-mt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold text-gray-300 mb-3 pb-2 border-b border-gray-800 flex items-center gap-2",
                                children: [
                                    PHASE_LABELS[phase],
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-normal text-gray-600",
                                        children: [
                                            "(",
                                            svcs.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 390,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `#phase-${phase}`,
                                        className: "ml-auto text-xs text-gray-700 hover:text-gray-500 font-mono transition-colors",
                                        children: [
                                            "#",
                                            phase
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 391,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 388,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3",
                                children: svcs.map((svc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ServiceCard, {
                                        svc: svc
                                    }, svc.id, false, {
                                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                        lineNumber: 394,
                                        columnNumber: 38
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                                lineNumber: 393,
                                columnNumber: 17
                            }, this)
                        ]
                    }, phase, true, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 387,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false),
            filtered.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-16 text-gray-600",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-3xl mb-3",
                        children: "🔍"
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 404,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm",
                        children: "No services match."
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 405,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: clearAll,
                        className: "mt-3 text-xs text-blue-400 hover:text-blue-300",
                        children: "Clear filters"
                    }, void 0, false, {
                        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                        lineNumber: 406,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/control-panel/components/ServiceGrid.tsx",
                lineNumber: 403,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/control-panel/components/ServiceGrid.tsx",
        lineNumber: 268,
        columnNumber: 5
    }, this);
}
_s2(ServiceGrid, "o3XEicGMDUwtrvbi5aG50ef2QsI=");
_c2 = ServiceGrid;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ServiceCard");
__turbopack_context__.k.register(_c1, "ServiceRow");
__turbopack_context__.k.register(_c2, "ServiceGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/control-panel/components/QuickActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QuickActions",
    ()=>QuickActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ACTIONS = [
    {
        label: "infra",
        icon: "🏗",
        text: "bash setup.sh infrastructure",
        title: "Copy: launch infrastructure services (step 1)"
    },
    {
        label: "phase 1a",
        icon: "🚀",
        text: "bash setup.sh 1a",
        title: "Copy: launch Phase 1A services (step 2)"
    },
    {
        label: "phase 1b",
        icon: "🔬",
        text: "bash setup.sh 1b",
        title: "Copy: launch Phase 1B services"
    }
];
function CopyChip({ action }) {
    _s();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleCopy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CopyChip.useCallback[handleCopy]": async ()=>{
            try {
                await navigator.clipboard.writeText(action.text);
                setCopied(true);
                setTimeout({
                    "CopyChip.useCallback[handleCopy]": ()=>setCopied(false)
                }["CopyChip.useCallback[handleCopy]"], 1800);
            } catch  {
            // clipboard unavailable in some environments
            }
        }
    }["CopyChip.useCallback[handleCopy]"], [
        action.text
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleCopy,
        title: action.title,
        className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${copied ? "bg-green-900/80 border-green-700 text-green-300" : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600 hover:text-white active:scale-95"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: copied ? "✓" : action.icon
            }, void 0, false, {
                fileName: "[project]/control-panel/components/QuickActions.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-mono",
                children: copied ? "copied!" : action.label
            }, void 0, false, {
                fileName: "[project]/control-panel/components/QuickActions.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/control-panel/components/QuickActions.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(CopyChip, "p/6Yo8FQEJZXv4gOdZmefYkNrGA=");
_c = CopyChip;
function QuickActions() {
    _s1();
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Show bar only after user has scrolled a bit
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickActions.useEffect": ()=>{
            const onScroll = {
                "QuickActions.useEffect.onScroll": ()=>{
                    const y = window.scrollY;
                    setScrolled(y > 200);
                }
            }["QuickActions.useEffect.onScroll"];
            window.addEventListener("scroll", onScroll, {
                passive: true
            });
            return ({
                "QuickActions.useEffect": ()=>window.removeEventListener("scroll", onScroll)
            })["QuickActions.useEffect"];
        }
    }["QuickActions.useEffect"], []);
    // Always visible on the stack page — just animate in after mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickActions.useEffect": ()=>{
            const t = setTimeout({
                "QuickActions.useEffect.t": ()=>setVisible(true)
            }["QuickActions.useEffect.t"], 300);
            return ({
                "QuickActions.useEffect": ()=>clearTimeout(t)
            })["QuickActions.useEffect"];
        }
    }["QuickActions.useEffect"], []);
    const scrollTop = ()=>window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `fixed bottom-5 right-5 z-50 flex items-center gap-2 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-1.5 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl px-3 py-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs text-gray-600 font-medium pr-1 hidden sm:block",
                    children: "Quick copy:"
                }, void 0, false, {
                    fileName: "[project]/control-panel/components/QuickActions.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                ACTIONS.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyChip, {
                        action: a
                    }, a.label, false, {
                        fileName: "[project]/control-panel/components/QuickActions.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-px h-4 bg-gray-700 mx-1"
                }, void 0, false, {
                    fileName: "[project]/control-panel/components/QuickActions.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: scrollTop,
                    title: "Scroll to top",
                    className: `p-1.5 rounded-lg text-xs transition-all duration-200 border ${scrolled ? "text-gray-400 hover:text-white border-gray-700 hover:bg-gray-700" : "text-gray-700 border-gray-800 cursor-default"}`,
                    disabled: !scrolled,
                    "aria-label": "Scroll to top",
                    children: "↑"
                }, void 0, false, {
                    fileName: "[project]/control-panel/components/QuickActions.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setVisible(false),
                    title: "Hide quick actions (refresh to restore)",
                    className: "p-1.5 rounded-lg text-xs text-gray-700 hover:text-gray-400 transition-colors",
                    "aria-label": "Dismiss quick actions bar",
                    children: "×"
                }, void 0, false, {
                    fileName: "[project]/control-panel/components/QuickActions.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/control-panel/components/QuickActions.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/control-panel/components/QuickActions.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s1(QuickActions, "KmSSm1w/oCzraBb9kwugggSW4Pw=");
_c1 = QuickActions;
var _c, _c1;
__turbopack_context__.k.register(_c, "CopyChip");
__turbopack_context__.k.register(_c1, "QuickActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=control-panel_components_15cc1fcd._.js.map