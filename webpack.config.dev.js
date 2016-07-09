var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');


module.exports = {
  // or devtool: 'eval' to debug issues with compiled output:
  devtool: 'eval',
  entry: [
    // necessary for hot reloading with IE:
    'eventsource-polyfill',
    // listen to code updates emitted by hot middleware:
    'webpack-hot-middleware/client',
    // your code:
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    modulesDirectories: ['./src', './node_modules']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new FaviconsWebpackPlugin({
      logo: './assets/favicon.png',
      prefix: 'icons-[hash]/'
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },
    {
      test: /\.json$/,
      loader: 'json'
    },
    {
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader'
      ]
    },
    {
      test: /\.(ttf|jpg|png|otf|eot|woff|woff2)/,
      loader: 'url?limit=100000'
    },
    {
      test: /\.svg$/,
      loader: 'babel!svg-react'
    }]
  }
};
