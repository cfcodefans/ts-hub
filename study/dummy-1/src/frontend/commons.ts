import $ from "jquery"
import { DBResp, DBReq } from "../common/defs"

export const cleanInput = (ev: Event) => {
    let t = $(ev.currentTarget as HTMLElement).siblings()[0]
    if (!(t instanceof HTMLInputElement)) return
    var _type = t.type
    if (!(_type == "text"
        || _type == "password"
        || _type == "mail"
        || _type == "tel"
        || _type == "number"
        || _type == "file"))
        return

    t.value = ""
    t.dispatchEvent(new Event("clean", { bubbles: false, cancelable: false, composed: true }))
}

$(".btn-clean").on("click", cleanInput)
//onclick="cleanInput(event)"

export async function query(dbReq: DBReq): Promise<any> {
    return fetch("/sql/", {
        headers: [["content-type", "application/json"],
        ["Accept", "application/json"]],
        method: "POST",
        body: JSON.stringify(dbReq)
    }).then((resp: Response) => resp.json())
        .catch((reason) => console.error(`failed to query with \n\t${JSON.stringify(dbReq)}\n\tfor ${reason}`))
}

export function dateToStr(d: Date): string {
    return `${d.getFullYear()}年${d.getMonth()}月${d.getDate()}日 ${d.getHours()}点${d.getMinutes()}分`
}