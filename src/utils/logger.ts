import winston from 'winston'
import expressWinston from 'express-winston'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
    ],
})

export const winstonMiddleware = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    colorize: true,
    expressFormat: true,
    msg: '1',
})
