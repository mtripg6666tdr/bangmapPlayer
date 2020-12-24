const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "./www/scripts/")
    },
    entry: path.join(__dirname, "./src/index.ts"),
    module: {
        rules: [
            {
                test: /\.ts/,
                exclude: /node_modules/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts"]
    }
}