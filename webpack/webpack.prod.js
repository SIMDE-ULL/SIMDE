const path = require('path');
const commonConfig = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');
const ENV = 'prod';

module.exports = webpackMerge(commonConfig({ env: ENV }), {

   output: {
      path: path.resolve("./dist"),
      filename: "bundle.js"
   }
});