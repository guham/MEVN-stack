# MEVN-stack [![Build Status](https://travis-ci.org/guham/MEVN-stack.svg?branch=master)](https://travis-ci.org/guham/MEVN-stack) [![codecov](https://codecov.io/gh/guham/MEVN-stack/branch/master/graph/badge.svg)](https://codecov.io/gh/guham/MEVN-stack)

MongoDB, Express, Vue.js & Node.js

WIP

## Todo

- [ ] i18N: fix tests
- [ ] Nginx proxy, https
- [ ] Perfs
- [ ] Security
- [ ] JWT: token storage
- [ ] JWT: refresh token
- [ ] Update browserslist
- [ ] Write doc

## MongoDB deployment on [mLab](https://mlab.com/)

1. Create an account and a database

2. Connect to the remote DB then create indexes (because Mongoose autoIndex = false in production):
    ```bash
    # within the api container (docker-compose exec api sh)
    mongo dsxxxxxx.mlab.com:xxxxx/DB_NAME -u DB_USER -p DB_PWD
    db.foos.createIndex( { "name": 1 }, { unique: true }, { background: true } )
    ```

## Deploy API on [Now.sh](https://zeit.co/now)

1. Create an account then install `now` globally

2. Add secrets:
    ```bash
    now secrets add mevn-stack-node-env "production"
    now secrets add mevn-stack-host "0.0.0.0"
    now secrets add mevn-stack-port "3000"
    now secrets add mevn-stack-mongodb-uri "mongodb://DB_USER:DB_PWD@dsxxxxxx.mlab.com:xxxxx/DB_NAME"
    now secrets add mevn-stack-google-oauth-client-id "CLIENT_ID.apps.googleusercontent.com"
    now secrets add mevn-stack-jwt-secret-key "!ChangeMe!"
    now secrets add mevn-stack-jwt-issuer "accounts.google.com"
    ```
3. Deploy the API:
    ```bash
    make deploy-api-now type=[npm|docker] # default value = npm
    ```

4. Optional: add a new alias
    ```bash
    # alias value is configured in now-npm.js or now-docker.js file
    make now-alias type=[npm|docker] # default value = npm
    ```
