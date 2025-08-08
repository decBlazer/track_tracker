#!/bin/bash

# Create database
psql -U postgres -c "CREATE DATABASE tracktracker;"

# Create user if it doesn't exist
psql -U postgres -c "DO
\$do\$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'tracktracker') THEN
      CREATE ROLE tracktracker LOGIN PASSWORD 'tracktracker';
   END IF;
END
\$do\$;"

# Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE tracktracker TO tracktracker;" 