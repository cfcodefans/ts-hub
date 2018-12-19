
import OS = require("os")
import Path = require("path")

import * as Apis from "./apis_impls"

import { logger } from "./log"
import { Logger } from "winston"
const log: Logger = logger("main")

import cookieParser = require("cookie-parser")
import bodyParser = require("body-parser")
import compress = require("compression")
import methodOverride = require("method-override")
import mustachExp = require("mustache-express")


import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from "@tsed/common"
import "@tsed/swagger"// import swagger Ts.ED module!!!
import * as Express from "express"
import { react_ssr } from "./ReactSsrMiddleware"

@ServerSettings({
    rootDir: Path.resolve(__dirname),
    httpPort: `${OS.hostname()}:12345`,
    acceptMimes: ["application/json"],
    httpsPort: false,
    logger: {
        debug: false,
        logRequest: true,
        requestFields: ["reqId", "method", "url", "headers", "body", "query", "params", "duration"]
    },
    swagger: {
        path: "/api-docs"
    },
})
export class Server extends ServerLoader {
    /**
     * This method let you configure the middleware required by your application to work
     * @return {Server}
     */
    public $onMountingMiddlewares(): void | Promise<any> {

        this.use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }))

        const static_path: string = Path.resolve(Path.join(__dirname, "../../frontend"))
        log.info(`static path: ${static_path}`)
        this.use("/frontend", Express.static(static_path))

        this.use("/react/ssr", react_ssr)

        //mustach templates
        this.engine("html", mustachExp())
        this.set("view engine", "html")
        this.set("views", Path.resolve(Path.join(__dirname, "../../templates")))
    }

    public $onReady(): void {
        log.info("Server starting...")
    }

    public $onServerInitError(err: Error): void {
        log.error(`failed to start...\n\t${err}`)
    }
}


function main(): void {
    const s = new Server()
    s.start().catch(log.error)
}
main()

