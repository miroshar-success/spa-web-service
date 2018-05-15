const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index.tsx',
  ],

  devtool: 'cheap-module-source-map',

  devServer: {
    // proxy: {
    //   '/api/v1/**': {
    //     target: process.env.PROFILE_API_HOST || 'http://localhost:8080',
    //     secure: false,
    //   },
    // },

    contentBase: path.resolve(__dirname, '../dist'),
    historyApiFallback: true,
    host: "0.0.0.0",
    port: 3000,
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