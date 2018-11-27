import express = require("express")
import * as _exp from 'express'
import * as React from "react"
import { renderToString } from "react-dom/server"
import App from "../client/App"
import html from "../client/html"

const port: number = 3000
const server = express()

server.use(express.static('dist'))

server.get("/", (req: _exp.Request, res: _exp.Response) => {
    /**
     * renderToString() will take our react app and turn it into a string
     * to be inserted into our Html template function
     */

    const body: string = renderToString(React.createElement(App))
    const title: string = "Server side rendering will styled components"

    res.send(html({ body, title }))
})

server.listen(port)
console.info(`Serving at http://localhost:${port}`)