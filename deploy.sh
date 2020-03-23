#!/usr/bin/env sh

set -e

# 构建
npm run build:prod


cd dist

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/caixiaoguang/drone-share.git master:gh-pages

# cd -