#!/bin/bash

set -o errexit

git config --global user.name "circle-bot"
git config --global user.email "duxiaodong@darlin.me"

git status
git add -A
git commit -am"bump version $CIRCLE_TAG [skip ci]"
git status
