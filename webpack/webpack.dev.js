const webpack = require('webpack');
const path = require('path');
const commonConfig = require('./webpack.common.js');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ENV = 'dev';


module.exports = webpackMerge(commonConfig({ env: ENV }), {
      devServer: {
            contentBase: './target/www',
            historyApiFallback: true
      },
      devtool: "source-map",
      output: {
            path: path.resolve('target/www'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js'
      },
      plugins: [
            new BrowserSyncPlugin({
                  host: 'localhost',
                  port: 9000,
                  proxy: {
                        target: 'http://localhost:9060'
                  }
            }, {
                        reload: true
                  }),
            new StyleLintPlugin(),
            new HtmlWebpackPlugin({
                  title: 'Simde DEMO',
                  template: 'src/index.html'
            }),
            new CopyWebpackPlugin([
                  { from: 'src/i18n' }
            ])
      ]
});