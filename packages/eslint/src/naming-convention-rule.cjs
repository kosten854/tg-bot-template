module.exports = [
  'warn',
  {
    selector: 'default',
    format: ['strictCamelCase'],
  },
  {
    selector: 'variable',
    format: ['strictCamelCase'],
  },
  {
    selector: 'variable',
    types: ['boolean'],
    format: ['StrictPascalCase'],
    prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
  },
  {
    selector: 'variable',
    modifiers: ['const'],
    format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
  },
  {
    selector: 'variable',
    modifiers: ['const'],
    format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
  },
  {
    selector: 'parameter',
    format: ['strictCamelCase'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'property',
    format: ['strictCamelCase', 'UPPER_CASE'],
    leadingUnderscore: 'allow',
  },
  {
    selector: 'typeLike',
    format: ['StrictPascalCase'],
  },
  {
    selector: 'interface',
    format: ['StrictPascalCase'],
    custom: {
      regex: '^I[A-Z]',
      match: false,
    },
  },
  {
    selector: [
      'property',
      'method',
      'accessor',
      'enumMember',
      'memberLike',
    ],
    // eslint-disable-next-line unicorn/no-null
    format: null,
    modifiers: ['requiresQuotes'],
  },
]
