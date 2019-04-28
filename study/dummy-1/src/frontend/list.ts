import { searchRecords, IRecord } from "./member_opers"
import { dateToStr, isArrayEmpty, dateToVal } from "../common/defs"


async function main() {
    const searchForm: HTMLFormElement = document.getElementById("search_form") as HTMLFormElement
    const searchBtn: HTMLButtonElement = document.getElementById("search_btn") as HTMLButtonElement

    const memberName: HTMLInputElement = document.getElementById("member_name") as HTMLInputElement
    const startDate: HTMLInputElement = document.getElementById("search_btn") as HTMLInputElement
    const endDate: HTMLInputElement = document.getElementById("search_btn") as HTMLInputElement

    const resultList: HTMLDivElement = document.getElementById("result_list") as HTMLDivElement
    const statList: HTMLDivElement = document.getElementById("stat_list") as HTMLDivElement


    function showRecords(records: IRecord[]) {
        resultList.innerHTML = ""

        if (isArrayEmpty(records)) {
            resultList.innerHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                找到记录
                <span class="badge badge-pill badge-warning">0条</span>
            </li>
            `
            return
        }


        function showRecord(record: IRecord): string {
            return `<li class="list-group-item">
                ${record.member.mark} 打卡于 ${dateToStr(new Date(record.time))}
            </li>`
        }

        resultList.innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
                找到记录
                <span class="badge badge-pill badge-success">${records.length}</span>条
            </li>
            ${records.map(showRecord).join("\n")}
        `

    }

    function showStat(records: IRecord[]) {
        statList.innerHTML = ""
        const _stat: Map<string, number> = records.map((rec: IRecord) => rec.member.name)
            .reduce((stat: Map<string, number>, name: string) => {
                stat.set(name, (stat.has(name) ? stat.get(name)! : 0) + 1)
                return stat
            }, new Map())

        const entries: Array<[string, number]> = Array.from(_stat.entries())
        entries.sort((a: [string, number], b: [string, number]) => a[1] > b[1] ? 1 : (a[1] == b[1] ? 0 : -1)).reverse()

        const maxNum: number = Math.max(...entries.map((e: [string, number]) => e[1]))

        function showStat(stat: [string, number], max: number) {
            const percentage: number = Math.floor(stat[1] / maxNum * 100)
            //background: linear-gradient(to left, #ff0000 50%, #0000ff 50%);
            return `<li class="list-group-item" style="background: linear-gradient(to right, lightblue ${percentage}%, white 1%);">
            ${stat[0]} 共打卡 ${stat[1]} 次
        </li>`
        }

        statList.innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
                共有<span class="badge badge-pill badge-success">${entries.length}</span>客户打卡
            </li>
            ${entries.map(showStat).join("\n")}
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
                showStat(records)
            }).catch((err: any) => {
                console.error(err)
                window.alert("查询失败")
                searchBtn.value = "查询"
                searchBtn.disabled = false
            })
    }

    function defaultResult() {
        const now: Date = new Date(Date.now())
        endDate.value = dateToVal(now)
        const _30d: Date = new Date(Date.now() - 86400 * 30000)
        startDate.value = dateToVal(_30d)
        searchBtn.click()
    }

    defaultResult()
}

main()