import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default [
  // ============================================================
  // BASE CONFIG
  // ============================================================
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // ============================================================
  // JS/TS FILES
  // ============================================================
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        URL: 'readonly'
      }
    },
    plugins: {
      import: importPlugin
    }
  },

  // ============================================================
  // IMPORT SETTINGS
  // ============================================================
  {
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.ts']
        }
      }
    }
  },
  prettier
];
