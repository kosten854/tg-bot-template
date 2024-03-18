# Описание

Библиотека для логирование основанная на pino multistream.

## Поддерживаемые стримы

- `consoleStream` выводит логи в формате json через `console.log`, `console.debug` и т.д. Подходит как для браузера так и для node, создаётся функцией `createConsoleStream(level)`
- `prettyStream` выводит логи в форматированном виде подходит как для браузера так и для node, создаётся функцией `createPrettyStream(level, config)`
- `sentryBrowserStream` отправляет логи в sentry(glitchTip), рекомендуется использовать уровень логирования warn или выше, работает только в браузере, создаётся функцией `createSentryBrowserStream(level, config)`
- `sentryNodeStream` отправляет логи в sentry(glitchTip), рекомендуется использовать уровень логирования warn или выше, работает только в браузере, создаётся функцией `createSentryNodeStream(level, config)`
- `stdStream` выводит логи в json формате в `stdout` или `stderr`, работает только в node, создаётся функцией `createStdStream(level)`

## Логгер

Логгер можно инициализировать через конструктор:

- Через конструктор `new Logger(config)`
