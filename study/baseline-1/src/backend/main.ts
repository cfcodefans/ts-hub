import { BaseContext, Context } from "koa"

import Koa = require("koa")
import koaCompress = require("koa-compress")
import bodyParser = require("koa-bodyparser")
import KoaRouter = require("koa-router")
import Serve = require("koa-static")
import Mime = require("mime")
import OS = require("os")
import Path = require("path")

import * as Apis from "./apis_impls"

import { logger } from "./log"
import { Logger } from "winston"
const log: Logger = logger("main")

const compress_types: string[] = [
    Mime.getType("txt"),
    Mime.getType("html"),
    Mime.getType("json"),
    Mime.getType("css"),
    Mime.getType("xml")
].filter(e => e != null) as string[]

function main(): void {
    log.info("start...")

    const app: Koa = new Koa()
    //enable gzip
    app.use(koaCompress({
        threshold: 2048,
        filter: (content_type: string) => compress_types.indexOf(content_type) >= 0
    }))

    //Enable bodyParser with default options
    app.use(bodyParser())

    const router: KoaRouter = new KoaRouter()

    //be noted, the static middleware is same as mapping the local path to the root
    const _static = Serve(Path.resolve(Path.join(__dirname, "../frontend")),
        { gzip: true, index: "index.html" })
    // app.use(_static)

    router.get("/test", async (ctx: Context) => {
        ctx.body = "test ok"
        ctx.type = Mime.getType("txt") || "text/html"
    }).get("/static/(.*)", _static) //there must be (.*), otherwise it wont be directed to static

    Apis.mount(router)

    app.use(router.routes())
        .use(router.allowedMethods())

    log.info(`start at http://${OS.hostname()}:12345/`)
    log.info(`static at ${Path.resolve(Path.join(__dirname, "./static"))}`)
    app.listen(12345)
}
main()