#!/bin/bash


if [ "$TRAVIS_BRANCH" = "uat" ]
then
    IDAM=$IDAM_ID
fi

sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-template.ts > src/environments/environment.ts