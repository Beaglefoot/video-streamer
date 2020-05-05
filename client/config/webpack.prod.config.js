const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const replaceStyleLoaderWith = require('./replaceStyleLoaderWith');

const {
  baseConfig,
  cssLoaderOptions,
  projectRootDir
} = require('./webpack.base.config.js');

cssLoaderOptions.sourceMap = false;

const prodConfig = merge.smart(
  replaceStyleLoaderWith(MiniCssExtractPlugin.loader)(/\.s[ac]ss$/, baseConfig),
  {
    mode: 'production',

    output: {
      path: path.resolve(projectRootDir, 'dist'),
      filename: 'bundle-[hash].js',
      publicPath: 'dist/'
    },

    module: {
      rules: [
        {
          test: /\.(jpe?g|png)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                optipng: {
                  optimizationLevel: 7
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4
                },
                mozjpeg: {
                  progressive: true,
                  quality: 80
                }
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'styles-[contenthash].css'
      })
    ]
  }
);

module.exports = prodConfig;
