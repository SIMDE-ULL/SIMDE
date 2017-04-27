const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
   name: 'app',
   target: 'web',
   entry: './src/demo.tsx',
   output: {
      path: __dirname + "/dist",
      filename: "bundle.js"
   },
   devtool: "source-map",
   resolve: {
      extensions: ['.ts', '.tsx'],
   },
   module: {
      loaders: [
         { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
         { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ],
   },
   externals: {
      "react": "React",
      "react-dom": "ReactDOM"
   },
   plugins: [
      new HtmlWebpackPlugin({
         title: 'Sinde DEMO',
         template: 'src/index.html'
      }),
      new CheckerPlugin()]
};