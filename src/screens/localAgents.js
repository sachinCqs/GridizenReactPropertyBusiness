import React, { Component } from 'react';
import { Platform, TouchableWithoutFeedback, Image, AsyncStorage, Dimensions, FlatList, TouchableOpacity, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
import { dynamicSize, getFontSize, dateConverterMMDDYYYY, themeColor, fontFamily } from '../utils/responsive';
const { height, width } = Dimensions.get('window');
import { ErrModal, Toast, Spinner } from '../components/toast';
import { NodeAPI } from '../services/webservice';
import DateTimePicker from 'react-native-modal-datetime-picker';
var text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

var addressOpen = false
export default class AgentList extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Local Agents",
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center', color: "#a2a8a2" },
        headerStyle: {
            backgroundColor: 'white',
        },
    });


    constructor(props) {
        super(props)
        this.state = {
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            dataCount: 100,

            pageNo: 0,
            AgentsArr: [
                // {
                //     name: "Allen & Haris",
                //     address: "84 Albany Road, Cardiff CF24 3RS, UK",
                //     image: "",
                //     propertyOnRent: 73,
                //     averageRent: "£888 pcm",
                //     averageTime: "36 weeks",
                //     showAddress: false
                // },
                // {
                //     name: "Allen & Haris",
                //     address: "84 Albany Road, Cardiff CF24 3RS, UK",
                //     image: "",
                //     propertyOnRent: 73,
                //     averageRent: "£888 pcm",
                //     showAddress: false,
                //     averageTime: "36 weeks",
                // },
                // {
                //     name: "Allen & Haris",
                //     showAddress: false,
                //     address: "84 Albany Road, Cardiff CF24 3RS, UK",
                //     image: "",
                //     propertyOnRent: 73,
                //     averageRent: "£888 pcm",
                //     averageTime: "36 weeks",
                // },
                // {
                //     name: "Allen & Haris",
                //     address: "84 Albany Road, Cardiff CF24 3RS, UK",
                //     image: "",
                //     propertyOnRent: 73,
                //     showAddress: false,
                //     averageRent: "£888 pcm",
                //     averageTime: "36 weeks",
                // },
                // {
                //     name: "Allen & Haris",
                //     showAddress: false,
                //     address: "84 Albany Road, Cardiff CF24 3RS, UK",
                //     image: "",
                //     propertyOnRent: 73,
                //     averageRent: "£888 pcm",
                //     averageTime: "36 weeks",
                // }
            ]
        }
    }
    componentWillMount() {
        addressOpen = false
        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })
            this.getAllAgentList(paramData)
        })
    }
    getAllAgentList(paramData) {

        // this.setState({ refreshing: true })

        return NodeAPI({}, "getAllAgentQuotesByProperty.json/" + this.props.navigation.state.params.propertyId + '/' + this.state.pageNo + '/' + this.state.dataCount, 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, refreshing: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    console.log(JSON.stringify(responseJson))
                    var arr = responseJson.quotes
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].showAddress = false
                        arr[i].agentDetail.image = arr[i].agentDetail.image + '?' + new Date()
                    }
                    this.setState({ AgentsArr: arr })
                    // console.log(new Date(responseJson.propertyviewings[0].viewing_date.split('T')[0]))
                } else {

                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })

                    }, 3000);
                }
                //alert(JSON.stringify(response));
            })


    }
    showHide(index) {
        var arr = this.state.AgentsArr
        addressOpen = false
        for (var i = 0; i < arr.length; i++) {
            if (i == index) {
                arr[i].showAddress = !arr[i].showAddress
                if (arr[i].showAddress) {
                    addressOpen = true
                }
            } else {
                arr[i].showAddress = false
            }
        }
        this.setState({ AgentsArr: arr })
    }
    buy() {
        this.setState({ showToast: true, alertMessage: 'Payment successful.' })
        setTimeout(() => {
            this.setState({ showToast: false })
            this.props.navigation.goBack()

        }, 3000);
    }
    showList(item, index) {
        return (
            <View style={{ backgroundColor: 'white', zIndex: 99 }}>
                <TouchableWithoutFeedback onPress={() => this.showHide(index)}>
                    <View style={{
                        position: 'absolute', backgroundColor: '#EDEDED90',
                        height: addressOpen == true ? (item.showAddress ? '0%' : '100%') : '0%',
                        width: addressOpen == true ? (item.showAddress ? '0%' : '100%') : '0%',
                        zIndex: 2
                    }} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback

                    onPress={() => this.showHide(index)}
                //onPress={() => this.props.navigation.navigate('AgentDescription')}
                >
                    <View style={{ position: 'relative', paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(15) }}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: dynamicSize(5) }}>
                            <View style={{ flex: 1.7, marginRight: dynamicSize(20) }}>
                                <Text style={{ color: addressOpen == true ? item.showAddress ? themeColor : "#7a7a7a" : "#7a7a7a", fontFamily: fontFamily("bold"), fontSize: getFontSize(15) }}>{item.agentDetail.name}</Text>
                                <Text style={{ marginTop: dynamicSize(5), color: "#7a7a7a", fontFamily: fontFamily(), fontSize: getFontSize(13) }}>{item.agentDetail.address}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Image resizeMode='cover'
                                    style={{ flex: 1, height: dynamicSize(50) }} source={{ uri: item.agentDetail.image }} />
                            </View>
                        </View>
                        <Image style={{ height: dynamicSize(15), width: dynamicSize(70) }} source={require("../assets/Agents/star.png")} />
                        <Text style={{ marginTop: dynamicSize(5), color: "#7a7a7a", fontFamily: fontFamily(), fontSize: getFontSize(11) }}>{item.comment}</Text>
                        {
                            item.showAddress ?
                                <Text style={{ marginTop: dynamicSize(10), color: "#7a7a7a", fontFamily: fontFamily(), fontSize: getFontSize(11) }}>{item.agentDetail.about_us || ''}</Text>
                                : null
                        }

                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: dynamicSize(10), alignItems: 'center' }}>
                            <Text style={{ color: "#7a7a7a", fontFamily: fontFamily(), fontSize: getFontSize(15) }}>Offer Price :
                                <Text style={{ color: "#7a7a7a", fontFamily: fontFamily('bold'), fontSize: getFontSize(15) }}>{' '}£{item.quote} </Text>

                            </Text>
                            {
                                item.showAddress ?
                                    <TouchableOpacity
                                        onPress={() => this.buy()}
                                        style={{ backgroundColor: '#F49930', width: '45%', paddingVertical: dynamicSize(8), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={require('../assets/Agents/cart.png')} />
                                        <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(10), color: 'white', marginLeft: dynamicSize(5) }}>Buy this Service</Text>

                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity>
                                        <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(12), color: '#7388e7', alignSelf: 'flex-end' }}>Contact</Text>

                                    </TouchableOpacity>
                            }

                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ width: width, height: dynamicSize(7), backgroundColor: "#e7e7e7" }}></View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.fullView}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Spinner visible={this.state.spinnerVisible} />
                <View style={{ width: width, flexDirection: 'row', borderTopColor: '#e7e7e7', borderBottomColor: '#e7e7e7', borderTopWidth: 0.5, borderBottomWidth: 1, paddingVertical: dynamicSize(10) }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}
                        style={{ paddingHorizontal: dynamicSize(15), alignItems: 'center', }}>
                        <Image resizeMode='contain'
                            source={require('../assets/backArrow.png')} />
                    </TouchableOpacity>
                    <View
                        style={{ flex: 1, alignItems: 'flex-start', marginLeft: dynamicSize(5), marginTop: dynamicSize(3) }}>

                        <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(14), color: '#7a7a7a' }}>Agents response your property:</Text>
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(13), color: '#7a7a7a' }}>{this.state.AgentsArr.length != 0 ? this.state.AgentsArr[0].propertyDetail.bedroom : '' + ' '} Bhk {' ' + this.state.AgentsArr.length != 0 ? this.state.AgentsArr[0].propertyDetail.property_type_name : '' + ' '} in {' ' + this.state.AgentsArr.length != 0 ? this.state.AgentsArr[0].propertyDetail.address : '' + ' '}</Text>

                    </View>


                </View>
                <FlatList
                    data={this.state.AgentsArr}
                    renderItem={({ item, index }) => this.showList(item, index)}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    //marginTop={dynamicSize(5)}
                    marginBottom={dynamicSize(10)}
                    extraData={this.state}
                    ref={(scroller) => { this.scroller = scroller }}
                />
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
        backgroundColor: "white"
    },
    propertyListRow: {
        width: width,
        backgroundColor: '#fff',
        flexDirection: 'row',


        borderBottomWidth: dynamicSize(5),
        borderBottomColor: '#dcdcdc'
    },
    imageView: {
        width: (width / 2) - dynamicSize(40),
        height: (width / 2) - dynamicSize(80),
        padding: dynamicSize(10)

    },
    detailView: {
        width: (width / 2) + dynamicSize(40), paddingVertical: dynamicSize(8),


    },
    propertyImage: {
        width: (width / 2) - dynamicSize(60),
        height: (width / 2) - dynamicSize(100)
    },
    dateView: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'red', justifyContent: 'flex-end' },
    //dateText: { fontSize: getFontSize(10), color: '#fff', marginHorizontal: dynamicSize(5) },
    likeView: { position: 'absolute', top: dynamicSize(15), left: dynamicSize(18) },
    seenView: { backgroundColor: '#00000098', padding: dynamicSize(2), paddingHorizontal: dynamicSize(5), position: 'absolute', right: 0, top: 0 },

    rentText: { color: 'grey', fontSize: getFontSize(16), fontFamily: fontFamily('bold') },
    address1Text: { fontSize: getFontSize(11), color: themeColor, fontFamily: fontFamily('bold') },
    address2Text: { fontSize: getFontSize(11), fontFamily: fontFamily() },
    dateText: { fontSize: getFontSize(10), color: '#a2a8a2', fontFamily: fontFamily(), marginTop: dynamicSize(3) },
    BHKText: { fontSize: getFontSize(13), color: '#3c3c3c', marginTop: dynamicSize(8) }
});