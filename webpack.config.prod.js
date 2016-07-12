var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist/' + process.env.TARGET),
    filename: 'bundle-[hash].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('style-[hash].css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new FaviconsWebpackPlugin({
      logo: './assets/favicon.png',
      prefix: 'icons-[hash]/'
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CopyWebpackPlugin([{
      from: './assets/backgrounds/',
      to: './assets/backgrounds/'
    }])
  ],
  resolve: {
    modulesDirectories: ['./src', './node_modules']
  },
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
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader', {
        publicPath: './'
      })
    },
    {
      test: /\.(ttf|jpg|png|otf|eot|woff|woff2)/,
      loader: 'url?limit=100000'
    },
    {
      test: /\.svg(\?.*)?$/,
      loader: 'babel!svg-react' +
        // removes xmlns tag from svg (see https://github.com/jhamlet/svg-react-loader/issues/25)
        '!string-replace?search=%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22&replace=' +
        '!string-replace?search=%20data-name%3D%22%5B%5Cw%5Cs_-%5D*%22&replace=&flags=ig'
    }]
  }
};
