module.exports = {
  parser: 'esprima',
  env: {
    es2022: true,
    node: true,
  },
  root: true,
  extends: [
    'eslint:all',
    'airbnb-base',
    'plugin:unicorn/recommended',
  ],
  plugins: [
    'unicorn',
  ],
  rules: {
    'block-spacing': ['error', 'never'],
    'brace-style': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'consistent-return': 'off',
    curly: ['error', 'all'],
    'default-case': 'off',
    indent: ['error', 2],
    'max-len': 'off',
    'no-confusing-arrow': 'off',
    'no-duplicate-imports': 'warn',
    'object-curly-spacing': 'off',
    quotes: ['error', 'single', {
      avoidEscape: true,
    }],
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'never'],
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
