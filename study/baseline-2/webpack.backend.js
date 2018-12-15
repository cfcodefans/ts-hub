'use strict'

const Path = require("path")
const FS = require("fs")
const CWD = FS.realpathSync(process.cwd())
//use this webpack-node-externals to exclude the node dependencies
//node dependenices on backend are placed in node_modules
const NODE_EXTERNALS = require("webpack-node-externals")

module.exports = {
    entry: Path.resolve(CWD, "src/backend/main.ts"),
    output: {
        filename: "backend.js",
        path: Path.resolve(CWD, "dist/backend"),
        publicPath: "/"
    },

    //enable sourcemap for debugging webpack output
    devtool: "source-map",
    target: "node",
    resolve: {
        //Add ".ts", ".tsx" as resolve extensions
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            //All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: [
                    Path.resolve(CWD, "src/frontend")
                ]
            },
            //all output '.js' files will have any sourcemaps reprocessed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ]
    },
    externals: [NODE_EXTERNALS()]
}