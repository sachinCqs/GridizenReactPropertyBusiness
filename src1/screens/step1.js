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
            houseNoSelected: false
        }

    }
    selectItem(item) {
        this.setState({ houseNoSelected: true, houseNoErr: false })
        Keyboard.dismiss()
        this.setState({ houseNo: item.Text + " " + item.Description, listData: [] })
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
                    //console.log("===" + JSON.stringify(responseData))
                    this.setState({ totalListData: responseData.Items })
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
            for (var i = 1; i < arr.length; i++) {
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
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please select H.No./Street Name.', houseNoErr: true })
        } else if (!this.state.houseNoSelected) {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please select H.No./Street Name from list.', houseNoErr: true })
        }
        else {
            alert('done')
        }
    }
    render() {

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', marginBottom: dynamicSize(5) }}>
                    <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomColor: themeColor, borderBottomWidth: 2 }}>
                        <Text style={[styles.boldText, { color: themeColor }]}>Step 1</Text></View>
                    <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#A2A8A2' }}>
                        <Text style={[styles.boldText, {}]}>Step 2</Text></View>
                    <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#A2A8A2' }}>
                        <Text style={[styles.boldText, {}]}>Step 3</Text></View>
                </View>
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <TextBoxWithTitleAndButton {...this.props}
                    placeHolder={'PostCode'}
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
                    editable={true}
                    downArrow={false}
                    onButtonPress={() => console.log('')}
                    icon={require('../assets/Step1Icons/house-no-icn.png')}
                    onChangeText={(text) => this.filter(text)}
                />
                <View style={styles.listContainer}>
                    <FlatList
                        data={this.state.listData}
                        renderItem={({ item, index }) => this.renderList(item, index)}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={key => key.index}
                        keyboardShouldPersistTaps="always"
                        extraData={this.state}
                    />
                </View>

                <View style={[styles.accomodationView, { marginBottom: dynamicSize(5) }]}>


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
