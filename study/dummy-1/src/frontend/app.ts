import jsqr, { QRCode } from "jsqr";
import { dateToStr } from "../common/defs"
import { getMemberInfo, IMember, saveCheckInRecord } from "./member_opers"
import { speak, getUrlParams } from './commons';

let WIDTH = 320
let HEIGHT = 240

enum STATUS {
    started, stopped, paused, initiated, found, not_found, detected
}

class Context {
    v: HTMLVideoElement
    context: CanvasRenderingContext2D
    code: string = ""
    info: HTMLDivElement

    lastStatus: STATUS = STATUS.initiated
    status: STATUS = STATUS.initiated
    statusCnt: number = 0

    constructor(_v: HTMLVideoElement, c: HTMLCanvasElement, div: HTMLDivElement) {
        this.v = _v
        this.context = c.getContext("2d") as CanvasRenderingContext2D
        this.info = div
    }

    start() {
        let v = this.v
        this.code = ''
        if (v.paused) {
            v.play()
        }
        this.statusCnt = 0
        this.status = STATUS.started
    }

    tick(): void {
        let v = this.v
        let ctx = this.context

        const default_div = document.getElementById("default_div") as HTMLDivElement
        const loading_div = document.getElementById("loading_div") as HTMLDivElement
        const checked_div = document.getElementById("checked_div") as HTMLDivElement

        switch (this.status) {
            case STATUS.initiated: {
                this.start()
                break;
            }
            case STATUS.started: {
                let code: string = getCodeDataFromVideo(v, ctx)
                if (code.length > 0) {
                    v.pause()
                    this.status = STATUS.detected
                    this.code = code
                } else {
                    default_div.removeAttribute("hidden")
                    loading_div.setAttribute("hidden", "")
                    checked_div.setAttribute("hidden", "")
                }
                break
            }
            case STATUS.detected: {
                let code = this.code

                default_div.setAttribute("hidden", "")
                loading_div.removeAttribute("hidden")

                getMemberInfo(code)
                    .then((member: IMember | null) => {
                        if (this.status != STATUS.detected) {
                            console.info("already reset!")
                            return
                        }
                        loading_div.setAttribute("hidden", "")
                        checked_div.removeAttribute("hidden")

                        if (!!!member) {
                            this.status = STATUS.not_found
                            return
                        }

                        saveCheckInRecord(member)
                        checked_div.innerHTML = `
                        <p>欢迎您, 尊敬的 ${member.name}</p>
                        <p>打卡于 ${dateToStr(new Date())}</p>`
                        speak("checked")
                        this.status = STATUS.found
                    }).catch((reason: any) => {
                        console.error(JSON.stringify(reason))
                        loading_div.setAttribute("hidden", "")
                        checked_div.removeAttribute("hidden")
                        checked_div.innerHTML = `
                        <div class="spinner-border" role="status">
                            <span class="sr-only">查询失败...</span>
                        </div>
                        <button onclick="appCtx.start()">重置</button>`
                        this.status = STATUS.found
                    })
                break
            }
            case STATUS.found: {
                if (this.statusCnt <= 8) {
                    this.statusCnt++
                } else {
                    this.start()
                }
                break
            }
            case STATUS.not_found: {
                if (this.statusCnt <= 8) {
                    this.statusCnt++
                    checked_div.innerHTML = `
                    <p>抱歉, 没有找到 ${this.code} 对应记录<p/>
                    <p>${Math.ceil(this.statusCnt / (1000 / 500)) + 1}秒后请重试</p>`
                } else {
                    this.start()
                }
                break
            }
            default:
        }
        this.lastStatus = this.status
    }
}

function getCodeDataFromVideo(v: HTMLVideoElement, ctx: CanvasRenderingContext2D): string {
    ctx.drawImage(v, 0, 0)
    const imgData: ImageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)
    const qr: QRCode = jsqr(imgData.data, WIDTH, HEIGHT) as QRCode
    if (!!qr) {
        console.info(JSON.stringify(qr))
        return qr.data
    }
    return ""
}

async function layout() {
    // document.documentElement.requestFullscreen()

    let v: HTMLVideoElement = document.getElementById('v') as HTMLVideoElement
    if (!!!v) {
        console.error("could not find video tag")
        return
    }

    let width: number = document.body.clientWidth
    v.width = WIDTH = width
    v.height = HEIGHT = WIDTH

    const md: MediaDevices = navigator.mediaDevices
    //Get access to the camera!
    if (!(md && md.getUserMedia)) {
        console.error("could not find camera device")
        return
    }

    const facingModeParam:string = getUrlParams()["face"] || "user"

    try {
        let ms: MediaStream = await md.getUserMedia({
            audio: false,
            video: {
                width: WIDTH,
                height: HEIGHT,
                aspectRatio: { exact: WIDTH / HEIGHT },
                facingMode: { ideal: facingModeParam }
            }
        })

        let vts = ms.getVideoTracks()
        let vt = vts[0]
        console.info(JSON.stringify(vt.getSettings()))
        v.srcObject = ms
    } catch (err) {
        window.alert("摄像头错误" + JSON.stringify(err))
    }
}

let appCtx: Context

async function main() {
    await layout()
    let c: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement
    let v: HTMLVideoElement = document.getElementById('v') as HTMLVideoElement
    await v.play()
    c.width = v.videoWidth
    c.height = v.videoHeight
    appCtx = new Context(v, c, document.getElementById("info_div") as HTMLDivElement)

    appCtx.start()
    setInterval(() => appCtx.tick(), 500)
}

main().catch(reason => console.error(reason))