#!/bin/bash

# set GitHub repo details
OWNER=$username_git
REPO="https://github.com/Crown-Commercial-Service/conclave-ssso-ui.git"
GITHUB_TOKEN=$token_git

# set version range
START_VERSION=1.0.0
END_VERSION=1.0.5

# loop through versions and create releases
for ((i=$(echo $START_VERSION | tr '.' ' ');i<=$(echo $END_VERSION | tr '.' ' ');i++)); do
  VERSION=$(echo $i | tr ' ' '.')
  TAG_NAME="v$VERSION"
  RELEASE_NAME="Release $VERSION"
  RELEASE_BODY="Release for version $VERSION"

  # create release via GitHub API
  curl --request POST \
    --url "https://api.github.com/repos/$OWNER/$REPO/releases" \
    --header "authorization: Bearer $GITHUB_TOKEN" \
    --header 'content-type: application/json' \
    --data "{
      \"tag_name\": \"$TAG_NAME\",
      \"name\": \"$RELEASE_NAME\",
      \"body\": \"$RELEASE_BODY\",
      \"draft\": false,
      \"prerelease\": false
    }"
done
