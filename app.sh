#!/bin/bash

APP_ENV=$(git symbolic-ref --short HEAD)

echo
echo "**** Running post-commit hook from branch $APP_ENV"
echo

if [[ "$APP_ENV" == "uat" ]]
then
    CF_SPACE="uat"
fi


echo "$CF_SPACE"

sed "s/CF_SPACE/$CF_SPACE/g" manifest-template.yml