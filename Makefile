DOCKER			= docker
DOCKER_COMPOSE  = docker-compose

EXEC_API		= $(DOCKER_COMPOSE) exec -T api
YARN_API		= $(EXEC_API) yarn

EXEC_CLIENT		= $(DOCKER_COMPOSE) exec -T client
YARN_CLIENT		= $(EXEC_CLIENT) yarn

EXEC_DB			= $(DOCKER_COMPOSE) exec db

DB_USER			= $(shell echo $$(grep MONGODB_USERNAME .env | xargs) | sed 's/.*=//')
DB_PWD			= $(shell echo $$(grep MONGODB_PASSWORD .env | xargs) | sed 's/.*=//')
DB_NAME			= $(shell echo $$(grep MONGO_INITDB_DATABASE .env | xargs) | sed 's/.*=//')

# Now.sh deploy
type?=npm

# Client tests
t?=.

##
## MEVN Project
## -------
##

build:
	@$(DOCKER_COMPOSE) pull --parallel --quiet --ignore-pull-failures 2> /dev/null
	$(DOCKER_COMPOSE) build --pull

kill:
	$(DOCKER_COMPOSE) kill
	$(DOCKER_COMPOSE) down --volumes --remove-orphans

install: ## Install and start the project
install: .env build start node_modules

reset: ## Stop and start a fresh install of the project
reset: kill install

start: ## Start the project
	$(DOCKER_COMPOSE) up -d --remove-orphans

stop: ## Stop the project
	$(DOCKER_COMPOSE) stop

clean: ## Stop the project and remove generated files
clean: kill clean-api clean-client

ps: ## List containers
	$(DOCKER) ps

logs: ## Show all logs
	$(DOCKER_COMPOSE) logs -f

lint: ## Lint API & client files
lint: lint-api lint-client

test: ## Run all unit & functional tests
test: test-api test-client

upgrade: ## Upgrade all dependencies
upgrade: upgrade-api upgrade-client

.PHONY: build kill install reset start stop clean ps logs lint test upgrade

node_modules: api.node_modules client.node_modules

.env: .env.dist
	@if [ -f .env ]; \
	then\
		echo '\033[1;41m/!\ The .env.dist file has changed. Please check your .env file.\033[0m';\
		touch .env;\
		exit 1;\
	else\
		echo cp .env.dist .env;\
		cp .env.dist .env;\
	fi

##
## API (Express/Node.js)
## -------
##

logs-api: ## Show logs
	$(DOCKER_COMPOSE) logs -f api

lint-api: ## Lint (ESLint)
lint-api: api.node_modules
	$(YARN_API) lint

upgrade-api: ## Upgrade dependencies
	$(YARN_API) upgrade

test-api: ## Run unit & integration tests (option t=<regex> to run only tests with a name that matches the regex)
test-api: api.node_modules
	$(YARN_API) test -t=$(t)

deploy-api-now: ## Deploy on Now.sh (as a Node.js/Docker deployment) type=[npm|docker]
	now --public --$(type) -A ../now-$(type).json \
		-e NODE_ENV=@mevn-stack-node-env \
		-e HOST=@mevn-stack-host \
		-e PORT=@mevn-stack-port \
		-e MONGODB_URI=@mevn-stack-mongodb-uri \
		-e GOOGLE_OAUTH_CLIENT_ID=@mevn-stack-google-oauth-client-id \
		-e ACCESS_TOKEN_SECRET_KEY=@mevn-stack-access-token-secret-key \
		-e ACCESS_TOKEN_EXPIRES_IN=@mevn-stack-access-token-expires-in \
		-e REFRESH_TOKEN_SECRET_KEY=@mevn-stack-refresh-token-secret-key \
		-e REFRESH_TOKEN_EXPIRES_IN=@mevn-stack-refresh-token-expires-in \
		-e JWT_ISSUER=@mevn-stack-jwt-issuer \
		./api

now-alias: ## Add a new alias to the last deployment
	now alias -A now-$(type).json

.PHONY: logs-api lint-api upgrade-api test-api ut-api deploy-api-now now-alias

clean-api:
	rm -rf .env api/node_modules api/yarn-error.log api/tests/coverage api/tests/access.log

api.node_modules: api/package.json api/yarn.lock
	$(YARN_API) install
	@touch -c api.node_modules

##
## CLIENT (Vue.js)
## -------
##

logs-client: ## Show logs
	$(DOCKER_COMPOSE) logs -f client

lint-client: ## Lint (ESLint)
lint-client: client.node_modules
	$(YARN_CLIENT) lint

upgrade-client: ## Upgrade dependencies
	$(YARN_CLIENT) upgrade

test-client: ## Run unit & functional tests
test-client: ut-client ft-client

ut-client: ## Run unit tests (option t=<regex> to run only tests with a name that matches the regex)
ut-client: client.node_modules
	$(YARN_CLIENT) test:unit -t=$(t)

ut-client-update-snapshot: ## Run unit tests & regenerate snapshots
ut-client-update-snapshot: client.node_modules
	$(YARN_CLIENT) test:unit --updateSnapshot

ft-client: ## Run functional tests
ft-client: client.node_modules
	$(YARN_CLIENT) test:e2e

build-client: ## Produce a production-ready bundle
build-client: client.node_modules
	$(YARN_CLIENT) build

ui: ## Start the vue-cli ui
ui: client.node_modules
	$(EXEC_CLIENT) vue ui -p 8081 --headless

production: ## Previewing production build
production: build-client-production
	docker build -t client-production -f client/Dockerfile-production .
	docker run -it -p 8082:8082 --rm -v $(shell pwd)/client/dist:/dist --name client-production-1 client-production

.PHONY: logs-client lint-client upgrade-client test-client ut-client ut-client-update-snapshot ft-client build-client ui production

clean-client:
	rm -rf client/node_modules client/dist client/tests/coverage client/tests/e2e/reports client/yarn-error.log client/selenium-debug.log

client.node_modules: client/package.json client/yarn.lock
	$(YARN_CLIENT) install
	@touch -c client.node_modules

build-client-production: client.node_modules
	$(YARN_CLIENT) build-production

##
## DB (MongoDB)
## -------
##

logs-db: ## Show logs
	$(DOCKER_COMPOSE) logs -f db

db-shell: ## Open MongoDB shell
	$(EXEC_DB) mongo $(DB_NAME) -u $(DB_USER) -p $(DB_PWD)

db-test-shell: ## Open MongoDB shell on test database
	$(EXEC_DB) mongo test -u $(DB_USER) -p $(DB_PWD)

.PHONY: logs-db db-shell db-test-shell

.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help
