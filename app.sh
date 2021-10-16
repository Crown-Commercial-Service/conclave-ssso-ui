#!/bin/bash


if [ "$TRAVIS_BRANCH" = "uat" ]
then
    CF_SPACE="uat"| IDAM="TPmOI4f0eDrYqzRu2a4BXNhe4vHJt4jY" 
fi

if [ "$TRAVIS_BRANCH" = "training" ]
then
    CF_SPACE="training"
fi

if [ "$TRAVIS_BRANCH" = "testing" ]
then
    CF_SPACE="test"
fi

if [ "$TRAVIS_BRANCH" = "pre-production" ]
then
    CF_SPACE="preprod"
fi

if [ "$TRAVIS_BRANCH" = "sandbox" ]
then
    CF_SPACE="sand"
fi

echo "$CF_SPACE"

sed "s/CF_SPACE/$CF_SPACE/g" manifest-template.yml > manifest.yml

echo "$IDAM"

sed "s/IDAM/$IDAM/g" src/environments/enviornment-template.ts > src/envionrment/enviornment.ts