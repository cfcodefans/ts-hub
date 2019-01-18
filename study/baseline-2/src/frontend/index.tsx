import * as React from "react"
import ReactDOM from "react-dom"
import App from "../components/App"
import { observable, IObservableValue } from "mobx"
import { observer } from "mobx-react"
import { Clock } from "../components/clock"
import { Holder } from "../common/defs";

const app_div = document.getElementById("app")
export const TIME: IObservableValue<Date> = observable.box(new Date)

setInterval(() => {
    TIME.set(new Date(TIME.get().getTime() + 2000))
}, 2000)

// const reactApp = React.createElement(Clock, { d: TIME })
if (app_div) {
    // ReactDOM.render(<Timer timerData={timerData} />, app_div)
    if (app_div.childElementCount) {
        ReactDOM.hydrate(<Clock d={TIME} />, app_div)
    } else {
        ReactDOM.render(<Clock d={TIME} />, app_div)
    }
}