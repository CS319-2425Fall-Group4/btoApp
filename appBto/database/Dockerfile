FROM postgres:15

# Copy the schema.sql file to the container
COPY schema.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432
