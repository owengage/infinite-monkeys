const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js',
        publicPath: 'dist',
    },
    devtool: "sourcemap",
    module: {
        rules: [

            /**
             * Convert our ES6/7 mangle intro ES5 for browser consumption.
             * Configuration for babel happens in `.babelrc`.
             */
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },

            /**
             * This is how I've decided to combine a lite version of web
             * components with Webpack. The file loader just gives us the path
             * to the file in `dist`. This lets us load it like a web component.
             */
            { test: /\.wc.html$/, loader: 'file-loader', exclude: /node_modules/ },

        ],
    },
    plugins: [
        /**
         * When doing testing on the server side we use JSDOM to fake a DOM.
         * But if we're bundling with Webpack we don't want to do that, obviously.
         */
        new webpack.IgnorePlugin(/^jsdom$/),
    ],
};
