DOCKER			= docker
DOCKER_COMPOSE  = docker-compose

EXEC_BACKEND    = $(DOCKER_COMPOSE) exec -T backend
YARN_BACKEND	= $(EXEC_BACKEND) yarn
SH_BACKEND		= $(EXEC_BACKEND) /bin/sh

EXEC_FRONTEND   = $(DOCKER_COMPOSE) exec -T frontend
YARN_FRONTEND	= $(EXEC_FRONTEND) yarn
SH_FRONTEND		= $(EXEC_FRONTEND) /bin/sh

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
	$(DOCKER_COMPOSE) up -d --remove-orphans --no-recreate

stop: ## Stop the project
	$(DOCKER_COMPOSE) stop

clean: ## Stop the project and remove generated files
clean: kill backend-clean frontend-clean

ps: ## List containers
	$(DOCKER) ps

logs: ## Show logs
	$(DOCKER_COMPOSE) logs -f

lint: ## Lint back & front files
lint: lint-backend lint-frontend

.PHONY: build kill install reset start stop clean ps logs lint

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
## Express server
## -------
##

lint-backend: ## Lint (ESLint)
lint-backend: backend.node_modules
	$(YARN_BACKEND) lint

.PHONY: lint-backend

backend-clean:
	rm -rf .env node_modules

backend.node_modules: backend.yarn.lock
	$(YARN_BACKEND) install
	touch -c backend.node_modules

backend.yarn.lock: package.json
	$(YARN_BACKEND) upgrade

##
## Vue
## -------
##

lint-frontend: ## Lint (ESLint)
lint-frontend: frontend.node_modules
	$(YARN_FRONTEND) lint

.PHONY: lint-frontend

frontend-clean:
	rm -rf client/node_modules

frontend.node_modules: frontend.yarn.lock
	$(YARN_FRONTEND) install
	touch -c frontend.node_modules

frontend.yarn.lock: client/package.json
	$(YARN_FRONTEND) upgrade

.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help
