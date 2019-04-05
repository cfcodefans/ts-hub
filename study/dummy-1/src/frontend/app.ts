import jsqr from "jsqr"
import { QRCode } from "jsqr"
import { DBResp, DBReq } from "../common/defs";

let WIDTH = 320
let HEIGHT = 240

enum STATUS {
    started, stopped, paused, initiated, found, detected
}

interface IMember {
    id: number
    name: string
    mark: string
    note: string
}

async function query(dbReq: DBReq): Promise<any> {
    return fetch("/sql/", {
        method: "POST",
        body: JSON.stringify(dbReq)
    }).then((resp: Response) => resp.json())
        .catch((reason) => console.error(`failed to query with \n\t${JSON.stringify(dbReq)}\n\tfor ${reason}`))
}

async function getMemberInfo(code: string): Promise<IMember> {
    return query({ r: `select * from member where mark=${code}`, w: "" })
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
        if (v.paused) {
            v.play()
        }
        this.statusCnt = 0
        this.status = STATUS.started
    }

    tick(): void {
        let v = this.v
        let ctx = this.context

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
                    this.info.innerHTML = `
                    <div class="text-center"> 
                        请出示道善二维码...
                    </div>`
                }
                break
            }
            case STATUS.detected: {
                let code = this.code
                this.info.innerHTML = `
                <div class="text-center"> 
                    正在查询您的课程...
                    <div class="spinner-border" role="status"> 
                        <span class="sr-only">Loading...</span>
                    </div>
                    <button onclick="appCtx.start()">重置</button>
                </div>`
                getMemberInfo(code)
                    .then((member: IMember) => {
                        if (this.status != STATUS.detected) {
                            console.info("already reset!")
                            return
                        }

                        this.info.innerHTML = `
                        <div class="text-center"> 
                            欢迎您, 尊敬的 ${member.name}
                            已经打卡于 ${Date.now().toLocaleString()}                                
                        </div>`
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

    let width: number = document.body.clientWidth;
    v.width = WIDTH = width - 24
    v.height = HEIGHT = Math.floor(WIDTH * 0.75)

    let ind: HTMLDivElement = document.getElementById("indicator") as HTMLDivElement
    {
        let vRect = v.getBoundingClientRect()
        ind.style.left = `${vRect.left + 12}`
        ind.style.top = `${vRect.top + 12}`
        ind.style.width = `${vRect.width - 24}`
        ind.style.height = `${vRect.height - 24}`
        ind.style.right = `${vRect.right - 12}`
        ind.style.bottom = `${vRect.bottom - 12}`
    }
    const md: MediaDevices = navigator.mediaDevices
    //Get access to the camera!
    if (!(md && md.getUserMedia)) {
        console.error("could not find camera device")
        return
    }

    let ms: MediaStream = await md.getUserMedia({ audio: false, video: { width: WIDTH, height: HEIGHT } })
    v.srcObject = ms
}

let appCtx: Context

async function main() {
    await layout()
    let c: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement
    let v: HTMLVideoElement = document.getElementById('v') as HTMLVideoElement
    v.play()
    appCtx = new Context(v, c, document.getElementById("info_div") as HTMLDivElement)

    appCtx.start()
    setInterval(() => appCtx.tick(), 500)
}

main().catch(reason => console.error(reason))