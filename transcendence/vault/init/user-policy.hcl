path "secret/data/users/*" {
  capabilities = ["create", "update", "read"]
}
path "pki/*" {
  capabilities = ["read", "create", "update", "list"]
}
path "sys/mounts" {
  capabilities = ["read", "list"]
}
path "pki/roles/https-cert-role" {
  capabilities = ["read", "create", "update"]
}
