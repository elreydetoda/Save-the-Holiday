FROM docker.io/node:lts-alpine

WORKDIR /app
COPY . .
RUN set -ex && rm -rf node_modules dist/* && npm install && chown -vR nobody:nogroup .
USER nobody
CMD [ "run.js" ]
EXPOSE 8000
ENTRYPOINT [ "node" ]