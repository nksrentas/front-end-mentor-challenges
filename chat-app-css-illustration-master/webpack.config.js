const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PRODUCITON_MODE = 'production';
const DEVELOPMENT_MODE = 'development';
const ENTRY_POINT = 'index.js';
const OUTPUT_PATH = 'dist';

const styleRegex = /\.s[ac]ss$/i;
const styleLoader = (mode) => {
  switch (mode) {
    case PRODUCITON_MODE:
      return {
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: true,
        },
      };
    case DEVELOPMENT_MODE:
      return 'style-loader';
    default:
      return 'style-loader';
  }
};

const imgRegex = /\.(png|jpe?g|gif)$/i;

module.exports = (webpackEnv) => {
  const isDevMode = webpackEnv !== PRODUCITON_MODE;
  const filenameJS = isDevMode ? '[name].js' : '[name]-[contenthash]-bundle.js';
  const filenameCSS = isDevMode
    ? '[name].css'
    : '[name]-[contenthash]-bundle.css';
  const filenameIMG = isDevMode ? '[name].[ext]' : '[name]-[contenthash].[ext]';

  return {
    mode: isDevMode ? DEVELOPMENT_MODE : PRODUCITON_MODE,
    entry: path.resolve(__dirname, ENTRY_POINT),
    output: {
      filename: filenameJS,
      path: path.resolve(__dirname, OUTPUT_PATH),
    },
    module: {
      rules: [
        {
          test: styleRegex,
          use: [styleLoader(webpackEnv), 'css-loader', 'sass-loader'],
        },
        {
          test: imgRegex,
          use: [
            {
              loader: 'file-loader',
              options: {
                filename: filenameIMG,
              },
            },
          ],
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './index.html',
        favicon: './images/favicon-32x32.png',
      }),
      new MiniCssExtractPlugin({
        filename: filenameCSS,
      }),
      new CleanWebpackPlugin(),
    ],
  };
};
