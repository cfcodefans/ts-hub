import jsqr from "jsqr"
import { QRCode } from "jsqr"

const WIDTH = 320
const HEIGHT = 240

function getImageFromVideo(v: HTMLVideoElement, ctx: CanvasRenderingContext2D): ImageData {

    ctx.drawImage(v, 0, 0)
    const imgData: ImageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)


    const qr: QRCode = jsqr(imgData.data, WIDTH, HEIGHT) as QRCode
    if (!!qr) {
        console.info(qr.data)
    }

    window.requestAnimationFrame(() => {
        getImageFromVideo(v, ctx)
    })

    return imgData
}

async function main() {
    let v: HTMLVideoElement = document.getElementById('v') as HTMLVideoElement
    if (!!!v) {
        console.error("could not find video tag")
        return
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
    setInterval(() => getImageFromVideo(v, context), 1000)
    // getImageFromVideo(v, context)
}

main()