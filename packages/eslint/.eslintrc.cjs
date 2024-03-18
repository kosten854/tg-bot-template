const config = require('./src/js.eslintrc.cjs')

config.rules['import/no-extraneous-dependencies'] = 'off'
config.ignorePatterns = ['plugin/**/*.js']

module.exports = config
