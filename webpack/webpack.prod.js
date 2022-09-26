const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ENV = 'production';

module.exports = merge(common, {
    mode: 'production',
    output: {
       path: path.resolve("./dist"),
       filename: "bundle.js"
    },
    plugins: [
       new HtmlWebpackPlugin({
          title: 'SIMDE - Superescalar Machine Simulator',
          template: 'src/index.html',
          inject: true,
          minify: {
             removeComments: true,
             collapseWhitespace: true,
             removeRedundantAttributes: true,
             useShortDoctype: true,
             removeEmptyAttributes: true,
             removeStyleLinkTypeAttributes: true,
             keepClosingSlash: true,
             minifyJS: true,
             minifyCSS: true,
             minifyURLs: true
          }
       }),
       new webpack.DefinePlugin({
          'process.env': {
             'NODE_ENV': JSON.stringify('production'),
             'PUBLIC_URL': '\"/SIMDE\"'
          }
       }),
       new CopyPlugin({
           patterns: [
               { from: 'src/i18n' }
           ]
       }),
    ],
}); 
