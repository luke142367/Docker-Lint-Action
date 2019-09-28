FROM node:11

RUN npm install -g dockerfilelint

WORKDIR /.docker-lint-action

COPY entrypoint.sh package.json package-lock.json ./

RUN npm install

COPY build build

ENTRYPOINT [ "/.docker-lint-action/entrypoint.sh" ]