import { IApis } from "../common/defs"

import { logger } from "./log"
import { Logger } from "winston"
const log: Logger = logger("apis_impls")

class ApiImpl implements IApis {
    add(a: number, b: number): number {
        log.info(`${a} + ${b}`)
        return a + b
    }
    sub(a: number, b: number): number {
        log.info(`${a} - ${b}`)
        return a - b
    }
    mul(a: number, b: number): number {
        log.info(`${a} * ${b}`)
        return a * b
    }
    div(a: number, b: number): number {
        log.info(`${a} / ${b}`)
        return a / b
    }
}

const apiImpl: ApiImpl = new ApiImpl

// export function mount(kr: KoaRouter): KoaRouter {
//     if (!!!kr) return kr

//     kr.get("/apis/add/:a,:b", async (ctx: Context) => {
//         ctx.body = apiImpl.add(ctx.params['a'], ctx.params['b'])
//     }).get("/apis/sub/:a,:b", async (ctx: Context) => {
//         ctx.body = apiImpl.sub(ctx.params['a'], ctx.params['b'])
//     }).get("/apis/mul/:a,:b", async (ctx: Context) => {
//         ctx.body = apiImpl.mul(ctx.params['a'], ctx.params['b'])
//     }).get("/apis/div/:a,:b", async (ctx: Context) => {
//         ctx.body = apiImpl.div(ctx.params['a'], ctx.params['b'])
//     })

//     return kr
// }