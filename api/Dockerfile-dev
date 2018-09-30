FROM node:10-alpine

RUN set -xe \
	&& apk add --no-cache mongodb

RUN mkdir -p /api

COPY package.json yarn.lock /api/

RUN chown -R node: /api

USER node

WORKDIR /api

RUN yarn install && yarn cache clean

COPY . .
