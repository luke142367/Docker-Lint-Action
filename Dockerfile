FROM node:11

RUN npm install -g dockerfilelint

copy entrypoint.sh /entrypoint.sh

COPY src /src

ENTRYPOINT [ "/entrypoint.sh" ]