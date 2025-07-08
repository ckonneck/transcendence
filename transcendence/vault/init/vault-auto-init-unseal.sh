#!/bin/sh
set -e

INIT_FILE="/vault/init/vault-init.json"

echo "Checking Vault initialization status..."
if vault status -address="$VAULT_ADDR" | grep 'Initialized.*false'; then
  echo "Vault not initialized, running init..."
  vault operator init -key-shares=5 -key-threshold=3 -format=json > /vault/init/vault-init.json
else
  echo "Vault already initialized, skipping init."
fi


echo "Unsealing Vault..."
UNSEAL_KEYS=$(jq -r '.unseal_keys_b64[]' "$INIT_FILE")

for key in $UNSEAL_KEYS; do
  vault operator unseal "$key"
done

echo "logging in with root token..."
# Login with root token
ROOT_TOKEN=$(jq -r '.root_token' $INIT_FILE)
export VAULT_TOKEN=$ROOT_TOKEN
echo "Logged in with root token."

UNSEAL_KEY_1=$(jq -r '.unseal_keys_b64[0]' /vault/init/vault-init.json)
UNSEAL_KEY_2=$(jq -r '.unseal_keys_b64[1]' /vault/init/vault-init.json)
UNSEAL_KEY_3=$(jq -r '.unseal_keys_b64[2]' /vault/init/vault-init.json)
echo "catting hard rn."
cat << EOF > /vault/init/.env
VAULT_ROOT_TOKEN=$ROOT_TOKEN
VAULT_UNSEAL_KEY_1=$UNSEAL_KEY_1
VAULT_UNSEAL_KEY_2=$UNSEAL_KEY_2
VAULT_UNSEAL_KEY_3=$UNSEAL_KEY_3
EOF

cat /vault/init/.env >> /transcendence/.env
rm /vault/init/.env # && rm /vault/init/vault-init.json # add in prod maybe. maybe risky. maybe unnecessary, idk
echo "check .env now"

echo "Vault is unsealed and ready."

# --- Enable and configure PKI secrets engine for HTTPS certificates ---
echo "Enabling PKI secrets engine..."
vault secrets enable -path=pki pki || echo "PKI already enabled."

# Tune the PKI secrets engine to have a max lease TTL of 87600h (10 years)
vault secrets tune -max-lease-ttl=87600h pki

# Generate root CA (self-signed)
echo "Generating root CA..."
vault write -field=certificate pki/root/generate/internal \
    common_name="pong.localhost" \
    ttl=87600h > /vault/init/ca_cert.crt

# Configure URLs for issuing certificates and CRL distribution
echo "Configuring URLs for PKI..."
vault write pki/config/urls \
    issuing_certificates="http://localhost:8200/v1/pki/ca" \
    crl_distribution_points="http://localhost:8200/v1/pki/crl"

# Create a role for issuing HTTPS certificates
echo "Creating PKI role for HTTPS..."
vault write pki/roles/https-cert-role \
    allowed_domains="pong.localhost" \
    allow_subdomains=true \
    max_ttl="72h"

echo "PKI secrets engine configured for HTTPS certificates."

# --- Issue certificate and save .crt and .key for Nginx ---
DOMAIN="pong.localhost"
CERT_PATH="/vault/init/${DOMAIN}.crt"
KEY_PATH="/vault/init/${DOMAIN}.key"

echo "Requesting certificate for $DOMAIN..."
vault write -format=json pki/issue/https-cert-role \
    common_name="$DOMAIN" \
    ttl="72h" > /vault/init/cert.json

# Extract certificate, issuing CA, and private key
CRT=$(jq -r '.data.certificate' /vault/init/cert.json)
CA=$(jq -r '.data.issuing_ca' /vault/init/cert.json)
KEY=$(jq -r '.data.private_key' /vault/init/cert.json)

# Save certificate and key for Nginx
echo "$CRT" > "$CERT_PATH"
echo "$CA" >> "$CERT_PATH"
echo "$KEY" > "$KEY_PATH"

echo "Certificate and key generated: $CERT_PATH, $KEY_PATH"


