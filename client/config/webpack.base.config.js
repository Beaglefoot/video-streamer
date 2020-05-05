const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const projectRootDir = path.resolve(__dirname, '..');

const cssLoaderOptions = {
  modules: {
    localIdentName: '[name]__[local]--[hash:base64:5]',
    exportGlobals: true
  },
  sourceMap: true,
  importLoaders: 2,
  localsConvention: 'dashesOnly'
};

const baseConfig = {
  entry: path.resolve(projectRootDir, 'src/index.tsx'),

  output: {
    path: path.resolve(projectRootDir, 'dist'),
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
          { loader: 'ts-loader' }
        ]
      },

      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },

      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          '@teamsupercell/typings-for-css-modules-loader',
          {
            loader: 'css-loader',
            options: cssLoaderOptions
          },
          'postcss-loader',
          'sass-loader'
        ]
      },

      {
        test: /\.worker\.[jt]s$/,
        loader: 'worker-loader'
      },

      {
        test: /\.(jpe?g|png)$/i,
        loader: 'file-loader'
      },

      {
        test: /\.svg$/i,
        use: [
          'raw-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              svgo: {
                plugins: [
                  { removeDimensions: true },
                  { removeViewBox: true },
                  { cleanupIDs: false }
                ]
              }
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      src: path.resolve(projectRootDir, 'src'),
      assets: path.resolve(projectRootDir, 'assets')
    }
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(projectRootDir, 'src/index.html'),
      filename: path.resolve(projectRootDir, 'index.html')
    }),
    new webpack.WatchIgnorePlugin([/scss\.d\.ts$/]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      API_ROOT: process.env.API_ROOT
    })
  ]
};

module.exports = {
  baseConfig,
  projectRootDir,
  cssLoaderOptions
};
