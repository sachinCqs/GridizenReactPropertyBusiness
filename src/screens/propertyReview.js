import React, { Component } from 'react';
import { Platform, Image, AsyncStorage, Linking, TouchableOpacity, FlatList, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
const { height, width } = Dimensions.get('window');
import { NodeAPI } from '../services/webservice';
import { dynamicSize, getFontSize, fontFamily, themeColor, dateConverterMMDDYYYY } from '../utils/responsive';
import { ErrModal, Spinner, Toast } from '../components/toast';
import { NavigationActions, StackActions } from 'react-navigation';
import { checkUserName, validateEmail, validateFirstName, validateLastName, validatePassword, validateDOB, validatePhoneNo } from '../services/validation';

export default class PropertyDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            showToast: false,
            data: this.props.navigation.state.params.data,
            alertMessage: "",
            ErrModalVisible: false,
            errModalMessage: '',
            amenitiesArrPassedToReview: this.props.navigation.state.params.amenitiesArrPassedToReview || [],
            errMessageArr: [],
            headerData: '',
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
    _showimages(item, index) {
        return (
            <View style={{ width: width, height: dynamicSize(180), backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
                <Image style={{ width: width, height: dynamicSize(160) }} source={{ uri: 'data:image/png;base64,' + item.image }} />

                {
                    item.uploadType == 'D' ?
                        <TouchableOpacity onPress={() => this.openPdf(item.uri)}
                            style={{ position: 'absolute', top: dynamicSize(80) }}>
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

                <Image style={{ alignSelf: 'flex-end', marginRight: dynamicSize(2), tintColor: 'transparent' }} source={require('../assets/tick.png')} />


                <View style={{ alignItems: 'center' }}>

                    <Image source={{ uri: item.icon }} resizeMode="contain"
                        style={{ opacity: item.selected ? null : 0.2, height: ((width - dynamicSize(20)) / 4) / 2, width: ((width - dynamicSize(20)) / 4) / 2 }} />
                    <Text numberOfLines={2}
                        style={{ fontSize: getFontSize(10), textAlign: 'center', fontFamily: fontFamily(), color: item.selected ? themeColor : '#3c3c3c' }}>{item.name}</Text>
                </View>


            </TouchableOpacity>
        )
    }
    post(status) {
        var variables = this.state.data
        variables.status = status
        this.setState({ spinnerVisible: true })
        return NodeAPI(variables, "addProperty.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {
                    //alert(JSON.stringify(responseJson))
                    this.setState({ showToast: true, alertMessage: status == 2 ? "Property Saved Successfully." : responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                        status == 1 ?
                            this.props.navigation.navigate('Appointment', { propertyId: responseJson.propertyId, backTo: 5 })
                            :
                            this.props.navigation.pop(4)
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

    render() {
        return (
            <ScrollView style={styles.fullview}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Spinner visible={this.state.spinnerVisible} />
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <FlatList
                    data={this.state.data.propertyPhotos}
                    renderItem={({ item, index }) => this._showimages(item, index)}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    extraData={this.state}
                    pagingEnabled
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                // numColumns={2}
                // marginHorizontal={dynamicSize(20)}
                // style={{ alignSelf: this.state.ImagesArr.length > 1 ? "center" : "flex-start" }}
                />

                <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(15), }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(18), color: "#56B24D" }}>£ {this.state.data.expectedRent} PCM</Text>


                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), }}>{this.state.data.propertyId || ''}</Text>
                    </View>
                    <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginTop: dynamicSize(10) }}>{this.state.data.address}</Text>
                    <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginTop: dynamicSize(6) }}>Posted on {dateConverterMMDDYYYY(new Date())}</Text>

                </View>


                {/* <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(15), flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View>
                        <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(18), color: "#56B24D" }}>£ {this.state.data.expectedRent} PCM</Text>
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginTop: dynamicSize(10) }}>{this.state.data.address}</Text>
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginTop: dynamicSize(6) }}>Posted on {dateConverterMMDDYYYY(new Date())}</Text>

                    </View>
                    <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginRight: dynamicSize(10) }}> {this.state.data.propertyId || ''}</Text>
                </View> */}

                <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(12), flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={require("../assets/propertyDetail/size-icn.png")} />
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginLeft: dynamicSize(10) }}>{this.state.data.builtUp.value + " " + this.state.data.builtUp.sqFtunit}</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={require("../assets/propertyDetail/recption-icn.png")} />
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginLeft: dynamicSize(10) }}>{this.state.data.reception} Reception</Text>
                    </View>

                </View>
                <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(7), flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={require("../assets/propertyDetail/bed-icn.png")} />
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginLeft: dynamicSize(10) }}>{this.state.data.bedrooms} Bedrooms</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                        <Image source={require("../assets/propertyDetail/cal-icn.png")} />
                        <View style={{ marginLeft: dynamicSize(10) }}>
                            <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(9), color: "#56B24D" }}>Available from</Text>
                            <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14) }}>{dateConverterMMDDYYYY(new Date(this.state.data.availableFrom))}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(7), flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={require("../assets/propertyDetail/recption-icn.png")} />
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(14), marginLeft: dynamicSize(10) }}>{this.state.data.bathrooms} Bathrooms</Text>
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
                    {this.makeSquareView('', this.state.amenitiesArrPassedToReview)}
                </View>
                <View style={{ height: dynamicSize(10), width: width, backgroundColor: "#FAFAFA" }}></View>

                <Text style={{ fontFamily: fontFamily("bold"), fontSize: getFontSize(14), marginLeft: dynamicSize(15), marginTop: dynamicSize(15) }}>Description :</Text>

                <Text numberOfLines={6} style={{ fontFamily: fontFamily(), fontSize: getFontSize(13), marginHorizontal: dynamicSize(15), marginTop: dynamicSize(15) }}>{this.state.data.otherDetails}</Text>

                <TouchableOpacity>
                    <Text style={{ fontFamily: fontFamily("bold"), textAlign: "right", fontSize: getFontSize(14), marginRight: dynamicSize(15), marginTop: dynamicSize(15), color: "#56B24D", textDecorationLine: "underline" }}>View full details ></Text>
                </TouchableOpacity>

                <View style={[styles.accomodationView, { marginBottom: dynamicSize(5) }]}>


                    <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2' }}
                        onPress={() => this.post(2)}>
                        <Text style={styles.boldText}>Save Draft</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2', backgroundColor: '#F49930' }}
                        onPress={() => this.post(1)}>
                        <Text style={[styles.boldText, { color: 'white' }]}>Publish</Text>
                    </TouchableOpacity>
                </View>
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
    boldText: { fontSize: getFontSize(14), fontFamily: fontFamily('bold') },

    accomodationView: { alignItems: 'center', borderTopColor: "#A2A8A2", borderTopWidth: 0, padding: dynamicSize(10), flexDirection: 'row', paddingHorizontal: dynamicSize(10) },

});