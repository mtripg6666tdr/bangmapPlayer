const path = require("path");

module.exports = {
    mode: "production",
    entry: path.join(__dirname, "./src/index.ts"),
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "./www/scripts/")
    },
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
        extensions: [".js",".ts"]
    }
}