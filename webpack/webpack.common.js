const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = function (options) {
   return {
      name: 'app',
      target: 'web',
      entry: './src/main.tsx',
      resolve: {
         extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
      module: {
         loaders: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
               test: /\.scss$/,
               loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            },
            {
               test: /\.(eot|svg|ttf|woff|woff2)$/,
               loader: 'file-loader?name=public/fonts/[name].[ext]'
            }
         ],
      },
      plugins: [
         new ExtractTextPlugin({
            filename: '[name].[hash:8].css',
            allChunks: true
         }),
         new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
         }),
         new CheckerPlugin()]
   }
};