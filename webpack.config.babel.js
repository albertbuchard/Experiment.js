import webpack from 'webpack'

const PROD = JSON.parse(process.env.PROD_ENV || '0')

const libraryName = 'experiment'
const outputFile = `${libraryName}${PROD ? '.min' : '.max'}.js`
const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
]
const prodPlugins = plugins.concat(new webpack.optimize.UglifyJsPlugin())

export default {
  entry: './builder.js',
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
    jquery: {
      commonjs: 'jQuery',
      commonjs2: 'jQuery',
      amd: 'jQuery',
      root: 'jQuery',
    },
    chartjs: {
      commonjs: 'chartjs',
      commonjs2: 'chartjs',
      amd: 'chartjs',
      root: 'Chart',
    },
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_',
    },
    'experiment-mathjs': {
      commonjs: 'experiment-mathjs',
      commonjs2: 'experiment-mathjs',
      amd: 'experiment-mathjs',
      root: 'math',
    },
    'experiment-boxes': {
      commonjs: 'experiment-boxes',
      commonjs2: 'experiment-boxes',
      amd: 'experiment-boxes',
      root: 'experimentBoxes',
    },
    'experiment-babylon-js': {
      commonjs: 'experiment-babylon-js',
      commonjs2: 'experiment-babylon-js',
      amd: 'experiment-babylon-js',
      root: 'BABYLON',
    },
    'experiment-babylon-js/lib/babylon.custom.js': {
      commonjs: 'experiment-babylon-js/lib/babylon.custom.js',
      commonjs2: 'experiment-babylon-js/lib/babylon.custom.js',
      amd: 'experiment-babylon-js/lib/babylon.custom.js',
      root: 'BABYLON',
    },
  },
  plugins: PROD ? prodPlugins : plugins,
}
