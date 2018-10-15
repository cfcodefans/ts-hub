import { logger } from "./logger"
import { Logger } from "winston"

import {BaseContext} from "koa"

import Koa = require("koa")
import KoaCompress = require("koa-compress")
// import * as BodyParser from "koa-bodyparser"
import bodyParser = require("koa-bodyparser")
// import * as _KoaRouter from "koa-router"
import KoaRouter = require("koa-router")


const log: Logger = logger("main")

function main(): void {
    log.info("start...")

    const app: Koa = new Koa()
    //enable gzip
    app.use(KoaCompress({ threshold: 2048 }))

    // Enable bodyParser with default options
    app.use(bodyParser())

    const router: KoaRouter = new KoaRouter()

    router.get("/test", async (ctx: BaseContext) => {
        log.info(JSON.stringify(ctx.query))
        ctx.body = "test ok"
    })

    app.use(router.routes()).use(router.allowedMethods())

    app.listen(12345)
}
main()