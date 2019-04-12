
import qrcode from "qrcode"
import { IMember, saveMembereInfo } from "./member_opers"

function getDownloadButton(): HTMLButtonElement {
    return document.getElementById("download_btn") as HTMLButtonElement
}

function getCanvas(): HTMLCanvasElement {
    return document.getElementById('c') as HTMLCanvasElement
}

function toggleDownloadBtn(flag: boolean) {
    const downloadBtn = getDownloadButton()
    downloadBtn.disabled = !flag
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
                cw * 0.35,
                ch * 0.35,
                cw * 0.3,
                ch * 0.3)
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
    downloadBtn.onclick = async (ev: MouseEvent) => {
        downloadBtn.value = "生成中..."
        downloadBtn.disabled = true

        const member: IMember | null = await saveMembereInfo(input.value)
        downloadBtn.value = "确定下载"
        downloadBtn.disabled = false

        if (member) {
            const c: HTMLCanvasElement = getCanvas()
            const imgData: string = c.toDataURL("image/png").replace("image/png", "image/octet-stream")
            const link: HTMLAnchorElement = downloadBtn.parentElement as HTMLAnchorElement
            link.download = `道善二维码-${input.value}.png`
            link.href = imgData
            return
        } else {
            window.alert("操作失败,请联系技术支持.")
        }
    }
}

async function main() {
    layout()
    init()
}

main()

console.info(exports)