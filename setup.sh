#!/bin/bash
echo Updating the root package dependencies
npm update
cd builder
if [ -n $HHTP_PROXY ]; then
    echo Setting HTTP_PROXY values
    echo proxy=$HTTP_PROXY > .typingsrc
fi

echo Installing typings
typings install

echo Installing builder dependencies
npm update

