#!/bin/bash

trap 'kill 0' SIGINT

yarn build:watch &

sleep 5 && yarn serve

