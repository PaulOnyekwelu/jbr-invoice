build:
	docker compose -f local.yml up -d --build --remove-orphans

up:
	docker compose -f local.yml up -d

down:
	docker compose -f local.yml down

down-v:
	docker compose -f local.yml down -v

show-logs:
	docker compose -f local.yml logs


show-logs-api:
	docker compose -f local.yml logs api

show-logs-client:
	docker compose -f local.yml logs client

user:
	docker run --rm jbr-invoice-api whoami

volume:
	docker volume inspect jbr-invoice_mongodb-data