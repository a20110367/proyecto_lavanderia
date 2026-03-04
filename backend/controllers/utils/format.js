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

    let dateUTC = moment.utc(timeNow).toDate();

    let timeLocal = moment(dateUTC).local().format('HH:mm')

    console.log('Tiempo local ' + timeLocal)

    return (timeLocal)
}

export const localDate = () => {

    let dateNow = moment.utc()

    let dateUTC = moment.utc(dateNow).toDate();

    let dateLocal = moment(dateUTC).local('L')

    console.log('Fecha local ' + dateLocal)

    return (dateLocal)
}

export const tolocalTime = (timeUTC) => {

    let dateUTC = moment.utc(timeUTC).toDate();

    let timeLocal = moment(dateUTC).local().format('HH:mm')

    console.log('Tiempo local ' + timeLocal)

    return (timeLocal)
}

export const toLocalDate = (dateUTC) => {


    let dateUTC = moment.utc(dateUTC).toDate();

    let dateLocal = moment(dateUTC).local('L')

    console.log('Fecha local ' + dateLocal)

    return (dateLocal)
}