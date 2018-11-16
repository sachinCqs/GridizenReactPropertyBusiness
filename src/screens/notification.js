/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, TextInput, Modal, RefreshControl, FlatList, Keyboard, ScrollView, Switch, sAsyncStorage, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Easing, Text, View, Image, AsyncStorage } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { dynamicSize, getFontSize, themeColor, fontFamily, dateConverterWithTime } from '../utils/responsive';
const { width, height } = Dimensions.get('window');
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TextBoxWithTitleAndButton } from '../components/button'
import { ErrModal, Toast, Spinner } from '../components/toast'
import { NodeAPI } from '../services/webservice'
import { validateEmail } from '../services/validation';
var multiSelectNotificationArr = []
var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};
var interval;
export default class Step2 extends Component {
    constructor(props) {
        super(props)
        this.state = {

            ErrModalVisible: false,
            errModalMessage: '',
            spinnerVisible: false,
            datePickerVisible: false,
            query: '',
            showToast: false,
            alertMessage: "",
            notificationList: [],
            headerData: '',
            refreshing: false,
            notificationListCount: 0,
            dataCount: 6,
            holdDetails: {},
            multiSelect: false,
            pageNo: 0,
            activeTab: 'Viewing Request',
            messageList: [],
            messageBadgeCount: 0,
            viewRequestBadgeCount: 0,
            modalVisible: false,
            tempData: '',
            quote: ''
        }
    }
    componentWillMount() {

        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })
            this.hitGetAllNotificationListApi(paramData)
            this.hitGetAllMessageListApi(paramData)
            clearInterval(interval);
            interval = setInterval(() => {
                this.hitGetMessageCount(paramData)
                this.hitGetViewRequestCount(paramData)
            }, 10000)
            this.hitGetMessageCount(paramData)
            this.hitGetViewRequestCount(paramData)


        })
    }
    componentWillUnmount() {
        clearInterval(interval);
    }
    hitGetMessageCount(paramData) {
        return NodeAPI({}, "getTotalUnreadMessage.json", 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, loaderPosition: dynamicSize(10), refreshing: false })
                if (responseJson.response_code === 'success') {
                    console.log("ppppppppppp")
                    this.setState({ messageBadgeCount: responseJson.total })
                } else {

                }
                //alert(JSON.stringify(response));
            })

    }
    hitGetViewRequestCount(paramData) {
        return NodeAPI({}, "getTotalRequest.json/V", 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, loaderPosition: dynamicSize(10), refreshing: false })
                if (responseJson.response_code === 'success') {
                    this.setState({ viewRequestBadgeCount: responseJson.total })
                } else {

                }
                //alert(JSON.stringify(response));
            })

    }
    hitGetAllNotificationListApi(paramData) {
        // this.setState({ refreshing: true })
        return NodeAPI({}, "getAllNotifications.json/" + this.state.pageNo + '/' + this.state.dataCount, 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, refreshing: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    console.log(JSON.stringify(responseJson))
                    var arr = responseJson.notifications
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].select = false
                    }
                    this.setState({ notificationList: [...this.state.notificationList, ...arr], notificationListCount: responseJson.total })
                    // console.log(new Date(responseJson.propertyviewings[0].viewing_date.split('T')[0]))
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
    hitGetAllMessageListApi(paramData) {
        // this.setState({ refreshing: true })
        return NodeAPI({}, "getAllChats.json", 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, refreshing: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    console.log(JSON.stringify(responseJson))
                    this.setState({ messageList: responseJson.propertymessages })
                    // var arr = responseJson.propertyviewings
                    // for (var i = 0; i < arr.length; i++) {
                    //     arr[i].select = false
                    // }
                    // this.setState({ notificationList: [...this.state.notificationList, ...arr], notificationListCount: responseJson.total })
                    // console.log(new Date(responseJson.propertyviewings[0].viewing_date.split('T')[0]))
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
        return type == 'viewDate' ? dateForViewing : (equal ? strTime : dateFortimeStamp)
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
    hitRescheduleRequestApi(dateTime) {
        // id,propertyId,vendorId,viewing_date,actionType(V,U) POST
        var variables = {
            id: this.state.holdDetails.id,
            propertyId: this.state.holdDetails.propertyId,
            vendorId: this.state.headerData.userid,
            viewing_date: dateTime,
            actionType: 'V',
            status: 2
        }
        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "reschedulePropertyViewing.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);
                    var arr = this.state.notificationList
                    arr[this.state.holdDetails.index].status = 2
                    arr[this.state.holdDetails.index].is_read = true
                    this.setState({ notificationList: arr })
                    //this.hitGetAllNotificationListApi(this.state.headerData)
                    // this.showSideMenu(this.state.holdDetails.index)
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
    reschedule(item, index) {
        item.index = index
        this.setState({ datePickerVisible: true, holdDetails: item })
    }
    //     Your property <Bedroom no> BHK <Property Type>
    //  <property Id> has received a new viewing request
    // <timestamp> 
    multiSelectFunction(item, index) {
        this.setState({ multiSelect: true })
        var arr = this.state.notificationList
        arr[index].select = true
        multiSelectNotificationArr.push(item.id)
        this.setState({ totalSelected: multiSelectNotificationArr.length })
        setTimeout(() => {
            this.setState({ notificationList: arr })
        }, 300)

    }
    multiSelectFunctionality(item, index) {

        var arr = this.state.notificationList

        if (item.select) {

            arr[index].select = !item.select
            if (multiSelectNotificationArr.indexOf(item.id) == -1) {
                multiSelectNotificationArr.push(item.id)
            } else {
                if (!arr[index].select) {
                    multiSelectNotificationArr.splice(multiSelectNotificationArr.indexOf(item.id), 1)
                }
            }

        } else {

            if (multiSelectNotificationArr.indexOf(item.id) == -1) {
                multiSelectNotificationArr.push(item.id)
            }
            arr[index].select = true

        }
        this.setState({ notificationList: arr })

        setTimeout(() => {
            if (multiSelectNotificationArr.length == 0) {

                this.setState({ multiSelect: false })
                multiSelectNotificationArr.length = 0
                this.resetNotificationArray()
            }
        }, 150);
        this.setState({ totalSelected: multiSelectNotificationArr.length })


    }
    resetNotificationArray() {
        var arr = this.state.notificationList
        for (var i = 0; i < arr.length; i++) {
            arr[i].select = false
        }
        this.setState({ notificationList: arr })
    }
    rowCheckImage(item) {
        if (this.state.multiSelect) {
            if (item.select && item.select == true) {
                return require('../assets/notification/selection_active_icon.png')
            } else {
                return require('../assets/notification/selection_inactive_icon.png')

            }
        } else {
            return require('../assets/notification/selection_inactive_icon.png')
        }

    }
    confirm(item, index) {

        var variables = {
            id: item.id,
            propertyId: item.propertyId,
            vendorId: this.state.headerData.userid,
            viewing_date: item.viewing_date,
            actionType: 'V',
            status: 1
        }
        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "reschedulePropertyViewing.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);
                    var arr = this.state.notificationList
                    arr[index].status = item.status == 1 ? 3 : 1
                    arr[this.state.holdDetails.index].is_read = true
                    this.setState({ notificationList: arr })
                    //this.hitGetAllNotificationListApi(this.state.headerData)
                    // this.showSideMenu(this.state.holdDetails.index)
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
    navigateToNotificationDetail(item, index) {

        if (item.is_read) {
            this.props.navigation.navigate("NotificationDetail", { type: "all", title: item.propertyDetail.propertyId, ViewingId: item.viewingDetail.viewingId, callbackOfNotification: () => this.callbackFromNotification() })
        } else {
            return NodeAPI({ id: item.id }, "readNotification.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
                .then(responseJson => {
                    this.setState({ spinnerVisible: false, loaderPosition: dynamicSize(10), refreshing: false })
                    if (responseJson.response_code === 'success') {
                        var arr = this.state.notificationList
                        arr[index].is_read = true
                        this.setState({ notificationList: arr })
                        this.props.navigation.navigate("NotificationDetail", { type: "all", title: item.propertyDetail.propertyId, ViewingId: item.viewingDetail.viewingId, callbackOfNotification: () => this.callbackFromNotification() })
                    } else {

                    }
                    //alert(JSON.stringify(response));
                })
        }


    }
    makeNegotiateView(item, index) {
        return (
            <TouchableWithoutFeedback
                onPress={() => item.type == "AGENT" ? null : this.props.navigation.navigate('NegotiationLogs', { data: item })}
            >
                <View style={{ marginHorizontal: dynamicSize(15), marginVertical: dynamicSize(5) }}>
                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily() }}>{this._handleDatePicked(item.updatedAt, 'tiimestampDate')}</Text>
                    <View style={{ borderWidth: 1, borderColor: item.is_read ? '#d8d8d8' : themeColor, marginTop: dynamicSize(5), backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', padding: dynamicSize(12), flex: 1, paddingVertical: dynamicSize(8) }}>
                            <View style={{ flex: 1 }}>
                                {this.parseHtml(item)}

                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Message", { data: { propertyId: item.propertyDetail.id, userId: item.userDetail.id }, callbackOfNotification: () => this.callbackFromNotification() })}
                                style={{ paddingLeft: dynamicSize(20) }}>
                                <Image source={require('../assets/notification/commentIcon.png')} />
                            </TouchableOpacity>
                        </View>
                        {item.is_action == 0 ?
                            <View style={{ width: '100%', flexDirection: 'row', borderTopColor: '#d8d8d8', borderTopWidth: 0.5, paddingVertical: dynamicSize(12) }}>
                                {item.negotationDetail.actionType == 'U' ?
                                    < TouchableOpacity onPress={() => this.hitDontNegotiateAPI(item)}
                                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: themeColor }}>{'ACCEPT'}</Text>
                                    </TouchableOpacity>
                                    : null}
                                < TouchableOpacity onPress={() => this.onNegotiatePress(item, "modal")}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{item.type == "AGENT" ? "SEND QUOTE" : "NEGOTIATE"}</Text>

                                </TouchableOpacity>

                            </View>
                            : null}
                    </View>
                </View>

            </TouchableWithoutFeedback >
        )
    }
    showNotificationList(item, index) {
        // var date = new Date(item.viewing_date.split('T')[0]).toString()

        return (

            <View>
                {item.type == 'VIEWING' ?
                    <TouchableWithoutFeedback

                        onPress={() => this.navigateToNotificationDetail(item, index)}
                    >
                        <View style={{ marginHorizontal: dynamicSize(15), marginVertical: dynamicSize(5) }}>
                            <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily() }}>{this._handleDatePicked(item.updatedAt, 'tiimestampDate')}</Text>
                            <View style={{ borderWidth: 1, borderColor: item.is_read ? '#d8d8d8' : themeColor, marginTop: dynamicSize(5), backgroundColor: 'white' }}>
                                <View style={{ flexDirection: 'row', padding: dynamicSize(12), flex: 1, paddingVertical: dynamicSize(8) }}>
                                    <View style={{ flex: 1 }}>
                                        {/* <Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a', marginTop: dynamicSize(2) }}>{item.notification.split('#')[0]}</Text> */}
                                        {this.parseHtml(item)}


                                        <Text style={{ fontSize: getFontSize(10), fontFamily: fontFamily(), marginTop: dynamicSize(5), color: '#7b7b7b', }}>{this._handleDatePicked(item.notification.split('#')[1], 'viewDate')}</Text>

                                    </View>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Message", { data: { propertyId: item.propertyDetail.id, userId: item.userDetail.id }, callbackOfNotification: () => this.callbackFromNotification() })}
                                        style={{ paddingLeft: dynamicSize(20) }}>
                                        <Image source={require('../assets/notification/commentIcon.png')} />
                                    </TouchableOpacity>
                                </View>
                                {/* <View style={{ width: '100%', flexDirection: 'row', borderTopColor: '#d8d8d8', borderTopWidth: 0.5, paddingVertical: dynamicSize(12) }}>
                           
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("NotificationDetail", { type: item.status == 1 && item.actionType == "V" ? "all" : "confirm", title: item.pid, ViewingId: item.id, callbackOfNotification: () => this.callbackFromNotification() })}
                                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: themeColor }}>{item.status == 1 && item.actionType == "V" ? 'CONFIRMED' : 'CONFIRM'}</Text>
                            </TouchableOpacity>
                            {item.countreschedule < 2 ?
                                < TouchableOpacity onPress={() => this.props.navigation.navigate("NotificationDetail", { type: "re", title: item.pid, ViewingId: item.id, callbackOfNotification: () => this.callbackFromNotification() })}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>RESCHEDULE</Text>

                                </TouchableOpacity>
                                : null}
                        </View> */}
                            </View>
                        </View>

                    </TouchableWithoutFeedback >
                    :
                    item.type == 'VISIT' ?
                        this.makevisitView(item, index)
                        :
                        item.type == 'FEEDBACK' ?
                            this.makeFeedbackView(item, index)
                            :
                            item.type == "NEGOTATION" ?
                                this.makeNegotiateView(item, index)
                                :
                                item.type == "AGENT" ?
                                    this.makeNegotiateView(item, index)
                                    :
                                    null
                }
            </View>

        )
    }
    parseHtml(item) {
        var arr = []
        var string = item.notification.split('#')[0]
        var splitArr = string.split('[')
        console.log(splitArr)
        for (var i = 0; i < splitArr.length; i++) {
            if (splitArr[i].indexOf(']') != -1) {
                var searchText = splitArr[i].split(']')[0]
                switch (searchText) {
                    case 'LL': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{item.vendorDetail.name},</Text>); break;

                    case 'NL': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{'\n\n'}</Text>); break;

                    case 'UU': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{item.userDetail.first_name}</Text>); break;

                    case 'ER': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{item.negotationDetail ? item.negotationDetail.price : item.propertyDetail.expectedRent}</Text>); break;

                    case 'PA': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{item.propertyDetail.address}</Text>); break;

                    case 'PT': arr.push(
                        <Text onPress={() => this.props.navigation.navigate('PropertyDetails', { data: { id: item.propertyDetail.id } })} style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{item.propertyDetail.bedroom + " BHK " + item.propertyDetail.property_type_name}</Text>
                    ); break;

                    case 'VD': arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>{this._handleDatePicked(item.viewingDetail.viewing_date, 'viewDate')}</Text>); break;
                }
                arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily(), color: '#7a7a7a' }}>{splitArr[i].split(']')[1]}</Text>)

            } else {
                console.log(splitArr[i])
                arr.push(<Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily(), color: '#7a7a7a' }}>{splitArr[i]}</Text>)
            }

        }
        return (
            <Text>{arr}</Text>
        )
    }
    hitVisitYesNoAPI(status, item) {
        var variables = {
            id: item.id,
            viewingId: item.viewingDetail.viewingId,
            propertyId: item.propertyDetail.id,
            userId: item.userDetail.id,
            action: status
        }
        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "visitSuccess.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {

                if (responseJson.response_code === 'success') {
                    this.setState({ pageNo: 0, notificationList: [] })
                    setTimeout(() => {
                        this.hitGetAllNotificationListApi(this.state.headerData)
                    }, 500);

                } else {
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    this.setState({ spinnerVisible: false, refreshing: false })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);

                }
                //alert(JSON.stringify(response));
            })
    }
    hitDontNegotiateAPI(item) {
        var variables = {
            id: item.id,
            viewingId: item.viewingDetail.viewingId,
            propertyId: item.propertyDetail.id,
            userId: item.userDetail.id,
            rent: item.negotationDetail ? item.negotationDetail.price : item.propertyDetail.expectedRent,
            comment: this.state.query,
            type: 'NEGOTATION',
            action: 1 // for negotiate 0
        }

        // alert(JSON.stringify(variables))
        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "negotatiate.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {

                if (responseJson.response_code === 'success') {
                    //this.setState({   alertMessage: responseJson.msg })

                    this.setState({ pageNo: 0, notificationList: [] })
                    setTimeout(() => {
                        //this.setState({ spinnerVisible: true })
                        this.hitGetAllNotificationListApi(this.state.headerData)

                    }, 200);


                } else {

                    this.setState({ spinnerVisible: false, showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);
                }
                //alert(JSON.stringify(response));
            })
    }
    onNegotiatePress(item, check) {
        if (check == "hit") {
            if (item.type == "AGENT") {
                this.setState({ modalVisible: false })
                var variables = {
                    id: item.id,
                    vendorId: item.vendorDetail.id,
                    propertyId: item.propertyDetail.id,
                    comment: this.state.query,
                    quote: this.state.quote
                }

                //alert(JSON.stringify(variables))
                this.setState({ spinnerVisible: true })
                return NodeAPI(variables, "sendQuote.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
                    .then(responseJson => {

                        if (responseJson.response_code === 'success') {
                            this.setState({ spinnerVisible: false, alertMessage: responseJson.msg })
                            setTimeout(() => {
                                //this.setState({ showToast: false })
                                this.setState({ pageNo: 0, notificationList: [] })
                                setTimeout(() => {
                                    this.setState({ spinnerVisible: true })
                                    this.hitGetAllNotificationListApi(this.state.headerData)

                                }, 200);
                            }, 3000);

                        } else {

                            this.setState({ spinnerVisible: false, showToast: true, alertMessage: responseJson.msg })
                            setTimeout(() => {
                                this.setState({ showToast: false })
                            }, 3000);
                        }
                        //alert(JSON.stringify(response));
                    })
            }
            else {
                this.setState({ modalVisible: false })
                var variables = {
                    id: item.id,
                    viewingId: item.viewingDetail.viewingId,
                    propertyId: item.propertyDetail.id,
                    userId: item.userDetail.id,
                    rent: this.state.message,
                    type: item.type,
                    comment: this.state.query,
                    action: 0 // for negotiate 0
                }

                //alert(JSON.stringify(variables))
                this.setState({ spinnerVisible: true })
                return NodeAPI(variables, "negotatiate.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
                    .then(responseJson => {

                        if (responseJson.response_code === 'success') {
                            this.setState({ spinnerVisible: false, alertMessage: responseJson.msg })
                            setTimeout(() => {
                                //this.setState({ showToast: false })
                                this.setState({ pageNo: 0, notificationList: [] })
                                setTimeout(() => {
                                    this.setState({ spinnerVisible: true })
                                    this.hitGetAllNotificationListApi(this.state.headerData)

                                }, 200);
                            }, 3000);

                        } else {

                            this.setState({ spinnerVisible: false, showToast: true, alertMessage: responseJson.msg })
                            setTimeout(() => {
                                this.setState({ showToast: false })
                            }, 3000);
                        }
                        //alert(JSON.stringify(response));
                    })
            }


        } else {
            this.setState({ tempData: item, message: '', quote: '', query: '', message: item.propertyDetail.expectedRent.toString() })
            setTimeout(() => {
                this.setState({ modalVisible: true, })
            }, 200);
        }
    }
    makevisitView(item, index) {
        return (
            <TouchableWithoutFeedback

            //onPress={() => this.navigateToNotificationDetail(item, index)}
            >
                <View style={{ marginHorizontal: dynamicSize(15), marginVertical: dynamicSize(5) }}>
                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily() }}>{this._handleDatePicked(item.updatedAt, 'tiimestampDate')}</Text>
                    <View style={{ borderWidth: 1, borderColor: item.is_read ? '#d8d8d8' : themeColor, marginTop: dynamicSize(5), backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', padding: dynamicSize(12), flex: 1, paddingVertical: dynamicSize(8) }}>
                            <View style={{ flex: 1 }}>
                                {this.parseHtml(item)}

                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Message", { data: { propertyId: item.propertyDetail.id, userId: item.userDetail.id }, callbackOfNotification: () => this.callbackFromNotification() })}
                                style={{ paddingLeft: dynamicSize(20) }}>
                                <Image source={require('../assets/notification/commentIcon.png')} />
                            </TouchableOpacity>
                        </View>
                        {item.is_action == 0 ?
                            <View style={{ width: '100%', flexDirection: 'row', borderTopColor: '#d8d8d8', borderTopWidth: 0.5, paddingVertical: dynamicSize(12) }}>

                                <TouchableOpacity onPress={() => this.hitVisitYesNoAPI(1, item)}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: themeColor }}>{'YES'}</Text>
                                </TouchableOpacity>

                                < TouchableOpacity onPress={() => this.hitVisitYesNoAPI(0, item)}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>NO</Text>

                                </TouchableOpacity>

                            </View>
                            : null}
                    </View>
                </View>

            </TouchableWithoutFeedback >
        )
    }
    hitReadFeedbackAPI(item) {
        this.setState({ spinnerVisible: true })
        return NodeAPI({ id: item.id }, "readNotification.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                //this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    this.setState({ pageNo: 0, notificationList: [] })
                    setTimeout(() => {

                        this.hitGetAllNotificationListApi(this.state.headerData)

                    }, 200);
                } else {

                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);
                }
                //alert(JSON.stringify(response));
            })
    }
    makeFeedbackView(item, index) {
        return (
            <TouchableWithoutFeedback

                onPress={() => this.hitReadFeedbackAPI(item)}
            >
                <View style={{ marginHorizontal: dynamicSize(15), marginVertical: dynamicSize(5) }}>
                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily() }}>{this._handleDatePicked(item.updatedAt, 'tiimestampDate')}</Text>
                    <View style={{ borderWidth: 1, borderColor: item.is_read ? '#d8d8d8' : themeColor, marginTop: dynamicSize(5), backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', padding: dynamicSize(12), flex: 1, paddingVertical: dynamicSize(8) }}>
                            <View style={{ flex: 1 }}>
                                {this.parseHtml(item)}

                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Message", { data: { propertyId: item.propertyDetail.id, userId: item.userDetail.id }, callbackOfNotification: () => this.callbackFromNotification() })}
                                style={{ paddingLeft: dynamicSize(20) }}>
                                <Image source={require('../assets/notification/commentIcon.png')} />
                            </TouchableOpacity>
                        </View>
                        {/* {item.is_action == 0 ?
                            <View style={{ width: '100%', flexDirection: 'row', borderTopColor: '#d8d8d8', borderTopWidth: 0.5, paddingVertical: dynamicSize(12) }}>

                                <TouchableOpacity onPress={() => this.hitVisitYesNoAPI(1, item)}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: themeColor }}>{'YES'}</Text>
                                </TouchableOpacity>

                                < TouchableOpacity onPress={() => this.hitVisitYesNoAPI(0, item)}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>NO</Text>

                                </TouchableOpacity>

                            </View>
                            : null} */}
                    </View>
                </View>

            </TouchableWithoutFeedback >
        )
    }
    refresh() {
        this.setState({ refreshing: true })
        this.hitGetAllNotificationListApi(this.state.headerData)

    }
    dismiss() {
        //alert(multiSelectNotificationArr)
        var variables = {
            id: multiSelectNotificationArr
        }
        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "readPropertyViewing.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    this.setState({ showToast: true, multiSelect: false, alertMessage: 'Dismiss Successfully.' })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);
                    this.hitGetAllNotificationListApi(this.state.headerData)
                    // this.showSideMenu(this.state.holdDetails.index)
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
    makeBadge(count, type) {
        // return (
        //     <View style={{
        //         position: 'absolute',
        //         height: dynamicSize(20),
        //         width: dynamicSize(20),


        //         borderRadius: dynamicSize(10),
        //         backgroundColor: 'red',
        //         alignItems: 'center',

        //         justifyContent: 'center', top: dynamicSize(3), left: type == 'view' ? '85%' : '70%'
        //     }}>
        //         <Text style={{ color: 'white', fontSize: getFontSize(10) }}>{count.length > 2 ? '9+' : count}</Text>
        //     </View>
        // )
        return (
            <View style={{
                position: 'absolute',
                height: dynamicSize(20),
                width: dynamicSize(20),


                borderRadius: dynamicSize(10),
                backgroundColor: '#f49930',
                alignItems: 'center',
                right: dynamicSize(-20),
                top: dynamicSize(-20),
                justifyContent: 'center', top: dynamicSize(3),
                // left: type == 'view' ? '85%' : '70%'
            }}>
                <Text style={{ color: 'white', fontSize: getFontSize(10) }}>{count.length > 2 ? '9+' : count}</Text>
            </View>
        )
    }
    showMessageList(item, index) {
        return (
            // <TouchableOpacity
            //     onPress={() => this.props.navigation.navigate("Message", { data: item })} 
            // style={{ borderBottomColor: "#f2f2f2", borderBottomWidth: dynamicSize(1), paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(10), flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
            //     <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            //         <View style={{ alignItems: "center", justifyContent: "center", height: dynamicSize(40), width: dynamicSize(40), borderRadius: dynamicSize(20), backgroundColor: "#f2f2f2" }}>
            //             <Image style={{ height: dynamicSize(20), width: dynamicSize(20) }} source={{ uri: "https://png.icons8.com/android/1600/user.png" }} />
            //         </View>
            //         <View style={{ marginLeft: dynamicSize(15) }}>
            //             <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(14), color: "black" }}>{item.userDetail.first_name}</Text>
            //             <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), color: "#a2a8a2" }}>{item.message}</Text>
            //         </View>
            //     </View>

            //     <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily(), color: "#a2a8a2" }}>{this._handleDatePicked(item.updatedAt, 'timestampDate')}</Text>
            // </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Message", { data: item, callbackOfNotification: () => this.callbackFromNotification() })}
                style={{ borderBottomColor: "#f2f2f2", borderBottomWidth: dynamicSize(1), backgroundColor: !item.is_read ? '#f3fcf2' : 'white', paddingHorizontal: dynamicSize(20), paddingVertical: dynamicSize(15), flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <View style={{ alignItems: "center", justifyContent: "center", height: dynamicSize(40), width: dynamicSize(40), borderRadius: dynamicSize(20), backgroundColor: "#f2f2f2" }}>
                        <Image style={{ height: dynamicSize(20), width: dynamicSize(20) }} source={{ uri: "https://png.icons8.com/android/1600/user.png" }} />
                    </View>
                    <View style={{ marginLeft: dynamicSize(15) }}>
                        <View style={{ flexDirection: "row", width: "100%" }}>
                            <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(14), color: '#7a7a7a', flex: 1 }}>{item.userDetail.first_name}</Text>
                            <Text style={{ fontSize: getFontSize(10), fontFamily: fontFamily(), color: '#999999', flex: 1, textAlign: "right" }}>{this._handleDatePicked(item.updatedAt, 'timestampDate')}</Text>
                        </View>
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), color: '#7a7a7a', width: width - dynamicSize(100) }}>{item.message}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )

    }
    callbackFromNotification = () => {
        this.setState({ pageNo: 0, notificationList: [] })
        setTimeout(() => {
            this.hitGetAllNotificationListApi(this.state.headerData)
        }, 300);

        this.hitGetAllMessageListApi(this.state.headerData)
    }
    render() {

        return (
            <View style={[styles.container, { backgroundColor: this.state.activeTab == "Viewing Request" ? '#f5f5f5' : 'white' }]}>
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
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}>
                    <View style={{ flex: 1, backgroundColor: "#34495E90", alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: "white", width: width - dynamicSize(50), alignItems: "center" }}>

                            <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: themeColor, height: dynamicSize(35), width: '100%' }}>
                                <Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily("bold"), color: "white" }}>{this.state.tempData.type == "AGENT" ? 'Send Quote' : 'Make an offer'}</Text>
                            </View>

                            <View style={{ marginTop: dynamicSize(35), width: "80%", }}>

                                <View style={{ minHeight: dynamicSize(70), width: '100%', borderColor: "#c4c4c4", borderWidth: dynamicSize(0.5), marginVertical: dynamicSize(15) }}>
                                    <TextInput
                                        placeholder="Message"
                                        placeholderTextColor='#7a7a7a'
                                        style={{ width: "100%", fontSize: getFontSize(14), color: "#7a7a7a", fontFamily: fontFamily() }}
                                        multiline={true}
                                        value={this.state.query}
                                        onChangeText={(text) => this.setState({ query: text })}
                                    />
                                </View>
                                <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily(), color: "#7a7a7a" }}>{this.state.tempData.type == "AGENT" ? "Quote in PCM" : "Offer Price in PCM"}</Text>

                                <TextInput
                                    placeholder={this.state.tempData.type == "AGENT" ? "Quote" : "Offer price"}
                                    style={{ fontSize: getFontSize(14), width: '100%', height: dynamicSize(35), color: "#7a7a7a", fontFamily: fontFamily(), borderColor: "#c4c4c4", borderWidth: dynamicSize(0.5), }}
                                    multiline={true}
                                    keyboardType='numeric'
                                    value={this.state.tempData.type == "AGENT" ? this.state.quote : this.state.message}
                                    onChangeText={(text) => this.state.tempData.type == "AGENT" ? this.setState({ quote: text }) : this.setState({ message: text })}
                                />
                            </View>


                            <TouchableOpacity onPress={() => this.onNegotiatePress(this.state.tempData, "hit")}
                                style={{ marginVertical: dynamicSize(20), justifyContent: "center", alignItems: "center", backgroundColor: "orange", height: dynamicSize(35), width: '80%', }}>
                                <Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily("bold"), color: "white" }}>{this.state.tempData.type == "AGENT" ? 'Send' : 'Offer'}</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </Modal>

                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />

                <View style={[styles.subHeader, { marginTop: dynamicSize(5) }]}>
                    <View style={styles.bottomHeader}>
                        <View style={styles.headerTab}>


                            <TouchableOpacity onPress={() => { this.setState({ activeTab: 'Viewing Request' }) }} style={[styles.tabButton, { flex: 1 }]}>

                                <View style={[styles.tabBtnIcon, { borderBottomWidth: dynamicSize(3), borderBottomColor: this.state.activeTab == "Viewing Request" ? themeColor : "white" }]}>
                                    {this.makeBadge(this.state.viewRequestBadgeCount, 'view')}
                                    <Text style={[styles.btnText, {}]}>Viewing Request</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.setState({ activeTab: 'Messages' }) }} style={[styles.tabButton, { flex: 1 }]}>

                                <View style={[styles.tabBtnIcon, { borderBottomWidth: dynamicSize(3), borderBottomColor: this.state.activeTab != "Viewing Request" ? themeColor : "white" }]}>
                                    {this.makeBadge(this.state.messageBadgeCount, 'message')}
                                    <Text style={[styles.btnText, {}]}>Messages</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {this.state.activeTab == 'Viewing Request' ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: dynamicSize(10), marginVertical: dynamicSize(10), }}>
                        <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(14) }}>{this.state.notificationListCount <= 1 ? this.state.notificationListCount + " notification" : this.state.notificationListCount + " notifications"}</Text>
                        {this.state.multiSelect ?
                            <TouchableOpacity onPress={() => this.dismiss()}
                                style={{ backgroundColor: themeColor, borderRadius: dynamicSize(5), paddingVertical: dynamicSize(5), paddingHorizontal: dynamicSize(5) }}>
                                <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(12), color: 'white' }}>Dismiss Selected</Text>
                            </TouchableOpacity> : null}
                    </View>
                    : null}
                <ScrollView
                    style={{}}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (this.state.notificationList.length < this.state.notificationListCount) {
                                this.setState({ pageNo: this.state.pageNo + 1, refreshing: true })
                                setTimeout(() => {

                                    this.hitGetAllNotificationListApi(this.state.headerData)

                                }, 200);
                            }



                        }
                    }}
                    scrollEventThrottle={400}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => console.log()}
                            progressViewOffset={width - dynamicSize(20)}
                            colors={['white']}
                            progressBackgroundColor={themeColor}
                        />
                    }
                >
                    {this.state.activeTab != 'Viewing Request' ?
                        <View style={{ paddingTop: dynamicSize(15), paddingBottom: dynamicSize(10), paddingHorizontal: dynamicSize(15), backgroundColor: "#f2f2f2" }}>

                            <View style={{ backgroundColor: "white", height: dynamicSize(40), width: "100%", borderColor: "grey", borderWidth: dynamicSize(0.5), flexDirection: "row", alignItems: "center" }}>
                                <Image style={{ marginLeft: dynamicSize(15), tintColor: "#56B24D", height: dynamicSize(16), width: dynamicSize(16) }} source={{ uri: "https://static.thenounproject.com/png/101791-200.png" }} />
                                <TextInput
                                    style={{ flex: 1, fontFamily: fontFamily(), fontSize: getFontSize(15), color: "black" }}
                                    placeholder="Search"
                                    placeholderTextColor="#a2a8a2"
                                />
                            </View>
                        </View>
                        :
                        null
                    }
                    <FlatList
                        data={this.state.activeTab == 'Viewing Request' ? this.state.notificationList : this.state.messageList}
                        renderItem={({ item, index }) => this.state.activeTab == 'Viewing Request' ? this.showNotificationList(item, index) : this.showMessageList(item, index)}
                        keyExtractor={(item, index) => index}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}

                        marginTop={dynamicSize(5)}
                        marginBottom={dynamicSize(10)}
                        extraData={this.state}
                        ref={(scroller) => { this.scroller = scroller }}
                    />
                    <View style={{ height: dynamicSize(60) }} />
                </ScrollView>





            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#fff',
    },
    rentText: { color: 'grey', fontSize: getFontSize(16), fontFamily: fontFamily('bold') },
    address1Text: { fontSize: getFontSize(11), color: themeColor, fontFamily: fontFamily('bold') },
    subHeader: {
        backgroundColor: "white",
    },
    bottomHeader: {
        backgroundColor: "white",
        // width: width - dynamicSize(30),
        // marginHorizontal: dynamicSize(15)
    },
    headerBottomTitle: {
        color: 'black',
        fontSize: getFontSize(17),
        padding: dynamicSize(18),
        fontWeight: '600'
    },
    headerTab: {
        flexDirection: 'row',
    },
    tabButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',

    },
    tabBtnIcon: {
        //borderRadius: dynamicSize(10),
        //borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        paddingVertical: dynamicSize(10),
        marginBottom: dynamicSize(1)

    },
    btnText: {
        fontSize: getFontSize(15),
        fontWeight: '600',
        color: themeColor,
        marginLeft: dynamicSize(5)
    },
});
