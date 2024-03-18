const namingConventionRule = require('./naming-convention-rule.cjs')
// process.env['ESLINT_USE_FLAT_CONFIG']='false'

module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es2022: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
  ],
  ignorePatterns: [
    '!.github',
    '!.vitepress',
    '!.vscode',
    '*.min.*',
    'CHANGELOG.md',
    'LICENSE*',
    '__snapshots__',
    'coverage',
    'dist',
    'output',
    'packages-lock.json',
    'pnpm-lock.yaml',
    'public',
    'temp',
    '.eslintrc.cjs',
    'yarn.lock',
    'package.json',
    'tsconfig.json',
  ],
  plugins: [
    'import',
    'import-newlines',
    'promise',
    'typescript-sort-keys',
    'unicorn',
  ],
  root: true,
  rules: {
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', {
      disallowTypeAnnotations: true,
      fixStyle: 'inline-type-imports',
      prefer: 'type-imports',
    }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'none',
        requireLast: true,
      },
      multilineDetection: 'brackets',
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    }],
    '@typescript-eslint/method-signature-style': 'error',
    '@typescript-eslint/naming-convention': namingConventionRule,
    '@typescript-eslint/no-confusing-void-expression': ['error', {
      ignoreArrowShorthand: true,
      ignoreVoidOperator: true,
    }],
    /** Обычно, разработчик умышлено делает приведение типов. */
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-invalid-this': 'error',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-useless-empty-export': 'error',

    /** Иногда эти комментарии необходимы. */
    '@typescript-eslint/object-curly-spacing': ['error', 'never'],
    '@typescript-eslint/padding-line-between-statements': 'error',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/prefer-regexp-exec': 'error',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/require-array-sort-compare': 'error',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/sort-type-constituents': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/type-annotation-spacing': ['error', {
      after: true,
      before: false,
      overrides: {
        arrow: {
          after: true,
          before: true,
        },
      },
    }],
    /** Получаются слишком длинные строки. */
    'arrow-body-style': 'off',
    'block-spacing': ['error', 'never'],
    'brace-style': 'off',

    /** TypeScript подскажет, если результирующее значение будет undefined. */
    'consistent-return': 'off',
    curly: ['error', 'all'],

    /** TypeScript подскажет, если результирующее значение будет undefined. */
    'default-case': 'off',
    'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    'import/named': 'off',
    'import/namespace': 'off',
    'import/no-duplicates': ['error', {
      'prefer-inline': true,
    }],
    'import/no-extraneous-dependencies': ['error', {
      includeTypes: false,
    }],
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-relative-packages': 'error',
    'import/no-unresolved': 'off',
    'import/order': ['error', {
      alphabetize: {
        caseInsensitive: true,
        order: 'asc',
      },
      groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object', 'type'],
      pathGroups: [
        {
          group: 'builtin',
          pattern: '@/**',
          position: 'after',
        },
      ],
    }],
    'import/prefer-default-export': 'off',
    'max-len': 'off',
    'newline-per-chained-call': 'off',
    'no-confusing-arrow': 'off',
    'no-duplicate-imports': 'warn',
    'no-spaced-func': 'off',
    /** Конфликтует с правилом @typescript-eslint/no-floating-promises */
    'no-void': 'off',
    'object-curly-spacing': 'off',
    semi: 'off',
    'sort-imports': ['error', {
      ignoreDeclarationSort: true,
    }],

    /**
     * Правила необходимы до тех пор, пока не добавят auto-fix в @typescript-eslint/member-ordering
     * @see https://github.com/typescript-eslint/typescript-eslint/issues/2296
     */
    'typescript-sort-keys/interface': ['error', 'asc', {
      caseSensitive: true,
      natural: true,
      requiredFirst: false,
    }],
    /** Не используем enum. */
    'typescript-sort-keys/string-enum': ['off', 'asc', {
      caseSensitive: true,
      natural: true,
    }],
    'unicorn/filename-case': ['error'],
    'unicorn/no-abusive-eslint-disable': 'off',

    /** TypeScript уже проверяет корректность переданных аргументов. */
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
}
