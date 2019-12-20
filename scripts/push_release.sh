#!/bin/bash

# Script to commit and push source and node_modules to a releases/ branch.

set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ ${BRANCH} != releases/* ]]; then
  echo "This can run only on release branches. Current branch is ${BRANCH}"
  exit 1
fi

set -x

npm ci
npm run build
git add -f lib
git diff --quiet && git diff --staged --quiet || git commit -m "build"

npm ci --only=production
git add -f node_modules
git diff --quiet && git diff --staged --quiet ||  git commit -m "node_modules"

git push
