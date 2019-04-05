
import bwipjs from "bwip-js"
import _ from "lodash"
import $ from "jquery"

function layout() {
    let c: HTMLImageElement = document.getElementById('c') as HTMLImageElement
    let width: number = document.body.clientWidth
    c.width = width - 24
    c.height = width - 24
}

function generatorQRCode(img: HTMLImageElement, data: string) {
    if (!(img && data && data.length > 0)) return

    bwipjs.toBuffer({
        bcid: "code128",
        text: data
    }, (error: string | Error, png: Buffer) => {
        if (error) {
            console.error(error)
            return
        }

        let imgSrc = window.URL.createObjectURL(png)
        img.src = imgSrc
    })
}

function onInputChange(ev: Event) {
    const input: HTMLInputElement = ev.srcElement! as HTMLInputElement
    let c: HTMLImageElement = document.getElementById('c') as HTMLImageElement
    console.info(`${ev.type} ${input.value}`)
    // generatorQRCode(c, input.value)
}

function init() {
    let input: HTMLInputElement = document.getElementById("name") as HTMLInputElement
    input.oninput = onInputChange
    input.addEventListener("clean", onInputChange)
}

async function main() {
    layout()
    init()
}

main()

console.info(exports)