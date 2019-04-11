import { DBResp } from "../common/defs"
import { query, head } from "./commons"

export interface IMember {
    id: number
    name: string
    mark: string
    note: string
    time: number
}

export interface IRecord {
    id: number
    member: IMember
    time: number
    mark: string
    note: string
}

export async function getMemberInfo(code: string): Promise<IMember | null> {
    return query({ r: `select * from member where mark='${code}'`, w: "" })
        .then((value: DBResp) => head(value.data))
}

export async function saveMembereInfo(code: string): Promise<IMember | null> {
    return query({
        r: `select * from member where mark='${code}'`,
        w: `insert into member (name, mark, time) 
            values ('${code}', '${code}', ${Date.now()})
            on conflict(mark) do update set time = ${Date.now()}`
    }).then((value: DBResp) => head(value.data))
}

export async function saveCheckInRecord(member: IMember): Promise<IRecord> {
    const now: number = Date.now()
    return query({
        r: `select * from record where member_id=${member.id} and mark='${now}'`,
        w: `insert into records (member_id, time, mark, note) 
            values ('${member.id}', ${now}, '${now}', '')`
    })
}