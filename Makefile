# ==============================================================================
# TTSFR Platform - Automation Makefile
# Initiative: UM6P | Green Tech Institute (GTI) | Fondation OCP
# Lead Developer: Issam ZITOUNI
# ==============================================================================

.DEFAULT_GOAL := help

# Colors for terminal output
COLOR_RESET   := \033[0m
COLOR_GREEN   := \033[32m
COLOR_YELLOW  := \033[33m
COLOR_BLUE    := \033[34m
COLOR_CYAN    := \033[36m

DOCKER_COMPOSE := docker compose

.PHONY: help init build up start down stop restart ps status logs logs-backend logs-frontend logs-db seed db-shell backend-shell frontend-shell test lint-frontend clean reset-db

## --- General -----------------------------------------------------------------
help: ## Display this help menu
	@echo ""
	@echo "  TTSFR Platform - UM6P / GTI / Fondation OCP"
	@echo "  ================================================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(COLOR_CYAN)%-18s$(COLOR_RESET) %s\n", $$1, $$2}'
	@echo ""

init: ## Initialize environment, build containers, start services and seed database
	@echo "$(COLOR_YELLOW)[INFO] Initializing TTSFR Platform...$(COLOR_RESET)"
	@if [ ! -f .env ]; then \
		echo "$(COLOR_BLUE)[INFO] Creating .env from .env.example...$(COLOR_RESET)"; \
		cp .env.example .env; \
	fi
	@$(MAKE) build
	@$(MAKE) up
	@echo "$(COLOR_BLUE)[INFO] Waiting for database to be healthy...$(COLOR_RESET)"
	@sleep 3
	@$(MAKE) seed
	@echo "$(COLOR_GREEN)[SUCCESS] TTSFR Platform initialized successfully.$(COLOR_RESET)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8000/docs"

## --- Container Lifecycle -----------------------------------------------------
build: ## Build or rebuild all Docker containers
	@echo "$(COLOR_BLUE)[BUILD] Building Docker images...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) build

up: ## Start all services in the background (detached mode)
	@echo "$(COLOR_GREEN)[START] Starting all services...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) up -d

start: up ## Alias for 'up'

down: ## Stop and remove all running containers and networks
	@echo "$(COLOR_YELLOW)[STOP] Stopping all services...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) down

stop: down ## Alias for 'down'

restart: ## Restart all Docker services
	@echo "$(COLOR_YELLOW)[RESTART] Restarting all services...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) restart

ps: ## View running container status and ports
	$(DOCKER_COMPOSE) ps

status: ps ## Alias for 'ps'

## --- Logs & Monitoring -------------------------------------------------------
logs: ## Stream live logs from all containers
	$(DOCKER_COMPOSE) logs -f

logs-backend: ## Stream FastAPI backend logs
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend: ## Stream Next.js frontend logs
	$(DOCKER_COMPOSE) logs -f frontend

logs-db: ## Stream PostgreSQL database logs
	$(DOCKER_COMPOSE) logs -f db

## --- Database & Seeding ------------------------------------------------------
seed: ## Seed ODCO sectors, clusters, and pilot accounts into the database
	@echo "$(COLOR_BLUE)[SEED] Running database seeds...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) exec backend python -m app.seeds.initial_data

db-shell: ## Open an interactive PostgreSQL psql shell
	$(DOCKER_COMPOSE) exec db psql -U ttsfr_user -d ttsfr_db

backend-shell: ## Open an interactive bash shell in the backend container
	$(DOCKER_COMPOSE) exec backend /bin/bash

frontend-shell: ## Open an interactive sh shell in the frontend container
	$(DOCKER_COMPOSE) exec frontend /bin/sh

reset-db: ## Reset database volume and re-run all seed scripts (CAUTION: wipes DB data)
	@echo "$(COLOR_YELLOW)[WARNING] Resetting database...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) up -d db
	@echo "[INFO] Waiting for database ready..."
	@sleep 4
	$(DOCKER_COMPOSE) up -d backend frontend
	@sleep 2
	@$(MAKE) seed
	@echo "$(COLOR_GREEN)[SUCCESS] Database reset and seeded successfully.$(COLOR_RESET)"

## --- Tests & Quality ---------------------------------------------------------
test: ## Run backend tests with pytest
	$(DOCKER_COMPOSE) exec backend python -m pytest -v

lint-frontend: ## Run ESLint on the Next.js frontend
	$(DOCKER_COMPOSE) exec frontend npm run lint

clean: ## Remove containers, volumes, networks, and untracked artifacts
	@echo "$(COLOR_YELLOW)[CLEAN] Cleaning Docker environment...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) down -v --remove-orphans
