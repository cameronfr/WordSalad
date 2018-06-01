const path = require("path");
const webpack = require("webpack");
const bundlePath = path.resolve(__dirname, "static");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['env'] }
      },
      {
        test: /\.(css|less)$/,
        use: [{
          loader:'style-loader',
        }, {
          loader:'css-loader', options: {minimize: true},
        }, {
          loader:'less-loader'
        }]
      }
    ]
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  output: {
    path: bundlePath,
    publicPath: bundlePath,
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname,'public'),
    port: 3000,
    publicPath: "http://localhost:3000/static"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
    //new BundleAnalyzerPlugin(),
    //new CompressionPlugin(),
   ]
};
