# create createdb ecom
createdb ecom
psql --dbname ecom -f ./data/ecom-dump.sql
psql --dbname ecom -c "CREATE USER cube WITH PASSWORD '12345';"
psql --dbname ecom -c "GRANT ALL PRIVILEGES ON DATABASE ecom TO cube;"

