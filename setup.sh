#!/bin/bash
echo Updating the root package dependencies

rm -fR node_modules
npm update

cd builder

rm -fR typings
rm -fR node_modules

echo Installing builder dependencies
npm update

if [ -n $HTTP_PROXY ]; then
    echo Setting HTTP_PROXY values
    echo proxy=$HTTP_PROXY > .typingsrc
fi

echo Installing typings
typings install
