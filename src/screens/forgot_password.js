import React, { Component } from 'react';
import { Platform, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
const { height, width } = Dimensions.get('window');
import { NodeAPI } from '../services/webservice';
import { dynamicSize, getFontSize, fontFamily } from '../utils/responsive';
import { ErrModal, Spinner, Toast } from '../components/toast';
import { NavigationActions, StackActions } from 'react-navigation';

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            ErrModalVisible: false,
            errModalMessage: '',
            showToast: false,
            alertMessage: "",
            loginParameter: '',
            length: 10,
            loginType: ''

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


    verifyCode() {
        if (this.state.loginParameter != '') {


            this.setState({ spinnerVisible: true })

            var variables = {
                username: this.state.loginType == "mobile" ? "+44 " + this.state.loginParameter : this.state.loginParameter
            }
            return NodeAPI(variables, "forgot.json", 'POST')
                .then(response => {
                    this.setState({ spinnerVisible: false })


                    if (response.response_code == 'success') {
                        this.setState({ showToast: true, alertMessage: response.msg })
                        setTimeout(() => {
                            this.setState({ showToast: false })
                            this.props.navigation.goBack()
                        }, 3000);
                      
                        // //var userId = response.userId
                        // this.setState({ showToast: true, alertMessage: response.msg })
                        // setTimeout(() => {
                        //     this.setState({ showToast: false })
                        //     this.props.navigation.goBack()
                        // }, 3000);

                        // this.setState({ username: '', emailOrMobile: '' })
                        // // this.props.navigation.navigate('ResetPassword')
                        // //this.props.navigation.navigate('Verification', { userId: userId })
                    }
                    else if (!response.verify) {
                        global.vendorId = response.vendorId
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Verification' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                       
                    }
                    else {
                        this.setState({ showToast: true, alertMessage: response.msg })
                        setTimeout(() => {
                            this.setState({ showToast: false })
                        }, 3000);
                        // if (response.msg == 'User not verified') {
                        //     this.setState({ emailOrMobile: '' })
                        //     this.props.navigation.navigate('Verification', { userId: response.userId })
                        // }

                    }

                    //alert(JSON.stringify(response));
                })



        } else {
            //alert("Please enter verification code")
            this.setState({
                errModalMessage: "Please enter email or mobile.", ErrModalVisible: true
            })
        }
    }


    render() {
        return (
            <View style={styles.fullview}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <Spinner visible={this.state.spinnerVisible} />
                <Image 
                style={{  marginTop: dynamicSize(100) }}
                 source={require("../assets/logo-business.png")} />
                <View style={{ paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(20), paddingHorizontal: dynamicSize(10), marginTop: dynamicSize(100) }}>
                    <Image resizeMode="contain"
                        //style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/user.png')} />
                    <TextInput
                        placeholder="Email or mobile"
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        maxLength={this.state.length}
                        onChangeText={(text) => this._loginDetails(text)}
                        value={this.state.loginParameter}
                    />
                </View>
                <TouchableOpacity onPress={() => this.verifyCode()} style={{ backgroundColor: "#F49930", height: dynamicSize(45), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: getFontSize(16), fontFamily: fontFamily("bold") }}>Reset Password</Text>
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