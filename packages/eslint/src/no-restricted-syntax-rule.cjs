module.exports = [
  'error',
  {
    message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
    selector: 'ForInStatement',
  },
  {
    message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
    selector: 'ForOfStatement',
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
    selector: 'TSEnumDeclaration',
    message: 'Не используем enum. Подробности: https://github.com/shian15810/eslint-plugin-typescript-enum',
  },
  {
    selector: 'ClassDeclaration',
    message: 'Не используем class. Только функциональное программирование. Только хардкор.',
  },
  {
    selector: 'FunctionDeclaration',
    message: 'Просто используйте Function Expression.',
  },
]
