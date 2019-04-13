import KoaRouter = require("koa-router")
import bodyParser = require("koa-bodyparser")
import Mime = require("mime")
import { Context } from "koa"
import sqlite from "sqlite"
import { Logger } from "winston"
import { logger } from "./log"
import { DBReq, DBResp } from "../common/defs";

const log: Logger = logger("sqlite_impls")


const dbPromise = sqlite.open("./sqlite", { cached: true })

async function init() {
    let db: sqlite.Database = await dbPromise
    db = await db.migrate({})
    let re = await db.all("select name from sqlite_master where type='table'")
    log.info(`\ntables\n${re.map(v => JSON.stringify(v)).join("\n")}`)
}

init()

export function mount(kr: KoaRouter): KoaRouter {
    if (!!!kr) return kr

    kr.use(bodyParser())

    kr.post("/sql/", async (ctx: Context) => {
        // ctx.type = Mime.getType("json") || "application/json"
        // log.info(`get ctx\n\t${JSON.stringify(ctx)}`)
        // log.info(`get body\n\t${JSON.stringify(ctx.body)}`)
        log.info(`get request.body\n\t${JSON.stringify(ctx.request.body)}`)
        // log.info(`get request.rawBody\n\t${JSON.stringify(ctx.request.rawBody)}`)
        ctx.body = { id: -1, name: "dummy", mark: "", note: "" }

        let req: DBReq = ctx.request.body as DBReq

        try {
            let write: string = req.w
            let read: string = req.r

            let result: DBResp = { updated: -1, data: {} }

            const db: sqlite.Database = await dbPromise
            if (write) {
                try {
                    let stat = await db.run(write)
                    result.updated = stat.changes
                } catch (err) {
                    log.error(`
                        failed to query with ${JSON.stringify(req)} for
                        ${err}
                    `)
                    ctx.onerror(err)
                }
            }
            if (read) {
                result.data = await db.all(read)
            }

            ctx.body = result
        } catch (err) {
            log.error("failed for " + err)
            ctx.body = { error: err }
        }

    })

    return kr
}