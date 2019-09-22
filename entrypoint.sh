#!/bin/bash

node /.docker-lint-action/src/main.js

if [ $? -ne 0 ]
then
    echo 'Dockerfile Lint failed'
    exit 1
fi 