import { Dimensions,Text } from 'react-native';

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
export const orange = '#F49930'
export function dateConverterMMDDYYYY(date) {
    var arr = []

    var present = date.toString();
    present = present.split(" ");
    present = present[1] + ' ' + present[2] + "," + present[3]



    return present
}
export function dateConverterOfMilli(dateMilliSecond) {
    var date = new Date(dateMilliSecond)
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    date = (day < 10 ? '0' + day : day) + '/' + (month + 1 < 9 ? '0' + (month + 1) : (month + 1)) + '/' + year
    return date
}


export function fontFamily(param) {
    if (param == "bold") {
        return "Raleway-Bold"
    }
    return "Raleway-Regular"
}

// export function handleDatePicked(date, type) {
//     // alert(new Date(date).getDate())
//     let d = new Date(date)
//     let Year = d.getFullYear();
//     let Month = d.getMonth();
//     let MonthString = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);

//     let Day = (d.getDate()) < 10 ? '0' + (d.getDate()) : (d.getDate());
//     let Hours = (d.getHours()) < 10 ? '0' + (d.getHours()) : (d.getHours());
//     let Minutes = (d.getMinutes()) < 10 ? '0' + (d.getMinutes()) : (d.getMinutes());
//     let Seconds = (d.getSeconds()) < 10 ? '0' + (d.getSeconds()) : (d.getSeconds());
//     //this return date informat 25 oct 2018 12:25
//     var dateForViewing = Day.toString() + ' ' + monthArr[Month] + ' ' + Year.toString() + "  " + Hours.toString() + ':' + Minutes.toString() //+ ':' + Seconds.toString()

//     var hours = d.getHours()
//     var minutes = d.getMinutes()
//     var ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'
//     minutes = minutes < 10 ? '0' + minutes : minutes;
//     var strTime = hours + ':' + minutes + ' ' + ampm;
//     //tis return in format 5:25 pm  - 11-10-2018
//     var dateFortimeStamp = strTime + '  ' + Day.toString() + '-' + MonthString.toString() + '-' + Year.toString()  //+ ':' + Seconds.toString()
//     var equal = false
//     equal = this.compareDate('' + d.getDate() + d.getMonth() + d.getFullYear())
//     return type == 'viewDate' ? dateForViewing : (equal ? strTime : dateFortimeStamp)
//     // this.setState({
//     //     //appointment: Year.toString() + '-' + Month.toString() + '-' + Day.toString() + "  " + Hours.toString() + ':' + Minutes.toString() + ':' + Seconds.toString(),
//     //     appointmentErr: '', datePickerVisible: false
//     // })
//     // this.hitRescheduleRequestApi(date)
// }
// export function parseHtmlText(item) {
//     var arr = []
//     var string = item.notification
//     var splitArr = string.split('[')
//     //console.log(splitArr)
//     for (var i = 0; i < splitArr.length; i++) {
//         if (splitArr[i].indexOf(']') != -1) {
//             var searchText = splitArr[i].split(']')[0]
//             switch (searchText) {
//                 case 'LL': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{item.vendorDetail.name},</Text>); break;

//                 case 'NL': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{'\n\n'}</Text>); break;

//                 case 'UU': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{item.userDetail.first_name}</Text>); break;

//                 case 'VD': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{handleDatePicked(item.viewingDetail.viewing_date, 'viewDate')}</Text>); break;
//             }
//             arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily(), color: '#7a7a7a' }}>{splitArr[i].split(']')[1]}</Text>)

//         } else {
//             //console.log(splitArr[i])
//             arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily(), color: '#7a7a7a' }}>{splitArr[i]}</Text>)
//         }

//     }
//     return <Text>{arr}</Text>
    
// }
