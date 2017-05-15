const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = function (options) {
   return {
      name: 'app',
      target: 'web',
      entry: './src/main.tsx',
      output: {
         path: __dirname + "/dist",
         filename: "bundle.js"
      },
      devtool: "source-map",
      resolve: {
         extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
      module: {
         loaders: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
               test: /\.css$/,
               loader: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: {
                     loader: 'css-loader'
                  }
               })
            },
            {
               test: /\.(eot|svg|ttf|woff|woff2)$/,
               loader: 'file-loader?name=public/fonts/[name].[ext]'
            }
         ],
      },
      plugins: [
         new HtmlWebpackPlugin({
            title: 'Sinde DEMO',
            template: 'src/index.html'
         }),
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