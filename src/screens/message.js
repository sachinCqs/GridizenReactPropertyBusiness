/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, TextInput, RefreshControl, FlatList, Keyboard, ScrollView, Switch, sAsyncStorage, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Easing, Text, View, Image, AsyncStorage } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { dynamicSize, getFontSize, themeColor, fontFamily, dateConverterWithTime } from '../utils/responsive';
const { width, height } = Dimensions.get('window');
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TextBoxWithTitleAndButton } from '../components/button'
import { ErrModal, Toast, Spinner } from '../components/toast'
import { NodeAPI } from '../services/webservice'
import { validateEmail } from '../services/validation';
import Emoji from 'react-emoji-render';
var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var partition = ''
var interval;
var dateFlag = []


export default class Step2 extends Component {
    constructor(props) {
        super(props)
        this.state = {

            ErrModalVisible: false,
            errModalMessage: '',
            spinnerVisible: false,
            datePickerVisible: false,
            showToast: false,
            alertMessage: "",

            headerData: '',
            refreshing: false,
            lastOneTime: '',
            marginFromBottom: dynamicSize(10),
            messageList: [
            ]
        }
    }



    componentWillMount() {
        var self = this
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => this._keyboardDidShow(e, self));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => this._keyboardDidHide(e, self));

        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })
            // interval = setInterval(() => {
            //     this.hitGetAllChatMessageListApi(paramData)
            // }, 1000000000)
            this.hitGetAllChatMessageListApi(paramData)
            this.hitReadMessage(paramData)
        })
    }
    _keyboardDidShow(e, self) {
        console.log("pppp==>" + e.endCoordinates.height)
        self.setState({ marginFromBottom: dynamicSize(30) });
        // this.props.navigation.setParams({
        //     keyboardHeight: e.endCoordinates.height,
        //     normalHeight: Dimensions.get('window').height,
        //     shortHeight: Dimensions.get('window').height - e.endCoordinates.height,
        // });
    }
    _keyboardDidHide(e, self) {
        self.setState({ marginFromBottom: dynamicSize(10) });
    }

    componentWillUnmount() {
        clearInterval(interval);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    hitReadMessage(paramData) {
        var propertyId = this.props.navigation.state.params.data.propertyId
        var userId = this.props.navigation.state.params.data.userId


        return NodeAPI({}, "readMessage.json/" + propertyId + '/' + userId, 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ loaderPosition: dynamicSize(10), refreshing: false })
                if (responseJson.response_code === 'success') {
                    this.setState({ viewRequestBadgeCount: responseJson.total })
                } else {

                }
                //alert(JSON.stringify(response));
            })

    }

    hitGetAllChatMessageListApi(paramData) {
        // this.setState({ refreshing: true })
        var propertyId = this.props.navigation.state.params.data.propertyId
        var userId = this.props.navigation.state.params.data.userId

        return NodeAPI({}, "getAllPropertyMessagesByUser.json/" + propertyId + '/' + userId, 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ refreshing: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    console.log(JSON.stringify(responseJson))
                    dateFlag = []
                    //date1 = ''
                    var arr = responseJson.propertymessages

                    var data = responseJson.propertymessages;

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].viewingDetail) {
                            console.log(i)
                            this.setState({ lastOneTime: data[i].viewingDetail.log.logId })
                            //break;
                        }
                        if (dateFlag.indexOf(this.getDate(data[i].createdAt)) == -1) {

                            arr[i].show = this.getDate(data[i].createdAt)
                            dateFlag.push(this.getDate(data[i].createdAt))
                        }

                    }
                    console.log("arrrrrrr" + JSON.stringify(arr))
                    this.setState({ messageList: arr.reverse(), spinnerVisible: false, })

                    // console.log(new Date(responseJson.propertyviewings[0].viewing_date.split('T')[0]))
                } else {
                    // setTimeout(() => {
                    //     alert(responseJson.msg)
                    // }, 300)
                    this.setState({ showToast: true, alertMessage: responseJson.msg, spinnerVisible: false })
                    setTimeout(() => {
                        this.setState({ showToast: false })

                    }, 3000);
                }
                //alert(JSON.stringify(response));
            })

    }





    _handleDatePicked(date, type) {
        // alert(new Date(date).getDate())
        let d = new Date(date)
        let Year = d.getFullYear();
        let Month = d.getMonth();
        let MonthString = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);

        let Day = (d.getDate()) < 10 ? '0' + (d.getDate()) : (d.getDate());
        let Hours = (d.getHours()) < 10 ? '0' + (d.getHours()) : (d.getHours());
        let Minutes = (d.getMinutes()) < 10 ? '0' + (d.getMinutes()) : (d.getMinutes());
        let Seconds = (d.getSeconds()) < 10 ? '0' + (d.getSeconds()) : (d.getSeconds());
        //this return date informat 25 oct 2018 12:25
        var dateForViewing = Day.toString() + ' ' + monthArr[Month] + ' ' + Year.toString() + "  " + Hours.toString() + ':' + Minutes.toString() //+ ':' + Seconds.toString()

        var hours = d.getHours()
        var minutes = d.getMinutes()
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        //tis return in format 5:25 pm  - 11-10-2018
        var dateFortimeStamp = strTime + '  ' + Day.toString() + '-' + MonthString.toString() + '-' + Year.toString()  //+ ':' + Seconds.toString()
        var equal = false
        equal = this.compareDate('' + d.getDate() + d.getMonth() + d.getFullYear())
        return type == 'viewDate' ? dateForViewing : (strTime)
        // this.setState({
        //     //appointment: Year.toString() + '-' + Month.toString() + '-' + Day.toString() + "  " + Hours.toString() + ':' + Minutes.toString() + ':' + Seconds.toString(),
        //     appointmentErr: '', datePickerVisible: false
        // })
        // this.hitRescheduleRequestApi(date)
    }
    compareDate(date) {
        var presentDate = '' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear()
        if (date == presentDate)
            return true
        else
            return false
    }
    getDate(date) {
        let d = new Date(date)
        return '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()
    }
    callbackFromNotification = () => {
        this.hitGetAllChatMessageListApi(this.state.headerData)
        this.props.navigation.state.params.callbackOfNotification()
    }
    showNotificationList(item, index) {
        // var date = new Date(item.viewing_date.split('T')[0]).toString()

        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate("NotificationDetail", { type: "all", title: item.propertyDetail.propertyId, ViewingId: item.viewingDetail.viewingId, callbackOfNotification: () => this.callbackFromNotification() })}
            //onLongPress={() => this.multiSelectFunction(item, index)}
            >
                <View style={{ marginHorizontal: dynamicSize(15), marginVertical: dynamicSize(5) }}>
                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily() }}>{this._handleDatePicked(item.createdAt, 'timestampDate')}</Text>
                    <View style={{ borderWidth: 0.5, borderColor: '#d8d8d8', marginTop: dynamicSize(5), backgroundColor: 'white', }}>
                        <View style={{ flexDirection: 'row', padding: dynamicSize(12), flex: 1, paddingVertical: dynamicSize(8) }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a', marginTop: dynamicSize(2) }}>{item.propertyDetail.bedroom + " BHK " + item.propertyDetail.property_type_name}</Text>
                                <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily(), marginTop: dynamicSize(2), color: '#7a7a7a', }}>

                                    {
                                        item.viewingDetail.log.status == 1 && item.viewingDetail.log.actionType == "U" ?
                                            'Viewing request for your property ' + item.propertyDetail.bedroom + " bhk flat has been accepted by tenant"
                                            :
                                            item.viewingDetail.log.status == 1 && item.viewingDetail.log.actionType == "V" ?
                                                'Viewing request for your property ' + item.propertyDetail.bedroom + " bhk flat has been accepted by you"
                                                :
                                                item.viewingDetail.log.status == 2 && item.viewingDetail.log.actionType == "U" ?
                                                    'Viewing request for your property ' + item.propertyDetail.bedroom + " bhk flat has been rescheduled by tenant"
                                                    :
                                                    item.viewingDetail.log.status == 2 && item.viewingDetail.log.actionType == "V" ?
                                                        'Viewing request for your property ' + item.propertyDetail.bedroom + " bhk flat has been rescheduled by you"

                                                        :
                                                        'Your property ' + item.propertyDetail.bedroom + ' bhk flat has received a new viewing request'
                                    }


                                    {/* {'Your property ' + item.propertyDetail.bedroom + ' bhk flat has received a new viewing request'} */}
                                </Text>
                                <Text style={{ fontSize: getFontSize(10), fontFamily: fontFamily(), marginTop: dynamicSize(5), color: '#999999', }}>{this._handleDatePicked(item.viewingDetail.viewing_date, 'viewDate')}</Text>

                            </View>
                            {/* <View style={{ paddingLeft: dynamicSize(15) }}>
                                <Image source={require('../assets/notification/commentIcon.png')} />
                            </View> */}
                        </View>
                        {this.state.lastOneTime == item.viewingDetail.log.logId ?
                            <View style={{ width: '100%', flexDirection: 'row', borderTopColor: '#e7e7e7', borderTopWidth: 0.5, paddingVertical: dynamicSize(12) }}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("NotificationDetail", { type: item.viewingDetail.log.status == 1 && item.viewingDetail.log.actionType == "V" ? "all" : "confirm", title: item.propertyDetail.propertyId, ViewingId: item.viewingDetail.viewingId, callbackOfNotification: () => this.callbackFromNotification() })}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: themeColor }}>{item.viewingDetail.log.status == 1 && item.viewingDetail.log.actionType == "V" ? 'CONFIRMED' : 'CONFIRM'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("NotificationDetail", { type: "re", title: item.propertyDetail.propertyId, ViewingId: item.viewingDetail.viewingId, callbackOfNotification: () => this.callbackFromNotification() })}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>RESCHEDULE</Text>

                                </TouchableOpacity>

                            </View> : null}
                    </View>
                </View>

            </TouchableWithoutFeedback>
        )
    }
    // getDate(date) {
    //     let d = new Date(date)
    //     // if (partition != '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()) {
    //     //     partition = '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()
    //     // }

    //     return '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()
    // }
    // getDateView(date) {
    //     let d = new Date(date)
    //     // if (partition != '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()) {
    //     //     partition = '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()
    //     // }
    //     partition='' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()

    //     return '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()
    // }

    showMessageList(item, index) {
        // console.log(this.getDate(item.createdAt))
        // if (index == 0) {
        //     partition = this.getDate(item.createdAt)
        // }
        // if (partition == this.getDate(item.createdAt)) {
        //     partition = this.getDate(item.createdAt)
        // } else {
        //     partition = ''
        // }
        // partition = partition == this.getDate(item.createdAt) ? '' : this.getDate(item.createdAt)



        // console.log("--------", dateFlag.indexOf(this.getDate(item.createdAt)) + '-----' + date1[index])

        return (
            <View style={{}}>

                {item.show ?
                    <View style={{ backgroundColor: '#f3fcf2', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: dynamicSize(5), borderRadius: dynamicSize(5), borderColor: themeColor, borderWidth: 0.5 }}>
                        <Text style={{ color: themeColor }}>{item.show}</Text>
                    </View>
                    : null
                }




                {item.viewingDetail ?
                    this.showNotificationList(item, index)
                    :
                    <View style={{ alignItems: item.sender_type == 'U' ? 'flex-start' : 'flex-end', marginHorizontal: dynamicSize(15), marginVertical: dynamicSize(10) }}>
                        <View style={{ flexDirection: 'row' }}>
                            {item.sender_type == 'U' ?
                                <Image style={{ zIndex: 99 }}
                                    source={require('../assets/chat/chat-tail-left.png')} />
                                : null}
                            <View style={{ maxWidth: '80%', zIndex: 5, marginLeft: item.sender_type == 'U' ? dynamicSize(-1) : 0, backgroundColor: item.sender_type == 'V' ? "#f3fcf2" : 'white', borderRadius: dynamicSize(6), padding: dynamicSize(10), borderTopRightRadius: item.sender_type == 'U' ? dynamicSize(6) : 0, borderTopLeftRadius: item.sender_type == 'V' ? dynamicSize(6) : 0, borderWidth: dynamicSize(1), borderColor: item.sender_type == 'V' ? '#a7cea2' : '#e7e7e7' }} >

                                <Text style={{ color: '#7a7a7a', fontFamily: fontFamily(), fontSize: getFontSize(16) }}>{item.message}

                                    <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(10), textAlign: 'right', color: '#999999' }}>{"    " + this._handleDatePicked(item.createdAt, 'timestampDate')}</Text>
                                </Text>



                            </View>
                            {item.sender_type == 'U' ?
                                null
                                :
                                <Image style={{ zIndex: 99, marginLeft: dynamicSize(-1) }}
                                    source={require('../assets/chat/chat-tail-right.png')} />
                            }
                        </View>




                    </View>
                }
            </View>

        )

    }
    onSend() {
        // var arr = this.state.messageList
        // arr.unshift({ type: 'me', message: this.state.textInpuValue })
        // this.setState({ messageList: arr, textInpuValue: '' })
        console.log(this.state.textInpuValue)

        if (this.state.textInpuValue != '') {
            this.hitReadMessage(this.state.headerData)
            var variables = {
                message: this.state.textInpuValue,
                propertyId: this.props.navigation.state.params.data.propertyId,
                userId: this.props.navigation.state.params.data.userId
            }
            return NodeAPI(variables, "sendMessage.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
                .then(responseJson => {
                    this.setState({ spinnerVisible: false, textInpuValue: '' })
                    Keyboard.dismiss()
                    if (responseJson.response_code === 'success') {
                        this.props.navigation.state.params.callbackOfNotification()
                        this.hitGetAllChatMessageListApi(this.state.headerData)

                    } else {
                        // setTimeout(() => {
                        //     alert(responseJson.msg)
                        // }, 300)
                        this.setState({ showToast: true, alertMessage: responseJson.msg })
                        setTimeout(() => {
                            this.setState({ showToast: false })

                        }, 3000);
                    }
                    //alert(JSON.stringify(response));
                })
        }
    }
    render() {

        return (
            <View style={styles.container}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <DateTimePicker
                    isVisible={this.state.datePickerVisible}
                    onConfirm={(date) => this._handleDatePicked(date)}
                    onCancel={() => this.setState({ datePickerVisible: false })}
                    mode="datetime"
                    minimumDate={new Date()}
                    is24Hour={false}
                //datePickerContainerStyleIOS={styles.datepickeriosstyle}
                />

                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />

                <View style={{ flex: 1, marginBottom: dynamicSize(10) }}>

                    <FlatList
                        data={this.state.messageList}
                        renderItem={({ item, index }) => this.showMessageList(item, index)}
                        keyExtractor={(item, index) => index}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        inverted
                        // marginTop={dynamicSize(5)}
                        // marginBottom={dynamicSize(10)}
                        extraData={this.state}
                        ref={(scroller) => { this.scroller = scroller }}
                    />

                    {/* <View style={{ backgroundColor: 'white', margin: dynamicSize(5), marginHorizontal: dynamicSize(15), alignItems: 'center', justifyContent: 'center', paddingBottom: dynamicSize(40) }}> */}
                    <View style={{ height: dynamicSize(50), backgroundColor: 'white', margin: dynamicSize(5), marginHorizontal: dynamicSize(15), alignItems: 'center', justifyContent: 'center', marginBottom: this.state.marginFromBottom }}>
                        <View style={{ padding: dynamicSize(5), flexDirection: 'row', borderColor: '#e7e7e7', borderWidth: 1 }}>
                            <TextInput
                                value={this.state.textInpuValue}
                                placeholder="Message"
                                onChangeText={(text) => this.setState({ textInpuValue: text })}
                                placeholderTextColor="#7a7a7a"
                                style={{ flex: 1, color: "#7a7a7a", fontFamily: fontFamily(), fontSize: getFontSize(14) }}
                            />
                            <TouchableOpacity onPress={() => this.onSend()}
                                style={{ height: dynamicSize(40), width: dynamicSize(40), alignItems: 'center', justifyContent: 'center' }} >
                                <Image source={require('../assets/notification/send-button.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>




            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    rentText: { color: 'grey', fontSize: getFontSize(16), fontFamily: fontFamily('bold') },
    address1Text: { fontSize: getFontSize(11), color: themeColor, fontFamily: fontFamily('bold') },

});
