import React, { Component } from 'react';
import { Platform, TouchableWithoutFeedback, RefreshControl, ScrollView, Image, AsyncStorage, Dimensions, FlatList, TouchableOpacity, StyleSheet, Text, View, ImageBackground, TextInput, Keyboard } from 'react-native';
import { dynamicSize, getFontSize, dateConverterMMDDYYYY, themeColor, orange, fontFamily } from '../utils/responsive';
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

            showToast: false,
            alertMessage: "",
            ErrModalVisible: false,
            errModalMessage: '',
            enterMoney: '',
            showTopUpView: false,

            datePickerVisible: false,

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

            })

        })
    }
    onChange(text, type) {
        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        if (type === 'enterMoney') {
            if (!pattern.test(text)) {
                this.setState({
                    enterMoney: text.replace(/[^0-9".]/g, ''),
                });
            }
        }
    }
    showTopUpView() {
        return (
            <View style={styles.addWalletBalance}>
                <View style={styles.inputView} >
                    <Text style={{ color: '#60A85D', fontSize: getFontSize(14), fontFamily: fontFamily(), paddingVertical: dynamicSize(10) }}>   £   </Text>
                    <View style={{ height: dynamicSize(25), width: 1, backgroundColor: '#E7E7E7', alignSelf: 'center' }} ></View>
                    <TextInput
                        style={styles.txtinput}
                        placeholder='Add Money '
                        placeholderTextColor='#838383'
                        keyboardType={'decimal-pad'}
                        maxLength={20}
                        onChangeText={(text) => this.onChange(text, "enterMoney")}
                        value={this.state.enterMoney}

                    />
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => this.setState({ enterMoney: '' + 10 })}
                        style={styles.addMoney}>
                        <Text style={styles.addMoneyTxt} >+£10</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({ enterMoney: '' + 50 })}
                        style={styles.addMoney1}>
                        <Text style={styles.addMoneyTxt} >+£50</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({ enterMoney: '' + 100 })}
                        style={styles.addMoney}>
                        <Text style={styles.addMoneyTxt} >+£100</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
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

                        <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(18), color: '#7a7a7a' }}>My Wallet</Text>

                    </View>
                    {/* <TouchableOpacity 
                        style={{  alignItems: 'center', justifyContent: 'center', height: dynamicSize(50),marginHorizontal:dynamicSize(15) }}>
                        <Image resizeMode='contain' style={{tintColor:'transparent'}}
                            source={require('../assets/backArrow.png')} />
                    </TouchableOpacity> */}
                </View>
                <View style={{ padding: dynamicSize(15), borderBottomColor: '#e7e7e7', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(16), color: '#7a7a7a' }}>Balance</Text>
                    <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(16), color: themeColor }}>£90</Text>
                </View>
                <View style={{ padding: dynamicSize(15), borderBottomColor: '#e7e7e7', borderBottomWidth: 1, }}>
                    {
                        this.state.showTopUpView ?
                            this.showTopUpView()
                            : null
                    }
                    <View style={{ paddingBottom: dynamicSize(15), paddingTop: this.state.showTopUpView ? dynamicSize(5) : dynamicSize(15), flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ showTopUpView: !this.state.showTopUpView })}
                        >
                            <View
                                onPress={() => this.setState({ showTopUpView: !this.state.showTopUpView })}
                                style={{ backgroundColor: orange, flex: 1, padding: dynamicSize(15), alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(16), color: 'white' }}>{this.state.showTopUpView ? 'ADD' : 'TOP UP'}</Text>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>


                </View >
            </View>
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
    walletBalance: {
        flexDirection: 'row',
        paddingVertical: dynamicSize(8),
        marginTop: dynamicSize(15),
        marginHorizontal: dynamicSize(15),
        justifyContent: "space-between",
        alignItems: "center"
    },
    addWalletBalance: {
        margin: dynamicSize(10),
        marginBottom: dynamicSize(5)
    },
    txtinput: {
        color: '#838383',
        paddingVertical: dynamicSize(8),
        fontSize: getFontSize(14),
        fontFamily: fontFamily(),
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: fontFamily()
    },
    addMoney: {
        flex: 1,
        height: dynamicSize(30),
        borderWidth: dynamicSize(1),
        marginTop: dynamicSize(15),
        borderColor: themeColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addMoney1: {
        flex: 1,
        height: dynamicSize(30),
        borderWidth: dynamicSize(1),
        margin: dynamicSize(15),
        borderColor: themeColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addMoneyTxt: {
        fontSize: getFontSize(14),
        fontFamily: fontFamily(),
        color: themeColor,
    },
    buttonView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: dynamicSize(15),
        //height: dynamicSize(45),
        paddingVertical: dynamicSize(10),
        backgroundColor: '#F49930',
    },
    inputView: {
        flexDirection: 'row',
        borderWidth: dynamicSize(1),
        borderColor: '#C3C3C3',
        justifyContent: 'flex-start'
    },
    poundIcon: {
        width: dynamicSize(15),
        height: dynamicSize(15),
    }
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