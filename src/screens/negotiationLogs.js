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
var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var partition = '';
var interval;
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
            marginFromBottom: dynamicSize(10),

            messageList: [
            ],
          
        }
    }
    componentWillMount() {
       AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })

            this.hitGetAllChatMessageListApi(paramData)
          
        })

       
    }
    
    componentWillUnmount() {
   
      
    }

    
    hitGetAllChatMessageListApi(paramData) {
        // this.setState({ refreshing: true })
        var notificationId = this.props.navigation.state.params.data.id
        //var userId = this.props.navigation.state.params.data.userId

        return NodeAPI({}, "getAllNegotationLog.json/" + notificationId, 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ refreshing: false,spinnerVisible:false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    console.log(JSON.stringify(responseJson))

                   

                   this.setState({ messageList: responseJson.notifications, spinnerVisible: false, })
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
        // if (partition != '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()) {
        //     partition = ''
        // } else {
        //     partition = '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()
        // }

        return '' + d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear()
    }
   



    showMessageList(item, index) {
        
        return (
            <View style={{}}>

                {/* {item.show ?
                    <View style={{ backgroundColor: '#f3fcf2', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: dynamicSize(5), borderRadius: dynamicSize(5), borderColor: themeColor, borderWidth: 0.5 }}>
                        <Text style={{ color: themeColor }}>{item.show}</Text>
                    </View>
                    : null
                }
                 */}
                    <View style={{ alignItems: item.actionType == 'U' ? 'flex-start' : 'flex-end', marginHorizontal: dynamicSize(15), marginVertical: dynamicSize(10) }}>
                        <View style={{ flexDirection: 'row' }}>
                            {item.actionType == 'U' ?
                                <Image style={{ zIndex: 99 }}
                                    source={require('../assets/chat/chat-tail-left.png')} />
                                : null}
                            <View style={{ maxWidth: '80%', zIndex: 5, marginLeft: item.actionType == 'U' ? dynamicSize(-1) : 0, backgroundColor: item.actionType == 'V' ? '#f3fcf2' : 'white', borderRadius: dynamicSize(6), padding: dynamicSize(10), borderTopRightRadius: item.actionType == 'U' ? dynamicSize(6) : 0, borderTopLeftRadius: item.actionType == 'U' ? 0 : dynamicSize(6), borderWidth: dynamicSize(1), borderColor: item.actionType == 'V' ? '#a7cea2' : '#e7e7e7' }} >
                                <Text style={{ color: '#7a7a7a', fontFamily: fontFamily(), fontSize: getFontSize(16) }}>{item.actionType == 'V' ? 'Your offer price' : item.userDetail.first_name+' offered price'} <Text style={{ color: themeColor, fontFamily: fontFamily(), fontSize: getFontSize(16) }}>{item.price}</Text>
                                    <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(10), textAlign: 'right', color: '#999999' }}>{"    " + this._handleDatePicked(item.createdAt, 'timestampDate')}</Text>
                                </Text>



                            </View>
                            {item.actionType == 'U' ?
                                null
                                :
                                <Image style={{ zIndex: 99, marginLeft: dynamicSize(-1) }}
                                    source={require('../assets/chat/chat-tail-right.png')} />
                            }
                        </View>




                    </View>
               
            </View>

        )

    }

    // onSend() {
    //     // var arr = this.state.messageList
    //     // arr.unshift({ type: 'me', message: this.state.textInpuValue })
    //     // this.setState({ messageList: arr, textInpuValue: '' })
    //     if (this.state.textInpuValue != "") {
    //         this.hitReadMessage(this.state.headerData)

    //         var variables = {
    //             message: this.state.textInpuValue,
    //             propertyId: this.props.navigation.state.params.data.propertyId,
    //             vendorId: this.props.navigation.state.params.data.vendorId
    //         }
    //         return NodeAPI(variables, "sendMessage.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
    //             .then(responseJson => {
    //                 this.setState({ spinnerVisible: false })
    //                 Keyboard.dismiss()
    //                 if (responseJson.response_code === 'success') {
    //                     this.props.navigation.state.params.callbackOfNotification()
    //                     this.hitGetAllChatMessageListApi(this.state.headerData)
    //                     this.setState({ textInpuValue: '' })

    //                 } else {
    //                     // setTimeout(() => {
    //                     //     alert(responseJson.msg)
    //                     // }, 300)
    //                     this.setState({ showToast: true, alertMessage: responseJson.msg })
    //                     setTimeout(() => {
    //                         this.setState({ showToast: false })

    //                     }, 3000);
    //                 }
    //                 //alert(JSON.stringify(response));
    //             })
    //     }
    // }
    render() {

        return (
            <View style={styles.container}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
               
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, }}>
                        <FlatList
                            data={this.state.messageList}
                            renderItem={({ item, index }) => this.showMessageList(item, index)}
                            keyExtractor={(item, index) => index}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            // inverted
                            // marginTop={dynamicSize(5)}
                            // marginBottom={dynamicSize(10)}
                            extraData={this.state}
                            ref={(scroller) => { this.scroller = scroller }}
                        />
                    </View>
                    {/* <View style={{ height: dynamicSize(50), backgroundColor: 'white', borderColor: '#a2a8a2', borderWidth: 1, margin: dynamicSize(5), borderRadius: 8, flexDirection: 'row', padding: dynamicSize(5) }}>
                        <TextInput
                            value={this.state.textInpuValue}
                            placeholder="Message"
                            onChangeText={(text) => this.setState({ textInpuValue: text })}
                            style={{ flex: 1, color: themeColor, fontFamily: fontFamily(), fontSize: getFontSize(14) }}
                        />
                        <TouchableOpacity onPress={() => this.onSend()}
                            style={{ height: dynamicSize(40), width: dynamicSize(40), alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={require('../assets/notification/send-button.png')} />
                        </TouchableOpacity>
                    </View> */}
                    {/* <View style={{ height: dynamicSize(50), backgroundColor: 'white', marginTop: dynamicSize(5), marginHorizontal: dynamicSize(15), alignItems: 'center', justifyContent: 'center', marginBottom: this.state.marginFromBottom }}>
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
                    </View> */}
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
