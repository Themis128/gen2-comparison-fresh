module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'jsx-a11y',
    'import',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': ['warn', {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports'
    }],
    '@typescript-eslint/no-import-type-side-effects': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
    'react/self-closing-comp': 'warn',
    'react/jsx-boolean-value': ['warn', 'never'],
    'react/no-array-index-key': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-role': 'error',
    'import/order': ['warn', {
      'groups': [
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling'],
        'index',
        'type'
      ],
      'pathGroups': [
        {
          'pattern': 'react',
          'group': 'external',
          'position': 'before'
        },
        {
          'pattern': 'next/**',
          'group': 'external',
          'position': 'before'
        },
        {
          'pattern': '@/**',
          'group': 'internal',
          'position': 'before'
        }
      ],
      'pathGroupsExcludedImportTypes': ['react'],
      'newlines-between': 'always',
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }
    }],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'warn',
    'no-var': 'error',
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['src/components/Contact.tsx', 'src/components/TodoList.tsx', 'src/app/test-page/page.tsx', 'src/components/label.tsx'],
      rules: {
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
      },
    },
  ],
  ignorePatterns: [
    '.next/**',
    '.amplify/**',
    'node_modules/**',
    'playwright-report/**',
    'test-results/**',
    'amplify/**',
    'coverage/**',
    'next-env.d.ts',
    '*.config.js',
    '*.config.mjs',
    '*.config.ts',
    'public/**',
  ],
};
