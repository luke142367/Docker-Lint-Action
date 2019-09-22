FROM node:11

RUN npm install -g dockerfilelint

WORKDIR .docker-lint-action

COPY entrypoint.sh entrypoint.sh

COPY src src

ENTRYPOINT [ "./entrypoint.sh" ]