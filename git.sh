#!/bin/bash

set -o errexit

git config --global user.name "circle-bot"
git config --global user.email "bot@darlin.me"

git status
git commit -am"bump version"
git status
