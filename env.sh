#!/bin/bash


if [ "$TRAVIS_BRANCH" = "uat" ]
then
    IDAM=$IDAM_ID
fi


echo $IDAM