#!/bin/bash
tsc
cat build/Builder.js  build/BlendBuilder.js |  uglifyjs > build/out.js
cat copyright.txt build/out.js > ../bin/blend-builder.js