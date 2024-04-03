const merge = require('deepmerge')
const baseConfig = require('./base.eslintrc.cjs')

module.exports = merge(
  baseConfig,
  {
    parserOptions: {
      project: true,
      sourceType: 'module',
    },
    env: {
      jest: true,
    },
    plugins: [
      '@typescript-eslint/eslint-plugin',
    ],
    rules: {
      'no-continue': 'off',
      'no-plusplus': 'off',
      '@typescript-eslint/brace-style': ['error', '1tbs', {
        allowSingleLine: false,
      }],
      '@typescript-eslint/explicit-member-accessibility': ['error', {
        accessibility: 'explicit',
        overrides: {
          accessors: 'off',
          constructors: 'no-public',
          methods: 'explicit',
          parameterProperties: 'explicit',
          properties: 'explicit',
        },
      }],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/member-ordering': ['warn', {
        default: ['signature', 'call-signature', // Fields
          'public-static-field', 'protected-static-field', 'private-static-field', '#private-static-field', // Fields
          'public-static-field', 'protected-static-field', 'private-static-field', '#private-static-field', 'public-decorated-field', 'protected-decorated-field', 'private-decorated-field', 'public-instance-field', 'protected-instance-field', 'private-instance-field', '#private-instance-field', 'public-abstract-field', 'protected-abstract-field', 'public-field', 'protected-field', 'private-field', '#private-field', 'static-field', 'instance-field', 'abstract-field', 'decorated-field', 'field', // Static initialization
          'static-initialization', // Constructors
          'public-constructor', 'protected-constructor', 'private-constructor', 'constructor', 'public-decorated-method', 'protected-decorated-method', 'private-decorated-method'],
      }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-parens': ['error', 'all', {
        enforceForArrowConditionals: false,
      }],
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'class-methods-use-this': 'off',
      'import/default': 'error',
      'import/extensions': 'off',
      'no-await-in-loop': 'off',
      'no-return-assign': 'off',
      'no-restricted-syntax': [
        'error',
        {
          message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
          selector: 'ForInStatement',
        },
        {
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
          selector: 'LabeledStatement',
        },
        {
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
          selector: 'WithStatement',
        },
        {
          selector: 'FunctionDeclaration',
          message: 'Просто используйте Function Expression.',
        },
      ],
    },
  },
)
