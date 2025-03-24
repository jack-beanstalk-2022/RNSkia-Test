// webpack.config.js
const path = require("path");
const fs = require("fs");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const { presets, plugins } = require(`${__dirname}/babel.config.js`);

const babelLoaderConfiguration = {
  test: /\.(ts|tsx)$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, "index.js"), // Entry to your application
    path.resolve(__dirname, "MySkiaComponent.tsx"), // Entry to your application
  ],
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      presets,
      plugins,
    },
  },
};
const svgLoaderConfiguration = {
  test: /\.(svg)$/,
  use: [
    {
      loader: "@svgr/webpack",
    },
  ],
};
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png)$/,
  use: {
    loader: "url-loader",
    options: {
      name: "[name].[ext]",
      esModule: false,
    },
  },
};

const fontLoaderConfiguration = {
  test: /\.(otf|ttf)$/,
  use: {
    loader: "url-loader",
    options: {
      name: "[name].[ext]",
    },
  },
};

module.exports = {
  mode: 'development',
  entry: {
    app: path.join(__dirname, "index.js"),
  },
  output: {
    path: path.resolve(__dirname, "./bundle"),
    publicPath: "/",
    filename: "test.bundle.js",
  },
  devServer: {
    static: './bundle',
    historyApiFallback: true,
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".web.js", ".js"],
    alias: {
      "react-native$": "react-native-web",
      "react-native-reanimated/package.json": require.resolve(
        "react-native-reanimated/package.json"
      ),
      "react-native-reanimated": require.resolve("react-native-reanimated"),
      "react-native/Libraries/Image/AssetRegistry": false,
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      fontLoaderConfiguration,
      svgLoaderConfiguration,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
    }),
    new webpack.DefinePlugin({
      // See: <https://github.com/necolas/react-native-web/issues/349>
      __DEV__: JSON.stringify(process.env.PISTACHIO_ENV !== "prod"),
    }),
    new (class CopySkiaPlugin {
      apply(compiler) {
        compiler.hooks.thisCompilation.tap("AddSkiaPlugin", (compilation) => {
          compilation.hooks.processAssets.tapPromise(
            {
              name: "copy-skia",
              stage:
                compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
            },
            async () => {
              const src = require.resolve(
                "canvaskit-wasm/bin/full/canvaskit.wasm"
              );
              if (compilation.getAsset(src)) {
                // Skip emitting the asset again because it's immutable
                return;
              }

              compilation.emitAsset(
                "/canvaskit.wasm",
                new webpack.sources.RawSource(await fs.promises.readFile(src))
              );
            }
          );
        });
      }
    })(),
    new NodePolyfillPlugin()
  ],
};
