// This library used to distribute a bundled javascript file.
// It now distributes a collection of ES2020 modules. This
// was the webpack config for the bundle and is kept for
// posterity.

const path = require('path');

module.exports = {
  entry: './src/tower.ts',
  mode: 'production',
  target: 'es2020',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  experiments: {
    outputModule: true,
  },
  output: {
    library: {
      type: 'module',
    },
    filename: 'tower.mjs',
    path: path.resolve(__dirname, 'dist'),
    chunkFormat: 'module',
    clean: true,
  },
};
