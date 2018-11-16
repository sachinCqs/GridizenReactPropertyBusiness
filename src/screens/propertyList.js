import React, { Component } from 'react';
import { Platform, Image, AsyncStorage, ScrollView, RefreshControl, TouchableWithoutFeedback, Dimensions, FlatList, TouchableOpacity, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
import { dynamicSize, getFontSize, dateConverterMMDDYYYY, themeColor, fontFamily } from '../utils/responsive';
const { height, width } = Dimensions.get('window');
import { ErrModal, Toast, Spinner } from '../components/toast'
import { FloatButton } from '../components/button'
import { NodeAPI } from '../services/webservice'
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};
var set = ''
export default class Dashboard extends Component {



    constructor(props) {
        super(props)
        this.state = {
            // propertyList: [
            //     {
            //         rent: 35000,
            //         address1: 'Rwa Nizamuddin west',
            //         address2: 'Delhi',
            //         bedrooms: '1 BHK',
            //         furnishedType: 'Semifurnished',
            //         contactType: 'Dealer',
            //         contactPerson: 'Manish',
            //         like: false,
            //         postedOn: new Date().getTime(),
            //         seen: false,
            //         image: 'https://imagejournal.org/wp-content/uploads/bb-plugin/cache/23466317216_b99485ba14_o-panorama.jpg'
            //     },
            //     {
            //         rent: 3000,
            //         address1: 'Govind puri',
            //         address2: 'kalka ji',
            //         bedrooms: '3 BHK',
            //         furnishedType: 'Furnished',
            //         contactType: 'Owner',
            //         contactPerson: 'Suresh',
            //         like: true,
            //         postedOn: new Date().getTime(),
            //         seen: true,
            //         image: 'https://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg'
            //     }
            // ],
            dataCount: 10,
            propertyList: [],
            headerData: '',
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            refreshing: false,
            loaderPosition: dynamicSize(5),
            propertyListCount: 0
        }
    }

    componentWillMount() {

        // var d = [{ id: 1, value: 1 }, { id: 2, value: 1 }, { id: 3, value: 1 }, { id: 1, value: 1 },
        // { id: 4, value: 1 }, { id: 1, value: 'sss' }, , { id: 1, value: 'ppp' },];
        // var arr = []

        // d.map((v, index) => {
        //     var index11 = arr.findIndex(function (item, i) {
        //         return item.id === v.id
        //     })
        //     if (index11 == -1) {
        //         arr.push({ id: v.id, value: [v.value] })
        //     } else {
        //         arr[index11].value.push(v.value)

        //     }


        // }
        // )
        // console.log(JSON.stringify(arr))

        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })
            this.hitGetGlobalNotificationCount(paramData)
            this.hitGetAllListApi(paramData)
            clearInterval(set)
            set = setInterval(() => {
                this.hitGetGlobalNotificationCount(paramData)

            }, 15000)
            // getAllProperties.json/:page/:pageSize/:sortBy/:sortType/:search?

        })


    }

    hitGetGlobalNotificationCount(paramData) {
        return NodeAPI({}, "getTotalRequest.json/V", 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, loaderPosition: dynamicSize(10), refreshing: false })
                if (responseJson.response_code === 'success') {
                    this.props.navigation.setParams({ notificationCount: responseJson.total })
                    var count = responseJson.total
                    return NodeAPI({}, "getTotalUnreadMessage.json", 'GET', paramData.token, paramData.userid)
                        .then(responseJson => {
                            this.setState({ spinnerVisible: false, loaderPosition: dynamicSize(10), refreshing: false })
                            if (responseJson.response_code === 'success') {
                                this.props.navigation.setParams({ notificationCount: responseJson.total + count })

                            } else {

                            }
                            //alert(JSON.stringify(response));
                        })



                } else {

                }
                //alert(JSON.stringify(response));
            })

    }
    updateList = () => {
        this.hitGetAllListApi(this.state.headerData)
    }
    hitGetAllListApi(paramData) {
        // this.setState({ refreshing: true })
        return NodeAPI({}, "getAllProperties.json/0/" + this.state.dataCount, 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, loaderPosition: dynamicSize(10), refreshing: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    console.log(JSON.stringify(responseJson))
                    var arr = responseJson.properties
                    for (var i = 0; i < responseJson.properties.length; i++) {
                        arr[i].showDetailView = false
                    }
                    this.setState({ propertyList: arr, propertyListCount: responseJson.total })
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
    hitPublishDeleteApiApi(item, status) {
        var variables = { id: item.id, status: status }

        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "changeStatusProperty.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    //alert(JSON.stringify(responseJson))
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    this.hitGetAllListApi(this.state.headerData)
                    setTimeout(() => {
                        this.setState({ showToast: false })

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
    onHeartPress(index) {
        var arr = this.state.propertyList
        arr[index].like = !arr[index].like
        this.setState({ propertyList: arr })
    }
    checkImage(item) {
        return item.type == 'Image';
    }
    showSideMenu(index) {
        var arr = this.state.propertyList
        for (var i = 0; i < arr.length; i++) {
            if (i == index) {
                arr[index].showDetailView = !arr[index].showDetailView
            } else {
                arr[i].showDetailView = false
            }
        }
        // var arr = this.state.propertyList

        // arr[index].showDetailView = !arr[index].showDetailView
        this.setState({ propertyList: arr })
    }
    showList(item, index) {
        var count = item.propertyPhotos.filter(this.checkImage).length

        return (
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('PropertyDetails', { data: item, updateList: () => this.updateList() })}>
                <View style={styles.propertyListRow}>
                    <View style={styles.imageView}>
                        <ImageBackground source={{ uri: item.propertyPhotos[0] ? item.propertyPhotos[0].image : '' }}
                            style={styles.propertyImage} />

                        <View style={styles.propertyImageOpacity} />
                        {/* <View style={styles.dateView}>
                        <Text style={styles.dateText}>Posted On {dateConverterMMDDYYYY(new Date(item.postedOn))}</Text>
                    </View> */}
                        {/* <TouchableOpacity onPress={() => this.onHeartPress(index)}
                            style={styles.likeView}>
                            <Image resizeMode='contain'
                                source={item.like ? require('../assets/propertyList/heart-active.png') : require('../assets/propertyList/heart-white.png')} />
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            style={{ position: 'absolute', backgroundColor: '#000000', paddingHorizontal: dynamicSize(2), bottom: dynamicSize(10), right: dynamicSize(10), flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: getFontSize(11), fontFamily: fontFamily(), marginRight: dynamicSize(2) }}>{count}</Text>
                            <Image source={require('../assets/propertyList/cam-white.png')} />
                        </TouchableOpacity>

                    </View>
                    <View style={styles.detailView}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.rentText}>£ {item.expectedRent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' PCM'}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: item.status == 1 ? themeColor : 'red', marginRight: dynamicSize(5) }}>{item.status == 1 ? 'Active' : item.status == 2 ? 'In-Active' : item.status == 3 ? 'Deleted' : ''}</Text>
                                <TouchableOpacity
                                // onPress={() => this.showSideMenu(index)}
                                >
                                    <Image style={{ tintColor: '#7a7a7a' }}
                                        source={require('../assets/threeDot.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text numberOfLines={1}
                            style={styles.address1Text}>{item.bedroom + ' Bed ' + item.propertyType + ' for rent'}</Text>
                        <Text numberOfLines={1}
                            style={styles.address2Text}>{item.address}</Text>
                        <Text numberOfLines={1}
                            style={styles.dateText}>{'Posted on ' + dateConverterMMDDYYYY(new Date(item.createdAt))}</Text>

                        {/* <Text numberOfLines={1}
                        style={styles.BHKText}>{item.bedrooms + ' ' + item.furnishedType}</Text> */}
                        {/* <View style={{ marginTop: dynamicSize(5), flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../assets/propertyList/bed-sml-icn.png')} />
                                <Text style={{ color: 'grey', fontSize: getFontSize(14), fontFamily: fontFamily('bold'), marginLeft: dynamicSize(2) }}>{item.bedroom}</Text>

                            </View>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', marginRight: dynamicSize(10) }}>
                                <Image source={require('../assets/propertyList/bath-icn.png')} />
                                <Text style={{ color: 'grey', fontSize: getFontSize(14), fontFamily: fontFamily('bold'), marginLeft: dynamicSize(2) }}>{item.bathroom}</Text>

                            </View>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../assets/propertyList/sofa.png')} />
                                <Text style={{ color: 'grey', fontSize: getFontSize(14), fontFamily: fontFamily('bold'), marginLeft: dynamicSize(2) }}>{item.reception}</Text>

                            </View>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'grey', fontSize: getFontSize(11), fontFamily: fontFamily(), marginRight: dynamicSize(10) }}>{item.build_up_area + " " + item.build_up_area_unit}</Text>

                            </View>
                        </View> */}
                        {item.showDetailView ?
                            <ScrollView style={{ position: 'absolute', zIndex: 99, backgroundColor: 'white', right: dynamicSize(20), top: dynamicSize(20), borderColor: themeColor, borderWidth: 1 }}>

                                <TouchableOpacity onPress={() => this.hitPublishDeleteApiApi(item, item.status == 1 ? 2 : 1)}
                                    style={{ padding: dynamicSize(5), paddingHorizontal: dynamicSize(20) }}>
                                    <Text style={{ fontSize: getFontSize(10), color: '#7a7a7a', fontFamily: fontFamily('bold') }}>{item.status == 1 ? 'In-Activate' : 'Activate'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.hitPublishDeleteApiApi(item, 3)}
                                    style={{ padding: dynamicSize(5), paddingHorizontal: dynamicSize(20) }}>
                                    <Text style={{ fontSize: getFontSize(10), color: '#7a7a7a', fontFamily: fontFamily('bold') }}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ padding: dynamicSize(5), paddingHorizontal: dynamicSize(20) }}>
                                    <Text style={{ fontSize: getFontSize(10), color: '#7a7a7a', fontFamily: fontFamily('bold') }}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("LocalAgents")}
                                    style={{ padding: dynamicSize(5), paddingHorizontal: dynamicSize(20) }}>
                                    <Text style={{ fontSize: getFontSize(10), color: '#7a7a7a', fontFamily: fontFamily('bold') }}>Market</Text>
                                </TouchableOpacity>
                            </ScrollView>

                            : null}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    refresh() {
        this.setState({ refreshing: true, loaderPosition: dynamicSize(10), dataCount: 10 })
        setTimeout(() => {
            this.hitGetAllListApi(this.state.headerData)
        }, 50);
    }
    _ItemLoadMore() {
        this.setState({ dataCount: this.state.dataCount + 5, refreshing: true, loaderPosition: height - dynamicSize(180) })
        setTimeout(() => {
            this.hitGetAllListApi(this.state.headerData)
        }, 50);
    }

    render() {
        return (
            <View style={styles.fullView}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Text style={{ fontFamily: fontFamily(), marginLeft: dynamicSize(10), marginTop: dynamicSize(10), fontSize: getFontSize(14), color: '#7a7a7a' }}>{this.state.propertyListCount <= 1 ? this.state.propertyListCount + " property found" : this.state.propertyListCount + " properties found"}</Text>
                {/* <View style={{width:width, height: dynamicSize(5),
                        backgroundColor:'#dcdcdc',marginVertical:dynamicSize(2)}}/> */}
                <ScrollView
                    style={{}}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (this.state.propertyList.length < this.state.propertyListCount) {
                                this._ItemLoadMore()
                            }

                        }
                    }}
                    scrollEventThrottle={400}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.refresh()}
                            progressViewOffset={this.state.loaderPosition}
                            colors={['white']}
                            progressBackgroundColor={themeColor}
                        />
                    }
                >
                    <FlatList
                        data={this.state.propertyList}
                        renderItem={({ item, index }) => this.showList(item, index)}
                        keyExtractor={(item, index) => index}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}

                        marginTop={dynamicSize(5)}
                        marginBottom={dynamicSize(10)}
                        extraData={this.state}
                        ref={(scroller) => { this.scroller = scroller }}
                    />
                    <View style={{ height: dynamicSize(60) }} />
                </ScrollView>

                <FloatButton onPress={() =>
                    this.props.navigation.navigate('Step1')}
                ///this.props.navigation.toggleDrawer()}
                />
            </View>
            // <Image resizeMode="stretch" source={require('../assets/icons/businessDashboard.jpg')} style={{flex:1}}/>
        )
    }
}

const styles = StyleSheet.create({
    fullView: {
        flex: 1,
        backgroundColor: '#fff'

    },
    propertyListRow: {
        width: width,
        backgroundColor: '#fff',
        flexDirection: 'row',


        borderBottomWidth: dynamicSize(8),
        borderBottomColor: '#e7e7e7'
    },
    imageView: {
        width: (width / 2) - dynamicSize(40),
        height: (width / 2) - dynamicSize(80),
        padding: dynamicSize(10),


    },
    detailView: {
        width: (width / 2) + dynamicSize(40), paddingVertical: dynamicSize(8),


    },
    propertyImage: {
        width: (width / 2) - dynamicSize(60),
        height: (width / 2) - dynamicSize(100),


    },
    propertyImageOpacity: {
        width: (width / 2) - dynamicSize(60),
        height: (width / 2) - dynamicSize(100),
        opacity: 0.4,
        backgroundColor: '#000000', position: 'absolute',
        left: dynamicSize(10), top: dynamicSize(10),

    },
    dateView: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'red', justifyContent: 'flex-end' },
    //dateText: { fontSize: getFontSize(10), color: '#fff', marginHorizontal: dynamicSize(5) },
    likeView: { position: 'absolute', top: dynamicSize(15), left: dynamicSize(15) },
    seenView: { backgroundColor: '#00000098', padding: dynamicSize(2), paddingHorizontal: dynamicSize(5), position: 'absolute', right: 0, top: 0 },

    rentText: { color: '#7a7a7a', fontSize: getFontSize(16), fontFamily: fontFamily('bold') },
    address1Text: { fontSize: getFontSize(11), color: themeColor, fontFamily: fontFamily('bold') },
    address2Text: { fontSize: getFontSize(11), fontFamily: fontFamily(), color: '#7a7a7a' },
    dateText: { fontSize: getFontSize(9), color: '#999999', fontFamily: fontFamily(), marginTop: dynamicSize(3) },
    BHKText: { fontSize: getFontSize(13), color: '#3c3c3c', marginTop: dynamicSize(8) }
});