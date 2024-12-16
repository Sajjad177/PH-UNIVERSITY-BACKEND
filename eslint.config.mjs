
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config} */
export default {
  overrides: [
    {
      files: ['**/*.{js,mjs,cjs,ts}'],
      languageOptions: {
        globals: globals.node,
        parser: tsParser,
        parserOptions: {
          project: './tsconfig.json',
        },
      },
      ...pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      rules: {
        'no-unused-vars': 'error',
        '@typescript-eslint/no-var-requires': 'error',
        'no-unused-expressions': 'error',
        '@typescript-eslint/prefer-const': 'error',
        'no-console': 'warn',
        'no-undef': 'error',
      },
      ignores: ['node_modules', 'dist'],
    },
  ],
};
