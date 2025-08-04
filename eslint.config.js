import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "semi": ["error", "always"],
            "quotes": ["error", "double"],
            "no-multi-spaces": "error",
            "indent": ["error", 2],
            "space-before-function-paren": ["error", "always"],
            "keyword-spacing": ["error", { "before": true, "after": true }],
            "no-trailing-spaces": "error",
            "eol-last": ["error", "always"],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],
            "arrow-spacing": ["error", { "before": true, "after": true }],
            "no-console": "warn",
            "no-debugger": "error",
            "prefer-const": "error",
            "no-var": "error",
            "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
            "comma-dangle": [
                "error",
                {
                    "arrays": "never",
                    "objects": "never",
                    "imports": "never",
                    "exports": "never",
                    "functions": "never"
                }
            ]
        },
    }
);
