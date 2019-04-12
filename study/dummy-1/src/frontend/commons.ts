import { DBReq } from "../common/defs"

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

export function dateToStr(d: Date): string {
    return `${d.getFullYear()}年${d.getMonth()}月${d.getDate()}日 ${d.getHours()}点${d.getMinutes()}分`
}

export function head<T>(array: T[]): T | null {
    return array && array.length > 0 ? array[0] : null
}

export function isEmpty(str: string | null): boolean {
    return (!!!str) || str.length == 0
}

export function isArrayEmpty<T>(array: T[] | null): boolean {
    return (!!!array) || array.length == 0
}

export function isBlank(str: string | null): boolean {
    return isEmpty(str) || isEmpty(str!.trim())
}