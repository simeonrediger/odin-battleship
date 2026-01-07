import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        ignores: ['dist/'],
    },

    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser },
    },

    {
        files: ['**/*.{test,spec}.{js,mjs,cjs}', '**/tests/**/*.{js,mjs,cjs}'],
        languageOptions: { globals: globals.jest },
    },

    {
        files: ['webpack.*.{js,mjs,cjs}'],
        languageOptions: { globals: globals.node },
    },
]);
