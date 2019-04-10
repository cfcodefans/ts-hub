import { DBResp } from "../common/defs";
import { query } from "./commons";

export interface IMember {
    id: number
    name: string
    mark: string
    note: string
    time: number
}

export async function getMemberInfo(code: string): Promise<IMember> {
    return query({ r: `select * from member where mark='${code}'`, w: "" })
        .then((value: any) => {
            const dbResp = value as DBResp
            const resultSet = dbResp.data
            return resultSet ? resultSet[0] : null
        })
}

export async function saveMembereInfo(code: string): Promise<IMember> {
    return query({
        r: `select * from member where mark='${code}'`,
        w: `insert into member (name, mark, time) 
            values ('${code}', '${code}', ${Date.now()})
            on conflict(mark) do update set time = ${Date.now()}`
    }).then((value: any) => {
        const dbResp = value as DBResp
        const resultSet = dbResp.data
        return resultSet ? resultSet[0] : null
    })
}