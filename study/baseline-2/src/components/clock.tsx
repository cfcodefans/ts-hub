import * as React from "react"
import { observable, IObservableValue } from "mobx"
import { observer } from "mobx-react"
import { Holder } from "../common/defs";




// export const TIME: { d: Date } = observable({ d: new Date })

// setInterval(() => {
//     const d = TIME.d
//     d.setTime(d.getTime() + 2000)
//     TIME.d = d
// }, 2000)

// // mobx.autorun(() => console.info(`autorun(${TIME.get()})`))

// const _clock = (p: { d: Date }): JSX.Element => {
//     let t: Date = p.d
//     return <div>Time: {t.getFullYear()}-{t.getMonth()}-{t.getDate()}: {t.getHours()}: {t.getMinutes()}: {t.getSeconds()}</div>
// }
// export const Clock = observer(_clock)

@observer
export class Clock extends React.Component<{ d: IObservableValue<Date> }> {
    constructor(p: { d: IObservableValue<Date> }) {
        super(p)
    }
    render(): JSX.Element {
        let t: Date = this.props.d.get()
        console.info(`${t} is rendered...`)
        return <div>Time: {t.getFullYear()}-{t.getMonth()}-{t.getDate()}: {t.getHours()}: {t.getMinutes()}: {t.getSeconds()}</div>
    }
}

// export const TIME = observable({
//     secondsPassed: 0
// });

// setInterval(() => {
//     TIME.secondsPassed++;
// }, 1000);

// export const Clock = observer(({ timerData }) => {
//     console.info(JSON.stringify(timerData))
//     return < span > Seconds passed: {timerData.secondsPassed} </span >
// });