const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: "source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, './../target/www'),
        },
        historyApiFallback: true,
        compress: true,
        port:9060,
    },
    plugins: [
          new StyleLintPlugin({
              extensions: ['scss', 'sass'],
          }),
          new HtmlWebpackPlugin({
                title: 'SIMDE (Development mode)',
                template: 'src/index.html'
          }),
          new CopyPlugin({
              patterns: [
                  { from: 'src/i18n' }
              ]
          }),
          new webpack.DefinePlugin({
              'process.env': {
                 'NODE_ENV': JSON.stringify('development')
              }
          }),
    ]
});
