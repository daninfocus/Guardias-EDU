export function datesAreOnSameDay(first, second) {
    return first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
}

export function generateKey(pre){
    return `${pre}_${new Date().getTime()}`;
};  