
import qrcode from "qrcode"
import { IMember, saveMembereInfo, getMemberInfo, saveCheckInRecord } from "./member_opers"

function getAddBtn(): HTMLButtonElement {
    return document.getElementById("add_btn") as HTMLButtonElement
}

function onInputChange(ev: Event) {
    const input: HTMLInputElement = ev.srcElement! as HTMLInputElement
    let c: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement
    console.info(`${ev.type} ${input.value}`)
}

function init() {
    let input: HTMLInputElement = document.getElementById("name") as HTMLInputElement
    input.oninput = onInputChange
    input.addEventListener("clean", onInputChange)

    const addBtn: HTMLButtonElement = getAddBtn()
    addBtn.onclick = async (ev: MouseEvent) => {
        addBtn.value = "处理中..."
        addBtn.disabled = true

        let member: IMember | null = await saveMembereInfo(input.value)
        if (!member) {
            window.alert("打卡失败")
        }
        await saveCheckInRecord(member!)
        addBtn.value = "打卡"
        addBtn.disabled = false
    }
}

async function main() {
    init()
}

main()

console.info(exports)