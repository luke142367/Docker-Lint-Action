#!/bin/bash

NODE_PATH=/.docker-lint-action/node_modules node /.docker-lint-action/src/main.js

if [ $? -ne 0 ]
then
    echo 'Dockerfile Lint failed'
    exit 1
fi 