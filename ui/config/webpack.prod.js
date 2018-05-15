const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
// const FontFaceRemoverPlugin = require('../FontFaceRemoverPlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: PRODUCTION ? 'js/[name].[chunkhash].js' : 'js/[name].js',
  },
  devtool: 'cheap-module-source-map',
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      comments: false,
      sourceMap: true,
      minimize: true,
      exclude: [/\.min\.js$/gi],
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new FontFaceRemoverPlugin(),
  ],
})