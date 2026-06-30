import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      'no-undef': 'off',
      'prettier/prettier': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [['^node:'], ['^\\w'], ['^@(?!/)\\w'], ['^@/'], ['^\\./'], ['^.+\\.?(css)$']],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'no-console': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          name: 'next/link',
          message: 'Please import from `@/pkg/locale` instead.',
        },
        {
          name: 'next/navigation',
          importNames: ['redirect', 'permanentRedirect', 'useRouter', 'usePathname'],
          message: 'Please import from `@/pkg/locale` instead.',
        },
      ],
    },
  },
])

export default eslintConfig
