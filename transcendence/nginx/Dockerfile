FROM debian:bookworm

# Install Nginx and ModSecurity-related packages
RUN apt-get update && apt-get install -y \
    nginx \
	libnginx-mod-http-modsecurity \
    libmodsecurity3 \
    libmodsecurity-dev \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y git && \
    git clone https://github.com/coreruleset/coreruleset opt/crs

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY modsecurity/modsecurity.conf etc/nginx/modsec/modsecurity.conf
COPY modsecurity/crs-setup.conf opt/crs/crs-setup.conf
# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
