export const formatDate = (dateStr) => {
    const date = moment(dateStr).format("DD / MM / YYYY")
    return date;
};

export const formatTime = (dateStr) => {
    const date =  moment(dateStr).format("LT");
    return date
}