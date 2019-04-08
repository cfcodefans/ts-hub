import $ from "jquery"

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