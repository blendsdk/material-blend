rm -fR tests/testrunner/blend
rm -fR tests/testrunner/js

cd builder
./make-builder.sh
cd ..
bin/blend "$@"

demos=`realpath ../material-blend-dev-demo`
if [ -d $demos ]; then
    rm -fR $demos/web/blend
    rm -fR $demos/themes
    rm -fR $demos/web/js
    rm -fR $demos/web/css
    mkdir -p $demos/web/blend/css
    mkdir -p $demos/web/blend/js
    cp -fR build/css $demos/web/blend
    cp -fR build/blend/blend.js $demos/web/blend/js/blend-debug.js
    cp -fR build/blend/blend.d.ts $demos/typings/
    cp -fR blend/themes $demos/themes
    cd $demos
    tsc
    compass compile
fi
