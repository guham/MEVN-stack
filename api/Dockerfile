FROM node:10-alpine

RUN mkdir -p /api
WORKDIR /api
COPY package.json yarn.lock /api/
RUN yarn install --production && yarn cache clean
COPY . .
ENV NODE_ENV="production"
CMD ["node", "src/server.js"]
