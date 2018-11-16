import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// const { width } = Dimensions.get('window');
const STANDARD_WIDTH = 375; const CURRENT_WIDTH = width;
const K = CURRENT_WIDTH / STANDARD_WIDTH;
const USE_FOR_BIGGER_SIZE = true;
export function dynamicSize(size) { return K * size; }
export function getFontSize(size) {
    if (USE_FOR_BIGGER_SIZE || CURRENT_WIDTH < STANDARD_WIDTH) { const newSize = dynamicSize(size); return newSize; }
    return size;
}
export const themeColor = '#56B24D'

export function dateConverterOfMilli(dateMilliSecond) {
    var date = new Date(dateMilliSecond)
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    date = (day < 10 ? '0' + day : day) + '/' + (month + 1 < 9 ? '0' + (month + 1) : (month + 1)) + '/' + year
    return date
}

export function dateConverterMMDDYYYY(date) {
    var arr = []

    var present = date.toString();
    present = present.split(" ");
    present = present[1] + ' ' + present[2] + "," + present[3]



    return present
}
export function fontFamily(param) {
    if (param == "bold") {
        return "Raleway-Bold"
    }
    return "Raleway-Regular"
}