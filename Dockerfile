FROM node

run npm install -g dockerfilelint

copy entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]