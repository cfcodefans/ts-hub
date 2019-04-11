'use strict'

const Path = require("path")
const FS = require("fs")
const CWD = FS.realpathSync(process.cwd())
//use this webpack-node-externals to exclude the node dependencies
//node dependenices on backend are placed in node_modules

module.exports = {

    entry: {
        app: Path.resolve(CWD, "src/frontend/app.ts"),
        commons: Path.resolve(CWD, "src/frontend/commons.ts"),
        add: Path.resolve(CWD, "src/frontend/add.ts"),
        list: Path.resolve(CWD, "src/frontend/list.ts"),
    },
    output: {
        filename: "[name].js",
        path: Path.resolve(CWD, "frontend/static/js"),
        publicPath: "/"
    },

    //enable sourcemap for debugging webpack output
    devtool: "source-map",
    target: "web",
    resolve: {
        //Add ".ts", ".tsx" as resolve extensions
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            //All files with a '.tsx' extension will be handled by 'awesome-typescript-loader'
            {
                test: /\.tsx$/,
                loader: "awesome-typescript-loader",
                // loader: "awesome-typescript-loader?{configFileName: 'config/tsconfig.json'}"
                exclude: [
                    Path.resolve(CWD, "node_modules"),
                    Path.resolve(CWD, "src/backend")
                ]
            },
            //All files with a '.ts' extension will be handled by 'awesome-typescript-loader'
            {
                test: /\.ts$/,
                loader: "ts-loader",
                // loader: "awesome-typescript-loader?{configFileName: 'config/tsconfig.json'}"
                exclude: [
                    Path.resolve(CWD, "node_modules"),
                    Path.resolve(CWD, "src/backend")
                ]
            },
            //all output '.js' files will have any sourcemaps reprocessed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ]
    },
    externals: {

    }
}