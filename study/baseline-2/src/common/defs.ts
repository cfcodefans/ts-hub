
import { action, computed, observable } from 'mobx'

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

export class Holder<T> {
    @observable _value: T
    @computed get value() { return this._value }
    @action update(v: T) { this._value = v }

    constructor(v: T) {
        this._value = v
    }
}