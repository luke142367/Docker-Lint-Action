FROM node:11

RUN npm install -g dockerfilelint

WORKDIR .docker-lint-action

copy entrypoint.sh entrypoint.sh

COPY src src

ENTRYPOINT [ "/.docker-lint-action/entrypoint.sh" ]