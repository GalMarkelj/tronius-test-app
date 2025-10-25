import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      //suppress errors for missing 'import React' in files
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-require-imports": "off",
      semi: ["warn", "never"],
      camelcase: "off",
      "max-len": [
        "warn",
        {
          code: 100,
          ignoreStrings: true,
          ignoreComments: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "comma-dangle": [
        "warn",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "ignore",
        },
      ],
      quotes: ["warn", "single", { avoidEscape: true }],
      "jsx-quotes": ["warn", "prefer-single"],
      "react/display-name": "off",
      "react/prop-types": "off",
    },
  },
]);
