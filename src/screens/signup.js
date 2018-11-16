import React, { Component } from 'react';
import { Platform, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
const { height, width } = Dimensions.get('window');
import { NodeAPI } from '../services/webservice';
import { dynamicSize, getFontSize, fontFamily } from '../utils/responsive';
import { ErrModal, Spinner, Toast } from '../components/toast';
import { checkUserName, validateEmail, validateFirstName, validateLastName, validatePassword, validateDOB, validatePhoneNo } from '../services/validation';
import { NavigationActions, StackActions } from 'react-navigation';

export default class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            switchImage: true,
            email: '',
            emailErr: '',
            phone: '',
            phoneErr: '',
            fName: '',
            fnameErr: '',
            userName: '',
            userNameErr: '',
            Password: '',
            passwordErr: '',
            ErrModalVisible: false,
            errModalMessage: '',
            errMessageArr: [],
            userTypeSelected: this.props.navigation.state.params.type,
            spinnerVisible: false,
            showToast: false,
            alertMessage: ""

        };
    }


    handleOnChange(text, type) {

        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        // if (!pattern.test(text)) {
        if (type == "email") {
            this.setState({ email: text.replace(/[^A-Za-z0-9@._-]/g, ''), emailErr: '' })
        }
        if (type == "phone") {
            if (text == '') this.setState({ phone: text, phoneErr: '' })
            if (/[0-9]$/.test(text)) {
                this.setState({ phone: text, phoneErr: '' })
            }
        }
        else if (type == "fName") {
            this.setState({ fName: text.replace(/[^A-Za-z0-9-._]/g, ''), fnameErr: '' })
        }
        // } else if (type == "username") {
        //     this.setState({ userName: text.replace(/[^A-Za-z0-9-._]/g, ''), userNameErr: '' })
        // }
        else if (type == "password") {
            this.setState({ password: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''), passwordErr: '' })
        }

    }




    signup() {

        let { email, password, fName, phone, errMessageArr } = this.state;
        errMessageArr = [];
        // if (checkUserName(userName).status !== true) {
        //     this.setState({ errMessageArr: errMessageArr.push(checkUserName(userName).message) })
        // }
        if (validateEmail(email).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validateEmail(email).message) })
        }
        if (validateFirstName(fName).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validateFirstName(fName).message) })
        }
        if (validatePhoneNo(phone).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validatePhoneNo(phone).message) })
        }
        if (validatePassword(password).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validatePassword(password).message) })
        }
        if (errMessageArr.length != 0) {
            if (errMessageArr.length == 1) {
                this.setState({
                    errModalMessage: errMessageArr[0], ErrModalVisible: true
                })
            }
            else {
                if (email == '' || password == '' || fName == '' || phone == '') {
                    this.setState({
                        errModalMessage: 'Please enter all the credentials.', ErrModalVisible: true
                    })
                    
                } else {
                    this.setState({
                        errModalMessage: "Please enter valid credentials.", ErrModalVisible: true
                    })
                }
            }
        }
        console.log("aaa-->", errMessageArr)
        setTimeout(() => {

            if (errMessageArr.length == 0) {
                this.setState({ spinnerVisible: true })
                var check = this.state.userTypeSelected;
                var typearr = []
                check.landlordSelected ? typearr.push(0) : null;
                check.blockSelected ? typearr.push(1) : null;
                check.agentSelected ? typearr.push(2) : null;
                check.developerSelected ? typearr.push(3) : null;


                var variables = {
                    email: this.state.email,
                    password: this.state.password,
                    name: this.state.fName,
                    mobile_num: "+44 " + this.state.phone,
                    type: typearr,
                    business_type: 0
                }

                return NodeAPI(variables, "register.json", 'POST')
                    .then(response => {
                        console.log("test==>" + JSON.stringify(response))
                        this.setState({ spinnerVisible: false })
                        if (response.response_code == 'success') {
                            global.vendorId = response.vendorId
                            
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'Verification' })],
                            });
                            this.props.navigation.dispatch(resetAction);
                            // this.props.navigation.navigate("Verification", { vendorId: response.vendorId })
                        } else {
                            this.setState({ showToast: true, alertMessage: response.msg })
                            setTimeout(() => {
                                this.setState({ showToast: false })
                            }, 3000);
                        }
                        //alert(JSON.stringify(response));
                    })

                //this.props.navigation.navigate('Verification')
                //this.setState({passwordErr: '', emailErr: '', emailStatus: false, passwordStatus: false})
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
                // style={{ tintColor: "#56B24D", height: dynamicSize(54), width: dynamicSize(200) }} 
                source={require("../assets/logo-business.png")} />
                <View style={{ paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(20), paddingHorizontal: dynamicSize(10) }}>
                    <Image resizeMode="contain"
                        //style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/username.png')} />
                    <TextInput
                        placeholder="Email"
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        maxLength={100}
                        value={this.state.email}
                        onChangeText={(text) => this.handleOnChange(text.trim(), "email")}

                    />
                </View>
                <View style={{ paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), paddingHorizontal: dynamicSize(10) }}>
                    <Image resizeMode="contain"
                        //style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/phoneEmail.png')} />
                    <TextInput
                        placeholder="Mobile"
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        maxLength={10}
                        value={this.state.phone}
                        onChangeText={(text) => this.handleOnChange(text.trim(), "phone")}

                    />
                </View>
                <View style={{ paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), paddingHorizontal: dynamicSize(10) }}>
                    <Image resizeMode="contain"
                        //style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/user.png')} />
                    <TextInput
                        placeholder="Business Name"
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        maxLength={64}
                        value={this.state.fName}
                        onChangeText={(text) => this.handleOnChange(text.trim(), "fName")}
                    />
                </View>
                {/* <View style={{ paddingVertical: dynamicSize(3), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), paddingHorizontal: dynamicSize(10) }}>
                    <Image resizeMode="contain"
                        style={{ height: dynamicSize(25), width: dynamicSize(25) }}
                        source={require('../assets/logimages.png')} />
                    <TextInput
                        placeholder="Username"
                        style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily() }}
                        placeholderTextColor="#ABACAE"
                        maxLength={16}
                        value={this.state.userName}
                        onChangeText={(text) => this.handleOnChange(text.trim(), "username")}

                    />
                </View> */}
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
                        onChangeText={(text) => this.handleOnChange(text.trim(), "password")}

                    />
                    <TouchableOpacity onPress={() => this.setState({ switchImage: !this.state.switchImage })}>
                        <Image resizeMode="contain"
                            style={{ height: dynamicSize(30), width: dynamicSize(30), marginLeft: dynamicSize(10) }}
                            source={this.state.switchImage ? require('../assets/eye_h.png') : require('../assets/eye_v.png')} />
                    </TouchableOpacity>

                </View>
                <TouchableOpacity onPress={() => this.signup()} style={{ backgroundColor: "#F49930", height: dynamicSize(45), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: getFontSize(16), fontFamily: fontFamily("bold") }}> Sign Up</Text>
                </TouchableOpacity>

                <View style={{ marginTop: dynamicSize(20), width: "85%", alignItems: "center" }}>
                    <Text style={{ fontSize: getFontSize(12), color: "#929395", fontFamily: fontFamily() }}>By signing up, you agree to our</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity>
                            <Text style={{ color: "#A5A5A5", fontSize: getFontSize(12), fontFamily: fontFamily("bold") }}>Terms Data policy</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: getFontSize(12), color: "#929395" }}> and </Text>
                        <TouchableOpacity>
                            <Text style={{ color: "#A5A5A5", fontSize: getFontSize(12), fontFamily: fontFamily("bold") }}>Cookies policy</Text>
                        </TouchableOpacity>

                    </View>

                </View>

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
                <TouchableOpacity onPress={() => this.props.navigation.popToTop()} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: dynamicSize(40), width: "100%", borderTopColor: "#E9E9E9", borderTopWidth: dynamicSize(1), justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: getFontSize(12), fontFamily: fontFamily(), color: "#929395" }}>Have an account? <Text style={{ fontFamily: fontFamily("bold"), color: "#A5A5A5", fontSize: getFontSize(12) }}>Signin</Text></Text>
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