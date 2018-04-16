DOCKER			= docker
DOCKER_COMPOSE  = docker-compose
EXEC_APP       	= $(DOCKER_COMPOSE) exec -T app
YARN            = $(EXEC_APP) yarn

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
clean: kill
	rm -rf .env node_modules

ps: ## List containers
	$(DOCKER) ps

logs: ## Show logs
	$(DOCKER_COMPOSE) logs -f

eslint:	## eslint
eslint: node_modules
	$(EXEC_APP) ./node_modules/.bin/eslint --fix-dry-run ./

.PHONY: build kill install reset start stop clean ps logs eslint

node_modules: yarn.lock
	$(YARN) install
	@touch -c node_modules

yarn.lock: package.json
	$(YARN) upgrade

.env: .env.dist
	@if [ -f .env ]; \
	then\
		echo '\033[1;41m/!\ The .env.dist file has changed. Please check your .env file (this message will not be displayed again).\033[0m';\
		touch .env;\
		exit 1;\
	else\
		echo cp .env.dist .env;\
		cp .env.dist .env;\
	fi

.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help
