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
    
COPY /nginx/conf/nginx.conf /etc/nginx/nginx.conf
COPY /nginx/modsecurity/modsecurity.conf etc/nginx/modsec/modsecurity.conf
COPY /nginx/modsecurity/crs-setup.conf opt/crs/crs-setup.conf
    # Certs will be mounted at runtime via docker-compose volume
COPY nginx/wait-for-certs.sh /wait-for-certs.sh
RUN chmod +x /wait-for-certs.sh
# Expose HTTP/S port
EXPOSE 80 8443


# Start Nginx only after certs are present
CMD ["/wait-for-certs.sh"]


#possibly didnt load the certs correctly yet. recheck. also recheck if vault is still ok