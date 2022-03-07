#!/bin/bash


if [ "$TRAVIS_BRANCH" = "uat" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    GTM=$GTM
    BUCKET_URL=$BUCKET_URL
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-uat.ts | sed "s/ROLLBAR/$ROLLBAR/g" | sed "s/GTM/$GTM/g" | sed "s/BUCKET_URL/$BUCKET_URL/g" >> src/environments/environment.ts
fi

if [ "$TRAVIS_BRANCH" = "training" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    GTM=$GTM
    BUCKET_URL=$BUCKET_URL
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-training.ts | sed "s/ROLLBAR/$ROLLBAR/g" | sed "s/GTM/$GTM/g" | sed "s/BUCKET_URL/$BUCKET_URL/g" >> src/environments/environment.ts
fi

if [ "$TRAVIS_BRANCH" = "pre-production" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    GTM=$GTM
    BUCKET_URL=$BUCKET_URL
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-pre-production.ts | sed "s/ROLLBAR/$ROLLBAR/g" | sed "s/GTM/$GTM/g" | sed "s/BUCKET_URL/$BUCKET_URL/g" >> src/environments/environment.ts
fi

if [ "$TRAVIS_BRANCH" = "sandbox" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    GTM=$GTM
    BUCKET_URL=$BUCKET_URL
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-sandbox.ts | sed "s/ROLLBAR/$ROLLBAR/g" | sed "s/GTM/$GTM/g" | sed "s/BUCKET_URL/$BUCKET_URL/g" >> src/environments/environment.ts
fi

if [ "$TRAVIS_BRANCH" = "testing" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    GTM=$GTM
    BUCKET_URL=$BUCKET_URL
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-testing.ts | sed "s/ROLLBAR/$ROLLBAR/g" | sed "s/GTM/$GTM/g" | sed "s/BUCKET_URL/$BUCKET_URL/g" >> src/environments/environment.ts
fi

if [ "$TRAVIS_BRANCH" = "production" ]
then
    IDAM=$IDAM_ID
    ROLLBAR=$ROLLBAR
    GTM=$GTM
    BUCKET_URL=$BUCKET_URL
    sed "s/IDAM_ID/$IDAM_ID/g" src/environments/environment-production.ts | sed "s/ROLLBAR/$ROLLBAR/g" | sed "s/GTM/$GTM/g" | sed "s/BUCKET_URL/$BUCKET_URL/g" >> src/environments/environment.ts
fi