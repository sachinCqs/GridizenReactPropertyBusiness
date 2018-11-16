import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { dynamicSize, getFontSize, fontFamily, themeColor } from '../utils/responsive';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux'
import { NodeAPI } from '../services/webservice';
import { ErrModal, Toast, Spinner } from '../components/toast';

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = ['Cancel', 'Camera', 'Gallery']
const title = 'Open Image from'
class ProfilePic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: this.props.userObject.image == '' ? '' : this.props.userObject.image + "?" + new Date(),
            image64: '',
            headerData: {},
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            ErrModalVisible: false,
            errModalMessage: '',
        };
    }
    componentWillMount() {
        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                // spinnerVisible: true
            })

        })
    }
    handlePress(i) {
        this.setState({
            selected: i
        })
        if (i == 1) {
            ImagePicker.openCamera({
                width: 300,
                height: 300,
                compressImageQuality: 0.5,
                cropping: true,
                includeBase64: true
            }).then(image => {
                this.setState({
                    imagePath: image.path,
                    image64: image.data,
                    uploadPicture: true,
                    image: 'data:image/png;base64,' + image.data,
                })
            }).catch((err) => {
                console.log("ImageError===>" + JSON.stringify(err.message));
            });
        } else if (i == 2) {
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                compressImageQuality: 0.5,
                cropping: true,
                includeBase64: true
            }).then(image => {
                this.setState({
                    imagePath: image.path,
                    image64: image.data,
                    image: 'data:image/png;base64,' + image.data,
                    uploadPicture: true
                })
            }).catch((err) => {
                // alert(err.message);
            });
        }
    }
    showActionSheet() {
        this.ActionSheet.show()
    }
    hitGetUserDetail(paramData) {
        // this.setState({ refreshing: true })
        this.setState({ spinnerVisible: true })
        return NodeAPI({}, "getVendorDetail.json", 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, loaderPosition: dynamicSize(10), refreshing: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))

                    responseJson.vendorDetail.image = responseJson.vendorDetail.image != '' ? (responseJson.vendorDetail.image + '?' + new Date()) : ''
                    this.props.userObjectValue(responseJson.vendorDetail)
                    this.props.navigation.goBack()
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
    save() {
        this.setState({ spinnerVisible: true })
        var variables = { "image": this.state.image64 }
        return NodeAPI(variables, 'update-profile-image.json', 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                // console.log("profilepic ==>", responseJson)
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    // this.props.navigation.state.params.data.returnCallBack.callBack({ uri: this.state.imagePath })
                    // this.props.navigation.goBack()


                    setTimeout(() => {
                        this.hitGetUserDetail(this.state.headerData)
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

    render() {
        return (
            <View style={styles.Contener}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Spinner visible={this.state.spinnerVisible} />
                <View style={styles.TextView} >
                    <Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily(), color: '#7A7A7A', fontWeight: 'bold' }} >UPDATE PROFILE IMAGE</Text>
                </View>
                <View style={styles.profileImageView}>
                    <View style={styles.ImageBorder}>
                        <TouchableOpacity onPress={() => this.showActionSheet()}>
                            <Image style={{ height: dynamicSize(146), width: dynamicSize(146), borderRadius: dynamicSize(75) }}
                                source={this.state.image != '' ? { uri: this.state.image } : require('../assets/p1.jpeg')} />
                        </TouchableOpacity>
                        {this.state.image != '' ?
                            <TouchableOpacity
                                onPress={() => this.setState({ image: '', image64: '' })}
                                style={{ position: "absolute", zIndex: 19, height: dynamicSize(16), width: dynamicSize(16), borderRadius: dynamicSize(8), right: 0, top: dynamicSize(27) }}
                            >
                                <Image source={require("../assets/error.png")} />
                            </TouchableOpacity>
                            : null}
                    </View>
                </View>
                <View style={{ marginTop: dynamicSize(15) }}>
                    <TouchableOpacity
                        style={styles.buttonView}
                        onPress={() => this.save()}
                    >
                        <Text style={{ color: '#ffffff', fontFamily: fontFamily(), fontSize: getFontSize(14), fontWeight: 'bold' }}> Save</Text>
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={title}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={(index) => this.handlePress(index)}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    Contener: {
        flex: 1,
        backgroundColor: 'white'
    },
    TextView: {
        //margin: dynamicSize(5),
        height: dynamicSize(50),
        borderBottomWidth: dynamicSize(1),
        borderBottomColor: '#C3C3C3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageBorder: {
        borderWidth: dynamicSize(2),
        marginTop: dynamicSize(40),
        borderColor: '#7A7A7A',
        borderRadius: dynamicSize(75),
        height: dynamicSize(150),
        width: dynamicSize(150),
        position: "relative"

    },
    buttonView: {
        //width: dynamicSize(null),
        justifyContent: 'center',
        alignItems: 'center',
        height: dynamicSize(45),
        margin: dynamicSize(15),
        //marginLeft: dynamicSize(5),
        // marginLeft: 40,
        // marginRight: 40,
        backgroundColor: '#F49930',
        padding: dynamicSize(15),
        // borderRadius: 30,
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

export default connect(mapStateToProps, mapDispatchToPops)(ProfilePic);