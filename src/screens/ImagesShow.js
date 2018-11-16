import React, { Component } from 'react';
import { Platform, AsyncStorage, Image,ViewPagerAndroid, Dimensions, ScrollView, FlatList, TouchableOpacity, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
import { dynamicSize, getFontSize } from '../utils/responsive';
const { height, width } = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
import { CheckBox } from '../components/button';
import SingleTextModal from '../List_Modal/SingleTextModalList'
import { NodeAPI } from '../services/webservice';
import { Toast, Spinner } from '../components/toast'

var tagArr = []
const FloatButton = (props) => {
    return (
        <TouchableOpacity style={styles.floatButton} onPress={props.onPress}>
            <Image style={{ tintColor: "red" }} source={require("../assets/icons/rubbish-bin.png")} resizeMode="contain" />
        </TouchableOpacity>
    )
}

const GoFloatButton = (props) => {
    return (
        <TouchableOpacity style={styles.gofloatButton} onPress={props.onPress}>
            <Image style={{}} source={require("../assets/icons/send-button.png")} resizeMode="contain" />
        </TouchableOpacity>
    )
}

export default class ImagesShow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            images: this.props.navigation.state.params.data,
            singleTextModalVisible: false,
            tagIndex: -1,
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            initialScrollIndex: this.props.navigation.state.params.scrollIndex || 0,
            coverPhotoCheck: false,
            type: this.props.navigation.state.params.type
            // imagesThumbnail: []
        }
        console.log("Images-->", JSON.stringify(this.props.navigation.state.params.data))
    }

    componentWillMount() {
        var arr = this.state.images
        if (this.props.navigation.state.params.from && this.props.navigation.state.params.from == 'addProperty') {
            // if(this.props.navigation.state.params.scrollIndex){
            //     alert(this.props.navigation.state.params.scrollIndex)
            //    this.scroller.scrollToOffset({ offset: (this.props.navigation.state.params.scrollIndex-1) * width, animated: true })

            // }

        } else {
            for (var i = 0; i < arr.length; i++) {
                arr[i].coverPhoto = false;
                arr[i].tag = ''
            }
        }

        this.setState({ images: arr })

        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({ headerData: paramData, spinnerVisible: true })
            return NodeAPI({}, "getAllImageTags.json", 'GET', paramData.token, paramData.userid)
                .then(responseJson => {
                    this.setState({ spinnerVisible: false })
                    //this.setState({ spinnerVisible: false })
                    if (responseJson.response_code === 'success') {
                        tagArr = responseJson.imagetags
                    } else {
                        this.setState({ showToast: true, alertMessage: responseJson.msg })
                        setTimeout(() => {
                            this.setState({ showToast: false })
                        }, 3000);
                    }
                    //alert(JSON.stringify(response));
                })

        })

        // var data = this.props.navigation.state.params.data;
        // var a = { new: '+' }
        // data.push(a)
        // this.setState({
        //     imagesThumbnail: data,
        //     // images: this.props.navigation.state.params.data
        // })
    }

    _deletePhoto(item, index) {
        var imagesArr = this.state.images
        imagesArr.splice(index, 1);
        if (imagesArr.length == 0) {
            this.props.navigation.state.params.returnCallBack.callBack(imagesArr, this.state.type)
            this.props.navigation.goBack()
        }
        this.setState({
            images: imagesArr
        })
        console.log("Images--==>", imagesArr, this.state.images)
        this.scroller.scrollToOffset({ offset: 3 * width, animated: true })
    }

    _imagesSave() {
        var coverPhoto = false
        var tagCheck = true
        for (var i = 0; i < this.state.images.length; i++) {
            if (this.state.images[i].coverPhoto) {
                coverPhoto = true
                break
            }
        }
        for (var i = 0; i < this.state.images.length; i++) {
            if (this.state.images[i].tag == '') {
                tagCheck = false
                break
            }
        }
        if (!coverPhoto) {
            this.setState({ showToast: true, alertMessage: 'Please Select one photo as cover photo.' })
            setTimeout(() => {
                this.setState({ showToast: false })
            }, 3000);
        }
        else if (!tagCheck) {
            this.setState({ showToast: true, alertMessage: 'Please Select tags for all photos' })
            setTimeout(() => {
                this.setState({ showToast: false })
            }, 3000);
        }
        else {
            this.props.navigation.state.params.returnCallBack.callBack(this.state.images, this.state.type)
            this.props.navigation.goBack()
        }


    }
    onCheckBoxClicked(item, index) {
        var arr = this.state.images
        for (var i = 0; i < arr.length; i++) {
            if (i == index) {
                arr[index].coverPhoto = !arr[index].coverPhoto
            } else {
                arr[i].coverPhoto = false
            }
        }

        this.setState({ images: arr })
    }
    makeImagesArr(data) {
        var arr = []
        for (var i = 0; i < data.length; i++) {
            arr.push(this.showImages(data[i], i))
        }
        return (
            <View style={{flex:1}}>
                {
                    Platform.OS == 'ios' ?
                        <ScrollView style={{ height: height - dynamicSize(180), width: width }}
                            horizontal
                            pagingEnabled


                        >
                            {arr}
                        </ScrollView>
                        :
                        <ViewPagerAndroid style={{  width:width,height: height - dynamicSize(200)}}
                            horizontal
                            pagingEnabled


                        >
                            {arr}
                        </ViewPagerAndroid>
                }

            </View>
        )
    }
    showImages(item, index) {
        return (
            <View style={{ flex: 1 }}>
                <Image resizeMode="cover"
                    source={{ uri: item.path }} style={{ height: height - dynamicSize(180), width: width }} />
                <FloatButton onPress={() => this._deletePhoto(item, index)} />
                {/* <GoFloatButton onPress={() => this._imagesSave()} /> */}
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: dynamicSize(10), marginLeft: dynamicSize(10) }}>
                    <CheckBox {...this.props}
                        selected={item.coverPhoto}
                        checkClicked={() => this.onCheckBoxClicked(item, index)}
                        text='COVER PHOTO' fontSize={12} textColor="white" />

                    <View style={{ height: dynamicSize(20), width: dynamicSize(1), backgroundColor: "white", marginHorizontal: dynamicSize(10) }} />
                    <TouchableOpacity onPress={() => this.openTagModal(item, index)}>
                        <Text style={{ color: "white", fontSize: getFontSize(12) }}>{item.tag == '' ? 'SELECT TAG' : item.tag}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    _swipeImage(item, index) {
        // alert(index)
        this.scroller.scrollToOffset({ offset: index * width, animated: true })
    }

    showImagesThumbnail(item, index) {
        return (
            <TouchableOpacity onPress={() => this._swipeImage(item, index)} style={{}}>
                <Image resizeMode="cover" source={{ uri: item.path }} style={{ height: dynamicSize(40), width: dynamicSize(40), marginRight: dynamicSize(10) }} />
            </TouchableOpacity>
        )
    }

    _selectImages() {
        ImagePicker.openPicker({
            multiple: true,
            compressImageQuality: 0.5,
            includeBase64: true
        }).then(images => {
            var arr = images
            for (var i = 0; i < arr.length; i++) {
                arr[i].coverPhoto = false;
                arr[i].tag = ''
            }
            var data = [...this.state.images, ...arr]
            this.setState({
                images: data
            })
            console.log(data);
        });
    }

    singleTextModalRowClicked(item) {
        if (this.state.tagIndex != -1) {
            var arr = this.state.images
            arr[this.state.tagIndex].tag = item.name
            arr[this.state.tagIndex].tagId = item.id
            this.setState({ images: arr, singleTextModalVisible: false, tagIndex: -1 })

        }

    }
    singleTextModalClose() {
        this.setState({ singleTextModalVisible: false, tagIndex: -1 })
    }
    openTagModal(item, index) {
        this.setState({ singleTextModalVisible: true, tagIndex: index })
    }

    render() {
        return (
            <ScrollView style={styles.fullView}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <SingleTextModal {...this.props}
                    visible={this.state.singleTextModalVisible}
                    titleText={"Select Tag"}
                    data={tagArr}
                    typeKey='name'
                    selectItemFromFlatlist={(item, index) => this.singleTextModalRowClicked(item, index)}
                    close={() => this.singleTextModalClose()} />

                {/* <Image source={{ uri: "file:///storage/emulated/0/Pictures/1b517e9e-4cb9-49ee-bafc-bdbd12be5495-compressed.jpg" }} style={{ height: 200, width: 200}}/> */}
                <FlatList
                    data={this.state.images}
                    renderItem={({ item, index }) => this.showImages(item, index)}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    initialScrollIndex={this.state.initialScrollIndex}
                    extraData={this.state}
                    pagingEnabled
                    horizontal={true}
                    ref={(scroller) => { this.scroller = scroller }}
                />
                {/* {this.state.images.length!=0 ? this.makeImagesArr(this.state.images) : null} */}
                <GoFloatButton onPress={() => this._imagesSave()} />




                <View style={{ marginTop: dynamicSize(10), flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => this._selectImages()} style={{ height: dynamicSize(40), width: dynamicSize(40), marginLeft: dynamicSize(10), marginRight: dynamicSize(10), backgroundColor: "grey", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(24), fontWeight: "600", color: "white" }}>+</Text>
                    </TouchableOpacity >
                    <FlatList
                        data={this.state.images}
                        renderItem={({ item, index }) => this.showImagesThumbnail(item, index)}
                        keyExtractor={(item, index) => index}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        extraData={this.state}
                        // pagingEnabled
                        horizontal={true}
                    // ref={(scroller) => { this.scroller = scroller }}
                    />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    fullView: {
        flex: 1,
        backgroundColor: "black"
    },
    floatButton: {
        // height: dynamicSize(60),
        // width: dynamicSize(60),
        position: 'absolute', zIndex: 15,
        top: dynamicSize(30),
        right: dynamicSize(30),
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: dynamicSize(30)
    },
    gofloatButton: {
        height: dynamicSize(50),
        width: dynamicSize(50),
        position: 'absolute', zIndex: 15,
        bottom: dynamicSize(100),
        right: dynamicSize(20),
        backgroundColor: "#56B24D",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: dynamicSize(25)
    }

});