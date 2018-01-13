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
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        ],
    },
    plugins: [
        new webpack.IgnorePlugin(/^jsdom$/),
    ],
};
