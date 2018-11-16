
import React, { Component } from "react";
import {
    Platform,
    TouchableOpacity,
    StyleSheet,
    AsyncStorage,
    SafeAreaView,
    Text,
    ScrollView,
    Alert,
    TextInput,
    View,
    Image,
    Dimensions,
    TouchableWithoutFeedback
} from "react-native";
import { dynamicSize, getFontSize, fontFamily, themeColor } from '../utils/responsive';
const { height, width } = Dimensions.get('window');
import { createDrawerNavigator, DrawerItems, StackNavigator } from "react-navigation";
import { StackActions, NavigationActions } from "react-navigation";
import { ErrModal, Toast, Spinner } from '../components/toast'
import { connect } from 'react-redux'
import { NodeAPI } from '../services/webservice'
// const graphData=[
//     {}
// ]

class contentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            email: "",
            edit: false,
            companyCode: "",
            companyName: "",
            typeOfUser: "",
            //returnCallBack: { value: false, callBack: () => { } },
            //userImage: require("../images/userImage.png"),
            type: "user",
            headerData: '',
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
        };
    }
    componentWillMount() {
        // getVendorDetail
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
                    responseJson.vendorDetail.image = responseJson.vendorDetail.image != '' ? (responseJson.vendorDetail.image + '?' + new Date()) : ''
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
    componentDidMount() {

        // Setting.settingCallback(this.callBack);
        // CompanyProfile.companyProfileCallback(this.callBack);
    }

    logout() {
        // AsyncStorage.getItem("userToken").then(token => {
        //   return webservice("", "logout", "GET", token).then(response => {
        //     //this.setState({spinnerVisible:false})
        //     if (response != "error") {
        //       AsyncStorage.removeItem("userToken").then(token => {
        //         getLog("tokenRemoved");
        //       });

        //       AsyncStorage.removeItem("LoginresponseData").then(token => {
        //         getLog("LoginresponseDataRemoved");
        //       });
        //       const resetAction = StackActions.reset({
        //         index: 0,
        //         actions: [NavigationActions.navigate({ routeName: "Login" })]
        //       });
        //       this.props.item.navigation.dispatch(resetAction);
        //     }
        //   });
        // });

        AsyncStorage.removeItem("headerData")
        //     resetAction = StackActions.reset({
        //         index: 0,
        //         actions: [NavigationActions.navigate({ routeName: 'Login' })],
        //     });
        // this.props.item.navigation.dispatch(resetAction);
        // this.props.item.navigation.popToTop()
        this.props.item.navigation.navigate('Login');
        //  this.props.item.navigation.popToTop()
    }
    logoutPress() {

        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.logout() }
            ],
            { cancelable: false }
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />

                <View style={styles.container}>
                    <ScrollView
                        style={{
                            marginBottom: 10,

                        }}
                    >
                        <View style={[styles.topView]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingVertical: dynamicSize(10), borderTopColor: '#f5f5f5', borderBottomColor: '#f5f5f5', borderTopWidth: 1, borderBottomWidth: 1 }}>
                                <TouchableOpacity onPress={() => this.props.item.navigation.closeDrawer()}
                                    style={{ paddingHorizontal: dynamicSize(15), alignItems: 'center', }}>
                                    <Image resizeMode='contain'
                                        source={require('../assets/backArrow.png')} />
                                </TouchableOpacity>
                                <Image resizeMode='contain'
                                    source={require('../assets/logo.png')} />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingVertical: dynamicSize(10), borderTopColor: '#f5f5f5', borderBottomColor: '#f5f5f5', borderBottomWidth: 1 }}>
                                <View style={{ height: dynamicSize(40), width: dynamicSize(40), borderRadius: dynamicSize(20), borderWidth: 1, borderColor: '#e7e7e7', marginLeft: dynamicSize(20), alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        resizeMode='cover'
                                        style={{ height: dynamicSize(38), width: dynamicSize(38), borderRadius: dynamicSize(19), }}
                                        source={this.props.userObject.image && this.props.userObject.image != '' ? { uri: this.props.userObject.image } : require('../assets/userProfile.png')} />
                                </View>
                                <View style={{ marginLeft: dynamicSize(10) }}>
                                    <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(16), color: themeColor }}>{this.props.userObject.name || ''}</Text>
                                    <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(12), color: '#7a7a7a' }}>{this.props.userObject.email || ''}</Text>

                                </View>
                            </View>
                        </View>
                        <DrawerItems
                            {...this.props.item}
                            labelStyle={{ fontSize: getFontSize(14), fontWeight: 'normal', fontFamily: fontFamily('bold') }}
                            activeTintColor={themeColor}
                            itemStyle={{
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1,



                            }}


                        />

                        <TouchableWithoutFeedback
                            onPress={() => this.logoutPress()}
                        >
                            <View style={{ width: '60%', backgroundColor: '#F49930', paddingVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', marginLeft: dynamicSize(20), marginVertical: dynamicSize(15), marginTop: dynamicSize(20), flexDirection: 'row' }}>
                                <Image source={require('../assets/logout-icn.png')} />
                                <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(14), color: 'white', marginLeft: dynamicSize(5) }}>LOGOUT</Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#21459E"
    },
    topView: {

        width: width - width / 4,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
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

export default connect(mapStateToProps, mapDispatchToPops)(contentComponent);