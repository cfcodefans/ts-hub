import KoaRouter = require("koa-router")
import bodyParser = require("koa-bodyparser")
import Mime = require("mime")
import { Context } from "koa"
import { Logger } from "winston"
import { logger } from "./log"
import { DBReq, DBResp, head } from "../common/defs"
import * as sql from "sql.js"
import * as fs from "fs"

const log: Logger = logger("sqlite_impls")

let db: sql.Database

function saveToFile(db: sql.Database) {
    const data: Uint8Array = db.export()
    const buf: Buffer = new Buffer(data)
    fs.writeFileSync("sqlite", buf)
}

async function init() {
    try {
        const sqliteFile: Buffer = fs.readFileSync("sqlite")
        db = new sql.Database(sqliteFile)

        log.info(JSON.stringify(
            resultToObjs(head(db.exec("select name from sqlite_master where type='table'")))
        ))

        // process.stdin.resume()
        process.on("SIGINT", () => {
            saveToFile(db)
            db.close()
            process.exit()
        })
    } catch (err) {
        log.error("failed to init sql_impl\n\t" + JSON.stringify(err))
    }

    // setInterval(() => saveToFile(db), 1000)
}

function resultToObjs(qr: sql.QueryResults | null): any[] {
    if (!!!qr) return []
    const cols: string[] = qr.columns
    return qr.values.map((row: (string | number | Uint8Array)[]) => {
        const d: { [col: string]: any } = {}
        cols.forEach((col: string, i: number) => d[col] = row[i])
        return d
    })
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

            // const db: sqlite.Database = await dbPromise
            if (write) {
                try {
                    db.exec(write)
                    result.updated = db.getRowsModified()
                } catch (err) {
                    log.error(`
                        failed to query with ${JSON.stringify(req)} for
                        ${err}
                    `)
                    ctx.onerror(err)
                }
            }
            if (read) {
                result.data = resultToObjs(head(db.exec(read)))
            }

            ctx.body = result
        } catch (err) {
            log.error("failed for " + err)
            ctx.body = { error: err }
        }

    })

    return kr
}

