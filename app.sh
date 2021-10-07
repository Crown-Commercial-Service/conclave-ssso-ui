#!/bin/bash

APP_ENV=$(git symbolic-ref --short HEAD)

echo
echo "**** Running post-commit hook from branch $APP_ENV"
echo

if [ "$APP_ENV" = "uat" ]
then
    CF_SPACE="uat"
fi

if [ "$APP_ENV" = "training" ]
then
    CF_SPACE="training"
fi

if [ "$APP_ENV" = "testing" ]
then
    CF_SPACE="test"
fi

if [ "$APP_ENV" = "pre-production" ]
then
    CF_SPACE="preprod"
fi

if [ "$APP_ENV" = "sandbox" ]
then
    CF_SPACE="sand"
fi

echo "$CF_SPACE"

sed "s/CF_SPACE/$CF_SPACE/g" manifest.yml