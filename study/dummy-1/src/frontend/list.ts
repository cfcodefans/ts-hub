import { searchRecords, IRecord } from "./member_opers"
import { dateToStr, isArrayEmpty } from "../common/defs"


async function main() {
    const searchForm: HTMLFormElement = document.getElementById("search_form") as HTMLFormElement
    const searchBtn: HTMLButtonElement = document.getElementById("search_btn") as HTMLButtonElement

    const memberName: HTMLInputElement = document.getElementById("member_name") as HTMLInputElement
    const startDate: HTMLInputElement = document.getElementById("search_btn") as HTMLInputElement
    const endDate: HTMLInputElement = document.getElementById("search_btn") as HTMLInputElement

    const resultList: HTMLDivElement = document.getElementById("result_list") as HTMLDivElement

    function showRecord(record: IRecord): string {
        return `<li class="list-group-item">
                ${record.member.mark} 打开于 ${dateToStr(new Date(record.time))}
            </li>`
    }

    function showRecords(records: IRecord[]) {
        if (isArrayEmpty(records)) {
            resultList.innerHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                找到记录
                <span class="badge badge-pill badge-warning">0条</span>
            </li>
            `
            return
        }

        resultList.innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
                找到记录
                <span class="badge badge-pill badge-success">${records.length}条</span>
            </li>
            ${records.map(showRecord).join("\n")}
        `
    }

    searchBtn.onclick = (ev: MouseEvent) => {
        searchBtn.value = "查询中..."
        searchBtn.disabled = true
        searchRecords(memberName.value,
            startDate.valueAsDate,
            endDate.valueAsDate).then((records: IRecord[]) => {
                searchBtn.value = "查询"
                searchBtn.disabled = false
                showRecords(records)
            }).catch((err: any) => {
                console.error(err)
                window.alert("查询失败")
                searchBtn.value = "查询"
                searchBtn.disabled = false
            })
    }
}

main()