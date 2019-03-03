
const Path = require("path")
const FS = require("fs")
const CWD = FS.realpathSync(process.cwd())

module.exports = {
    entry: { app: Path.resolve(CWD, 'src/app.ts') },
    output: {
        filename: '[name].js',
        path: Path.resolve(CWD, 'static/js')
    },
    devtool: "source-map",
    target: "web",
    devServer: {
        contentBase: './static',
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};