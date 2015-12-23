#!/bin/bash
set -o errexit

NODE_PATH="../node/node-v4.2.3-linux-x64/bin"
GITHUB_REPOSITORY_URL="https://github.com/vinkel/site/archive/master.tar.gz"
GITHUB_COMMITS_API_URL="https://api.github.com/repos/vinkel/site/commits/master"
REPOSITORY_PACKAGE="master.tar.gz"
SITES_PATH="sites/"
BUILD_PATH="site-constraction-yard"
DEPLOY_PATH="public_html"
PID_FILE="build.pid"

DATE=`date`
echo -e "\n!! Build site $DATE !!\n"

### PID HANDLING
if [ -e $PID_FILE ]; then
  pid=`cat $PID_FILE`
  if kill -0 $pid > /dev/null 2>&1; then
    echo "** Already running, exit **"
    exit 1
  else
    echo "** Existing PID found, but no process running **"
    rm $PID_FILE
  fi
fi

echo $$ > $PID_FILE
 
## ACTUAL BUILD
rm -rf $REPOSITORY_PACKAGE
rm -rf $BUILD_PATH

LATEST_COMMIT_SHA=$(curl --silent $GITHUB_COMMITS_API_URL | grep -m1 "\"sha\":" | sed 's/\"sha\"//g;s/[\",:[:space:]+]//g')

TARGET_PATH=$SITES_PATH$LATEST_COMMIT_SHA

if [ ! -d "$TARGET_PATH" ]; 
then
  echo "** Downloading sources for commit $LATEST_COMMIT_SHA **"
  wget --quiet --output-document $REPOSITORY_PACKAGE $GITHUB_REPOSITORY_URL

  mkdir $BUILD_PATH

  echo "** Extracting sources to $BUILD_PATH **"
  tar -xzf $REPOSITORY_PACKAGE --strip 1 -C $BUILD_PATH

  echo "** Installing dependencies **"

  cd $BUILD_PATH
  $NODE_PATH/npm install

  echo "** Building site **"

  NODE_ENV=production $NODE_PATH/node index.js

  echo "** Syncing site from $TARGET_PATH to $DEPLOY_PATH **"

  cd ..
  mv $BUILD_PATH/build $TARGET_PATH

  # Must use supid rsync cause /bin/ln permission denied
  rsync -a --delete $TARGET_PATH/ $DEPLOY_PATH

  echo "** Cleanup old sites **"
  cd $SITES_PATH
  ls --ignore='.*' -x1t | sed -e '1,4d' | xargs -d '\n' rm -rf

  cd ..

  echo "** Cleanup temporary build files **"
  rm -rf $REPOSITORY_PACKAGE
  rm -rf $BUILD_PATH

else
  echo "** No new commits, latest: $LATEST_COMMIT_SHA **"
fi

rm -f $PID_FILE
