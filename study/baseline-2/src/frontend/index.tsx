import * as React from "react"
import ReactDOM from "react-dom"
import App from "../components/App"
import { observable } from "mobx"
import { observer } from "mobx-react"



const app_div = document.getElementById("app")
if (app_div) {
    // ReactDOM.render(<Timer timerData={timerData} />, app_div)
    if (app_div.childElementCount) {
        ReactDOM.hydrate(<App />, app_div)
    } else {
        ReactDOM.render(<App />, app_div)
    }
}