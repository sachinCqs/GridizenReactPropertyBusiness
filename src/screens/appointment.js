/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, TextInput, FlatList, Keyboard, ScrollView, Switch, sAsyncStorage, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Easing, Text, View, Image, AsyncStorage } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { dynamicSize, getFontSize, themeColor, fontFamily, dateConverterWithTime } from '../utils/responsive';
const { width, height } = Dimensions.get('window');
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TextBoxWithTitleAndButton } from '../components/button'
import { ErrModal, Toast, Spinner } from '../components/toast'
import { NodeAPI } from '../services/webservice'
import { validateEmail } from '../services/validation';

export default class Step2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.navigation.state.params.propertyId,
            backTo: this.props.navigation.state.params.backTo,
            ErrModalVisible: false,
            errModalMessage: '',
            spinnerVisible: false,
            datePickerVisible: false,
            showToast: false,
            alertMessage: "",
            appointment: '',
            email: '',
            emailErr: '',
            appointmentErr: '',
            errMessageArr: [],
            headerData: ''
        }
    }
    componentWillMount() {

        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,

            })

        })
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

        this.setState({
            appointment: Year.toString() + '-' + Month.toString() + '-' + Day.toString() + "  " + Hours.toString() + ':' + Minutes.toString() + ':' + Seconds.toString(),
            appointmentErr: '', datePickerVisible: false
        })
    }

    onSave() {
        let { email, errMessageArr } = this.state;
        errMessageArr = [];
        if (validateEmail(email).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validateEmail(email).message) })
        }
        if (this.state.appointment == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please select date of appointment") })
        }
        console.log(errMessageArr);
        if (errMessageArr.length != 0) {
            if (errMessageArr.length == 1) {
                this.setState({
                    errModalMessage: errMessageArr[0], ErrModalVisible: true
                })
            }
            else {
                this.setState({
                    errModalMessage: "Please enter valid credentials.", ErrModalVisible: true
                })
            }
        }
        if (errMessageArr.length == 0) {
            var variables = {
                propertyId: this.state.id,
                doa: this.state.appointment,
                email: this.state.email
            }

            this.setState({ spinnerVisible: true })
            return NodeAPI(variables, "addAppointment.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
                .then(responseJson => {
                    this.setState({ spinnerVisible: false })
                    if (responseJson.response_code === 'success') {
                        //alert(JSON.stringify(responseJson))
                        this.setState({ showToast: true, alertMessage: responseJson.msg })
                        //this.props.navigation.state.params.updateList()
                        setTimeout(() => {
                            this.setState({ showToast: false })
                            this.props.navigation.pop(this.state.backTo)
                        }, 3000);
                    } else {
                        // setTimeout(() => {
                        //     alert(responseJson.msg)
                        // }, 300)
                        this.setState({ showToast: true, alertMessage: responseJson.msg })
                        setTimeout(() => {
                            this.setState({ showToast: false })

                        }, 3000);
                    }
                    // alert(JSON.stringify(responseJson));
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
                <ScrollView style={{ flex: 1 }}>
                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Email'}
                        error={this.state.emailErr}
                        value={this.state.email}
                        editable={true}
                        downArrow={false}
                        multiline={false}
                        onButtonPress={() => console.log('')}
                        icon={require('../assets/step2/prop-detail-icn.png')}
                        onChangeText={(text) => this.setState({ email: text, emailErr: false })}
                        Keyboard="email-address"
                    />
                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Date of appointment'}
                        error={this.state.appointmentErr}
                        value={this.state.appointment}
                        editable={false}
                        downArrow={false}
                        onButtonPress={() => this.setState({ datePickerVisible: true })}
                        icon={require('../assets/step2/cal-icn.png')}
                        onChangeText={(text) => this.setState({ availableFrom: text })}
                    />
                    <View style={[styles.accomodationView, { marginBottom: dynamicSize(5) }]}>
                        <TouchableOpacity onPress={() => this.props.navigation.pop(this.state.backTo)}
                            style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2' }}
                        >
                            <Text style={styles.boldText}>Skip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2', backgroundColor: '#F49930' }}
                            onPress={() => this.onSave()}>
                            <Text style={[styles.boldText, { color: 'white' }]}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: { height: height / 2.5, marginHorizontal: dynamicSize(15), },
    propertyTypeView: { paddingHorizontal: dynamicSize(10), borderBottomColor: "#A2A8A2", borderBottomWidth: 0.5, padding: dynamicSize(8), },
    selectedText: { color: themeColor, fontFamily: fontFamily('bold') },
    squareView: { width: width - dynamicSize(20), flexDirection: 'row', borderColor: '#A2A8A2', borderWidth: 0.5, marginVertical: dynamicSize(10) },
    switchView: { alignItems: 'center', borderBottomColor: "#A2A8A2", borderBottomWidth: 0.5, padding: dynamicSize(8), flexDirection: 'row', paddingHorizontal: dynamicSize(10), justifyContent: 'space-between' },

    rowView: { paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(10) },
    rowText: { fontSize: getFontSize(14) },
    boldText: { fontSize: getFontSize(14), fontFamily: fontFamily('bold') },
    accomodationView: { alignItems: 'center', borderTopColor: "#A2A8A2", borderTopWidth: 0, padding: dynamicSize(10), flexDirection: 'row', paddingHorizontal: dynamicSize(10) },
});
