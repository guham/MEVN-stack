FROM node:10-alpine

ARG TZ

RUN set -xe \
	&& apk add --no-cache tzdata mongodb \
	&& cp /usr/share/zoneinfo/${TZ} /etc/localtime \
	&& echo ${TZ} > /etc/timezone

RUN mkdir -p /api

COPY package.json yarn.lock /api/

RUN chown -R node: /api

USER node

WORKDIR /api

RUN yarn install && yarn cache clean

COPY . .
