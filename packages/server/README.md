# server

> An awesome project based on Ts.ED framework

See [Ts.ED](https://tsed.io) project for more information.

## Build setup

> **Important!** Ts.ED requires Node >= 10, Express >= 4 and TypeScript >= 3.

```batch
# install dependencies
$ yarn install

# serve
$ yarn start

# build for production
$ yarn build
$ yarn start:prod
```

## Env template

```dotenv
LOG_ENTRIES_KEY=
LOG_NAME=API
MONGOOSE_URL=
REPOS_WHITE_LIST=tsed;tsed-cli;logger
ENFORCE_HTTPS=false
```