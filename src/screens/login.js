import React, { Component } from 'react';
import { AsyncStorage, BackHandler, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
const { height, width } = Dimensions.get('window');
import { NodeAPI } from '../services/webservice';
import { dynamicSize, getFontSize, fontFamily } from '../utils/responsive';
import { ErrModal, Spinner, Toast } from '../components/toast';
import { NavigationActions, StackActions } from 'react-navigation';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            switchImage: true,
            loginParameter: '',
            length: 10,
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            ErrModalVisible: false,
            errModalMessage: '',
            errMessageArr: [],
            password: '',
            loginType: ''


        };
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        BackHandler.exitApp();
        return true;
    }
    _loginDetails(text) {
        if (text == '') this.setState({ loginParameter: '' })
        if (/[0-9]$/.test(text.split('')[0])) {
            if (/[0-9]$/.test(text)) {
                this.setState({ loginParameter: text, length: 10, loginType: "mobile" })
            }
        }
        else {
            this.setState({
                loginParameter: text.replace(/[^A-Za-z0-9@._-]/g, ''), length: 100, loginType: "email"
            })
        }
    }

    login() {
        // if (this.state.email.length >= 1 && this.state.password.length >= 1) {
        let { errMessageArr } = this.state;
        errMessageArr = [];
        if (this.state.loginParameter == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please enter email or mobile.") })
        }
        if (this.state.password == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please enter password.") })
        }
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
        console.log("aaa-->", errMessageArr)
        setTimeout(() => {
            if (errMessageArr.length == 0) {
                this.setState({ spinnerVisible: true })
                var variables = { username: this.state.loginType == "mobile" ? "+44 " + this.state.loginParameter : this.state.loginParameter, password: this.state.password }
                return NodeAPI(variables, "login.json", 'POST')
                    .then(response => {
                        this.setState({ spinnerVisible: false })
                        if (response.response_code == 'success') {

                            if (response.is_tmppassword) {
                                this.props.navigation.navigate("ResetPassword", {
                                    data: { token: response.authtoken, id: response.vendorid }
                                })
                            }
                            else {
                                var loginData = { "userid": response.vendorid, "token": response.authtoken, type: response.vendorDetail.type }
                                AsyncStorage.setItem("headerData", JSON.stringify(loginData))
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


                            }

                            // // global.firstLogin = response.first_login
                            // var loginData = { "userid": response.userid, "token": response.authtoken }
                            // AsyncStorage.setItem("headerData", JSON.stringify(loginData))

                            // if (response.is_tmppassword) {
                            //     const resetAction = StackActions.reset({
                            //         index: 0,
                            //         actions: [NavigationActions.navigate({ routeName: 'ResetPassword' })],
                            //     });
                            //     this.props.navigation.dispatch(resetAction);
                            //     // this.props.navigation.navigate('ResetPassword')

                            // }  // if user use temporary password navigate to reset password.
                            // else { // navigate to dashboard
                            //     AsyncStorage.setItem("isLoggedin", JSON.stringify("loggedIn"))
                            //     var flag = response.userDetail
                            //     flag.first_login = response.first_login
                            //     AsyncStorage.setItem("userDetail", JSON.stringify(flag))
                            //     // this.props.navigation.navigate('Drawer')
                            //     const resetAction = StackActions.reset({
                            //         index: 0,
                            //         actions: [NavigationActions.navigate({ routeName: 'Drawer' })],
                            //     });
                            //     this.props.navigation.dispatch(resetAction);
                            // }
                            // this.setState({ passwordErr: '', emailErr: '', emailStatus: false, passwordStatus: false, password: '', email: '' })

                        }
                        else if (response.response_code == "600") {
                            global.vendorId = response.userid
                            this.setState({ showToast: true, alertMessage: response.msg })
                            setTimeout(() => {
                                this.setState({ showToast: false })
                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'Verification' })],
                                });
                                this.props.navigation.dispatch(resetAction);
                            }, 3000);


                        }
                        // else if (response.response_code == 600) {  // if user email is not verified, naviagte to verify screen.
                        //     this.setState({ showToast: true, alertMessage: response.msg })
                        //     setTimeout(() => {
                        //         this.setState({ showToast: false })
                        //     }, 3000);
                        //     this.props.navigation.navigate('Verification', { userId: response.userid })
                        //     this.setState({ email: '', password: '', passwordErr: '', emailErr: '', remenberMe: false })
                        // }
                        else {
                            this.setState({ showToast: true, alertMessage: response.msg })
                            setTimeout(() => {
                                this.setState({ showToast: false })
                            }, 3000);
                        }
                    })
            }
        }, 500)
        // }
    }

    _sendOTP() {
        this.setState({ spinnerVisible: true })
        var variables = { mobile_num: "+44 " + this.state.loginParameter }
        return NodeAPI(variables, "loginByMobile.json", 'POST')
            .then(response => {
                console.log("hello", response)
                this.setState({ spinnerVisible: false })
                if (response.response_code == 'success') {
                    this.setState({ showToast: true, alertMessage: response.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                    }, 3000);
                    global.fromWhere = "login"
                    global.vendorId = response.vendorid
                    global.mobileNo = "+44 " + this.state.loginParameter
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

    render() {
        return (

            <View style={styles.fullview}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Spinner visible={this.state.spinnerVisible} />
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <Image
                    //style={{ tintColor: "#56B24D", height: dynamicSize(54), width: dynamicSize(200) }} 
                    source={require("../assets/logo-business.png")} />
                <View style={{ paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(20), paddingHorizontal: dynamicSize(10) }}>
                    <Image resizeMode="contain"
                        //style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/user.png')} />
                    <TextInput
                        placeholder="Mobile or email"
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        maxLength={this.state.length}
                        onChangeText={(text) => this._loginDetails(text)}
                        value={this.state.loginParameter}
                    />
                </View>
                <View style={{ paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), paddingHorizontal: dynamicSize(10) }}>
                    <Image resizeMode="contain"
                        //style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/padlock.png')} />
                    <TextInput
                        placeholder="Password"
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        secureTextEntry={this.state.switchImage}
                        maxLength={16}
                        value={this.state.password}
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                    <TouchableOpacity onPress={() => this.setState({ switchImage: !this.state.switchImage })}>
                        <Image resizeMode="contain"
                            style={{ height: dynamicSize(30), width: dynamicSize(30), marginLeft: dynamicSize(10) }}
                            source={this.state.switchImage ? require('../assets/eye_h.png') : require('../assets/eye_v.png')} />
                    </TouchableOpacity>

                </View>
                <TouchableOpacity onPress={() => this.login()} style={{ backgroundColor: "#F49930", height: dynamicSize(45), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: getFontSize(16), fontFamily: fontFamily("bold") }}> Sign In</Text>
                </TouchableOpacity>

                {this.state.loginType == "mobile" && this.state.loginParameter.length == 10 ?
                    <View style={{ width: "80%" }}>
                        <TouchableOpacity onPress={() => this._sendOTP()}>
                            <Text style={{ textAlign: "right", fontFamily: fontFamily("bold"), marginTop: dynamicSize(10) }}>Login with OTP?</Text>
                        </TouchableOpacity>
                    </View>
                    : null}

                <TouchableOpacity onPress={() => this.props.navigation.navigate("ForgorPassword")} style={{ marginTop: dynamicSize(20), width: "85%", alignItems: "center" }}>
                    <Text style={{ fontSize: getFontSize(12), color: "#929395", fontFamily: fontFamily() }}>Forgotten your login details? <Text style={{ color: "#A5A5A5", fontSize: getFontSize(12), fontFamily: fontFamily("bold") }}>Get help with Signing in</Text></Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", alignItems: "center", width: "85%", marginTop: dynamicSize(10) }}>
                    <View style={{ height: dynamicSize(1), backgroundColor: "#C8C8C8", flex: 1 }} />
                    <Text style={{ marginHorizontal: dynamicSize(10), fontSize: getFontSize(14), color: "#9FA3A4", fontFamily: fontFamily("bold") }}>
                        OR
                    </Text>
                    <View style={{ height: dynamicSize(1), backgroundColor: "#C8C8C8", flex: 1 }} />

                </View>


                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "85%", marginTop: dynamicSize(10) }}>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image eMode="contain"
                            style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                            source={require('../assets/Facebook_Login_Btn.png')} />
                        <Text style={{ marginLeft: dynamicSize(10), color: "#435992", fontSize: getFontSize(13), fontFamily: fontFamily() }}>Login with Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image eMode="contain"
                            style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                            source={require('../assets/Google_Plus.png')} />
                        <Text style={{ marginLeft: dynamicSize(10), color: "#B86253", fontSize: getFontSize(13), fontFamily: fontFamily() }}>Login with Google</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate("UserType")} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: dynamicSize(40), width: "100%", borderTopColor: "#E9E9E9", borderTopWidth: dynamicSize(1), justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: getFontSize(12), color: "#929395", fontFamily: fontFamily() }}>Don't have an account? <Text style={{ color: "#A5A5A5", fontSize: getFontSize(12), fontFamily: fontFamily("bold") }}>Signup</Text></Text>
                </TouchableOpacity>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    fullview: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    }
});