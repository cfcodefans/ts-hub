
import _ from "lodash"
import $ from "jquery"
import qrcode from "qrcode"

function getDownloadButton(): HTMLButtonElement {
    return document.getElementById("download_btn") as HTMLButtonElement
}

function getCanvas(): HTMLCanvasElement {
    return document.getElementById('c') as HTMLCanvasElement
}

function toggleDownloadBtn(flag: boolean) {
    const downloadBtn = getDownloadButton()
    downloadBtn.disabled = !flag
    // if (!flag) {
    //     downloadBtn.classList.remove("active")
    //     downloadBtn.classList.add("disabled")
    // } else {
    //     downloadBtn.classList.remove("disabled")
    //     downloadBtn.classList.add("active")
    // }
    // if (!flag) {
    //     const link: HTMLAnchorElement = downloadBtn.children[0] as HTMLAnchorElement
    //     delete link.download
    //     delete link.href
    // }
}

function layout() {
    let c: HTMLCanvasElement = getCanvas()
    let width: number = document.body.clientWidth
    c.width = width - 24
    c.height = width - 24
}

function cleanImg(img: HTMLCanvasElement) {
    const ctx: CanvasRenderingContext2D = img.getContext("2d")!
    ctx.clearRect(0, 0, img.width, img.height)

    toggleDownloadBtn(false)
}

function generatorQRCode(img: HTMLCanvasElement, data: string) {
    if (!(img && data && data.length > 0)) {
        cleanImg(img)
        return
    }

    const opts: qrcode.QRCodeRenderersOptions = { version: 8, errorCorrectionLevel: "high", width: img.width }
    qrcode.toCanvas(img, data, opts)
        .then((v) => {
            const ctx: CanvasRenderingContext2D = img.getContext("2d")!
            const logo40_40 = document.getElementById("logo40_40") as HTMLImageElement
            const cw = img.width
            const ch = img.height
            ctx.drawImage(logo40_40,
                cw * 0.4,
                ch * 0.4,
                cw * 0.2,
                ch * 0.2)
            toggleDownloadBtn(true)
        })
}

function onInputChange(ev: Event) {
    const input: HTMLInputElement = ev.srcElement! as HTMLInputElement
    let c: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement
    console.info(`${ev.type} ${input.value}`)
    generatorQRCode(c, input.value)
}

function init() {
    let input: HTMLInputElement = document.getElementById("name") as HTMLInputElement
    input.oninput = onInputChange
    input.addEventListener("clean", onInputChange)

    const downloadBtn: HTMLButtonElement = getDownloadButton()
    downloadBtn.onclick = (ev: MouseEvent) => {
        const c: HTMLCanvasElement = getCanvas()
        const imgData: string = c.toDataURL("image/png").replace("image/png", "image/octet-stream")
        const link: HTMLAnchorElement = downloadBtn.parentElement as HTMLAnchorElement
        link.download = `道善二维码-${input.value}.png`
        link.href = imgData
    }
}

async function main() {
    layout()
    init()
}

main()

console.info(exports)