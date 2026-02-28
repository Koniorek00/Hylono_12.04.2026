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
];

//# sourceMappingURL=control-panel_components_CopyButton_tsx_ef3e4432._.js.map