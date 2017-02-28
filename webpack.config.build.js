const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    name: 'app',
    target: 'web',
    entry: './src/demo.ts',
        output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['.ts'],
    },
    module: {
        loaders: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
             title: 'Sinde DEMO',
             template: 'src/index.html'           
        })]
};