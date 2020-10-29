#!/bin/sh
set -e

LOG_PREFIX="Deploy to Github Pages:"
echo "$LOG_PREFIX Checking prerequisites"

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

BUILD_DIR=${BUILD_DIR%/}
TEMP_DIR="$HOME/temp-gh-pages/"
REPO_ROOT=$(pwd)

echo "$LOG_PREFIX Prepare $TARGET_BRANCH branch"
rm -rf "$TEMP_DIR"
mkdir "$TEMP_DIR"
cp -R "$REPO_ROOT"/$BUILD_DIR/. "$TEMP_DIR"

# Assuming target branch already exists
echo "Checkout $TARGET_BRANCH branch"
git checkout -f --track origin/$TARGET_BRANCH

cp -R ".git"/. "$TEMP_DIR/.git"
cd "$TEMP_DIR"

if [ -z "$(git status --porcelain)" ]; then
  echo "$LOG_PREFIX There are no changes to deploy"
else
  echo "$LOG_PREFIX Commit changes"
  cd "$WORK_DIR"
  git config --local user.name "$USERNAME"
  git config --local user.email "$EMAIL"
  git add .
  git commit -m "Automatic site update"

  echo "$LOG_PREFIX Push changes"
  git push
fi

echo "$LOG_PREFIX Done"
