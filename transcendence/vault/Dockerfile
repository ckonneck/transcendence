# vault-init.Dockerfile
FROM hashicorp/vault:1.20.0

# Install jq
RUN apk add --no-cache jq

RUN mkdir -p /vault/data && chown 100:100 /vault/data
COPY ./vault/init/vault-auto-init-unseal.sh /usr/local/bin/vault-auto-init-unseal.sh
COPY ./vault/init/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["vault", "server", "-config=/vault/config/vault.hcl"]