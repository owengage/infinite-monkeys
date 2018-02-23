#!/usr/bin/env bash

# ts-node doesn't support ES6 modules, so I apparently need
# to switch to compiling TS with commonjs style modules.
# Not really sure why.
export TS_NODE_COMPILER_OPTIONS='{"module": "commonjs"}'

# You can do ./run-tests.sh --watch as well.
node_modules/.bin/mocha \
    --require jsdom-global/register \
    --watch-extensions ts \
    --require ts-node/register test/**/*.ts \
    "$@"
