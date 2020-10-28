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
  echo "WARN! EMAIL not provided!"
fi

if [ -z "$USERNAME" ]; then
  USERNAME="deploy-bot"
  echo "WARN! USERNAME not provided!"
fi

if [ -z "$BUILD_DIR" ]; then
  BUILD_DIR="build"
  echo "BUILD_DIR not provided. Defaulting to $BUILD_DIR"
fi

REPO_URL=https://"${TOKEN}"@github.com/${REPO_NAME}.git
BUILD_DIR=${BUILD_DIR%/}
WORK_DIR="$HOME/temp-gh-pages/"
TEMP_DIR="$HOME/temp-gh-pages-checkout/"
REPO_ROOT=$(pwd)

echo "$LOG_PREFIX Prepare $TARGET_BRANCH branch"
rm -rf "$TEMP_DIR"
mkdir "$TEMP_DIR"
cp -R "$REPO_ROOT/.git/" "$TEMP_DIR/.git"
cd "$TEMP_DIR"

if [ -z "$(git ls-remote --heads "$REPO_URL" $TARGET_BRANCH)" ]; then
  echo "$LOG_PREFIX $TARGET_BRANCH doesn't exist!"
  git checkout -b $TARGET_BRANCH
else
  echo "Checkout $TARGET_BRANCH branch"
  git fetch
  git checkout -f --track origin/$TARGET_BRANCH
fi

echo "$LOG_PREFIX Prepare build"
rm -rf "$WORK_DIR"
mkdir "$WORK_DIR"
cp -R "$TEMP_DIR/.git/" "$WORK_DIR/.git"
cp -R "$REPO_ROOT"/$BUILD_DIR/. "$WORK_DIR"

if [ -z "$(git status --porcelain)" ]; then
  echo "$LOG_PREFIX There are not changes to deploy"
else
  echo "$LOG_PREFIX Commit changes"
  cd "$WORK_DIR"
  git config --local user.name "$USERNAME"
  git config --local user.email "$EMAIL"
  git add .
  git commit -m "Automatic site update"

  echo "$LOG_PREFIX Push changes"
  git push -fq origin $TARGET_BRANCH >/dev/null
fi

echo "$LOG_PREFIX Done"
