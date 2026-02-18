import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: [
            "dist/",
            "node_modules/",
            ".agent/**/*",
            "backups/**/*",
            "protected-ui-backup-*/**/*",
            "src/generated/**/*",
            "compressed-web/**/*",
            "eslint_report.json",
            "lint_results.txt",
        ],
    },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    }
);
