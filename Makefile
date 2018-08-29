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

NODE_ENV		= $(shell echo $$(grep NODE_ENV .env | xargs) | sed 's/.*=//')
API_URL			= $(shell echo $$(grep API_URL .env | xargs) | sed 's/.*=//')
GOOGLE_OAUTH_CLIENT_ID	= $(shell echo $$(grep GOOGLE_OAUTH_CLIENT_ID .env | xargs) | sed 's/.*=//')

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

test-api: ## Run tests
test-api: tu-api

tu-api: ## Run unit tests
tu-api: api.node_modules
	$(YARN_API) test

.PHONY: logs-api lint-api upgrade-api test-api tu-api

clean-api:
	rm -rf .env api/node_modules api/coverage api/yarn-error.log api/tests/access.log

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
test-client: tu-client tf-client

tu-client: ## Run unit tests
tu-client: client.node_modules
	$(YARN_CLIENT) test:unit

tu-client-update-snapshot: ## Run unit tests & regenerate snapshots
tu-client-update-snapshot: client.node_modules
	$(YARN_CLIENT) test:unit --updateSnapshot

tf-client: ## Run functional tests
tf-client: client.node_modules
	$(YARN_CLIENT) test:e2e

build-client: ## Produce a production-ready bundle
build-client: client.node_modules
	$(YARN_CLIENT) build

ui: ## Start the vue-cli ui
ui: client.node_modules
	$(EXEC_CLIENT) vue ui -p 8081 --headless

production: ## Previewing production build
production: build-client
	docker build -t client-production -f client/Dockerfile-production .
	docker run -it -p 8082:8082 --rm -v $(shell pwd)/client/dist:/dist -e NODE_ENV=$(NODE_ENV) -e VUE_APP_API_URL=$(API_URL) -e VUE_APP_GOOGLE_OAUTH_CLIENT_ID=$(GOOGLE_OAUTH_CLIENT_ID) --name client-production-1 client-production

.PHONY: logs-client lint-client upgrade-client test-client tu-client tu-client-update-snapshot tf-client build-client ui production

clean-client:
	rm -rf client/node_modules client/dist client/tests/coverage client/tests/e2e/reports client/yarn-error.log client/selenium-debug.log

client.node_modules: client/package.json client/yarn.lock
	$(YARN_CLIENT) install
	@touch -c client.node_modules

##
## DB (MongoDB)
## -------
##

logs-db: ## Show logs
	$(DOCKER_COMPOSE) logs -f db

db-terminal: ## Open terminal
	$(EXEC_DB) mongo $(DB_NAME) -u $(DB_USER) -p $(DB_PWD)

.PHONY: logs-db

.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help
