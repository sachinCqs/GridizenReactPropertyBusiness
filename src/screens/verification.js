import React, { Component } from 'react';
import { Platform, Image, TouchableOpacity, AsyncStorage, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
const { height, width } = Dimensions.get('window');
import { NodeAPI } from '../services/webservice';
import { dynamicSize, getFontSize, fontFamily } from '../utils/responsive';
import { ErrModal, Spinner, Toast } from '../components/toast';
import { NavigationActions, StackActions } from 'react-navigation';

export default class Verification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verificationCode: '',
            vendorId: global.vendorId,
            spinnerVisible: false,
            ErrModalVisible: false,
            errModalMessage: '',
            showToast: false,
            alertMessage: "",
            fromWhere: global.fromWhere,
            counter: 0

        };
        // alert(global.vendorId)
    }

    componentWillMount() {
        global.fromWhere = '';
        // alert(this.state.fromWhere)
    }

    _loginDetails(text) {
        if (text == '') this.setState({ loginParameter: '' })
        if (/[0-9]$/.test(text.split('')[0])) {
            if (/[0-9]$/.test(text)) {
                this.setState({ loginParameter: text, length: 10 })
            }
        }
        else {
            this.setState({
                loginParameter: text.replace(/[^A-Za-z0-9@._-]/g, ''), length: 100
            })

        }


    }


    verifyCode() {
        if (this.state.verificationCode != '') {
            var variables = {};
            {
                this.state.fromWhere != "login" ?
                    variables = {
                        vendorId: this.state.vendorId,
                        verification_code: this.state.verificationCode
                    }
                    :
                    variables = {
                        vendorId: this.state.vendorId,
                        otp: this.state.verificationCode
                    }

            }

            this.setState({ spinnerVisible: true })
            return NodeAPI(variables, this.state.fromWhere != "login" ? "verify.json" : "validateOtp.json", 'POST')
                .then(response => {
                    this.setState({ spinnerVisible: false })
                    setTimeout(() => {
                        if (response.response_code == 'success') {
                            var loginData = { "userid": response.vendorid, "token": response.authtoken,type:response.vendorDetail.type }
                            AsyncStorage.setItem("headerData", JSON.stringify(loginData))

                            // const resetAction = StackActions.reset({
                            //     index: 0,
                            //     actions: [NavigationActions.navigate({ routeName: 'Drawer' })],
                            // });
                            // this.props.navigation.dispatch(resetAction);
                            if (response.vendorDetail.type == '2') {
                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'DrawerOfAgent' })],
                                });
                                this.props.navigation.dispatch(resetAction);
                            } else {

                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'Drawer' })],
                                });
                                this.props.navigation.dispatch(resetAction);
                            }
                            // global.firstLogin = response.first_login;
                            // var loginData = { "userid": response.userid, "token": response.authtoken }
                            // AsyncStorage.setItem("headerData", JSON.stringify(loginData))
                            // //var userId = response.userId
                            // AsyncStorage.setItem("isLoggedin", JSON.stringify("loggedIn"))
                            // var flag = response.userDetail
                            // flag.first_login = response.first_login
                            // AsyncStorage.setItem("userDetail", JSON.stringify(flag))
                            // // this.props.navigation.navigate('Drawer')
                            // const resetAction = StackActions.reset({
                            //     index: 0,
                            //     actions: [NavigationActions.navigate({ routeName: 'Drawer' })],
                            // });
                            // this.props.navigation.dispatch(resetAction);
                            // this.setState({ verificationCode: '' })
                            //this.props.navigation.navigate('Verification', { userId: userId })
                        } else {
                            this.setState({ showToast: true, alertMessage: response.msg })
                            setTimeout(() => {
                                this.setState({ showToast: false })
                            }, 3000);
                        }
                        //alert(JSON.stringify(response));
                    }, 300)
                })
        } else {
            //alert("Please enter verification code")
            this.setState({
                errModalMessage: "Please enter verification code.", ErrModalVisible: true
            })
        }
    }
    resendCode() {
        if (this.state.fromWhere != "login") {
            this.setState({ spinnerVisible: true })
            var variables = {
                vendorId: this.state.vendorId,
            }
            return NodeAPI(variables, "resendVerification.json", 'POST')
                .then(response => {
                    this.setState({ spinnerVisible: false, verificationCode: '' })
                    if (response.response_code == 'success') {
                        this.setState({ showToast: true, alertMessage: response.msg })
                        setTimeout(() => {
                            this.setState({ showToast: false })
                        }, 3000);
                        //this.props.navigation.navigate('Verification', { userId: userId })
                    } else {
                        this.setState({ showToast: true, alertMessage: response.msg })
                        setTimeout(() => {
                            this.setState({ showToast: false })
                        }, 3000);
                    }
                    //alert(JSON.stringify(response));
                })
        } else {

            if (this.state.counter < 3) {
                this.setState({ spinnerVisible: true })
                var variables = { mobile_num: global.mobileNo }
                return NodeAPI(variables, "loginByMobile.json", 'POST')
                    .then(response => {
                        console.log("hello", response, this.state.counter)
                        this.setState({ spinnerVisible: false })
                        if (response.response_code == 'success') {

                            var loginData = { "userid": response.vendorid, "token": response.authtoken }
                            AsyncStorage.setItem("headerData", JSON.stringify(loginData))
                            this.setState({ showToast: true, alertMessage: response.msg, counter: this.state.counter + 1 })
                            setTimeout(() => {
                                this.setState({ showToast: false })
                            }, 3000);
                            global.fromWhere = "login"
                            global.userId = response.userid
                            this.props.navigation.navigate("Verification")
                        }
                        else {
                            this.setState({ showToast: true, alertMessage: response.msg })
                            setTimeout(() => {
                                this.setState({ showToast: false })
                            }, 3000);
                        }
                    })
            }
            else {
                this.setState({ showToast: true, alertMessage: "Maximum resend OTP attemps reached." })
                setTimeout(() => {
                    this.setState({ showToast: false })
                }, 3000);
            }


        }
    }


    render() {
        return (
            <View style={styles.fullview}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <Spinner visible={this.state.spinnerVisible} />
                <Image
                    style={{ marginTop: dynamicSize(100) }}
                    source={require("../assets/logo-business.png")} />
                <View style={{ paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(20), paddingHorizontal: dynamicSize(10), marginTop: dynamicSize(100) }}>
                    <Image resizeMode="contain"
                        //style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/phoneEmail.png')} />
                    <TextInput
                        placeholder={this.state.fromWhere != "login" ? "Enter verification code" : "Enter OTP"}
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        maxLength={this.state.length}
                        onChangeText={(text) => this.setState({ verificationCode: text })}
                        value={this.state.verificationCode}
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>
                <TouchableOpacity onPress={() => this.verifyCode()} style={{ backgroundColor: "#F49930", height: dynamicSize(45), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: getFontSize(16), fontFamily: fontFamily("bold") }}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.resendCode()} style={{ alignItems: "flex-end", width: "80%" }}>
                    <Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily(), marginTop: dynamicSize(5) }}>{this.state.fromWhere != "login" ? "Resend code?" : "Resend OTP?"}</Text>
                </TouchableOpacity>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    fullview: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    }
});