const path = require("path");

module.exports = {
    mode: "production",
    entry: path.join(__dirname, "./src/index.ts"),
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "./www/scripts/"),
        library: "bangMapApp",
        libraryTarget: "var",
        libraryExport: "default"
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".js",".ts"]
    }
}