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
export default class Dashboard extends Component {



    constructor(props) {
        super(props)
        this.state = {

            headerData: '',
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            refreshing: false,
            packagesList: [
                {
                    color: '#cacaca',
                    list: [
                        { data: 'Find a tenant' },

                    ]
                }, {
                    color: '#c39f58',
                    list: [
                        { data: 'Find a tenant' },
                        { data: 'Arrange viewing' },
                        { data: 'Tenant onboarding' },
                        { data: 'Collect rent' },

                    ]
                }, {
                    color: '#6a7378',
                    list: [
                        { data: 'Find a tenant' },
                        { data: 'Arrange viewing' },
                        { data: 'Tenant onboarding' },
                        { data: 'Collect rent' },
                        { data: 'Maintain properly' },
                        { data: 'Manage services' },
                    ]
                }
            ]
        }
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

    showList(item, index) {

        return (
            <View style={{ borderColor: '#a2a8a2', borderWidth: 0.5, borderRadius: dynamicSize(6), backgroundColor: 'white', marginTop: index == 0 ? 0 : -7, width: '100%' }}>
                <View style={{
                    height: dynamicSize(60),
                    right: dynamicSize(20), top: dynamicSize(10),
                    position: 'absolute',
                    zIndex: 99,
                    alignItems: 'center', justifyContent: 'center',
                    width: dynamicSize(60),
                    borderRadius: dynamicSize(30), borderWidth: dynamicSize(5), borderColor: 'white', backgroundColor: item.color
                }}>
                    <Text style={{ color: 'white', fontFamily: fontFamily(), fontSize: getFontSize(14) }}>£14</Text>
                </View>
                <View style={{ height: dynamicSize(40), backgroundColor: item.color, width: '100%', borderTopLeftRadius: dynamicSize(6), borderTopRightRadius: dynamicSize(6) }} ></View>
                <View style={{ width: '100%', flexDirection: 'row', }}>
                    <View style={{ flex: 1, margin: dynamicSize(10), }}>
                        {/* {this.makeList(item.list)} */}
                        {item.list.map((i) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: dynamicSize(3), height: dynamicSize(20) }}>
                                    <View style={{ backgroundColor: item.color, height: dynamicSize(8), width: dynamicSize(8), borderRadius: dynamicSize(4) }}></View>
                                    <Text style={{ color: '#7a7a7a', fontFamily: fontFamily(), fontSize: getFontSize(12), marginLeft: dynamicSize(5) }}>{i.data}</Text>
                                </View>
                            )
                        })}
                    </View>
                    <View style={{ width: dynamicSize(100), alignItems: 'center', paddingTop: dynamicSize(40), paddingBottom: dynamicSize(20) }}>
                        <Text style={{ fontFamily: fontFamily(), color: item.color, fontSize: getFontSize(12), textDecorationLine: 'underline', textDecorationColor: item.color }}>Buy now</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.fullView}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: dynamicSize(15) }}>
                        <View style={{ flexDirection: 'row', marginVertical: dynamicSize(10) }}>
                            <View style={{ width: '60%', }}>
                                <Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily('bold'), color: '#7a7a7a' }}>Allen & harris</Text>
                                <Text numberOfLines={2}
                                    style={{ fontSize: getFontSize(12), fontFamily: fontFamily(), color: '#7a7a7a' }}>84 Albany Road, Cardiff CF24 3RS, UK</Text>
                                <Text numberOfLines={2}
                                    style={{ fontSize: getFontSize(12), fontFamily: fontFamily(), color: '#7a7a7a' }}>We also cover </Text>
                                <View style={{ width: '60%', marginTop: dynamicSize(5) }}>
                                    <Image resizeMode="contain"
                                        style={{ width: '50%', height: dynamicSize(15), tintColor: '#7a7a7a' }}
                                        source={require('../assets/Agents/star.png')} />
                                </View>
                            </View>
                            <View style={{ width: '40%', }}>
                                <Image resizeMode="cover"
                                    style={{ width: '100%', height: dynamicSize(60) }}
                                    source={{ uri: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&h=350' }} />
                            </View>
                        </View>
                        <View style={{ borderBottomColor: '#a2a8a2', borderTopColor: '#a2a8a2', borderTopWidth: 0.5, borderBottomWidth: 0.5, paddingVertical: dynamicSize(8), flexDirection: 'row', justifyContent: 'space-between' }}>
                            {/* <View>
                <Text style={{ fontSize: getFontSize(11), fontFamily: fontFamily(),color: '#7a7a7a'  }}>Average time on market:{" "}
                <Text style={{ fontSize: getFontSize(11), fontFamily: fontFamily('bold'),color: '#7a7a7a'  }}>36 weeks
                
                </Text>
                </Text>
                </View>
                <View>
                <Text style={{ fontSize: getFontSize(11), fontFamily: fontFamily(),color: '#7a7a7a'  }}>Average rent:{' '}
                <Text style={{ fontSize: getFontSize(11), fontFamily: fontFamily('bold'),color: '#7a7a7a'  }}>£ 212 pcm
                
                </Text>
                </Text> 
                </View>   */}
                        </View>
                        <View style={{ borderColor: themeColor, borderWidth: 1, marginVertical: dynamicSize(10), paddingVertical: dynamicSize(10), alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: getFontSize(15), fontFamily: fontFamily(), color: '#7a7a7a' }}>See properties Available - 73</Text>
                        </View>
                        <Text style={{ fontSize: getFontSize(13), fontFamily: fontFamily('bold'), color: '#7a7a7a', marginVertical: dynamicSize(10) }}>Packages</Text>

                        <FlatList
                            data={this.state.packagesList}
                            renderItem={({ item, index }) => this.showList(item, index)}
                            keyExtractor={(item, index) => index}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}


                            extraData={this.state}
                            ref={(scroller) => { this.scroller = scroller }}
                        />
                    </View>
                    <View style={{ width: width, zIndex: 99, marginVertical: dynamicSize(15), height: dynamicSize(10), backgroundColor: '#eef3fa' }} />
                    <View style={{ paddingHorizontal: dynamicSize(15) }}>
                        <Text style={{ fontSize: getFontSize(13), fontFamily: fontFamily('bold'), color: '#7a7a7a', }}>Overview</Text>

                        <Text 
                            style={{ fontSize: getFontSize(12), marginTop: dynamicSize(5), fontFamily: fontFamily(), color: '#7a7a7a',marginBottom:dynamicSize(25) }}>Allen & Harris in Roath is located on the busting Albany road area of cardiff. </Text>

                    </View>
                </ScrollView>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    fullView: {
        flex: 1,
        backgroundColor: '#fff',


    },
});