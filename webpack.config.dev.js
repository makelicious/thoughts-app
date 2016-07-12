var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');


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
    }),
    new CopyWebpackPlugin([{
      from: './assets/backgrounds/',
      to: './assets/backgrounds/'
    }])
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
      test: /\.svg(\?.*)?$/,
      loader: 'babel!svg-react' +
        // removes xmlns tag from svg (see https://github.com/jhamlet/svg-react-loader/issues/25)
        '!string-replace?search=%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22&replace=' +
        '!string-replace?search=%20data-name%3D%22%5B%5Cw%5Cs_-%5D*%22&replace=&flags=ig'
    }]
  }
};
