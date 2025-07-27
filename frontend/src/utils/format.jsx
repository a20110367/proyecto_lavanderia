import moment from "moment";
moment.locale('es-mx');

export const formatDate = (dateStr) => {
    const date = moment.utc(dateStr).format("DD / MM / YYYY")
    return date;
};

export const formatTime = (dateStr) => {
    const date = moment(dateStr).format("LT");
    return date
}

export const formatDateReport = (dateStr) => {
    const date = moment(dateStr).format("DD-MM-YYYY")
    return date;
};