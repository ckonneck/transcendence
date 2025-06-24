up:
	sudo docker-compose -f srcs/docker-compose.yml up -d

down:
	sudo docker-compose -f srcs/docker-compose.yml down --remove-orphans

restart:
	sudo docker-compose -f srcs/docker-compose.yml down --remove-orphans
	sudo docker-compose -f srcs/docker-compose.yml up -d

build:
	sudo docker-compose -f srcs/docker-compose.yml build
status:
	sudo docker ps
logs:
	sudo docker-compose -f srcs/docker-compose.yml logs --tail=20
mariadb-exec:
	sudo docker exec -it mariadb bash
wp-exec:
	sudo docker exec -it wp-php bash
nginx-exec:
	sudo docker exec -it nginx bash
clean-vol:
	sudo docker volume prune
clean-all:
	sudo docker system prune -a
build-no-cashe:
	sudo docker-compose -f srcs/docker-compose.yml build --no-cache


	
