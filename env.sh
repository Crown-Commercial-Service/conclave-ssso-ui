#!/bin/bash


if [ "$TRAVIS_BRANCH" = "uat" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-uat.ts > src/environments/environment.ts
    sed "s/ROLLBAR/$ROLLBAR/g" src/environments/environment-uat.ts > src/environments/environment.ts
fi

if [ "$TRAVIS_BRANCH" = "training" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-training.ts > src/environments/environment.ts
    sed "s/ROLLBAR/$ROLLBAR/g" src/environments/environment-training.ts > src/environments/environment.ts
fi

if [ "$TRAVIS_BRANCH" = "pre-production" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-pre-production.ts > src/environments/environment.ts
    sed "s/ROLLBAR/$ROLLBAR/g" src/environments/environment-pre-production.ts > src/environments/environment.ts
fi

if [ "$TRAVIS_BRANCH" = "sandbox" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-sandbox.ts > src/environments/environment.ts
    sed "s/ROLLBAR/$ROLLBAR/g" src/environments/environment-sandbox.ts > src/environments/environment.ts
fi

if [ "$TRAVIS_BRANCH" = "testing" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-testing.ts > src/environments/environment.ts
    sed "s/ROLLBAR/$ROLLBAR/g" src/environments/environment-testing.ts > src/environments/environment.ts
fi
