up: tsc
	docker compose up -d

tsc:
	npx tsc --project config/tsconfig.json

down:
	docker compose down --remove-orphans

re: down tsc build up

build:
	docker compose build

status:
	docker ps

logs:
	docker-compose logs --tail=20

exec:
	docker exec -it fastify bash

clean-vol:
	docker volume prune -f

clean-all:
	docker system prune -a -f

build-no-cache:
	docker compose build --no-cache
	
	
	
# changed all from docker-compose to docker compose. apparently change in version, redo if still bricked

