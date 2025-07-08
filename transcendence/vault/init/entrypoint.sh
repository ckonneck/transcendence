#!/bin/sh

# Start Vault server in background
"$@" &
VAULT_PID=$!

# Wait briefly for Vault to be ready
sleep 5

# Run init/unseal logic
/usr/local/bin/vault-auto-init-unseal.sh

# Wait for Vault process to exit (so container stays alive)
wait "$VAULT_PID"
