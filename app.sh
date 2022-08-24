#!/bin/bash


if [ "$TRAVIS_BRANCH" = "uat" ]
then
    CF_SPACE="uat"
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

if [ "$TRAVIS_BRANCH" = "production" ]
then
    CF_SPACE="prod"
fi

if [ "$TRAVIS_BRANCH" = "development" ]
then
    CF_SPACE="dev"
fi

echo "$CF_SPACE"

sed "s/CF_SPACE/$CF_SPACE/g" manifest-template.yml > manifest.yml

CF_USER=$username
CF_PASS=$password
CF_ORG=$organisation
CF_API_ENDPOINT=$api
CF_ENV=$TRAVIS_BRANCH

# login and target space
cf login -u "$CF_USER" -p "$CF_PASS" -o "$CF_ORG" -a "$CF_API_ENDPOINT" -s "$CF_ENV"
cf target -o "$CF_ORG" -s "$CF_ENV"

ls -l
mkdir deploy 
cp -rf dist ./deploy/
cp -rf Staticfile ./deploy/
cp -rf nginx.conf ./deploy/
cp -rf manifest.yml ./deploy/
cd deploy

cf push