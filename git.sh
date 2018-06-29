#!/bin/bash

set -o errexit

git config --global user.name "circle-bot"
git config --global user.email "bot@darlin.me"

git status
git commit -am"bump version"
git status

{
  git push -q "https://$GITHUB_TOKEN@github.com/doxiaodong/mobx-di.git" test:test-master
} || {
  echo "Push error"
  exit 1
}
echo "Push success!!"
