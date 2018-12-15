
export interface IApis {
    add(a: number, b: number): number
    sub(a: number, b: number): number
    mul(a: number, b: number): number
    div(a: number, b: number): number
}

export interface IResult {
    timestamp: Date,
    code: number,
    msg: string,
    data?: any
}