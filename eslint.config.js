import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import convexPlugin from '@convex-dev/eslint-plugin';

export default [
  // TypeScript + React linting
  ...tseslint.config(
    {
      ignores: ['dist', 'convex/_generated/**/*', 'vite.config.ts'], // ignore generated files
    },
    {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        parserOptions: {
          project: ['./tsconfig.eslint.json', './convex/tsconfig.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    }
  ),

  // Convex recommended rules
  ...convexPlugin.configs.recommended,
];
