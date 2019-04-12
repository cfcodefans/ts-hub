import { DBResp } from "../common/defs"
import { query, head, isBlank } from "./commons"

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
    }).then((value: DBResp) => head(value.data) as IRecord)
}

export async function searchRecords(
    member_name: string | null,
    startDate: Date | null,
    endDate: Date | null): Promise<IRecord[]> {

    let sql: string = `select r.id as id, 
                                r.time as time, 
                                r.mark as mark, 
                                r.note as note,
                                m.id as m_id,
                                m.name as m_name,
                                m.mark as m_mark,
                                m.note as m_note,
                                m.time as m_time
                                  from records r join member m on r.member_id = m.id where true 
                ${isBlank(member_name) ? '' : ` and m.mark like '%${member_name}%' `}
                ${!!!startDate ? '' : ` and time >= ${startDate.getTime()} `}
                ${!!!endDate ? '' : ` and time <= ${endDate.getTime()} `}`
    return query({ r: sql, w: "" })
        .then((value: DBResp) => value.data.map((row: any) => {
            return {
                id: row["id"],
                time: row["time"],
                mark: row["mark"],
                note: row["note"],
                member: {
                    id: row["m_id"],
                    name: row["m_name"],
                    mark: row["m_mark"],
                    note: row["m_note"],
                    time: row["m_time"],
                }
            }
        }))
}