// Important modules this config uses
const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const REACT_VERSION = require('react/package.json').version;
const env = require('../env/prod'); // eslint-disable-line import/no-unresolved

const resolvers = require('./resolvers');

module.exports = require('./webpack.base.babel')({
  env,
  mode: 'production',
  // In production, we skip all hot-reloading stuff
  entry: [
    path.join(process.cwd(), 'app/app.js'),
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].chunk.js',
  },

  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/index.ejs',
      templateParameters: env,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new DynamicCdnWebpackPlugin({
      // verbose: true,
      resolver: (moduleName, version) => {
        const res = resolvers[moduleName];
        if (!res) return null;
        return {
          name: moduleName,
          var: res.var,
          url: res.url.replace('{{VERSION}}', moduleName === 'react-dom' ? REACT_VERSION : version),
          weight: res.weight,
          version,
        };
      },
    }),
    // new BundleAnalyzerPlugin(),
  ],

  devtool: 'hidden-source-map',

  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        output: {
          comments: false,
        },
      },
    })],
  },
});
