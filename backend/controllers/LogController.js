import * as fs from 'fs'
import * as path from 'path'
import moment from "moment";
moment.locale('es-mx');
// import bcryptjs from "bcryptjs";

export const writeToLogFile = async (req, res) => {
    // console.log(req.body)
    try {
        const { logEntry } = req.body
        const logFilePath = path.join('./logs', `${moment().format('YYYY-MM-DD')}.log`)
        const formattedLogEntry = `[${moment().format('DD-MM-YYYY HH:mm:ss')}] ${logEntry}\n`

        fs.appendFile(logFilePath, formattedLogEntry, (err) => {
            if (err) {
                console.error('Error writing to log file: ', err);
            }
        });

        res.status(200).json({ msg: "LOG ADD!" });
    } catch (err) {
        res.status(400).json(err)
        console.error(err)
    }
}