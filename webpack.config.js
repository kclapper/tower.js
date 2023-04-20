const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/tower.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: "tower.js",
    path: path.resolve(__dirname, 'build'),
  },
};
