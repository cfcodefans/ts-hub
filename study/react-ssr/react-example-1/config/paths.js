'use strict'

const path = require("path")
const fs = require("fs")

//make sure any symlinks in the project folder are resolved
//https://github.com/facebookincubator/create-react-app/issues/637
const appDir = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDir, relativePath)

module.exports = {
    appDist: resolveApp("dist"),
    appServerTs: resolveApp("src/server/index.ts")
}

console.info(module.exports)