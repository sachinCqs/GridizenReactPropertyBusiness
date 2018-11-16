/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, TextInput, FlatList, Keyboard, ScrollView, Switch, sAsyncStorage, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Easing, Text, View, Image } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { dynamicSize, getFontSize, themeColor, fontFamily } from '../utils/responsive';
const { width, height } = Dimensions.get('window');
import { TextBoxWithTitleAndButton } from '../components/button'
import { ErrModal } from '../components/toast'
export default class Step1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            postCode: '',
            houseNo: '',
            postCodeErr: false,
            houseNoErr: false,
            totalListData: [],
            listData: [],
            ErrModalVisible: false,
            errModalMessage: '',
            houseNoSelected: false,
            latitude: '',
            longitude: ''
        }

    }
    selectItem(item) {
        this.setState({ houseNoSelected: true, houseNoErr: false })
        Keyboard.dismiss()
        this.setState({ houseNo: item.Text + " " + item.Description, listData: [] })
        this.getLatLong(item.Text + " " + item.Description)
    }
    renderList(item, index) {
        return (
            <TouchableOpacity onPress={() => this.selectItem(item)}
                style={styles.rowView}>
                <Text style={{ fontSize: getFontSize(14) }}>{item.Text + " " + item.Description}</Text>
            </TouchableOpacity>
        )
    }
    search(searchText) {
        console.log(searchText)
        this.setState({ postCode: searchText, postCodeErr: false })
        var init = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",

            }
        }
        var url = 'https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.00/json3ex.ws?Key=HJ76-UA59-PA53-ZW95&Text=' + searchText + '&Origin=GBR&Language=en&Container=GB%7CRM%7CENG%7C' + searchText.split(' ')[1] + '-' + searchText.split(' ')[0] + '&Filter=undefined&Instance=null&Test=false&$block=true&$cache=true'
        fetch(url, init)
            .then(response => response.json()
                .then(responseData => {
                    console.log("===" + JSON.stringify(responseData))
                    this.setState({ totalListData: responseData.Items, listData: responseData.Items })
                    //return responseData;
                }))
            .catch(err => {
                alert('err' + err)
                //return { msg: "Server encountered a problem please retry." }
            });
    }
    filter(text) {
        this.setState({ houseNo: text, houseNoErr: false, houseNoSelected: false })
        var arr = this.state.totalListData
        var typeArr = []
        if (text == '') {
            typeArr = []
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (
                    (arr[i].Text + arr[i].Description).toLowerCase().indexOf(text.toLowerCase()) != -1
                ) {
                    typeArr.push(arr[i]);
                }
            }
        }
        console.log("typeArr" + JSON.stringify(typeArr))

        this.setState({ listData: typeArr })

    }
    onSave() {

        if (this.state.postCode == '' && this.state.houseNo == '') {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please enter all values.', postCodeErr: true, houseNoErr: true })

        }
        else if (this.state.postCode == '') {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please enter postcode.', postCodeErr: true })
        }
        else if (this.state.houseNo == '') {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please select H.No./Street name.', houseNoErr: true })
        } else if (!this.state.houseNoSelected) {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please select H.No./Street name from list.', houseNoErr: true })
        } else if (this.state.latitude == '') {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please enter correct H.No./Street name.', houseNoErr: true })
        }
        else {
            console.log(JSON.stringify(this.state.latitude))
            this.props.navigation.navigate('Step2', {
                step1Variables: {
                    postCode: this.state.postCode, address: this.state.houseNo,
                    lattitude: this.state.latitude,
                    longitude: this.state.longitude,
                }
            })
        }

    }
    getLatLong(text) {
        var init = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",

            }
        }
        var url = 'https://maps.google.com/maps/api/geocode/json?address=' + text + '&sensor=false&key=AIzaSyBWfFx_15TqC1t6cCMpiIk7f4gJWhhLcLc'
        fetch(url, init)
            .then(response => response.json()
                .then(responseData => {
                    //console.log("===" + JSON.stringify(responseData))
                    console.log("address" + JSON.stringify(responseData))
                    this.setState({
                        latitude: responseData.results[0].geometry.location.lat,
                        longitude: responseData.results[0].geometry.location.lng,
                    })
                    //return responseData;
                }))
            .catch(err => {
                alert('err' + err)
                //return { msg: "Server encountered a problem please retry." }
            });

    }
    houseNoButtonPress() {
        if (this.state.postCode == '') {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please enter postcode.', postCodeErr: true })
        }
    }
    render() {

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', marginBottom: dynamicSize(5) }}>
                    <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomColor: themeColor, borderBottomWidth: 2 }}>
                        <Text style={[styles.boldText, { color: themeColor }]}>Address</Text></View>
                    <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#A2A8A2' }}>
                        <Text style={[styles.boldText, {}]}>Details</Text></View>
                    <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#A2A8A2' }}>
                        <Text style={[styles.boldText, {}]}>Photos</Text></View>
                </View>
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <TextBoxWithTitleAndButton {...this.props}
                    placeHolder={'Postcode'}
                    error={this.state.postCodeErr}
                    value={this.state.postCode}
                    editable={true}
                    downArrow={false}
                    onButtonPress={() => console.log('')}
                    icon={require('../assets/Step1Icons/postcode-icn.png')}
                    onChangeText={(text) => this.search(text)}
                />
                <View style={{ height: 0.5, width: width, backgroundColor: "#A2A8A2", marginVertical: dynamicSize(10) }} />
                <TextBoxWithTitleAndButton {...this.props}
                    placeHolder={'H.No. / Street Name'}
                    error={this.state.houseNoErr}
                    value={this.state.houseNo}
                    editable={this.state.postCode == '' ? false : true}
                    downArrow={false}
                    onButtonPress={() => this.houseNoButtonPress()}
                    icon={require('../assets/Step1Icons/house-no-icn.png')}
                    onChangeText={(text) => this.filter(text)}
                />
                <View style={styles.listContainer}>
                    {/* {this.state.listData.length == 0 && this.state.houseNo != '' ?
                        // <View style={{ flexDirection: 'row' }}>
                        //     <Text style={{ color: themeColor, fontFamily: fontFamily(), fontSize: getFontSize(14) }}>{this.state.houseNo}</Text>
                        //     <TouchableOpacity onPress={() => this.addAddress()} style={{ paddingVertical: dynamicSize(8), paddingHorizontal: dynamicSize(5), marginLeft: dynamicSize(10), backgroundColor: themeColor }}>
                        //         <Text style={{ color: 'white', fontFamily: fontFamily(), fontSize: getFontSize(14), borderRadius: dynamicSize(3) }}>+ ADD</Text>
                        //     </TouchableOpacity>
                        // </View>
                        : */}
                        <FlatList
                            data={this.state.listData}
                            renderItem={({ item, index }) => this.renderList(item, index)}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={key => key.index}
                            keyboardShouldPersistTaps="always"
                            extraData={this.state}
                        />
                    {/* } */}
                </View>

                <View style={[styles.accomodationView, { position:'absolute',bottom: dynamicSize(5) }]}>


                    <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2' }}
                        onPress={() => this.setState({ houseNo: '', postCode: '' })}>
                        <Text style={styles.boldText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2', backgroundColor: '#F49930' }}
                        onPress={() => this.onSave()}>
                        <Text style={[styles.boldText, { color: 'white' }]}>Save & Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
