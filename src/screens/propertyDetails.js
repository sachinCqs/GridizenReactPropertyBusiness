import React, { Component } from 'react';
import { Platform, Image, AsyncStorage, Linking, TouchableWithoutFeedback, ViewPagerAndroid, TouchableOpacity, FlatList, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
const { height, width } = Dimensions.get('window');
import { NodeAPI } from '../services/webservice';
import { dynamicSize, getFontSize, fontFamily, dateConverterMMDDYYYY, themeColor } from '../utils/responsive';
import { ErrModal, Spinner, Toast } from '../components/toast';
import { NavigationActions, StackActions } from 'react-navigation';
import { checkUserName, validateEmail, validateFirstName, validateLastName, validatePassword, validateDOB, validatePhoneNo } from '../services/validation';
import BottomModal from '../List_Modal/bottomModal'
export default class PropertyDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            showToast: false,
            data: [],
            alertMessage: "",
            ErrModalVisible: false,
            errModalMessage: '',
            errMessageArr: [],
            webUrl: '',
            show: false,
            webHeight: 0,
            bottomModalVisible: false,

            ImagesArr: [
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225615M-1539183204.jpeg" } },
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225621M-1539183062.jpeg" } },
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225615M-1539183204.jpeg" } },
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225621M-1539183062.jpeg" } },
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225615M-1539183204.jpeg" } },
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225621M-1539183062.jpeg" } },
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225615M-1539183204.jpeg" } },
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225621M-1539183062.jpeg" } },
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225615M-1539183204.jpeg" } },
                { image: { uri: "https://mediacdn.99acres.com/7211/5/144225621M-1539183062.jpeg" } },
            ],
            description: "A 3 bedroom resale flat, located in sarita vihar, delhi south, is available. It is a ready to move in flat located in on request. Situated in a prominent locality, it is a 5-10 year old property, which is in its prime condition. The flat is on the 1st floor of the building. Aesthetically designed, this property has 2 bathroom(S). The property also has more than 3balcony(S). The flat has a good view of the locality. The flat is a freehold property and has a super built-Up area of 1750. 0 sq. Ft. The flat offers good security. The unit has 2 open parking."

        };
    }
    componentWillMount() {
        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })
            var id = this.props.navigation.state.params.data.id
            // getAllProperties.json/:page/:pageSize/:sortBy/:sortType/:search?
            return NodeAPI({}, "getProperty.json/" + id, 'GET', paramData.token, paramData.userid)
                .then(responseJson => {
                    this.setState({ spinnerVisible: false })
                    if (responseJson.response_code === 'success') {
                        // alert(JSON.stringify(responseJson.areaunits.length))
                        console.log(JSON.stringify(responseJson))
                        this.setState({ data: responseJson.property })
                        // var arr = responseJson.properties
                        // for (var i = 0; i < responseJson.properties.length; i++) {
                        //     arr[i].like = false
                        // }
                        // this.setState({ propertyList: arr })
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

        })
    }
    openPdf(url) {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }
    makeImagesArr(data) {
        var arr = []
        for (var i = 0; i < data.length; i++) {
            arr.push(this._showimages(data[i], i))
        }
        return (
            <View>
                {
                    Platform.OS == 'ios' ?
                        <ScrollView style={{ height: dynamicSize(220), width: width }}
                            horizontal
                            pagingEnabled


                        >
                            {arr}
                        </ScrollView>
                        :
                        <ViewPagerAndroid style={{ height: dynamicSize(220), width: width }}
                            horizontal
                            pagingEnabled


                        >
                            {arr}
                        </ViewPagerAndroid>
                }

            </View>
        )
    }
    _showimages(item, index) {
        return (
            <View style={{ width: width, height: dynamicSize(220), backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
                <Image style={{ width: '100%', height: dynamicSize(200) }} source={{ uri: item.image }} />

                {
                    item.type == 'D' ?
                        <TouchableOpacity onPress={() => this.openPdf(item.image)}
                            style={{ position: 'absolute', top: dynamicSize(100) }}>
                            <Text style={{ fontSize: getFontSize(16), fontFamily: fontFamily("bold"), color: "white" }}>{'Open File'}</Text>
                        </TouchableOpacity>
                        : null
                }

                <View style={{ marginTop: dynamicSize(3), flexDirection: "row", alignItems: "center" }}>
                    <Image style={{ height: dynamicSize(10), width: dynamicSize(10), tintColor: "white", marginRight: dynamicSize(3) }} source={require("../assets/photo-camera.png")} />
                    <Text style={{ fontSize: getFontSize(10), fontFamily: fontFamily("bold"), color: "white" }}>{index + 1 > 9 ? index + 1 : "0" + (index + 1)}/{this.state.data.propertyPhotos.length > 9 ? this.state.data.propertyPhotos.length : "0" + this.state.data.propertyPhotos.length}</Text>
                </View>
            </View>

        )
    }
    makeSquareView(type, data) {

        var arr = []

        // alert(JSON.stringify(dataArray))
        for (var i = 0; i < data.length; i++) {
            arr.push(this.makeSquare(data[i], i, type))
        }


        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.squareView}>
                {arr}
            </ScrollView>
        )
    }
    squareClick(index, type) {
        if (type == 'amenities') {
            var arr = this.state.amenitiesArr;
            arr[index].selected = !arr[index].selected

            this.setState({ amenitiesArr: arr, totalAmenitiesSelected: arr[index].selected ? this.state.totalAmenitiesSelected + 1 : this.state.totalAmenitiesSelected - 1 })

        } else {

            this.setState({ propertyArr: [] })
            var arr = this.state.propertyArr;
            for (var i = 0; i < arr.length; i++) {
                if (i == index) {
                    arr[index].selected = true
                    this.setState({ propertyType: arr[i].id })
                } else {
                    arr[i].selected = false
                }
            }

            this.setState({ propertyArr: arr })
        }
    }
    makeSquare(item, index, type) {
        return (
            <TouchableOpacity
                // onPress={() => this.squareClick(index, type)}
                style={{ height: (width - dynamicSize(20)) / 4, width: (width - dynamicSize(20)) / 4, borderColor: '#A2A8A2', borderWidth: 0.5, alignItems: 'center', justifyContent: 'center', borderLeftWidth: index == 0 ? 0.5 : 0 }}>




                <View style={{ alignItems: 'center' }}>

                    <Image source={{ uri: item.icon }} resizeMode="contain"
                        style={{ height: ((width - dynamicSize(20)) / 4) / 2, width: ((width - dynamicSize(20)) / 4) / 2 }} />
                    <Text numberOfLines={2}
                        style={{ fontSize: getFontSize(10), textAlign: 'center', fontFamily: fontFamily(), color: themeColor }}>{item.name}</Text>
                </View>


            </TouchableOpacity>
        )
    }

    hitPublishApi() {
        var variables = { id: this.state.data.id, status: 1 }

        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "changeStatusProperty.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    //alert(JSON.stringify(responseJson))
                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    this.props.navigation.state.params.updateList()
                    setTimeout(() => {
                        this.setState({ showToast: false })
                        this.props.navigation.navigate('Appointment', { propertyId: this.state.data.id, backTo: 2 })
                        // this.props.navigation.goBack()
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
    pickerDropdownModalRowSelected(item) {
        switch (item) {
            case 'Agent Services': this.props.navigation.navigate('AgentsServices', { propertyId: this.state.data.id })
        }
        this.setState({ bottomModalVisible: false })
    }

    render() {
        return (
            <ScrollView style={styles.fullview}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Spinner visible={this.state.spinnerVisible} />
                <BottomModal
                    pickerDropdownModalVisible={this.state.bottomModalVisible}
                    pickerDropdownModalClose={() =>
                        this.setState({ bottomModalVisible: false })
                    }
                    titleText={'Select Service Type'}
                    pickerDropdownModalListData={
                        ['Agent Services', 'Cleaning Services', 'Repair Services']
                    }
                    pickerDropdownModalRow={({ item, index }) => (
                        <TouchableWithoutFeedback
                            key={"abc" + index}
                            onPress={() => this.pickerDropdownModalRowSelected(item)}
                        >
                            <View
                                style={{
                                    padding: dynamicSize(15),
                                    paddingLeft: dynamicSize(25),
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    borderBottomColor: "#e7e7e7",
                                    borderBottomWidth: 1
                                }}
                            >
                                <Text
                                    style={{ fontSize: getFontSize(18), color: "#7a7a7a" }}
                                >
                                    {item}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                {/* <FlatList
                    data={this.state.data.propertyPhotos}
                    renderItem={({ item, index }) => this._showimages(item, index)}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    
                    extraData={this.state}
                    pagingEnabled
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                // numColumns={2}
                // marginHorizontal={dynamicSize(20)}
                // style={{ alignSelf: this.state.ImagesArr.length > 1 ? "center" : "flex-start" }}
                /> */}

                {this.state.data.propertyPhotos ? this.makeImagesArr(this.state.data.propertyPhotos) : null}

                <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(15), }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(18), color: "#56B24D" }}>£ {this.state.data.expectedRent} PCM</Text>


                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), }}>ID : {this.state.data.propertyId || ''}</Text>
                    </View>
                    <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginTop: dynamicSize(10) }}>{this.state.data.address}</Text>
                    <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginTop: dynamicSize(6) }}>Posted on {this.state.data.createdAt ? dateConverterMMDDYYYY(new Date(this.state.data.createdAt)) : ''}</Text>

                </View>

                <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(12), flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={require("../assets/propertyDetail/size-icn.png")} />
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginLeft: dynamicSize(10) }}>{this.state.data.build_up_area ? this.state.data.build_up_area + " " + this.state.data.build_up_area_unit : ''}</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={require("../assets/propertyDetail/recption-icn.png")} />
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginLeft: dynamicSize(10) }}>{this.state.data.reception} Reception</Text>
                    </View>

                </View>
                <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(7), flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={require("../assets/propertyDetail/bed-icn.png")} />
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginLeft: dynamicSize(10) }}>{this.state.data.bedroom} Bedrooms</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                        <Image source={require("../assets/propertyDetail/cal-icn.png")} />
                        <View style={{ marginLeft: dynamicSize(10) }}>
                            <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(9), color: "#56B24D" }}>Available from</Text>
                            <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14) }}>{this.state.data.available_from ? dateConverterMMDDYYYY(new Date(this.state.data.available_from)) : ''}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(7), flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={require("../assets/propertyDetail/recption-icn.png")} />
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginLeft: dynamicSize(10) }}>{this.state.data.bathroom} Bathrooms</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                        <Image source={require("../assets/propertyDetail/duration-icn.png")} />
                        <View style={{ marginLeft: dynamicSize(10) }}>
                            <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(9), color: "#56B24D" }}>Duration</Text>
                            <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14) }}>{this.state.data.rentDuration}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginVertical: dynamicSize(10), paddingHorizontal: dynamicSize(10) }}>
                    {this.makeSquareView('', this.state.data.amnities || [])}
                </View>
                <View style={{ height: dynamicSize(10), width: width, backgroundColor: "#FAFAFA" }}></View>

                <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(14), marginLeft: dynamicSize(15), marginTop: dynamicSize(15) }}>Description :</Text>

                <Text numberOfLines={this.state.show ? null : 2} style={{ fontFamily: fontFamily(), fontSize: getFontSize(13), marginHorizontal: dynamicSize(15), marginTop: dynamicSize(15) }}>
                    {this.state.data.detail}
                </Text>

                <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })}>
                    <Text style={{ fontFamily: fontFamily("bold"), textAlign: "right", fontSize: getFontSize(14), marginRight: dynamicSize(15), marginTop: dynamicSize(15), color: "#56B24D", textDecorationLine: "underline" }}>View {this.state.show ? ' less ' : ' full '} details ></Text>
                </TouchableOpacity>

                {
                    this.state.data.status == 2 ? null :
                        // <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: dynamicSize(10) }}>
                        //     <TouchableOpacity onPress={() => this.props.navigation.navigate('LocalAgents')} style={{ flex: 1, marginHorizontal: dynamicSize(15), height: dynamicSize(30), width: dynamicSize(200), justifyContent: "center", alignItems: "center", backgroundColor: "orange", alignSelf: "center", marginBottom: dynamicSize(15) }}>
                        //         <Text style={{ color: "white", fontSize: getFontSize(15), fontFamily: fontFamily() }}>Local Agents</Text>
                        //     </TouchableOpacity>
                        //     <TouchableOpacity
                        //         // onPress={() => this.state.data.message == 0 ? this.setState({ modalVisible: true }) : this.props.navigation.navigate("Message", { data: { propertyId: this.state.data.id, vendorId: this.state.data.vendorId } })} 
                        //         style={{ flex: 1, marginHorizontal: dynamicSize(15), height: dynamicSize(30), width: dynamicSize(200), justifyContent: "center", alignItems: "center", backgroundColor: "orange", alignSelf: "center", marginBottom: dynamicSize(15) }}>
                        //         <Text style={{ color: "white", fontSize: getFontSize(15), fontFamily: fontFamily() }}>Price Trends</Text>
                        //     </TouchableOpacity>
                        // </View>
                        <View style={[styles.accomodationView, { marginBottom: dynamicSize(20) }]}>

                            {this.state.data.agentService && this.state.data.agentService.length == 0 ?
                                <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2' }}
                                    onPress={() => this.setState({ bottomModalVisible: true })} >
                                    <Text style={styles.boldText}>Services</Text>
                                </TouchableOpacity>
                                : null}
                            <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2', backgroundColor: '#F49930' }}
                            >
                                <Text style={[styles.boldText, { color: 'white' }]}>Price Trends</Text>
                            </TouchableOpacity>
                        </View>
                }
                {this.state.data.status == 2 ?
                    <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(15), marginHorizontal: dynamicSize(15), marginVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2', backgroundColor: '#F49930' }}
                        onPress={() => this.hitPublishApi()}>
                        <Text style={[styles.boldText, { color: 'white' }]}>Publish</Text>
                    </TouchableOpacity>
                    : null}

            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    fullview: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        backgroundColor: "white"
    },
    accomodationView: { alignItems: 'center', borderTopColor: "#A2A8A2", borderTopWidth: 0, padding: dynamicSize(15), flexDirection: 'row', paddingHorizontal: dynamicSize(10) },

    boldText: { fontSize: getFontSize(14), fontFamily: fontFamily('bold') },

});