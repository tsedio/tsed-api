###############################################################################
###############################################################################
##                      _______ _____ ______ _____                           ##
##                     |__   __/ ____|  ____|  __ \                          ##
##                        | | | (___ | |__  | |  | |                         ##
##                        | |  \___ \|  __| | |  | |                         ##
##                        | |  ____) | |____| |__| |                         ##
##                        |_| |_____/|______|_____/                          ##
##                                                                           ##
## description     : Dockerfile for Ts.ED Application                        ##
## author          : Ts.ED team                                              ##
## date            : 20210108                                                ##
## version         : 1.0                                                     ##
###############################################################################
###############################################################################
ARG NODE_VERSION=16.13.1
FROM node:${NODE_VERSION}-alpine as builder

WORKDIR /opt

RUN apk update && apk add build-base git

COPY ./packages/backoffice/package.json ./packages/backoffice/
COPY ./packages/config/package.json ./packages/config/
COPY ./packages/shared/package.json ./packages/shared/
COPY ./packages/tailwind/package.json ./packages/tailwind/
COPY ./packages/server/package.json ./packages/server/
COPY package.json lerna.json yarn.lock release.config.js .prettierrc ./

RUN yarn install --pure-lockfile --ignore-scripts

COPY ./packages/config ./packages/config
COPY ./packages/backoffice ./packages/backoffice
COPY ./packages/shared ./packages/shared
COPY ./packages/tailwind ./packages/tailwind
COPY ./packages/server ./packages/server

RUN yarn build
RUN yarn install --production --pure-lockfile --ignore-scripts

FROM node:${NODE_VERSION}-alpine
ENV WORKDIR /opt
WORKDIR $WORKDIR

RUN apk update && \
    apk upgrade && \
    apk add apache2-utils gettext vim bash curl

RUN npm install -g pm2

COPY --from=builder /opt .
COPY processes.config.js .

EXPOSE 8083
ENV PORT 8083

CMD ["yarn", "start:prod"]
