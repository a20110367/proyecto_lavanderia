import moment from 'moment'
import 'moment-timezone'
moment.locale('es-mx');

// Timezone: UTC -6:00 (Centro)
const TIMEZONE = 'America/Mexico_City'; // UTC -6:00

// ----------------------------------------  FORMATS ------------------------------------- //

export const formatDate = (dateStr) => {
    const date = moment(dateStr).tz(TIMEZONE).format("L")
    return date;
};

export const formatTime = (dateStr) => {
    const date = moment(dateStr).tz(TIMEZONE).format("dddd LT");
    return date
}

export const formatTicketTime = (dateStr) => {
    const date = moment(dateStr).tz(TIMEZONE).format('LT')
    return date
}

export const localTime = () => {
    let timeNow = moment.utc()

    let time = moment.utc(timeNow).tz(TIMEZONE).toDate();

    console.log(time)

    let timeLocal = moment(time).tz(TIMEZONE).format('LT')

    console.log('Tiempo local ' + timeLocal)

    return (timeLocal)
}

export const localDate = () => {

    let dateNow = moment.utc()

    console.log(dateNow)

    let date = moment.utc(dateNow).tz(TIMEZONE).toDate();

    let dateLocal = moment(date).tz(TIMEZONE).format('L')

    console.log('Fecha local ' + dateLocal)

    return (dateLocal)
}

export const tolocalTime = (timeUTC) => {

    let date = moment.utc(timeUTC).toDate();

    console.log(date)

    let timeLocal = moment(date).local().format('HH:mm')

    console.log('Tiempo local ' + timeLocal)

    return (timeLocal)
}

export const toLocalDate = (dateUTC) => {


    let date = moment.utc(dateUTC).toDate();

    console.log(date)

    let dateLocal = moment(date).local().format('L')

    console.log('Fecha local ' + dateLocal)

    return (dateLocal)
}