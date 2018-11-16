/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, TextInput, FlatList, Keyboard, ScrollView, Switch, AsyncStorage, TouchableOpacity, ImageBackground, TouchableWithoutFeedback, Dimensions, Easing, Text, View, Image } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { dynamicSize, getFontSize, themeColor, fontFamily } from '../utils/responsive';
const { width, height } = Dimensions.get('window');
import { TextBoxWithTitleAndButton } from '../components/button';
import { ErrModal, Toast, Spinner } from '../components/toast';
import ImagePicker from 'react-native-image-crop-picker';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { NodeAPI } from '../services/webservice'
import RNFS from 'react-native-fs';

export default class Step3 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ErrModalVisible: false,
            ImagesArr: [{}],
            returnCallBack: { value: false, callBack: () => { } },
            // selectedImages: [],
            returnArr: [],
            documentSwitch: false,
            DocumentArr: [{}],
            returnDocumentArr: [],
            pdf: false,
            imageArrayPassedToServer: [],
            step2Variables: '',
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            headerData: '',
            inventory: '',
            inventoryErr: false,
            selectedInventoryPassed: [],
            selectedInventoryPassedToServer: [],
            DocumentArrPassedToServer: []
        }

    }

    componentWillMount() {
        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })

            return NodeAPI({}, "getAllFurnishTypes.json", 'GET', paramData.token, paramData.userid)
                .then(responseJson => {
                    this.setState({ spinnerVisible: false })
                    if (responseJson.response_code === 'success') {
                        this.setState({
                            selectedInventoryPassed: responseJson.furnishtypes
                        })

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

        });

       this.setState({ step2Variables: this.props.navigation.state.params.step1and2variables || '' })
        console.log(JSON.stringify(this.props.navigation.state.params.step1and2variables || ''))
        this.setState({ returnCallBack: { value: false, callBack: this.updateImages } })
    }
    updateImages = (data, type) => {
        // alert(type)
        if (type != "photo") {
            // this.setState({
            //     DocumentArr: [{}]
            // })
            // setTimeout(() => {
            //     this.setState({
            //         returnDocumentArr: data
            //     })
            //     // alert(JSON.stringify(data))
            //     this.setState({
            //         DocumentArr: [...this.state.DocumentArr, ...data]
            //     })
            // }, 100);
        }
        else {
            console.log("images dtat" + JSON.stringify(data))
            this.setState({
                ImagesArr: [{}]
            })
            setTimeout(() => {
                this.setState({
                    returnArr: data
                })
                // alert(JSON.stringify(data))
                this.setState({
                    ImagesArr: [...this.state.ImagesArr, ...data]
                })
                setTimeout(() => {
                    var arr = []
                    for (var i = 0; i < data.length; i++) {
                        arr.push({
                            image: data[i].data,
                            tag: data[i].tagId,
                            isCover: data[i].coverPhoto,
                            uploadType: 'I',
                            documentType: 'IMAGE'
                        })
                    }
                    this.setState({ imageArrayPassedToServer: arr })
                }, 1000);
            }, 100);

        }
    }

    _selectDocuments() {
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {

            console.log(JSON.stringify(res))
            // Android

            // var data=window.btoa(res.uri)

            //console.log(JSON.stringify(data))
            // console.log(
            //     res.uri,
            //     res.type, // mime type
            //     res.fileName,
            //     res.fileSize
            // );
            if (res.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || res.type == 'application/msword' || res.type == 'application/pdf') {
                RNFS.readFile(res.uri, 'base64')
                    .then(response => {
                        console.log(response);
                        var docRes = res
                        docRes.image = response
                        docRes.uploadType = 'D'
                        docRes.documentType = res.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'DOCX' : res.type == 'application/msword' ? 'DOC' : res.type == 'application/pdf' ? 'PDF' : ''
                        var data = this.state.DocumentArr;
                        var DocumentArrPassedToServer = this.state.DocumentArrPassedToServer
                        data.push(docRes);
                        DocumentArrPassedToServer.push(docRes);
                        this.setState({
                            DocumentArr: data,
                            DocumentArrPassedToServer: DocumentArrPassedToServer
                        })

                    });


            } else {
                this.setState({ errModalMessage: 'Only Pdf and Word file supported.', ErrModalVisible: true })
            }


        });
    }

    _selectImages(check) {
        ImagePicker.openPicker({
            multiple: true,
            compressImageQuality: 0.5,
            includeBase64: true
        }).then(images => {
            {
                var arr = images
                for (var i = 0; i < images.length; i++) {
                    arr[i].coverPhoto = false;
                    arr[i].tag = ''
                }

                this.props.navigation.navigate("ImagesShow", { data: [...this.state.returnArr, ...arr], returnCallBack: this.state.returnCallBack, type: "photo", from: this.state.returnArr.length == 0 ? '' : 'addProperty' })

                // this.props.navigation.navigate("ImagesShow", { data: [...this.state.returnDocumentArr, ...images], returnCallBack: this.state.returnCallBack, type: "file" })
            } console.log(images);
        });
    }
    _goGallery(check, index) {

        this.props.navigation.navigate("ImagesShow", { data: this.state.returnArr, returnCallBack: this.state.returnCallBack, type: "photo", from: 'addProperty', scrollIndex: index - 1 })


    }

    _showimages(item, index) {
        return (
            index == 0 ?
                <View style={{ width: (width / 2) - dynamicSize(30), height: dynamicSize(80), marginLeft: index % 2 != 0 ? dynamicSize(10) : 0, marginTop: dynamicSize(10), borderColor: "#97978f", borderWidth: dynamicSize(0.5),marginBottom:dynamicSize(5) }}>

                    <TouchableOpacity onPress={() => this._selectImages("photo")} style={{ alignItems: "center", alignSelf: "flex-start", alignSelf: "center", flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Image source={require("../assets/step3/upload-pic-icn.png")}
                        //style={{ height: dynamicSize(40), width: dynamicSize(40), tintColor: "#E1E0DB" }}
                        />
                        <Text style={{ fontSize: getFontSize(12), color: "#97978f", fontFamily: fontFamily("bold") }}>+Add Photo</Text>
                    </TouchableOpacity>
                </View>
                :
                index < 4 ?
                    <TouchableOpacity onPress={() => this._goGallery("photo", index)} style={{ width: (width / 2) - dynamicSize(30), height: dynamicSize(80), marginLeft: index % 2 != 0 ? dynamicSize(10) : 0, marginTop: dynamicSize(10) }}>
                        <ImageBackground style={{ justifyContent: "center", alignItems: "center", flex: 1 }} source={{ uri: item.path }}>
                            {this.state.ImagesArr.length - 1 > 3 && index == 3 ?
                                < View style={{ height: dynamicSize(26), width: dynamicSize(26), borderRadius: dynamicSize(13), justifyContent: "center", alignItems: "center", backgroundColor: "black", opacity: 0.8 }}>
                                    <Text style={{ fontSize: getFontSize(11), color: "white", fontFamily: fontFamily("bold") }}>{this.state.ImagesArr.length - 4}</Text>
                                </View>
                                :
                                null
                            }
                        </ImageBackground>

                        <View style={{ position: 'absolute', bottom: 0, paddingVertical: dynamicSize(5), width: '100%', backgroundColor: '#00000092', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: "white", textAlign: 'center', fontFamily: fontFamily() }}>{item.tag}</Text>
                        </View>


                    </TouchableOpacity>
                    : null
        )
    }

    _showdocuments(item, index) {
        return (
            index == 0 ?
                <View style={{ width: (width / 2) - dynamicSize(30), height: dynamicSize(80), marginLeft: index % 2 != 0 ? dynamicSize(10) : 0, marginTop: dynamicSize(10), borderColor: "#97978f", borderWidth: dynamicSize(0.5) }}>

                    <TouchableOpacity onPress={() => this._selectDocuments("file")} style={{ alignItems: "center", alignSelf: "flex-start", alignSelf: "center", flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Image source={require("../assets/step3/upload-pic-icn.png")}
                        //style={{ height: dynamicSize(40), width: dynamicSize(40), tintColor: "#E1E0DB" }}
                        />
                        <Text style={{ fontSize: getFontSize(12), color: "#97978f", fontFamily: fontFamily("bold") }}>+Add File</Text>
                    </TouchableOpacity>
                </View>
                :
                index < 4 ?
                    <TouchableOpacity onPress={() => console.log('')} style={{ width: (width / 2) - dynamicSize(30), height: dynamicSize(80), marginLeft: index % 2 != 0 ? dynamicSize(10) : 0, marginTop: dynamicSize(10) }}>
                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1, backgroundColor: "grey" }}>
                            <Text numberOfLines={1}
                                style={{ textAlign: 'center', fontSize: getFontSize(12), color: "white", width: '90%', fontFamily: fontFamily("bold") }}>{item.fileName}</Text>
                        </View>
                    </TouchableOpacity>
                    : null
        )
    }
    save(type) {

        if (this.state.imageArrayPassedToServer.length == 0) {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please select atleast one property image.' })

        } else if (this.state.inventory == '') {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please select Inventory.', inventoryErr: true })

        }
        else {


            var variables = Object.assign({ propertyPhotos: [...this.state.imageArrayPassedToServer, ...this.state.DocumentArrPassedToServer], furnishing: { furnishingList: this.state.selectedInventoryPassedToServer } }, this.state.step2Variables)

            console.log("variables" + JSON.stringify(variables))
            if (type == 'post') {
                setTimeout(() => {
                    variables.status = 1
                    this.hitAddPropertyAPI(variables)
                }, 500);
            } else {
                this.props.navigation.navigate('PropertyReview', { data: variables, amenitiesArrPassedToReview: this.props.navigation.state.params.amenitiesArrPassedToReview })

            }


        }

    }
    hitAddPropertyAPI(variables) {
        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "addProperty.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    //alert(JSON.stringify(responseJson))
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                        this.props.navigation.navigate('Appointment', { propertyId: responseJson.propertyId, backTo: 4 })
                        //this.props.navigation.pop(3)
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
    updateInventory = (data) => {
        var arr = []
        // for (var i = 0; i < data.length; i++) {
        //     if ((data[i].switchValue && data[i].switchValue == true) || Number(data[i].quantity) != 0) {
        //         count++
        //     }
        // }
        for (var i = 0; i < data.length; i++) {
            if (data[i].is_numeric && data[i].quantity) {
                if (Number(data[i].quantity) != 0) {
                    arr.push({
                        id: data[i].id,
                        value: data[i].quantity
                    })
                }
            } else {
                if (data[i].switchValue) {
                    if (data[i].switchValue == true) {
                        arr.push({
                            id: data[i].id,
                        })
                    }
                }
            }

        }
        console.log("inventory sleceted" + JSON.stringify(arr))
        this.setState({ inventory: arr.length, inventoryErr: false, selectedInventoryPassed: data, selectedInventoryPassedToServer: arr })
    }
    render() {

        return (
            <View style={styles.container}>
                <ScrollView style={{ marginBottom: dynamicSize(60) }}
                    keyboardShouldPersistTaps="always">
                    <Spinner visible={this.state.spinnerVisible} />
                    <Toast visible={this.state.showToast} message={this.state.alertMessage} />

                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#A2A8A2' }}>
                            <Text style={[styles.boldText, {}]}>Address</Text></View>
                        <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#A2A8A2' }}>
                            <Text style={[styles.boldText, {}]}>Details</Text></View>
                        <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomColor: themeColor, borderBottomWidth: 2 }}>
                            <Text style={[styles.boldText, { color: themeColor }]}>Photos</Text></View>
                    </View>
                    <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />

                    <Text numberOfLines={2}
                        style={{ fontFamily: fontFamily("bold"), marginTop: dynamicSize(15), marginLeft: dynamicSize(15), fontSize: getFontSize(14), color: "#969a9d" }}>
                        Photos - Professional photography can improve sales
            </Text>
                    {/* <Text style={{ fontFamily: fontFamily("bold"), marginTop: dynamicSize(3), marginLeft: dynamicSize(15), fontSize: getFontSize(10), color: "#969a9d" }}>
                    Professional photography can improve sales
            </Text> */}
                    <View style={{}}>
                        <FlatList
                            data={this.state.ImagesArr}
                            renderItem={({ item, index }) => this._showimages(item, index)}
                            keyExtractor={(item, index) => index}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            extraData={this.state}
                            // pagingEnabled
                            // horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            numColumns={2}
                            marginHorizontal={dynamicSize(20)}
                            style={{ alignSelf: this.state.ImagesArr.length > 1 ? "center" : "flex-start" }}
                        /></View>

                    <View style={{ borderColor: "#97978f", borderWidth: dynamicSize(0.5), marginTop: dynamicSize(15), paddingVertical: dynamicSize(10), flexDirection: "row", justifyContent: "space-between", paddingHorizontal: dynamicSize(15), alignItems: "center" }}>
                        <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(14), color: "#969a9d" }}>Documents</Text>
                        <Switch
                            onValueChange={(value) => this.setState({ documentSwitch: !this.state.documentSwitch })}
                            value={this.state.documentSwitch}
                        />
                    </View>
                    {this.state.documentSwitch ?
                        <FlatList
                            data={this.state.DocumentArr}
                            renderItem={({ item, index }) => this._showdocuments(item, index)}
                            keyExtractor={(item, index) => index}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            extraData={this.state}
                            // pagingEnabled
                            // horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            numColumns={2}
                            marginHorizontal={dynamicSize(20)}
                            style={{ alignSelf: this.state.DocumentArr.length > 1 ? "center" : "flex-start" }}
                        />
                        :
                        null}

                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Inventory'}
                        error={this.state.inventoryErr}
                        value={this.state.inventory != '' ? this.state.inventory + ' Inventory Selected' : ''}
                        editable={false}
                        downArrow={true}

                        onButtonPress={() => this.props.navigation.navigate('Inventory', { updateInventory: (data) => this.updateInventory(data), selectedInventoryPassed: this.state.selectedInventoryPassed })}
                        icon={require('../assets/step2/bed-icn.png')}
                        onChangeText={(text) => this.setState({ inventory: text, bedroomsErr: false })}
                    />
                </ScrollView>
                <View style={{ position: "absolute", flexDirection: 'row', bottom: 0, left: 0, right: 0, height: dynamicSize(60), width: "100%", borderTopColor: "#E9E9E9", borderTopWidth: dynamicSize(1), paddingHorizontal: dynamicSize(10), justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => this.save('review')}
                        style={{ backgroundColor: this.state.ImagesArr.length > 1 ? "#F49930" : "transparent", height: dynamicSize(40), alignItems: "center", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), flex: 1, justifyContent: "center" }}>
                        <Text style={{ color: this.state.ImagesArr.length > 1 ? "white" : "#E9E9E9", fontSize: getFontSize(16), fontFamily: fontFamily("bold") }}>Review</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.save('post')}
                        style={{ backgroundColor: this.state.ImagesArr.length > 1 ? "#F49930" : "transparent", height: dynamicSize(40), alignItems: "center", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), flex: 1, justifyContent: "center" }}>
                        <Text style={{ color: this.state.ImagesArr.length > 1 ? "white" : "#E9E9E9", fontSize: getFontSize(16), fontFamily: fontFamily("bold") }}>Post</Text>
                    </TouchableOpacity>
                </View>


            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: { height: height / 2.5, marginHorizontal: dynamicSize(15), },

    rowView: { paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(10) },
    rowText: { fontSize: getFontSize(14) },
    boldText: { fontSize: getFontSize(14), fontFamily: fontFamily('bold') },
    accomodationView: { alignItems: 'center', borderTopColor: "#A2A8A2", borderTopWidth: 0, padding: dynamicSize(15), flexDirection: 'row', paddingHorizontal: dynamicSize(10) },
});
