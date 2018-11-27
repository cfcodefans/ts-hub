import * as React from "react"
import { Hello } from "./hello/index"

const App = (): JSX.Element => (
    <div>
        <h1>This is App</h1>
        <Hello compiler="webpack" framework="react" />
    </div>)

export default App