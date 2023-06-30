const path = require('path');

module.exports = {
  entry: './src/tower.ts',
  mode: 'production',
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
  output: {
    library: {
      type: 'commonjs-static',
    },
    filename: 'tower.cjs',
    path: path.resolve(__dirname, 'dist'),
    chunkFormat: 'module',
    clean: true,
  },
};
