import { Controller, Get, RouteService, Required, QueryParams } from "@tsed/common"
import { IApis } from "../../common/defs"

import { logger } from "../log"
import { Logger } from "winston"
const log: Logger = logger("main")

@Controller("/api")
export class ApiCtrl implements IApis {

    @Get("/add")
    public add(@Required @QueryParams("/:a") a: number,
        @Required @QueryParams("/:b") b: number): number {
        return a + b
    }
    @Get("/sub")
    public sub(@Required @QueryParams("/:a") a: number,
        @Required @QueryParams("/:b") b: number): number {
        return a - b
    }
    @Get("/mul")
    public mul(@Required @QueryParams("/:a") a: number,
        @Required @QueryParams("/:b") b: number): number {
        return a * b
    }
    @Get("/div")
    public div(@Required @QueryParams("/:a") a: number,
        @Required @QueryParams("/:b") b: number): number {
        return a / b
    }

    constructor(private routeService: RouteService) {
        log.info(`\n\tApiCtrl.constructor(${JSON.stringify(routeService)})\n\t`)
    }

    @Get("/info")
    public getInfo(): string {
        return "baseline-2 with tsed"
    }
    @Get("/routes")
    public getRoutes() {
        return this.routeService.getAll()
    }


}