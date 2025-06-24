
FROM debian:bookworm

RUN apt update && apt upgrade && apt install -y \
    mariadb-server

RUN mkdir -p /run/mysqld && chown mysql:mysql /run/mysqld

COPY srcs/requirements/mariadb/50-server.cnf /etc/mysql/mariadb.conf.d/.
#COPY secrets/init.sql /etc/mysql/init.sql
COPY srcs/requirements/mariadb/scriptdb.sh /usr/local/bin/scriptdb.sh
RUN chmod +x /usr/local/bin/scriptdb.sh

CMD ["/usr/local/bin/scriptdb.sh"]


