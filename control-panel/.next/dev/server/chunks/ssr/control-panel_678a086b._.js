module.exports = [
"[project]/control-panel/components/CopyButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CopyButton",
    ()=>CopyButton,
    "CopyCodeBlock",
    ()=>CopyCodeBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function CopyButton({ text, label = "Copy" }) {
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const copy = ()=>{
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: copy,
        className: "inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors",
        children: copied ? "✓ Copied!" : `📋 ${label}`
    }, void 0, false, {
        fileName: "[project]/control-panel/components/CopyButton.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
function CopyCodeBlock({ code, language = "bash" }) {
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const copy = ()=>{
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                className: "bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                    children: code
                }, void 0, false, {
                    fileName: "[project]/control-panel/components/CopyButton.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/control-panel/components/CopyButton.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: copy,
                className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600",
                children: copied ? "✓" : "Copy"
            }, void 0, false, {
                fileName: "[project]/control-panel/components/CopyButton.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/control-panel/components/CopyButton.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/control-panel/app/admin/commands/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommandsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$components$2f$CopyButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/control-panel/components/CopyButton.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const TABS = [
    {
        id: "setup",
        label: "Setup",
        icon: "🚀",
        desc: "Commands to initialise and start the stack for the first time.",
        commands: [
            {
                label: "Generate secrets (.env)",
                code: "bash scripts/generate-secrets.sh",
                note: "Safe to run — skips if .env already exists."
            },
            {
                label: "Start infrastructure only",
                code: "bash scripts/setup.sh infrastructure"
            },
            {
                label: "Start Phase 1A services",
                code: "bash scripts/setup.sh 1a"
            },
            {
                label: "Start Phase 1B services",
                code: "bash scripts/setup.sh 1b"
            },
            {
                label: "Start Phase 1C services",
                code: "bash scripts/setup.sh 1c"
            }
        ]
    },
    {
        id: "docker",
        label: "Docker",
        icon: "🐳",
        desc: "Day-to-day Docker Compose operations for managing running containers.",
        commands: [
            {
                label: "Check running containers",
                code: "docker compose -f docker/infrastructure/docker-compose.yml ps"
            },
            {
                label: "View live logs (all)",
                code: "docker compose -f docker/infrastructure/docker-compose.yml logs -f"
            },
            {
                label: "View logs for one service",
                code: "docker compose -f docker/infrastructure/docker-compose.yml logs -f postgres",
                note: "Replace postgres with any service name."
            },
            {
                label: "Stop infrastructure",
                code: "docker compose -f docker/infrastructure/docker-compose.yml down"
            },
            {
                label: "Stop Phase 1A",
                code: "docker compose -f docker/phase-1a/docker-compose.yml down"
            },
            {
                label: "Restart a single service",
                code: "docker compose -f docker/infrastructure/docker-compose.yml restart postgres",
                note: "Replace postgres with any service name."
            },
            {
                label: "Pull latest images",
                code: "docker compose -f docker/infrastructure/docker-compose.yml pull"
            },
            {
                label: "Resource usage snapshot",
                code: "docker stats --no-stream"
            },
            {
                label: "Disk usage by layer/container",
                code: "docker system df"
            },
            {
                label: "Remove unused data (safe)",
                code: "docker system prune -f",
                note: "Removes stopped containers and dangling images."
            }
        ]
    },
    {
        id: "db",
        label: "Database",
        icon: "🗄",
        desc: "Direct access to PostgreSQL and Redis for debugging and inspection.",
        commands: [
            {
                label: "Open PostgreSQL shell",
                code: "docker exec -it hylono-postgres psql -U postgres"
            },
            {
                label: "List all databases",
                code: "docker exec -it hylono-postgres psql -U postgres -c '\\l'"
            },
            {
                label: "Connect to a specific database",
                code: "docker exec -it hylono-postgres psql -U postgres -d medusa",
                note: "Replace medusa with the target database name."
            },
            {
                label: "Open Redis CLI",
                code: "docker exec -it hylono-redis redis-cli -a ${REDIS_PASSWORD}",
                note: "Source your .env first: export $(grep -v '^#' .env | xargs)"
            },
            {
                label: "Redis memory info",
                code: "docker exec -it hylono-redis redis-cli INFO memory"
            },
            {
                label: "Redis key count",
                code: "docker exec -it hylono-redis redis-cli DBSIZE"
            }
        ]
    },
    {
        id: "backup",
        label: "Backup",
        icon: "💾",
        desc: "Data safety — creating and restoring backups.",
        commands: [
            {
                label: "Run a full backup",
                code: "bash scripts/backup.sh",
                note: "Saves compressed dumps to /backups/hylono/YYYY-MM-DD/"
            },
            {
                label: "List existing backups",
                code: "ls -la /backups/hylono/"
            },
            {
                label: "Restore PostgreSQL from backup",
                code: "gunzip -c /backups/hylono/LATEST/postgres.sql.gz | docker exec -i hylono-postgres psql -U postgres",
                note: "Replace LATEST with the exact date folder name."
            },
            {
                label: "Restore Redis from backup",
                code: "docker cp /backups/hylono/LATEST/dump.rdb hylono-redis:/data/dump.rdb && docker compose restart redis",
                note: "Stop redis before restoring, then restart."
            }
        ]
    },
    {
        id: "debug",
        label: "Debug",
        icon: "🔧",
        desc: "Diagnostic commands for when things go wrong.",
        commands: [
            {
                label: "Inspect a container",
                code: "docker inspect hylono-postgres",
                note: "Replace hylono-postgres with any container name."
            },
            {
                label: "Check if ports are free (Linux/Mac)",
                code: "netstat -tlnp | grep -E '5432|6379|9000|27017'"
            },
            {
                label: "Check open ports (Windows)",
                code: "netstat -an | findstr \"5432 6379 9000\""
            },
            {
                label: "Show container environment vars",
                code: "docker exec hylono-postgres env"
            },
            {
                label: "Shell into a running container",
                code: "docker exec -it hylono-postgres bash",
                note: "Use sh instead of bash if bash isn't available."
            },
            {
                label: "Control panel dev server",
                code: "cd control-panel && npm run dev"
            },
            {
                label: "Build control panel",
                code: "cd control-panel && npm run build"
            }
        ]
    }
];
function CommandsPage() {
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("setup");
    const tab = TABS.find((t)=>t.id === activeTab) ?? TABS[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-950 text-gray-100",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-3xl mx-auto px-4 sm:px-6 py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white",
                            children: "💻 Commands Reference"
                        }, void 0, false, {
                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-gray-400 text-sm",
                            children: "All commands to operate the Hylono Stack. Click any block to copy."
                        }, void 0, false, {
                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-blue-950/30 border border-blue-800/40 rounded-xl px-4 py-3 mb-6 text-xs text-blue-200/80",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold text-blue-300",
                            children: "💡 "
                        }, void 0, false, {
                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this),
                        "All commands run from the",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                            className: "bg-blue-900/50 px-1 rounded text-blue-300",
                            children: "project root"
                        }, void 0, false, {
                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this),
                        " directory. On Windows, use Git Bash or WSL — not PowerShell."
                    ]
                }, void 0, true, {
                    fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-1 flex-wrap mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1",
                    children: TABS.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab(t.id),
                            className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: t.icon
                                }, void 0, false, {
                                    fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                                    lineNumber: 119,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: t.label
                                }, void 0, false, {
                                    fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                                    lineNumber: 120,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, t.id, true, {
                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                            lineNumber: 110,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500 mb-4",
                            children: tab.desc
                        }, void 0, false, {
                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: tab.commands.map((cmd)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-900 border border-gray-800 rounded-xl p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs font-medium text-gray-400 mb-2",
                                            children: cmd.label
                                        }, void 0, false, {
                                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                                            lineNumber: 131,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$components$2f$CopyButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CopyCodeBlock"], {
                                            code: cmd.code
                                        }, void 0, false, {
                                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                                            lineNumber: 132,
                                            columnNumber: 17
                                        }, this),
                                        cmd.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-600 mt-2 leading-relaxed",
                                            children: cmd.note
                                        }, void 0, false, {
                                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                                            lineNumber: 134,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, cmd.label, true, {
                                    fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                                    lineNumber: 130,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$control$2d$panel$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-xs text-gray-700 mt-8",
                    children: [
                        tab.commands.length,
                        " commands in this section ·",
                        " ",
                        TABS.reduce((sum, t)=>sum + t.commands.length, 0),
                        " total"
                    ]
                }, void 0, true, {
                    fileName: "[project]/control-panel/app/admin/commands/page.tsx",
                    lineNumber: 142,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/control-panel/app/admin/commands/page.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/control-panel/app/admin/commands/page.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=control-panel_678a086b._.js.map