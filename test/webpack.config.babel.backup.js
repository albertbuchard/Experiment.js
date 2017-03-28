// @flow

// import path from 'path'
import webpack from 'webpack'

const WDS_PORT = 7000

const PROD = JSON.parse(process.env.PROD_ENV || '0')

const libraryName = 'experiment'
const outputFile = `${libraryName}${PROD ? '.min' : '.max'}.js`
const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
]
const prodPlugins = plugins.concat(new webpack.optimize.UglifyJsPlugin())
// not really working
export default {
  entry: './builder.js',
  target: 'web',
  output: {
    path: `${__dirname}/lib`,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
    ],

  },
  devtool: PROD ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    chartjs: true,
    lodash: true,
    jquery: true,
    'experiment-mathjs': true,
    'experiment-boxes': true,
    'experiment-babylon-js': true,
  },
  devServer: {
    port: WDS_PORT,
    hot: true,
  },
  plugins: PROD ? prodPlugins : plugins,
}
