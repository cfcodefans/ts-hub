import { Controller, Get, RouteService } from "@tsed/common"

@Controller("/api")
export class ApiCtrl {
    constructor(private routeService: RouteService) {

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