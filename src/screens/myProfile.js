import React, { Component } from 'react';
import { Platform, TouchableWithoutFeedback, RefreshControl, ScrollView, Image, AsyncStorage, Dimensions, FlatList, TouchableOpacity, StyleSheet, Text, View, ImageBackground, TextInput, Keyboard } from 'react-native';
import { dynamicSize, getFontSize, dateConverterMMDDYYYY, themeColor, fontFamily } from '../utils/responsive';
const { height, width } = Dimensions.get('window');
import { ErrModal, Toast, Spinner } from '../components/toast';
import { NodeAPI } from '../services/webservice';
import { checkUserName, validateEmail, validateFirstName, validateLastName, validatePassword, validateDOB, validatePhoneNo } from '../services/validation';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux'

class MyProfile extends Component {




    constructor(props) {
        super(props)
        this.state = {
            spinnerVisible: false,
            image: '',
            showToast: false,
            alertMessage: "",
            ErrModalVisible: false,
            errModalMessage: '',
            editable: false,

            refreshing: false,

            filledTextInput: [
                { filled: false },
                { filled: false },
                { filled: false },
                { filled: false },
                { filled: false },
                { filled: false },
                { filled: false },
                { filled: false }
            ],

            email: "",
            mobile: "",
            fname: '',
            lname: '',
            datePickerVisible: false,
            nationality: '',
            street1: '',
            street2: '',
            postCode: '',
            aboutUs: '',
            companyName: '',
            errMessageArr: [],
            DOB: '',
            nationalityArr: ["a", "b", "c", "d"],
            headerData: {},
            postCodeArr: []
        }
    }
    componentWillMount() {
        // var data = this.props.userObject
        // data.name = 'oooooo'
        // this.props.userObjectValue(data)
        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })
            this.hitGetUserDetail(paramData)
        })
    }
    hitGetUserDetail(paramData) {
        // this.setState({ refreshing: true })
        return NodeAPI({}, "getVendorDetail.json", 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, loaderPosition: dynamicSize(10), refreshing: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    console.log(JSON.stringify(responseJson))
                    this.setState({
                        email: responseJson.vendorDetail.email,
                        latitude: responseJson.vendorDetail.lattitude != null ? responseJson.vendorDetail.lattitude : '',
                        longitude: responseJson.vendorDetail.longitude != null ? responseJson.vendorDetail.longitude : '',
                        mobile: responseJson.vendorDetail.mobile_num.split(' ')[1],
                        fname: responseJson.vendorDetail.name,
                        DOB: responseJson.vendorDetail.doi != null ? responseJson.vendorDetail.doi : '',
                        street1: responseJson.vendorDetail.address != null ? responseJson.vendorDetail.address : '',
                        aboutUs: responseJson.vendorDetail.about_us != null ? responseJson.vendorDetail.about_us : '',
                        companyName: responseJson.vendorDetail.company != null ? responseJson.vendorDetail.company : '',
                        postCodeArr: responseJson.vendorDetail.covered != null ? responseJson.vendorDetail.covered.split(',') : [],
                    })
                    responseJson.vendorDetail.image = responseJson.vendorDetail.image != '' ? (responseJson.vendorDetail.image + '?' + new Date()) : ''
                    console.log("-----" + JSON.stringify(this.props.userObject))
                    this.props.userObjectValue(responseJson.vendorDetail)
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
    resetFilledInputs(check) {
        console.log(typeof (check))
        var arr = this.state.filledTextInput;
        arr[check].filled = true;
        this.setState({ filledTextInput: arr })
        // check = check.toString()
        this.refs[check].focus()
    }



    handleOnChange(text, type) {

        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        // if (!pattern.test(text)) {
        if (type == "email") {
            this.setState({ email: text.replace(/[^A-Za-z0-9@._-]/g, ''), emailErr: '' })
        }
        if (type == "phone") {
            if (text == '') this.setState({ mobile: text, phoneErr: '' })
            if (/[0-9]$/.test(text)) {
                this.setState({ mobile: text, phoneErr: '' })
            }
        }
        else if (type == "fName") {
            this.setState({ fname: text.replace(/[^A-Za-z0-9-._ ]/g, ''), fnameErr: '' })
        }
        else if (type == "LName") {
            this.setState({ lname: text.replace(/[^A-Za-z0-9-._]/g, ''), LNameErr: '' })
        }
    }


    _save() {
        // this.refs.aabc.setNativeProps({
        //     borderColor:"red"
        // })
        let { email, fname, mobile, errMessageArr, lname, DOB, nationality, street1, street2 } = this.state;
        errMessageArr = [];
        if (validateEmail(email).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validateEmail(email).message) })
        }
        if (validateFirstName(fname).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validateFirstName(fname).message) })
        }
        if (validatePhoneNo(mobile).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validatePhoneNo(mobile).message) })
        }
        if (DOB == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please select Date of Birth") })
        }

        if (street1 == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please enter address") })
        }

        if (errMessageArr.length != 0) {
            if (errMessageArr.length == 1) {
                this.setState({
                    errModalMessage: errMessageArr[0], ErrModalVisible: true
                })
            }
            else {
                if (email == '' || mobile == '' || fname == '' || DOB == '' || street1 == '') {
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
                var variables = {
                    email: this.state.email,
                    name: this.state.fname.trim(),
                    image: this.props.userObject.image,
                    category_id: '452',
                    lattitude: this.state.latitude,
                    longitude: this.state.longitude,
                    mobile_num: "+44 " + this.state.mobile,
                    country: 'UK',
                    address: this.state.street1.trim(),
                    zip: '125',
                    //doi: new Date('2018-08-06').getTime(),
                    doi: this.state.DOB,
                    address1: '123',
                    about_us: '123',
                    covered: '',
                    company: ''

                }
                this.setState({ spinnerVisible: true })
                this.hitSaveUserDetailAPI(variables)

            }
        }, 500)
    }
    saveOfAgent() {
        let { email, fname, mobile, errMessageArr, lname, DOB, nationality, street1, street2, companyName, aboutUs } = this.state;
        errMessageArr = [];
        if (validateEmail(email).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validateEmail(email).message) })
        }
        if (validateFirstName(fname).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validateFirstName(fname).message) })
        }
        if (validatePhoneNo(mobile).status !== true) {
            this.setState({ errMessageArr: errMessageArr.push(validatePhoneNo(mobile).message) })
        }
        if (DOB == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please select DOI") })
        }
        if (companyName == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please enter company name") })
        }
        if (street1 == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please enter address") })
        }
        if (aboutUs == '') {
            this.setState({ errMessageArr: errMessageArr.push("*Please enter description") })
        }
        if (this.state.postCodeArr.length == 0) {
            this.setState({ errMessageArr: errMessageArr.push("*Please enter area catered") })
        }
        if (errMessageArr.length != 0) {
            if (errMessageArr.length == 1) {
                this.setState({
                    errModalMessage: errMessageArr[0], ErrModalVisible: true
                })
            }
            else {
                if (email == '' || mobile == '' || fname == '' || DOB == '' || street1 == '' || aboutUs == '' || companyName == '') {
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
                var variables = {
                    email: this.state.email,
                    name: this.state.fname.trim(),
                    image: this.props.userObject.image,
                    category_id: '452',
                    lattitude: this.state.latitude,
                    longitude: this.state.longitude,
                    mobile_num: "+44 " + this.state.mobile,
                    country: 'UK',
                    address: this.state.street1.trim(),
                    zip: '125',
                    company: this.state.companyName,
                    //doi: new Date('2018-08-06').getTime(),
                    doi: this.state.DOB,
                    address1: '123',
                    covered: this.state.postCodeArr.join(),
                    about_us: this.state.aboutUs,

                }
                this.setState({ spinnerVisible: true })
                this.hitSaveUserDetailAPI(variables)


            }
        }, 500)
    }
    hitSaveUserDetailAPI(vendor_req) {
        return NodeAPI(vendor_req, 'update.json', 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code == 'success') {
                    this.setState({ editMode: false })

                    this.setState({ showToast: true, alertMessage: responseJson.msg, editable: false })
                    setTimeout(() => {
                        this.setState({ showToast: false })

                    }, 3000);
                } else {
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })

                    }, 3000);
                }
            })

    }
    _handleDatePicked(date) {
        let d = new Date(date)
        let Year = d.getFullYear();
        let Month = d.getMonth();
        let MonthString = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
        let Day = (d.getDate()) < 10 ? '0' + (d.getDate()) : (d.getDate());
        // alert(Year + "-" + MonthString + "-" + Day)
        this.setState({ DOB: Year + "-" + MonthString + "-" + Day })
    }
    deletePostCode(index) {
        var arr = this.state.postCodeArr
        arr.splice(index, 1);
        this.setState({ postCodeArr: arr })
    }
    showList(item, index) {
        return (
            <View style={{ marginVertical: dynamicSize(5), backgroundColor: 'white', borderRadius: dynamicSize(6), borderColor: themeColor, borderWidth: 1, padding: dynamicSize(10), flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: themeColor, fontSize: getFontSize(14), fontFamily: fontFamily() }}>{item}</Text>
                {this.state.editable ?
                    <TouchableOpacity onPress={() => this.deletePostCode(index)}>
                        <Image style={{ height: dynamicSize(15), width: dynamicSize(15) }}
                            source={require('../assets/error.png')} />
                    </TouchableOpacity>
                    : null
                }
            </View>
        )
    }
    addPostCode() {
        var arr = this.state.postCodeArr
        arr.push(this.state.postCode)
        this.setState({ postCodeArr: arr, postCode: '' })
    }
    updateData = (details) => {
        this.setState({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            street1: details.name + "," + details.formatted_address

        })


    }
    render() {
        return (
            <View style={styles.fullView}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Spinner visible={this.state.spinnerVisible} />
                <DateTimePicker
                    isVisible={this.state.datePickerVisible}
                    onConfirm={(date) => this._handleDatePicked(date)}
                    onCancel={() => this.setState({ datePickerVisible: false })}
                    mode="date"
                    maximumDate={new Date()}
                    is24Hour={false}
                //datePickerContainerStyleIOS={styles.datepickeriosstyle}
                />
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <View style={{ width: width, height: dynamicSize(50), flexDirection: 'row', borderTopColor: '#e7e7e7', borderBottomColor: '#e7e7e7', borderTopWidth: 0.5, borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}
                        style={{ alignItems: 'center', justifyContent: 'center', height: dynamicSize(50), marginHorizontal: dynamicSize(15) }}>
                        <Image resizeMode='contain'
                            style={{ tintColor: '#7a7a7a' }}
                            source={require('../assets/backArrow.png')} />
                    </TouchableOpacity>


                    <View
                        style={{ flex: 1, height: dynamicSize(49), alignItems: 'flex-start', justifyContent: 'center', }}>

                        <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(18), color: '#7a7a7a' }}>My Profile</Text>

                    </View>
                    {/* <TouchableOpacity 
                        style={{  alignItems: 'center', justifyContent: 'center', height: dynamicSize(50),marginHorizontal:dynamicSize(15) }}>
                        <Image resizeMode='contain' style={{tintColor:'transparent'}}
                            source={require('../assets/backArrow.png')} />
                    </TouchableOpacity> */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', width: '100%', paddingVertical: dynamicSize(10), paddingHorizontal: dynamicSize(15), borderTopColor: '#f5f5f5', borderBottomColor: '#f5f5f5', borderBottomWidth: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('ProfilePic')}
                            style={{ height: dynamicSize(32), width: dynamicSize(32), borderRadius: dynamicSize(16), borderWidth: 1, borderColor: '#e7e7e7', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                resizeMode='cover'
                                style={{ height: dynamicSize(30), width: dynamicSize(30), borderRadius: dynamicSize(15), }}
                                source={(this.props.userObject.image && this.props.userObject.image != '') ? { uri: this.props.userObject.image } :
                                    require('../assets/userProfile.png')
                                } />
                        </TouchableOpacity>
                        <View style={{ marginLeft: dynamicSize(10) }}>
                            <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(15), color: themeColor }}>{this.props.userObject.name || ''}</Text>
                            <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(12), color: '#7a7a7a' }}>{this.props.userObject.email}</Text>

                        </View>
                    </View>
                    {/* {!this.state.editable ? */}
                    <TouchableOpacity
                        onPress={() => !this.state.editable ? this.setState({ editable: true }) : null}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Image resizeMode='contain' style={{ tintColor: themeColor, marginRight: dynamicSize(3) }}
                            source={this.state.editable ? require('../assets/checked.png') : require('../assets/unchecked.png')} />
                        <Text style={{ textAlign: "right", fontFamily: fontFamily(), fontSize: getFontSize(10) }}>EDIT</Text>
                    </TouchableOpacity>
                    {/* : null
                    } */}
                </View>
                <ScrollView
                    style={{}}
                    keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={400}

                >

                    <View ref="aabc" style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(15), paddingHorizontal: dynamicSize(5) }}>
                        <TextInput
                            placeholder="Email"
                            style={{ fontSize: getFontSize(12), flex: 1, fontFamily: fontFamily('bold'), color: '#7a7a7a' }}
                            placeholderTextColor="#ABACAE"
                            onChangeText={(text) => this.handleOnChange(text.trim(), "email")}
                            value={this.state.email}
                            editable={false}
                            onSubmitEditing={() => this.refs.mobile.focus()}
                            maxLength={100}
                        />
                    </View>

                    <View style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5) }}>
                        <TextInput
                            placeholder="Mobile"
                            style={{ fontSize: getFontSize(12), color: '#7a7a7a', flex: 1, fontFamily: fontFamily('bold') }}
                            placeholderTextColor="#ABACAE"
                            onChangeText={(text) => this.handleOnChange(text.trim(), "phone")}
                            value={this.state.mobile}
                            editable={this.state.editable}
                            keyboardType='number-pad'
                            ref="mobile"
                            onSubmitEditing={() => this.refs.fname.focus()}
                            maxLength={10}
                        />
                    </View>

                    <View style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5) }}>
                        <TextInput
                            placeholder="Full Name"
                            style={{ fontSize: getFontSize(12), color: '#7a7a7a', flex: 1, fontFamily: fontFamily('bold') }}
                            placeholderTextColor="#ABACAE"
                            onChangeText={(text) => this.handleOnChange(text, "fName")}
                            value={this.state.fname}
                            editable={this.state.editable}
                            ref="fname"
                            onSubmitEditing={() => this.state.headerData.type && this.state.headerData.type == '2' ? this.refs.cname.focus() : this.refs.bday.focus()}
                            maxLength={35}
                        />
                    </View>

                    {
                        this.state.headerData.type && this.state.headerData.type == '2' ?
                            <View style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5) }}>
                                <TextInput
                                    placeholder="Company Name"
                                    style={{ fontSize: getFontSize(12), color: '#7a7a7a', flex: 1, fontFamily: fontFamily('bold') }}
                                    placeholderTextColor="#ABACAE"
                                    onChangeText={(text) => this.setState({ companyName: text })}
                                    value={this.state.companyName}
                                    editable={this.state.editable}
                                    ref="cname"
                                    onSubmitEditing={() => this.refs.bday.focus()}
                                    maxLength={35}
                                />
                            </View>
                            : null
                    }

                    <TouchableOpacity onPress={() => this.state.editable ? this.setState({ datePickerVisible: true }) : null} style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5) }}>
                        <TextInput
                            placeholder={this.state.headerData.type && this.state.headerData.type == '2' ? 'DOI' : "Birthday"}
                            style={{ fontSize: getFontSize(12), color: '#7a7a7a', flex: 1, fontFamily: fontFamily('bold') }}
                            placeholderTextColor="#ABACAE"
                            onChangeText={(text) => this.setState({ bday: text })}
                            value={this.state.DOB}
                            editable={this.state.editable}
                            ref="bday"
                            onSubmitEditing={() => this.refs.street1.focus()}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {/* <View style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5) }}>
                        <TextInput
                            placeholder="Nationality"
                            style={{ fontSize: getFontSize(12), color: '#7a7a7a', flex: 1, fontFamily: fontFamily('bold') }}
                            placeholderTextColor="#ABACAE"
                            onChangeText={(text) => this.setState({ nationality: text })}
                            value={this.state.nationality}
                            editable={this.state.editable}
                            ref="nationality"
                            onSubmitEditing={() => this.refs.street1.focus()}
                        />
                    </View> */}

                    <TouchableOpacity
                        onPress={() => this.state.editable ? this.props.navigation.navigate("GoogleAutoCompleteList", { title: 'Select Address', onGoBack: (data) => this.updateData(data), data: { textInputPlaceHolder: 'Enter City', textInputTitle: '' } }) : null}
                        style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5) }}>
                        <TextInput
                            placeholder="Address"
                            style={{ fontSize: getFontSize(12), color: '#7a7a7a', flex: 1, fontFamily: fontFamily('bold') }}
                            placeholderTextColor="#ABACAE"
                            onChangeText={(text) => this.setState({ street1: text })}
                            value={this.state.street1}
                            editable={false}
                            multiline
                            ref="street1"
                            onSubmitEditing={() => this.state.headerData.type && this.state.headerData.type == '2' ? this.refs.about.focus() : Keyboard.dismiss()}
                        />
                    </TouchableOpacity>
                    {this.state.headerData.type && this.state.headerData.type == '2' ?
                        <View style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5), minHeight: dynamicSize(80), maxHeight: dynamicSize(120), alignItems: 'flex-start' }}>
                            <TextInput
                                placeholder="About us"
                                multiline
                                style={{ fontSize: getFontSize(12), color: '#7a7a7a', flex: 1, fontFamily: fontFamily('bold') }}
                                placeholderTextColor="#ABACAE"
                                onChangeText={(text) => this.setState({ aboutUs: text })}
                                value={this.state.aboutUs}
                                editable={this.state.editable}
                                ref="about"
                            //onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </View>
                        : null}
                    {/* <View style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5) }}>
                        <TextInput
                            placeholder="Street 2"
                            style={{ fontSize: getFontSize(12), color: '#7a7a7a', flex: 1, fontFamily: fontFamily('bold') }}
                            placeholderTextColor="#ABACAE"
                            onChangeText={(text) => this.setState({ street2: text })}
                            value={this.state.street2}
                            editable={this.state.editable}
                            ref="street2"
                        />
                    </View> */}
                    {this.state.headerData.type && this.state.headerData.type == '2' ?
                        <View>
                            <View style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(0), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5), marginBottom: dynamicSize(5) }}>
                                <Text style={{ color: '#7a7a7a', fontSize: getFontSize(14), fontFamily: fontFamily('bold') }}>Area Catered :</Text>

                            </View>

                            <View style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(0), marginTop: dynamicSize(0), paddingHorizontal: dynamicSize(5), marginBottom: dynamicSize(10) }}>
                                <FlatList
                                    data={this.state.postCodeArr}
                                    renderItem={({ item, index }) => this.showList(item, index)}
                                    keyExtractor={(item, index) => index}
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={true}


                                    extraData={this.state}
                                    ref={(scroller) => { this.scroller = scroller }}
                                />
                            </View>

                        </View>
                        : null}
                    {this.state.headerData.type && this.state.headerData.type == '2' ?
                        <View>
                            {this.state.editable ?
                                <View style={{ paddingVertical: dynamicSize(3), alignSelf: "center", flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(7), paddingHorizontal: dynamicSize(5), marginBottom: dynamicSize(10) }}>
                                    <TextInput
                                        placeholder="Enter Post Code"
                                        style={{ fontSize: getFontSize(12), color: '#7a7a7a', flex: 1, fontFamily: fontFamily('bold') }}
                                        placeholderTextColor="#ABACAE"
                                        onChangeText={(text) => this.setState({ postCode: text })}
                                        value={this.state.postCode}
                                        editable={this.state.editable}
                                        ref="street1"
                                        onSubmitEditing={() => this.state.headerData.type && this.state.headerData.type == '2' ? this.refs.about.focus() : Keyboard.dismiss()}
                                    />
                                    <TouchableOpacity
                                        onPress={() => this.addPostCode()}
                                        style={{ backgroundColor: themeColor }}>
                                        <Text style={{ color: 'white', fontSize: getFontSize(10), fontFamily: fontFamily(), margin: dynamicSize(10) }}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                                : null}
                        </View>
                        : null}
                    {this.state.editable ?
                        <TouchableOpacity
                            onPress={() =>
                                this.state.headerData.type && this.state.headerData.type == '2' ?
                                    this.saveOfAgent()
                                    :
                                    this._save()
                            }
                            style={{ backgroundColor: "#F49930", alignSelf: "center", height: dynamicSize(45), flexDirection: "row", alignItems: "center", width: width - dynamicSize(30), borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(10), justifyContent: "center", marginBottom: dynamicSize(15) }}>
                            <Text style={{ color: "white", fontSize: getFontSize(16), fontFamily: fontFamily("bold") }}>Save</Text>
                        </TouchableOpacity>
                        : null}


                </ScrollView>



            </View >
            // <Image resizeMode="stretch" source={require('../assets/icons/businessDashboard.jpg')} style={{flex:1}}/>
        )
    }
}

const styles = StyleSheet.create({
    fullView: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: "#fff"
    },
});

function mapStateToProps(state) {
    return {

        userObject: state.userObject
    }
}

function mapDispatchToPops(dispatch) {
    return {

        userObjectValue: (value) => dispatch({ type: 'userObject', value: value }),
    }
}

export default connect(mapStateToProps, mapDispatchToPops)(MyProfile);