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
GH_TOKEN=YOURGHTOKEN
GH_CLIENT_ID=YOURGHCLIENT
GH_CLIENT_SECRET=YOURGHCLIENTSECRET
GH_REDIRECT_URI=http://localhost:3000/projects/oauth/github/callback
MONGOOSE_URL=
REDIS_URL=
LOG_ENTRIES_KEY=
LOG_NAME=API
ENFORCE_HTTPS=false
```