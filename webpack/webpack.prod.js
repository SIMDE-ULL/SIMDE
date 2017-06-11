const webpack = require('webpack');
const path = require('path');
const commonConfig = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ENV = 'production';

module.exports = webpackMerge(commonConfig({ env: ENV }), {

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
            'NODE_ENV': JSON.stringify('production')
         }
      }),
      new webpack.optimize.UglifyJsPlugin()
   ],
});