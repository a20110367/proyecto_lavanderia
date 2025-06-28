import moment from 'moment'
moment.locale('es-mx');

// ----------------------------------------  FORMATS ------------------------------------- //

export const formatDate = (dateStr) => {
    const date = moment.utc(dateStr).format("L")
    return date;
};

export const formatTime = (dateStr) => {
    const date = moment(dateStr).format("dddd LT");
    return date
}

export const formatTicketTime = (dateStr) => {
    const date = moment(dateStr).format('LT')
    return date
}
