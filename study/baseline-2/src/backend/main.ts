
import OS = require("os")
import Path = require("path")

import * as Apis from "./apis_impls"

import { logger } from "./log"
import { Logger } from "winston"
const log: Logger = logger("main")

// import cookieParser = require("cookie-parser")
// import bodyParser = require("body-parser")
// import compress = require("compression")
// import methodOverride = require("method-override")


import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from "@tsed/common"
import * as Express from "express"

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

        const cookieParser = require("cookie-parser"),
            bodyParser = require("body-parser"),
            compress = require("compression"),
            methodOverride = require("method-override");

        this.use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }))

        const static_path: string = Path.resolve(Path.join(__dirname, "../../frontend"))
        log.info(`static path: ${static_path}`)
        this.use("/frontend", Express.static(static_path))

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
    log.info(JSON.stringify(s.httpServer))
}
main()

