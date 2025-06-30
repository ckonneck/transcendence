FROM debian:bookworm

# Install Nginx and ModSecurity-related packages
RUN apt-get update && apt-get install -y \
    nginx \
	libnginx-mod-http-modsecurity \
    libmodsecurity3 \
    libmodsecurity-dev \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/modsec/crs && \
    apt-get update && apt-get install -y git && \
    git clone https://github.com/coreruleset/coreruleset /etc/nginx/modsec/crs && \
    cp /etc/nginx/modsec/crs/crs-setup.conf.example /etc/nginx/modsec/crs/crs-setup.conf

#git clone https://github.com/coreruleset/coreruleset OWASP      CLONES TO ROOT OF NGINX
# Copy configuration files
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY modsecurity/modsecurity.conf /etc/nginx/modsec/modsecurity.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
