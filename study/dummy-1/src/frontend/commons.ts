import { DBReq } from "../common/defs"
import $ from "jquery"

export function cleanInput(ev: Event) {
    let s = ev.currentTarget as HTMLElement
    let t = s.parentElement!.children.item(0)
    if (!(t instanceof HTMLInputElement)) return
    var _type = t.type

    if (!(_type == "text"
        || _type == "password"
        || _type == "mail"
        || _type == "tel"
        || _type == "number"
        || _type == "file"
        || _type == "date"))
        return

    t.value = ""
    t.dispatchEvent(new Event("clean", { bubbles: false, cancelable: false, composed: true }))
}

$(".btn-clean").on("click", cleanInput)

export async function query(dbReq: DBReq): Promise<any> {
    return fetch("/sql/", {
        headers: [["content-type", "application/json"],
        ["Accept", "application/json"]],
        method: "POST",
        body: JSON.stringify(dbReq)
    }).then((resp: Response) => resp.json())
        .catch((reason) => console.error(`failed to query with \n\t${JSON.stringify(dbReq)}\n\tfor ${reason}`))
}


export function speak(text: string) {
    try {

        const synth: SpeechSynthesis = window.speechSynthesis
        const zh: SpeechSynthesisVoice = synth.getVoices().find((v: SpeechSynthesisVoice) => v.lang == "en_US")!
        // window.alert(JSON.stringify(synth.getVoices()))
        const utter = new SpeechSynthesisUtterance(text)
        utter.voice = zh
        // utter.rate = 1
        // utter.pitch = 1
        synth.speak(utter)
    } catch (err) {
        window.alert(JSON.stringify(err))
    }
}

export function getUrlParams(): { [k: string]: string } {
    var vars: { [k: string]: string } = {};
    var parts = window.location.href.replace("/[?&]+([^=&]+)=([^&]*)/gi",
        (m, key, value) => {
            vars[key] = value
            return ""
        })
    return vars
}