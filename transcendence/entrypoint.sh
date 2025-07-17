#!/bin/sh
set -e

INIT_FILE="/vault/init/vault-init.json"
CERT_SRC="/vault/init/pong.localhost.crt"
KEY_SRC="/vault/init/pong.localhost.key"
CERT_DST="/etc/ssl/certs/fastify.crt"
KEY_DST="/etc/ssl/private/fastify.key"

echo "⏳ Waiting for Vault to respond..."
until curl -sf http://vault:8200/v1/sys/health > /dev/null; do
  sleep 2
done
echo "✅ Vault is responding."

if [ ! -f "$INIT_FILE" ]; then
  echo "❌ ERROR: $INIT_FILE not found."
  exit 1
fi

export VAULT_TOKEN=$(jq -r '.root_token' "$INIT_FILE")
echo "✅ Exported VAULT_TOKEN from init file."

# Wait for the certificate files to be available
echo "⏳ Waiting for certificate and key from Vault..."
while [ ! -f "$CERT_SRC" ] || [ ! -f "$KEY_SRC" ]; do
  sleep 2
done

# Copy to target SSL paths (used by Fastify)
cp "$CERT_SRC" "$CERT_DST"
cp "$KEY_SRC" "$KEY_DST"
echo "✅ Copied certificate and key to Fastify container."

echo "🚀 Starting Fastify server..."
exec npm start
