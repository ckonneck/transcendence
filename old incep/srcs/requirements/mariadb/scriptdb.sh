#!/bin/bash
set -e

echo "=== Starting MariaDB with initialization ==="

# Read secrets
DB_NAME=$(cat /run/secrets/db_name.txt)
DB_USER=$(cat /run/secrets/db_user.txt)
DB_PASSWORD=$(cat /run/secrets/db_password.txt)
DB_ROOT_PASSWORD=$(cat /run/secrets/db_root_password.txt)

# Start MariaDB in background
echo "Starting mysqld..."
mysqld --user=mysql --datadir=/var/lib/mysql &

# Wait for MariaDB to become available
echo "Waiting for MariaDB to be ready..."
until mysqladmin ping --silent --wait=60; do
  sleep 1
done

# Run SQL initialization
echo "Running SQL initialization..."
mysql -u root -p"$DB_ROOT_PASSWORD" <<-EOSQL
  CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;
  CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
  GRANT ALL PRIVILEGES ON *.* TO '$DB_USER'@'%' WITH GRANT OPTION;
  FLUSH PRIVILEGES;
EOSQL

# Keep the container alive with mysqld
wait

