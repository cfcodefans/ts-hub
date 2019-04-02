import jsqr from "jsqr"
import { QRCode } from "jsqr"

let WIDTH = 320
let HEIGHT = 240

function getImageFromVideo(v: HTMLVideoElement, ctx: CanvasRenderingContext2D): ImageData {

    ctx.drawImage(v, 0, 0)
    const imgData: ImageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)

    const qr: QRCode = jsqr(imgData.data, WIDTH, HEIGHT) as QRCode
    if (!!qr) {
        console.info(qr.data)
    }

    // window.requestAnimationFrame(() => {
    //     getImageFromVideo(v, ctx)
    // })

    return imgData
}

async function main() {
    document.documentElement.requestFullscreen()

    let v: HTMLVideoElement = document.getElementById('v') as HTMLVideoElement
    if (!!!v) {
        console.error("could not find video tag")
        return
    }

    let width: number = document.body.clientWidth;
    v.width = WIDTH = width - 24
    v.height = HEIGHT = Math.floor(WIDTH * 0.75)

    let ind: HTMLDivElement = document.getElementById("indicator") as HTMLDivElement
    {
        let vRect = v.getBoundingClientRect()
        ind.style.left = `${vRect.left + 12}`
        ind.style.top = `${vRect.top + 12}`
        ind.style.width = `${vRect.width -24}`
        ind.style.height = `${vRect.height -24}`
        ind.style.right = `${vRect.right - 12}`
        ind.style.bottom = `${vRect.bottom - 12}`
    }

    let c: HTMLCanvasElement = document.getElementById("c") as HTMLCanvasElement
    let context: CanvasRenderingContext2D = c.getContext("2d") as CanvasRenderingContext2D

    const md: MediaDevices = navigator.mediaDevices
    //Get access to the camera!
    if (!(md && md.getUserMedia)) {
        console.error("could not find camera device")
        return
    }

    let ms: MediaStream = await md.getUserMedia({ audio: false, video: { width: WIDTH, height: HEIGHT } })
    v.srcObject = ms
    v.play()
    setInterval(() => getImageFromVideo(v, context), 500)
}

main()