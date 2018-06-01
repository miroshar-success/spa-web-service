const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: ['./src/index.tsx'],
  },

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
    filename: 'js/bundle.js',
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.json', '.css', 'html'],
    alias: {
      '@redux': path.resolve(__dirname, '../src/redux'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@containers': path.resolve(__dirname, '../src/containers'),
    }
  },

  stats: { warnings: false },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true,
              declaration: false,
            }
          }],
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.js$/,
        exclude: {
          test: path.resolve(__dirname, '../node_modules'),
          exclude: path.resolve(__dirname, '../node_modules/webpack-dev-server')
        },
        use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }]
      },
      {
        test: /\.(css)$/,
        // exclude: path.join(__dirname, 'src'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader'
          ],
        })
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        use: ['url-loader?limit=10000&mimetype=image/svg+xml']
      },
      {
        test: /\.gif/,
        exclude: /node_modules/,
        use: ['url-loader?limit=10000&mimetype=image/gif']
      },
      {
        test: /\.jp(e)g/,
        exclude: /node_modules/,
        use: ['url-loader?limit=10000&mimetype=image/jpg']
      },
      {
        test: /\.png/,
        exclude: /node_modules/,
        use: ['url-loader?limit=10000&mimetype=image/png']
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        exclude: /node_modules/,
        include: /assets/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/',
          output: 'assets/fonts/',
        }
      },
      {
        test: /\.(woff|woff2)$/,
        exclude: /node_modules/,
        include: /assets/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/',
          output: 'assets/fonts/',
        }
      },
      {
        test: /\.ttf(\?v=\d+.\d+.\d+)?$/,
        exclude: /node_modules/,
        include: /assets/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/',
          output: 'assets/fonts/',
        }
      },
      {
        test: /\.svg(\?v=\d+.\d+.\d+)?$/,
        exclude: /node_modules/,
        include: /assets/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/',
          output: 'assets/fonts/',
        }
      },
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'styles/bundle.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      filename: 'index.html',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ]),
  ]
}