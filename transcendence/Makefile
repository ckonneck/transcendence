up:
	docker-compose up -d

down:
	docker-compose down --remove-orphans

restart:
	docker-compose down --remove-orphans
	docker-compose up -d

build:
	docker-compose build

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
	docker-compose build --no-cache

