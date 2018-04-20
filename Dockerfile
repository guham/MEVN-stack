FROM node:9-alpine

RUN mkdir -p /usr/src/app

COPY package.json yarn.lock /usr/src/app/

RUN chown -R node: /usr/src/app

USER node

WORKDIR /usr/src/app

RUN yarn install && yarn cache clean

COPY . .
