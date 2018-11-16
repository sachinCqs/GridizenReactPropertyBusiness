import React, { Component } from 'react';
import { Platform, TouchableWithoutFeedback, RefreshControl, ScrollView, Image, AsyncStorage, Dimensions, FlatList, TouchableOpacity, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
import { dynamicSize, getFontSize, dateConverterMMDDYYYY, themeColor, fontFamily } from '../utils/responsive';
const { height, width } = Dimensions.get('window');
import { ErrModal, Toast, Spinner } from '../components/toast';
import { NodeAPI } from '../services/webservice';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux'
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};
class MyServices extends Component {




    constructor(props) {
        super(props)
        this.state = {
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            ErrModalVisible: false,
            errModalMessage: '',
            myRequest: [
                // { agents: [1, 2, 3] },
                // { agents: [] },
                // { agents: [1, 2, 3, 4, 5, 6, 7, 8] }

            ],
            selectedTab: 'MyRequest',
            archivedRequest: [],
            dataCount: 15,
            totalMyRequestData: 0,

            pageNo: 0,
            refreshing: false
        }
    }
    componentWillMount() {
        // var data = this.props.userObject
        // data.name = 'oooooo'
        // this.props.userObjectValue(data)
        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })
            this.getAllRequest(paramData)
        })
    }
    getAllRequest(paramData) {

        // this.setState({ refreshing: true })

        return NodeAPI({}, "getAllPropertiesByAgentService.json/" + this.state.pageNo + '/' + this.state.dataCount, 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false, refreshing: false })
                if (responseJson.response_code === 'success') {
                    // alert(JSON.stringify(responseJson.areaunits.length))
                    console.log(JSON.stringify(responseJson))
                    this.setState({ myRequest: [...this.state.myRequest, ...responseJson.properties], totalMyRequestData: responseJson.total })
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
    makeAgentsImageView(agents) {
        var count = agents.length > 5 ? 5 : agents.length

        var arr = []
        for (var i = 0; i < count; i++) {
            arr.push(this.makeImageView(agents[i]))
        }
        agents.length > 5 ?
            arr.push(<Text style={{ fontSize: getFontSize(11), color: '#7a7a7a', marginLeft: dynamicSize(10) }}>+{+ agents.length - count + ' More'}</Text>)
            : null
        return (
            arr
        )
    }
    makeImageView(item) {
        return (
            <View style={{ height: dynamicSize(40), width: dynamicSize(40), borderRadius: dynamicSize(20), borderWidth: dynamicSize(1), borderColor: '#e7e7e7' }}>
                <Image style={{ height: dynamicSize(40), width: dynamicSize(40), borderRadius: dynamicSize(20), marginRight: dynamicSize(3) }} resizeMode='cover'
                    source={item.image != '' ? { uri: item.image + '?' + new Date() } : require('../assets/userProfile.png')} />
            </View>
        )
    }
    showList(item, index) {

        return (
            <TouchableWithoutFeedback onPress={() => item.totalQuotes != 0 ? this.props.navigation.navigate('LocalAgents', { propertyId: item.id }) : null}>
                <View style={{ backgroundColor: '#f5f5f5' }}>
                    <View style={{ padding: dynamicSize(15), marginBottom: dynamicSize(10), backgroundColor: 'white' }}>
                        <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(14), color: '#7a7a7a', }}>{item.bedroom + ' '} BHK {' ' + item.propertyType}  </Text>
                        <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(13), color: '#7a7a7a', marginTop: dynamicSize(6) }}>{item.address}</Text>
                        <View style={{ marginVertical: dynamicSize(10), flexDirection: 'row', paddingHorizontal: dynamicSize(10), alignItems: 'center' }}>
                            <Image source={require('../assets/user.png')} />
                            <Text style={{ fontFamily: fontFamily(), fontSize: getFontSize(12), color: '#7a7a7a', marginLeft: dynamicSize(6) }}>{item.totalQuotes == 0 ? 'Waiting for response' : (item.totalQuotes + ' Agents have responded to your request')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: dynamicSize(7), }}>
                            {item.latestAgentQuotes.length != 0 ? this.makeAgentsImageView(item.latestAgentQuotes) : null}
                        </View>

                        <Text onPress={() => this.props.navigation.navigate('PropertyDetails', { data: { id: item.id } })}
                            style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(12), color: '#7388e7', alignSelf: 'flex-end' }}>View property</Text>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    _ItemLoadMore() {
        this.setState({ refreshing: true, pageNo: this.state.pageNo + 1 })
        setTimeout(() => {
            this.getAllRequest(this.state.headerData)
        }, 200);

    }
    refresh() {

    }
    render() {
        return (
            <View style={styles.fullView}>
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <Spinner visible={this.state.spinnerVisible} />

                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <View style={{ width: width, height: dynamicSize(50), flexDirection: 'row', borderTopColor: '#e7e7e7', borderBottomColor: '#e7e7e7', borderTopWidth: 0.5, borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}
                        style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center', height: dynamicSize(50) }}>
                        <Image resizeMode='contain'
                            source={require('../assets/backArrow.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ selectedTab: 'MyRequest' })}
                        style={{ flex: 1, height: dynamicSize(49), alignItems: 'center', justifyContent: 'center', }}>
                        <View style={{ height: dynamicSize(49), justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: this.state.selectedTab == 'MyRequest' ? themeColor : 'transparent', paddingHorizontal: dynamicSize(15) }}>
                            <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(14), color: this.state.selectedTab == 'MyRequest' ? themeColor : '#7a7a7a' }}>My Request</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.setState({ selectedTab: 'ArchivedRequest' })}
                        style={{ flex: 1, height: dynamicSize(49), alignItems: 'center', justifyContent: 'center', }}>
                        <View style={{ height: dynamicSize(49), borderBottomWidth: 2, justifyContent: 'center', borderBottomColor: this.state.selectedTab != 'MyRequest' ? themeColor : 'transparent', paddingHorizontal: dynamicSize(15) }}>
                            <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(14), color: this.state.selectedTab != 'MyRequest' ? themeColor : '#7a7a7a' }}>Archived Request</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={{}}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (this.state.myRequest.length < this.state.totalMyRequestData) {
                                this._ItemLoadMore()
                            }

                        }
                    }}
                    scrollEventThrottle={400}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.refresh()}
                            progressViewOffset={height - dynamicSize(150)}
                            colors={['white']}
                            progressBackgroundColor={themeColor}
                        />
                    }
                >

                    <FlatList
                        data={this.state.selectedTab == 'MyRequest' ? this.state.myRequest : this.state.archivedRequest}
                        renderItem={({ item, index }) => this.state.selectedTab == 'MyRequest' ? this.showList(item, index) : null}
                        keyExtractor={(item, index) => index}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        marginHorizontal={dynamicSize(5)}
                        marginTop={dynamicSize(5)}

                        extraData={this.state}
                        ref={(scroller) => { this.scroller = scroller }}
                    />
                </ScrollView>



            </View >
            // <Image resizeMode="stretch" source={require('../assets/icons/businessDashboard.jpg')} style={{flex:1}}/>
        )
    }
}

const styles = StyleSheet.create({
    fullView: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: "#fff"
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

export default connect(mapStateToProps, mapDispatchToPops)(MyServices);