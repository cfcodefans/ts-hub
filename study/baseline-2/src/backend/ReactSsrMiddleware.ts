import { logger } from "./log"
import { Logger } from "winston"
import * as Express from "express"
import { observable, IObservableValue } from "mobx"

const log: Logger = logger("react_ssr")

import { renderToString } from "react-dom/server"
import App from "../components/App"

// import FS = require("fs")
// import Path = require("path")
// const static_path: string = Path.resolve(Path.join(__dirname, "../../templates"))
// console.info(`react_ssr at path:\n\t${static_path}`)
// const static_ex: Express.Handler = Express.static(static_path)

import Proc = require("process")

import * as React from "react"
import { Clock } from "../components/clock";

export const TIME: IObservableValue<Date> = observable.box(new Date)

export function react_ssr(req: Express.Request, resp: Express.Response, next: Express.NextFunction): any {
    const reactApp = React.createElement(Clock, { d: TIME })
    resp.render("base-view.html", {
        cache: false,
        title: "base-view.title rendered by mustache",
        body: "base-view.body rendered by mustache" + renderToString(reactApp)
    })
}