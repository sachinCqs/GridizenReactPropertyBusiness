import React, { Component } from 'react';
import { Platform, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
const { height, width } = Dimensions.get('window');
import { NodeAPI } from '../services/webservice';
import { dynamicSize, getFontSize, fontFamily } from '../utils/responsive';
import { ErrModal, Spinner, Toast } from '../components/toast';
import { NavigationActions, StackActions } from 'react-navigation';
import { checkUserName, validateEmail, validateFirstName, validateLastName, validatePassword, validateDOB, validatePhoneNo } from '../services/validation';

export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
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
            loginType: '',
            password: '',
            confirmpassword: ''


        };
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
        if (validatePassword(this.state.password).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validatePassword(this.state.password).message) })
        }
        if (this.state.confirmpassword == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please enter confirm password") })
        }
        if (this.state.confirmpassword != this.state.password) {
            this.setState({ errMessageArr: errMessageArr.push("*Password and confirm passowrd does not match.") })
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
                var variables = {
                    password: this.state.password,
                    confirm_password: this.state.confirmpassword
                }
                var data = this.props.navigation.state.params.data
                return NodeAPI(variables, "resetPassword.json", 'POST', data.token, data.id)
                    .then(response => {
                        this.setState({ spinnerVisible: false })
                        setTimeout(() => {
                            if (response.response_code == 'success') {
                                
                                var loginData = { "userid": response.vendorid, "token": response.authtoken }
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
                                // // global.firstLogin = response.first_login
                                // AsyncStorage.setItem("isLoggedin", JSON.stringify("loggedIn"))
                                // var flag = response.userDetail
                                // flag.first_login = response.first_login
                                // AsyncStorage.setItem("userDetail", JSON.stringify(flag))
                                // // this.props.navigation.navigate('Drawer')
                                // const resetAction = StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Drawer' })], });
                                // this.props.navigation.dispatch(resetAction);
                            } else {
                                this.setState({ showToast: true, alertMessage: response.msg })
                                setTimeout(() => {
                                    this.setState({ showToast: false })
                                }, 3000);
                            }
                        }, 300)
                    })
            }
        }, 500);
    }


    render() {
        return (

            <View style={styles.fullview}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Spinner visible={this.state.spinnerVisible} />
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <Image 
                style={{marginTop: dynamicSize(100) }} 
                source={require("../assets/logo-business.png")} />
                <View style={{  paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(100), paddingHorizontal: dynamicSize(10) }}>
                    <Image resizeMode="contain"
                        //style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/padlock.png')} />
                    <TextInput
                        placeholder="New password"
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        maxLength={this.state.length}
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({ password: text })}
                        value={this.state.password}
                    />
                </View>
                <View style={{ paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), paddingHorizontal: dynamicSize(10) }}>
                    <Image resizeMode="contain"
                       //style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/padlock.png')} />
                    <TextInput
                        placeholder="Confirm password"
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        secureTextEntry={this.state.switchImage}
                        maxLength={16}
                        value={this.state.confirmpassword}
                        onChangeText={(text) => this.setState({ confirmpassword: text })}
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