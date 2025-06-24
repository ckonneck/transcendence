
FROM debian:bookworm

RUN apt update && apt upgrade && apt install -y \
    php-fpm \
    php-mysqli \
    curl \
    mariadb-client

COPY srcs/requirements/wordpress/www.conf /etc/php/8.2/fpm/pool.d/.
#COPY secrets/script.sh .
#RUN chmod +x script.sh
#CMD ["./script.sh"]
CMD ["/bin/bash", "/run/secrets/script.sh"]
