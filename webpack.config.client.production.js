const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin');
const CURRENT_WORKING_DIR = process.cwd();

const config = {
  mode: 'production',
  entry: [path.join(CURRENT_WORKING_DIR, 'client/main.js')],
  output: {
    path: path.join(CURRENT_WORKING_DIR, '/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  stats: 'errors-only',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template.js',
      inject: 'head',
      favicon: './client/assets/images/favicon.png',
    }),
  ],
};

module.exports = config;
