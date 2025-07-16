#!/bin/sh
set -e

INIT_FILE="/vault/init/vault-init.json"

echo "⏳ Waiting for Vault to respond..."

until curl -sf http://vault:8200/v1/sys/health > /dev/null; do
  sleep 2
done

echo "✅ Vault is responding."
echo "✅ Vault is up and initialized."

if [ -f "$INIT_FILE" ]; then
  export VAULT_TOKEN=$(jq -r '.root_token' "$INIT_FILE")
  echo "✅ Exported VAULT_TOKEN from init file."
else
  echo "❌ ERROR: $INIT_FILE not found."
  exit 1
fi

echo "🚀 Starting Fastify server..."
exec npm start
