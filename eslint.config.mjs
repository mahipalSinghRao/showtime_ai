import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ["**/*.{ts,tsx}"],

        languageOptions: {
            globals: globals.node,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        rules: {
            "no-console": "off",

            "@typescript-eslint/no-explicit-any": "error",

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },

    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "logs/**",
        ],
    },
];