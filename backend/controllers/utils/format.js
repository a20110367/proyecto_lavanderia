import moment from 'moment'
moment.locale('es-mx');

// ----------------------------------------  FORMATS ------------------------------------- //

export const formatDate = (dateStr) => {
    const date = moment(dateStr).local().format("L")
    return date;
};

export const formatTime = (dateStr) => {
    const date = moment(dateStr).local().format("dddd LT");
    return date
}

export const formatTicketTime = (dateStr) => {

    const date = moment(dateStr).local().format('LT')
    return date
}

export const localTime = () => {
    let timeNow = moment.utc()

    let time = moment.utc(timeNow).toDate();

    console.log(time)

    let timeLocal = moment(time).local().format('LT')

    console.log('Tiempo local ' + timeLocal)

    return (timeLocal)
}

export const localDate = () => {

    let dateNow = moment.utc()

    console.log(dateNow)

    let date = moment.utc(dateNow).toDate();

    let dateLocal = moment(date).local().format('L')

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