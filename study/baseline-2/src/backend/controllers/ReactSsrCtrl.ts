import { logger } from "../log"
import { Logger } from "winston"
import * as Express from "express"

const log: Logger = logger("main")

import { Controller, Get, Required, PathParams, QueryParams } from "@tsed/common"

import Path = require("path")
const static_path: string = Path.resolve(Path.join(__dirname, "../../templates"))
const static_ex: Express.Handler = Express.static(static_path)

// @Controller("/react/ssr")
export class ReactSsrCtrl {
    constructor() {
        log.info(`\n\t${__dirname}\\${__filename}\n\t`)
    }

    // @Get("/")
    public foo(@Required @PathParams("/:p") p: string): string {
        return ""
    }
}