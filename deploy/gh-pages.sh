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
WORK_DIR="$HOME/temp/$BUILD_DIR"

#echo "$LOG_PREFIX Preparing working dir: $WORK_DIR"
#
#mkdir -p "$WORK_DIR"
#cp -R $BUILD_DIR/* "$WORK_DIR"
#cd "$WORK_DIR"

echo "$LOG_PREFIX Configure Git"

git config --global user.name "$USERNAME"
git config --global user.email "$EMAIL"

echo "$LOG_PREFIX Clone repo $REPO_URL"

if [ -z "$(git ls-remote --heads "$REPO_URL")" ]; then
  echo "$LOG_PREFIX $TARGET_BRANCH doesn't exist!"
#  git clone --quiet https://"${TOKEN}"@github.com/${REPO_NAME}.git $TARGET_BRANCH >/dev/null
#  cd $TARGET_BRANCH
#  git checkout --orphan $TARGET_BRANCH
#  git rm -rf .
#  touch README.md
#  git add README.md
#  git commit -a -m "Create $TARGET_BRANCH branch"
#  git push origin $TARGET_BRANCH
#  cd ..
fi

git clone --quiet --branch=$TARGET_BRANCH "$REPO_URL" "$WORK_DIR" >/dev/null

echo "$LOG_PREFIX Prepare $TARGET_BRANCH branch"
cp -R $BUILD_DIR/* "$WORK_DIR"
#cp -R $TARGET_BRANCH/.git "$WORK_DIR"/.git
#rm -rf $TARGET_BRANCH/*
#cp -R "$WORK_DIR"/.git $TARGET_BRANCH/.git
#cd $TARGET_BRANCH
#cp -Rf "$WORK_DIR"/* .

echo "$LOG_PREFIX Commit changes"

git add -Af .
git commit -m "Automatic site update"

echo "$LOG_PREFIX Push changes"

git push -fq origin $TARGET_BRANCH >/dev/null

echo "$LOG_PREFIX Done"
