DOCKER			= docker
DOCKER_COMPOSE  = docker-compose

EXEC_BACKEND    = $(DOCKER_COMPOSE) exec -T backend
YARN_BACKEND	= $(EXEC_BACKEND) yarn

EXEC_FRONTEND   = $(DOCKER_COMPOSE) exec -T frontend
YARN_FRONTEND	= $(EXEC_FRONTEND) yarn

EXEC_DB			= $(DOCKER_COMPOSE) exec mongodb

DB_USER			= $(shell echo $$(grep MONGODB_USERNAME .env | xargs) | sed 's/.*=//')
DB_PWD			= $(shell echo $$(grep MONGODB_PASSWORD .env | xargs) | sed 's/.*=//')
DB_NAME			= $(shell echo $$(grep MONGO_INITDB_DATABASE .env | xargs) | sed 's/.*=//')

##
## Project
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
clean: kill backend-clean frontend-clean

ps: ## List containers
	$(DOCKER) ps

logs: ## Show all logs
	$(DOCKER_COMPOSE) logs -f

lint: ## Lint back & front files
lint: lint-backend lint-frontend

test: ## Run all unit & functional tests
test: test-backend test-frontend

upgrade: ## Upgrade all dependencies
upgrade: upgrade-backend upgrade-frontend

.PHONY: build kill install reset start stop clean ps logs lint test upgrade

node_modules: backend.node_modules frontend.node_modules

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

logs-backend: ## Show logs
	$(DOCKER_COMPOSE) logs -f backend

lint-backend: ## Lint (ESLint)
lint-backend: backend.node_modules
	$(YARN_BACKEND) lint

upgrade-backend: ## Upgrade dependencies
	$(YARN_BACKEND) upgrade

test-backend: ## Run tests
test-backend: tu-backend

tu-backend: ## Run unit tests
tu-backend: backend.node_modules
	$(YARN_BACKEND) test

.PHONY: logs-backend lint-backend upgrade-backend test-backend tu-backend

backend-clean:
	rm -rf .env node_modules

backend.node_modules: package.json yarn.lock
	$(YARN_BACKEND) install
	@touch -c backend.node_modules

##
## Vue
## -------
##

logs-frontend: ## Show logs
	$(DOCKER_COMPOSE) logs -f frontend

lint-frontend: ## Lint (ESLint)
lint-frontend: frontend.node_modules
	$(YARN_FRONTEND) lint

upgrade-frontend: ## Upgrade dependencies
	$(YARN_FRONTEND) upgrade

test-frontend: ## Run unit & functional tests
test-frontend: tu-frontend tf-frontend

tu-frontend: ## Run unit tests
tu-frontend: frontend.node_modules
	$(YARN_FRONTEND) test

tf-frontend: ## Run functional tests
tf-frontend: frontend.node_modules
	$(YARN_FRONTEND) e2e

build-frontend: ## Produce a production-ready bundle
build-frontend: frontend.node_modules
	$(YARN_FRONTEND) build

.PHONY: logs-frontend lint-frontend upgrade-frontend test-frontend tu-frontend tf-frontend build-frontend

frontend-clean:
	rm -rf client/node_modules client/dist

frontend.node_modules: client/package.json client/yarn.lock
	$(YARN_FRONTEND) install
	@touch -c frontend.node_modules

##
## MongoDB
## -------
##

logs-db: ## Show logs
	$(DOCKER_COMPOSE) logs -f mongodb

db-terminal: ## Open terminal
	$(EXEC_DB) mongo $(DB_NAME) -u $(DB_USER) -p $(DB_PWD)

.PHONY: logs-db

.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help
