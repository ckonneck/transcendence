storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1  # ⚠️ Insecure, but fine for testing
}

disable_mlock = true
ui = true