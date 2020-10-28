#!/bin/sh
set -e

LOG_PREFIX="Deploy to Github Pages:"
echo "$LOG_PREFIX Checking prerequisites"

if [ -z "$TOKEN" ]; then
  echo "TOKEN not provided!"
  exit 1
fi

if [ -z "$REPO_NAME" ]; then
  REPO_NAME="adimoldovan/covid-19"
  echo "REPO_NAME not provided. Defaulting to $REPO_NAME"
fi

if [ -z "$TARGET_BRANCH" ]; then
  TARGET_BRANCH="gh-pages"
  echo "TARGET_BRANCH not provided. Defaulting to $TARGET_BRANCH"
fi

if [ -z "$EMAIL" ]; then
  EMAIL="deploy-bot-noreply@noreply"
  echo "EMAIL not provided. Defaulting to $EMAIL"
fi

if [ -z "$USERNAME" ]; then
  USERNAME="deploy-bot"
  echo "USERNAME not provided. Defaulting to $USERNAME"
fi

if [ -z "$BUILD_DIR" ]; then
  BUILD_DIR="build"
  echo "BUILD_DIR not provided. Defaulting to $BUILD_DIR"
fi

REPO_URL=https://"${TOKEN}"@github.com/${REPO_NAME}.git
BUILD_DIR=${BUILD_DIR%/}
WORK_DIR="$HOME/temp-gh-pages/"
REPO_ROOT=$(pwd)

echo "$LOG_PREFIX Configure Git"

git config --global user.name "$USERNAME"
git config --global user.email "$EMAIL"

echo "$LOG_PREFIX Clone repo $REPO_URL"

rm -rf "$WORK_DIR"

if [ -z "$(git ls-remote --heads "$REPO_URL" $TARGET_BRANCH)" ]; then
  echo "$LOG_PREFIX $TARGET_BRANCH doesn't exist!"
  git clone --quiet "$REPO_URL" "$WORK_DIR" >/dev/null
  cd "$WORK_DIR"
  git checkout -b $TARGET_BRANCH
  git rm -rf .
else
  git clone --quiet --branch=$TARGET_BRANCH "$REPO_URL" "$WORK_DIR" >/dev/null
fi

echo "$LOG_PREFIX Prepare $TARGET_BRANCH branch"
cp -R "$REPO_ROOT"/$BUILD_DIR/* "$WORK_DIR"

echo "$LOG_PREFIX Commit changes"

cd "$WORK_DIR"
git add -Af .
git commit -m "Automatic site update"

echo "$LOG_PREFIX Push changes"

git push -fq origin $TARGET_BRANCH >/dev/null

echo "$LOG_PREFIX Done"
