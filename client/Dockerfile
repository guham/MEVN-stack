FROM node:10-stretch

ARG CHROME_VERSION="google-chrome-stable"

RUN set -xe \
	&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends --no-install-suggests \
		openjdk-8-jdk \
		${CHROME_VERSION:-google-chrome-stable} \
		libdbus-glib-1-2 \
	&& wget --no-verbose -O firefox.tar.bz2 "https://download.mozilla.org/?product=firefox-latest-ssl&os=linux64&lang=en-US" \
	&& tar xjf firefox.tar.bz2 -C /opt/ \
	&& ln -s /opt/firefox/firefox /usr/bin/firefox \
	&& rm /etc/apt/sources.list.d/google-chrome.list \
	&& rm -rf /var/lib/apt/lists/* /var/cache/apt/* firefox.tar.bz2

RUN yarn global add @vue/cli

RUN mkdir -p /client

COPY package.json yarn.lock /client/

RUN chown -R node: /client

USER node

WORKDIR /client

RUN yarn install && yarn cache clean

COPY . .
