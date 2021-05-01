import { resolve } from "path";
import webpack from "webpack";

export default () => {
  return {
    mode: "development",
    entry: "./public/js/app.js",
    output: {
      filename: "bundle.js",
      path: resolve("./public/dist"),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }]],
            },
          },
        },
      ],
    },
  };
};
