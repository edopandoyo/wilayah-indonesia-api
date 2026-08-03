FROM postgres:16-alpine

# Copy database initialization SQL files directly into the image
COPY ./init-db /docker-entrypoint-initdb.d/
