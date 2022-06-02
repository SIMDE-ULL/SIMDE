const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        app: './src/main.tsx',
    },
    optimization: {
        usedExports: true
    },
    output: {
          filename: '[name].[contenthash].js',
          path: path.resolve('target/www')
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
    },
    module: {
       rules: [
          { test: /\.tsx?$/, loader: "ts-loader" },
          { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              "sass-loader",
            ],
          },
          // {
          //   test: /\.(eot|svg|ttf|woff|woff2)$/,
          //   loader: 'file-loader',

          //   options: {
          //       name: "public/fonts/[name].[ext]",
          //   },
          // },
       ],
    },
    plugins: [
       new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
       })
    ]
};
