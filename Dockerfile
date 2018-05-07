FROM node:9-alpine

ARG TZ

RUN apk add --no-cache tzdata \
	&& cp /usr/share/zoneinfo/${TZ} /etc/localtime \
	&& echo ${TZ} > /etc/timezone

RUN mkdir -p /usr/src/app

COPY package.json yarn.lock /usr/src/app/

RUN chown -R node: /usr/src/app

USER node

WORKDIR /usr/src/app

RUN yarn install && yarn cache clean

COPY . .
