import * as Winston from "winston"

const format_ns = Winston.format

export const _log: Winston.Logger = Winston.createLogger({
    level: "info",
    transports: [new Winston.transports.Console({
        format: format_ns.combine(format_ns.colorize(), format_ns.simple())
    })]
})

export function logger(srcFile: string): Winston.Logger {
    return Winston.createLogger({
        level: "info",
        transports: [new Winston.transports.Console({
            format: format_ns.combine(
                format_ns.timestamp(),
                format_ns.label({ label: srcFile }),
                format_ns.colorize(),
                format_ns.simple())
        }),
        new Winston.transports.File({
            filename: "backend.log",
            tailable: true,
            format: format_ns.combine(
                format_ns.timestamp(),
                format_ns.label({ label: srcFile }),
                format_ns.json()
            )
        })]
    })
}