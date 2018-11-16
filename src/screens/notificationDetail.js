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
var multiSelectNotificationArr = []
var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};
export default class NotificationDetail extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: "ID : " + `${navigation.state.params.title}`,
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center', color: "#7a7a7a" },
        headerStyle: {
            backgroundColor: 'white',
        },
    });



    constructor(props) {
        super(props)
        this.state = {
            ErrModalVisible: false,
            errModalMessage: '',
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            headerData: '',
            refreshing: false,
            ViewingId: this.props.navigation.state.params.ViewingId,
            propertyDetails: {},
            propertyId: '',
            logs: [],
            data: '',
            datePickerVisible: false,
            getParamType: this.props.navigation.state.params.type
        }
        // alert(this.props.navigation.state.params.type)

    }
    componentWillMount() {

        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })
            this.hitGetAllDetailsAPI(paramData)

        })
    }
    hitGetAllDetailsAPI(paramData) {
        return NodeAPI({}, "getViewingDetail.json/" + this.state.ViewingId, 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    this.setState({
                        propertyDetails: responseJson.propertyviewing.propertyDetail,
                        logs: responseJson.propertyviewing.logs,
                        data: responseJson.propertyviewing
                    })
                    if (this.state.getParamType == 're') {

                        this.setState({ getParamType: '', holdDetails: this.state.logs[0], datePickerVisible: true })

                    } else if (this.state.getParamType == 'confirm') {
                        this.setState({ getParamType: '', })
                        setTimeout(() => {
                            this.confirm(this.state.logs[0])
                        }, 300);
                    } else {
                        this.setState({ getParamType: '', })
                    }
                } else {
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);
                }
                //alert(JSON.stringify(response));
            })


    }
    hitRescheduleRequestApi(dateTime) {
        // id,propertyId,vendorId,viewing_date,actionType(V,U) POST
        var variables = {
            id: this.state.holdDetails.viewingId,
            propertyId: this.state.holdDetails.propertyId,
            vendorId: this.state.headerData.userid,
            userId: this.state.holdDetails.userId,
            viewing_date: dateTime,
            actionType: 'V',
            status: 2
        }
        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "reschedulePropertyViewing.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    this.props.navigation.state.params.callbackOfNotification()
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);
                    this.hitGetAllDetailsAPI(this.state.headerData)
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
    confirm(item, index) {

        var variables = {
            id: item.viewingId,
            propertyId: item.propertyId,
            vendorId: this.state.headerData.userid,
            viewing_date: item.viewing_date,
            actionType: 'V',
            userId: item.userId,
            status: 1
        }
        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "reschedulePropertyViewing.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    this.props.navigation.state.params.callbackOfNotification()
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);
                    this.hitGetAllDetailsAPI(this.state.headerData)
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

    getDateTime(date, type) {
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
        var dateFortimeStamp = Day.toString() + '-' + monthArr[Month] + '-' + Year.toString() + '  ' + strTime   //+ ':' + Seconds.toString()
        var equal = false
        //equal = this.compareDate('' + d.getDate() + d.getMonth() + d.getFullYear())
        return type == 'viewDate' ? dateForViewing : (dateFortimeStamp)
        // this.setState({
        //     //appointment: Year.toString() + '-' + Month.toString() + '-' + Day.toString() + "  " + Hours.toString() + ':' + Minutes.toString() + ':' + Seconds.toString(),
        //     appointmentErr: '', datePickerVisible: false
        // })
        // this.hitRescheduleRequestApi(date)
    }

    _showLogs(item, index) {
        return (
            <View style={{ paddingVertical: dynamicSize(15), borderColor: "#a2a8a2", borderWidth: dynamicSize(0.3), paddingHorizontal: dynamicSize(15) }}>
                <Text style={{ fontFamily: fontFamily(), color: this.state.logs.length - 1 == index ? "#7a7a7a" : "#a2a8a2", fontSize: getFontSize(13) }}>{(index == 0 ? "Requested by " : "Rescheduled by ") + (item.actionType == 'V' ? "Me" : item.userDetail.first_name) + " " + this.getDateTime(item.viewing_date || new Date(), 'timestampDate')}</Text>
                {this.state.logs.length - 1 == index ?
                    <View>
                        <Text style={{ fontFamily: fontFamily(), color: "#999999", fontSize: getFontSize(10), marginTop: dynamicSize(6) }}>{this.getDateTime(item.createdAt || new Date(), 'timestampDate')}</Text>
                        <View style={{ width: "100%", height: dynamicSize(35), borderColor: "#e7e7e7", borderWidth: dynamicSize(0.5), marginTop: dynamicSize(10), flexDirection: "row" }}>
                            {item.isconfirm == 0 ?
                                <TouchableOpacity onPress={() =>  this.confirm(item, index)}
                                    style={{ flex: 1, backgroundColor: "#56B24D", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontFamily: fontFamily("bold"), color: "white", fontSize: getFontSize(11) }}>{'CONFIRM'}</Text>
                                </TouchableOpacity>
                                :
                                <View
                                    //   onPress={() => item.status == 1 ? null : this.confirm(item, index)}
                                    style={{ flex: 1, backgroundColor: "#56B24D", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontFamily: fontFamily("bold"), color: "white", fontSize: getFontSize(11) }}>{'CONFIRMED'}</Text>
                                </View>}
                            {item.countreschedule < 2 ?
                                <TouchableOpacity onPress={() => this.reschedule(item, index)}
                                    style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontFamily: fontFamily("bold"), color: "#7a7a7a", fontSize: getFontSize(11) }}>RESCHEDULE</Text>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                    </View>

                    :
                    null
                }
            </View>
        )
    }
    _handleDatePicked(date) {
        // alert(new Date(date).getDate())
        let d = new Date(date)
        let Year = d.getFullYear();
        let Month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
        let Day = (d.getDate()) < 10 ? '0' + (d.getDate()) : (d.getDate());
        let Hours = (d.getHours()) < 10 ? '0' + (d.getHours()) : (d.getHours());
        let Minutes = (d.getMinutes()) < 10 ? '0' + (d.getMinutes()) : (d.getMinutes());
        let Seconds = (d.getSeconds()) < 10 ? '0' + (d.getSeconds()) : (d.getSeconds());
        var date = Year.toString() + '-' + Month.toString() + '-' + Day.toString() + "  " + Hours.toString() + ':' + Minutes.toString() + ':' + Seconds.toString()
        this.setState({
            datePickerVisible: false
        })
        this.hitRescheduleRequestApi(date)
    }
    reschedule(item, index) {
        item.index = index
        this.setState({ datePickerVisible: true, holdDetails: item })
    }
    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.state.activeTab == "Viewing Request" ? null : 'white' }]}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <DateTimePicker
                    isVisible={this.state.datePickerVisible}
                    onConfirm={(date) => this._handleDatePicked(date)}
                    onCancel={() => this.setState({ datePickerVisible: false })}
                    mode="datetime"
                    minimumDate={new Date()}
                    is24Hour={false}
                //datePickerContainerStyleIOS={styles.datepickeriosstyle}
                />

                <View style={{ paddingVertical: dynamicSize(10), borderTopColor: "#a2a8a2", borderTopWidth: dynamicSize(0.3), paddingHorizontal: dynamicSize(15) }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('PropertyDetails', { data: { id: this.state.data.propertyId } })}>
                        <Text style={{ fontFamily: fontFamily("bold"), color: "#7a7a7a", fontSize: getFontSize(13) }}>{(this.state.propertyDetails.bedroom || '') + " BHK " + (this.state.propertyDetails.property_type_name || '')}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: fontFamily(), color: "#7a7a7a", fontSize: getFontSize(13), marginTop: dynamicSize(3) }}>{"Your property " + (this.state.propertyDetails.bedroom || "") + " BHK flat has received a new viewing request"}</Text>
                    <Text style={{ fontFamily: fontFamily(), color: "#999999", fontSize: getFontSize(10), marginTop: dynamicSize(3) }}>{this.getDateTime(this.state.data.createdAt || new Date(), 'timestampDate')}</Text>
                </View>
                <FlatList
                    data={this.state.logs}
                    renderItem={({ item, index }) => this._showLogs(item, index)}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    marginTop={dynamicSize(5)}
                    marginBottom={dynamicSize(10)}
                    extraData={this.state}
                    ref={(scroller) => { this.scroller = scroller }}
                />

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
