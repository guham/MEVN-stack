FROM mongo:3.6

RUN usermod -u 1000 mongodb

COPY mongodb-setup.sh /docker-entrypoint-initdb.d/
