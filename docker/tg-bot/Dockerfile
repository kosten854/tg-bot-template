FROM node:21.5.0-alpine
RUN corepack enable

WORKDIR /application
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY .docker.npmrc ./.npmrc
RUN pnpm fetch

COPY packages ./packages
COPY apps ./apps

# CMD ls -la /application


RUN pnpm i --frozen-lockfile --prefer-offline


CMD pnpm -F tg-bot test
