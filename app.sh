#!/bin/bash

APP_ENV=$(git symbolic-ref --short HEAD)

echo
echo "**** Running post-commit hook from branch $APP_ENV"
echo

if [ "$GITHUB_HEAD_REF" = "uat" ]
then
    CF_SPACE="uat"
fi

if [ "$GITHUB_HEAD_REF" = "training" ]
then
    CF_SPACE="training"
fi

if [ "$GITHUB_HEAD_REF" = "testing" ]
then
    CF_SPACE="test"
fi

if [ "$GITHUB_HEAD_REF" = "pre-production" ]
then
    CF_SPACE="preprod"
fi

if [ "$GITHUB_HEAD_REF" = "sandbox" ]
then
    CF_SPACE="sand"
fi

echo "$CF_SPACE"

sed "s/CF_SPACE/$CF_SPACE/g" manifest.yml