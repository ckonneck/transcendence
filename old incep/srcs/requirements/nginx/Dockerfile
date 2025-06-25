
FROM debian:bookworm

RUN apt update && apt upgrade && apt install -y \
    nginx

COPY srcs/requirements/nginx/default /etc/nginx/sites-available/.
COPY secrets/server.crt /etc/ssl/certs/server.crt
COPY secrets/server.key /etc/ssl/private/server.key

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

