#!/bin/bash

node src/main.js

if [$? -ne 0 ]
then
    echo 'DockerFileLint failed'
    exit 1
fi