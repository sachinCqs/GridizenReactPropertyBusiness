import React, { Component } from 'react';
import { Platform, TouchableWithoutFeedback, ScrollView, Image, AsyncStorage, Dimensions, FlatList, TouchableOpacity, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
import { dynamicSize, getFontSize, dateConverterMMDDYYYY, themeColor, fontFamily } from '../utils/responsive';
const { height, width } = Dimensions.get('window');
import { ErrModal, Toast, Spinner } from '../components/toast';
import { NodeAPI } from '../services/webservice';
import DateTimePicker from 'react-native-modal-datetime-picker';
var carpenterServices = [
    {
        name: 'Repairs & fixes',
        select: false,
    },
    {
        name: 'New furniture making',
        select: false,
    }
]
var plumbingServices = [
    {
        name: 'Repairs & fixes',
        select: false,
    },
    {
        name: 'Standard installation services',
        select: false,
    }
]
var electricianServices = [
    {
        name: 'Repairs & fixes',
        select: false,
    },
    {
        name: 'Standard installation services',
        select: false,
    }
]
export default class AgentList extends Component {




    constructor(props) {
        super(props)
        this.state = {
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            ErrModalVisible: false,
            errModalMessage: '',
            services: [
                {
                    name: 'Find me a Tenant',
                    select: false,
                }, {
                    name: 'Manage viewings',
                    select: false,

                }, {
                    name: 'Tenent referencing, checking and tenancy agreements',
                    select: false,

                },
                {
                    name: 'Deposit collection and registration',
                    select: false,
                },
                {
                    name: 'Rent collection',
                    select: false,
                },
                {
                    name: 'Full property maintenance and managment',
                    select: false,
                }
            ],
            selectedArr: [],
            title: 'ggent service',
            propertyId: this.props.navigation.state.params.propertyId
        }
    }
    componentWillMount() {
        var type = this.props.navigation.state.params.serviceType

        if (type == 'Plumbing') {
            this.setState({
                services: plumbingServices, title: "plumbing service"
            })
        } else if (type == 'Electrician') {
            this.setState({
                services: electricianServices, title: "electrician service"
            })
        } else if (type == 'Carpenters') {
            this.setState({
                services: carpenterServices, title: "carpenter service"
            })
        }
        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                // spinnerVisible: true
            })
        })
    }
    onRadioPress(index) {
        var arr = this.state.services
        // for (var i = 0; i < arr.length; i++) {
        //     if (i == index) {
        //         arr[i].select ? null :
        //             arr[i].select = !arr[i].select
        //     } else {
        //         arr[i].select = false
        //     }
        // }
        arr[index].select = !arr[index].select
        this.setState({ services: arr })
    }
    showList(item, index) {

        return (
            <View style={{ marginVertical: dynamicSize(10) }}>

                <TouchableWithoutFeedback onPress={() => this.onRadioPress(index)}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image resizeMode='contain' style={{ tintColor: themeColor }}
                            source={item.select ? require('../assets/checked.png') : require('../assets/unchecked.png')} />
                        <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(14), color: '#7a7a7a', textAlign: 'left', alignSelf: 'flex-start', marginLeft: dynamicSize(10) }}>{item.name}</Text>

                    </View>
                </TouchableWithoutFeedback>
                <View style={{ flex: 1, marginLeft: dynamicSize(35), marginTop: dynamicSize(6) }}>
                    {/* {this.makeList(item.list)} */}
                    {/* {item.list.map((i) => {
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: dynamicSize(3), height: dynamicSize(20) }}>
                                <View style={{ backgroundColor: '#7a7a7a90', height: dynamicSize(4), width: dynamicSize(4), borderRadius: dynamicSize(2) }}></View>
                                <Text style={{ color: '#7a7a7a', fontFamily: fontFamily(), fontSize: getFontSize(12), marginLeft: dynamicSize(10) }}>{i.data}</Text>
                            </View>
                        )
                    })} */}
                </View>


            </View>
        )
    }

    _goNotify() {
        var arr = this.state.services;
        var result = this.state.selectedArr;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].select) {
                result.push(arr[i].name)
            }
        }
        this.setState({ selectedArr: result })
        console.log("@@", result)
        if (this.state.selectedArr.length == 0) {
            this.setState({ showToast: true, alertMessage: "Please select atleast one service" })
            setTimeout(() => {
                this.setState({ showToast: false })
            }, 3000);
        }
        else {
            this.setState({ spinnerVisible: true })
            variables = {
                propertyId: this.state.propertyId,
                agentService: this.state.selectedArr
            }
            return NodeAPI(variables, "sendAgentPropertyNotification.json/", 'POST', this.state.headerData.token, this.state.headerData.userid)
                .then(responseJson => {
                    this.setState({ spinnerVisible: false })
                    if (responseJson.response_code === 'success') {
                        this.setState({ showToast: true, alertMessage: responseJson.msg })
                        setTimeout(() => {
                            this.setState({ showToast: false })
                            this.props.navigation.navigate('MyServicesOfDrawer')
                        }, 3000);
                    } else {
                        this.setState({ showToast: true, alertMessage: responseJson.msg })
                        setTimeout(() => {
                            this.setState({ showToast: false })

                        }, 3000);
                    }
                })
        }
    }


    render() {
        return (
            <ScrollView style={styles.fullView}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Spinner visible={this.state.spinnerVisible} />

                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <View style={{ paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(20) }}>
                    <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(16), color: '#7a7a7a', textAlign: 'left', alignSelf: 'flex-start', marginHorizontal: dynamicSize(5) }}>Which {" " + this.state.title + " "} do you require?</Text>

                    <FlatList
                        data={this.state.services}
                        renderItem={({ item, index }) => this.showList(item, index)}
                        keyExtractor={(item, index) => index}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        marginHorizontal={dynamicSize(5)}
                        marginTop={dynamicSize(15)}

                        extraData={this.state}
                        ref={(scroller) => { this.scroller = scroller }}
                    />

                    <TouchableOpacity onPress={() => this._goNotify()}
                        style={{ backgroundColor: '#F49930', width: '100%', paddingVertical: dynamicSize(10), marginVertical: dynamicSize(30) }}>
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(16), color: '#fff', textAlign: 'center', alignSelf: 'center' }}>Continue</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
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
});