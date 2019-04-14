
export interface DBResp {
    updated: number
    data: any
}

export interface DBReq {
    w: string
    r: string
}

export function dateToStr(d: Date): string {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}点${d.getMinutes()}分`
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