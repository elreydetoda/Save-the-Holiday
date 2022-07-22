FROM docker.io/python:3-alpine

WORKDIR /app
COPY . .
USER nobody
EXPOSE 8000
ENTRYPOINT [ "python3", "-m", "http.server", "${PORT:-8000}" ]
