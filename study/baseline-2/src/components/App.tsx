import * as React from "react"
import { Hello } from "./hello"
import { Clock, TIME } from "./clock";

const App = (): JSX.Element => (
    <div>
        <h1>This is App</h1>
        <Hello compiler="webpack" framework="react" />
        <Clock timeData={TIME} />
    </div>)

export default App