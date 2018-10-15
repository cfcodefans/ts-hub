import * as Winston from "winston"

const _format = Winston.format;
export const _log: Winston.Logger = Winston.createLogger({
    level: 'info',
    transports: [
        new Winston.transports.Console({
            format: _format.combine(_format.colorize(), _format.simple())
        }),
        new Winston.transports.File({ filename: "running.log", tailable: true, format: _format.json() })
    ]
})

export function logger(srcFile: string): Winston.Logger {
    return Winston.createLogger({
        level: 'info',
        transports: [
            new Winston.transports.Console({
                format: _format.combine(
                    _format.timestamp(),
                    _format.label({ label: srcFile }),
                    _format.colorize(),
                    _format.simple())
            }),
            new Winston.transports.File({
                filename: "running.log",
                tailable: true,
                format: _format.combine(
                    _format.timestamp(),
                    _format.label({ label: srcFile }),
                    _format.json())
            })
        ]
    })
}