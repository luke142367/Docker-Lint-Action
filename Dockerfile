FROM node:11

RUN npm install -g dockerfilelint

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]