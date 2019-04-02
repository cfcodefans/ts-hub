import KoaRouter = require("koa-router")
import Mime = require("mime")
import { BaseContext, Context } from "koa"

import { logger } from "./log"
import { Logger } from "winston"
const log: Logger = logger("sqlite_impls")

import sqlite from "sqlite"
import { DBResp, DBReq } from "../common/defs";

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

    kr.post("/sql/", async (ctx: Context) => {
        let req: DBReq = ctx.body as DBReq

        log.info(req)

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
        ctx.type = Mime.getType("json") || "application/json"
    })

    return kr
}