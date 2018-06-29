const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: [
    'webpack-dev-server/client?http://localhost:4000',
    'webpack/hot/only-dev-server',
    './src/index.tsx',
  ],

  devtool: 'cheap-module-source-map',

  devServer: {

    headers: {
      "Access-Control-Allow-Origin": "*",
    },

    proxy: {
      '*': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },

    contentBase: path.resolve(__dirname, '../dist'),
    historyApiFallback: true,
    host: "0.0.0.0",
    port: 4000,
    hot: true,
    publicPath: '/',
    compress: true,
    disableHostCheck: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
})