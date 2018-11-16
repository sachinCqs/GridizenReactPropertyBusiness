/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, TextInput, FlatList, Keyboard, ScrollView, Switch, sAsyncStorage, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Easing, Text, View, Image, AsyncStorage } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { dynamicSize, getFontSize, themeColor, fontFamily, dateConverterOfMilli } from '../utils/responsive';
const { width, height } = Dimensions.get('window');
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TextBoxWithTitleAndButton } from '../components/button'
import { ErrModal, Toast, Spinner } from '../components/toast'
import { NodeAPI } from '../services/webservice'
import SingleTextModal from '../List_Modal/SingleTextModalList'
const bedroomArr = ['1 ', '2 ', '3 ', '4 ', '5 ', '6 ', '7 ', '8 ', '9 ', '10 ']
var bathroomArr = [];
const receptionArr = ['1', '2', '3', '4', '5']
const rentDurationArr = ['1 Month', '3 Month', '6 Month', '1 Year', '5 Year']
var unitArr = []
const amenitiesArr = [{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' }]


const propertyArr = [{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' }]

export default class Step2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            paramData: '',
            ErrModalVisible: false,
            errModalMessage: '',
            amenitiesArr: [],
            propertyArr: [],
            totalPropertyArr: [],
            totalAmenitiesSelected: 0,
            singleTextModalVisible: false,
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            propertyType: '',
            propertyTypeErr: false,
            bedrooms: '',
            bedroomsErr: false,
            bathroom: '',
            bathroomErr: false,
            receptions: '',
            receptionsErr: false,
            furnishedSwitch: true,
            size: '',
            sizeErr: false,
            sqFt: '',
            sqFtErr: false,
            availableFrom: '',
            availableFromErr: false,
            rentDuration: '',
            rentDurationErr: false,
            propertyDetails: '',
            propertyDetailsErr: false,
            rent: '',
            rentErr: false,


            singleTextModalTitle: '',
            singleTextModalData: [],
            singleTextModalKey: '',
            datePickerVisible: false,
            unitId: ''

        }

    }
    getAllAmenities(paramData) {
        return NodeAPI({}, "getAllAmnities.json", 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                if (responseJson.response_code === 'success') {

                    this.setState({ amenitiesArr: responseJson.amnitions })

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
    getPropertyType(paramData) {
        return NodeAPI({}, "getAllPropertyTypes.json", 'GET', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                // alert('categories===' + JSON.stringify(responseJson))

                if (responseJson.response_code === 'success') {

                    var arr = []
                    this.setState({ propertyArr: responseJson.propertytypes, totalPropertyArr: responseJson.propertytypes })



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

    componentWillMount() {
        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({
                headerData: paramData,
                spinnerVisible: true
            })
            this.getPropertyType(paramData)
            this.getAllAmenities(paramData)
            return NodeAPI({}, "getAllAreaUnits.json", 'GET', paramData.token, paramData.userid)
                .then(responseJson => {
                    this.setState({ spinnerVisible: false })
                    if (responseJson.response_code === 'success') {
                        // alert(JSON.stringify(responseJson.areaunits.length))
                        unitArr = responseJson.areaunits
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
            <TouchableOpacity onPress={() => this.squareClick(index, type)}
                style={{ height: (width - dynamicSize(20)) / 4, width: (width - dynamicSize(20)) / 4, borderLeftColor: '#A2A8A2', borderRightColor: '#A2A8A2', borderLeftWidth: index == 0 ? 0.5 : 0, borderRightWidth: 0.5, alignItems: 'center', justifyContent: 'center' }}>

                <Image style={{ alignSelf: 'flex-end', marginRight: dynamicSize(2), tintColor: item.selected ? themeColor : 'transparent' }} source={require('../assets/tick.png')} />


                <View style={{ alignItems: 'center' }}>

                    <Image source={{ uri: item.icon }} resizeMode="contain"
                        style={{ opacity: item.selected ? null : 0.2, height: ((width - dynamicSize(20)) / 4) / 2, width: ((width - dynamicSize(20)) / 4) / 2 }} />
                    <Text numberOfLines={2}
                        style={{ fontSize: getFontSize(10), textAlign: 'center', fontFamily: fontFamily(), color: item.selected ? themeColor : '#3c3c3c' }}>{item.name}</Text>
                </View>


            </TouchableOpacity>
        )
    }
    onSave() {
        if (this.state.rent == '') {
            this.setState({ rentErr: true, ErrModalVisible: true, errModalMessage: 'Please enter property rent.' })
        }
        else if (Number(this.state.rent) > 10000) {
            this.setState({ rentErr: true, ErrModalVisible: true, errModalMessage: 'Property rent cannot be greater than 10k.' })
        }
        else if (this.state.propertyType == '') {
            this.setState({ propertyTypeErr: true, ErrModalVisible: true, errModalMessage: 'Please select property type.' })
        } else if (this.state.bedrooms == '') {
            this.setState({ bedroomsErr: true, ErrModalVisible: true, errModalMessage: 'Please select number of bedrooms.' })
        } else if (this.state.bathroom == '' && this.state.bedrooms == '') {
            this.setState({ bedroomsErr: true, ErrModalVisible: true, errModalMessage: 'Please select number of bedrooms first.' })
        } else if (this.state.bathroom == '' && this.state.bedrooms != '') {
            this.setState({ bathroomErr: true, ErrModalVisible: true, errModalMessage: 'Please select number of bathrooms.' })
        } else if (this.state.receptions == '') {
            this.setState({ receptionsErr: true, ErrModalVisible: true, errModalMessage: 'Please select number of receptions.' })
        } else if (Number(this.state.totalAmenitiesSelected) == 0) {
            this.setState({ ErrModalVisible: true, errModalMessage: 'Please select amenities.' })
        } else if (this.state.receptions == '') {
            this.setState({ receptionsErr: true, ErrModalVisible: true, errModalMessage: 'Please select number of receptions.' })
        } else if (this.state.size == '') {
            this.setState({ sizeErr: true, ErrModalVisible: true, errModalMessage: 'Please enter size.' })
        } else if (this.state.sqFt == '') {
            this.setState({ sqFtErr: true, ErrModalVisible: true, errModalMessage: 'Please select unit of size.' })
        } else if (this.state.availableFrom == '') {
            this.setState({ availableFromErr: true, ErrModalVisible: true, errModalMessage: 'Please select date of availability.' })
        } else if (this.state.rentDuration == '') {
            this.setState({ rentDurationErr: true, ErrModalVisible: true, errModalMessage: 'Please select rent duration.' })
        } else if (this.state.propertyDetails == '') {
            this.setState({ propertyDetailsErr: true, ErrModalVisible: true, errModalMessage: 'Please enter property details.' })
        } else {
            var amenitiesArrToServer = []
            var amenitiesArrPassedToReview = []
            for (var i = 0; i < this.state.amenitiesArr.length; i++) {

                if (this.state.amenitiesArr[i].selected) {
                    if (this.state.amenitiesArr[i].selected == true) {
                        amenitiesArrToServer.push(this.state.amenitiesArr[i].id)
                        amenitiesArrPassedToReview.push(this.state.amenitiesArr[i])
                    }
                }



            }
            var paramData = {
                propertyTypeId: this.state.propertyType,
                expectedRent: this.state.rent,
                bedrooms: this.state.bedrooms.split(' ')[0],
                bathrooms: this.state.bathroom,
                reception: this.state.receptions,
                amenities: amenitiesArrToServer,
                furnished: this.state.furnishedSwitch ? "Furnished" : 'UnFurnished',
                // size: this.state.size,
                // unit: this.state.sqFt,
                builtUp: {
                    value: this.state.size,
                    unit: this.state.unitId,
                    sqFtunit: this.state.sqFt
                },
                availableFrom: this.state.availableFrom,
                rentDuration: this.state.rentDuration,
                otherDetails: this.state.propertyDetails
            }
            var variables = Object.assign(paramData, this.props.navigation.state.params.step1Variables)
            this.props.navigation.navigate('Step3', { step1and2variables: variables, amenitiesArrPassedToReview: amenitiesArrPassedToReview })
        }
    }
    onPressOfBox(boxtype, array) {


        if (boxtype == 'Bathroom(s)') {
            if (this.state.bedrooms == '') {
                this.setState({
                    bedroomsErr: true,

                    ErrModalVisible: true,
                    errModalMessage: 'Please select number of bedrooms first.'
                })
                return
            }
        }

        this.setState({ singleTextModalTitle: boxtype, singleTextModalData: array, singleTextModalVisible: true, singleTextModalKey: boxtype == 'Unit' ? "name" : '', })

    }
    singleTextModalRowClicked(item, index) {
        if (this.state.singleTextModalTitle == 'Bedroom(s)') {
            this.setState({ bedrooms: item, bedroomsErr: false, bathroom: '', bathroomsErr: false });
            bathroomArr = []
            for (var i = 1; i <= Number(item.split(' ')[0]) * 2; i++) {
                bathroomArr.push(i.toString())
            }
        } else if (this.state.singleTextModalTitle == 'Bathroom(s)') {
            this.setState({ bathroom: item, bathroomErr: false });
        } else if (this.state.singleTextModalTitle == 'Receptions') {
            this.setState({ receptions: item, receptionsErr: false });
        } else if (this.state.singleTextModalTitle == 'Unit') {
            this.setState({ sqFt: item.name, unitId: item.id, sqFtErr: false });
        } else if (this.state.singleTextModalTitle == 'Rent Duration') {
            this.setState({ rentDuration: item, rentDurationErr: false });
        }


        this.setState({ singleTextModalVisible: false, singleTextModalTitle: '', singleTextModalKey: '' })
    }
    singleTextModalClose() {
        this.setState({ singleTextModalVisible: false, singleTextModalTitle: '', singleTextModalKey: '' })
    }
    _handleDatePicked(date) {
        //alert(new Date(date).getTime())
        this.setState({ availableFrom: new Date(date).getTime(), availableFromErr: '', datePickerVisible: false })
    }
    onSwitchClicked(value) {
        this.setState({ furnishedSwitch: !this.state.furnishedSwitch })

        setTimeout(() => {
            if (!this.state.furnishedSwitch) {
                this.setState({
                    ErrModalVisible: true,
                    errModalMessage: 'We recommend negotiable prices as this will help you find a tenant quicker'
                })
            }
        }, 100);
    }

    render() {

        return (
            <View style={styles.container}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <SingleTextModal {...this.props}
                    visible={this.state.singleTextModalVisible}
                    titleText={this.state.singleTextModalTitle}
                    data={this.state.singleTextModalData}
                    typeKey={this.state.singleTextModalKey}
                    selectItemFromFlatlist={(item, index) => this.singleTextModalRowClicked(item, index)}
                    close={() => this.singleTextModalClose()} />
                <DateTimePicker
                    isVisible={this.state.datePickerVisible}
                    onConfirm={(date) => this._handleDatePicked(date)}
                    onCancel={() => this.setState({ datePickerVisible: false })}
                    mode="date"

                    minimumDate={new Date()}
                    is24Hour={false}
                //datePickerContainerStyleIOS={styles.datepickeriosstyle}
                />
                <View style={{ flexDirection: 'row', marginBottom: dynamicSize(5) }}>
                    <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomColor: '#A2A8A2', borderBottomWidth: 0.5 }}>
                        <Text style={[styles.boldText, {}]}>Address</Text></View>
                    <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomWidth: 2, borderBottomColor: themeColor }}>
                        <Text style={[styles.boldText, { color: themeColor }]}>Details</Text></View>
                    <View style={{ flex: 1, paddingVertical: dynamicSize(15), alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#A2A8A2' }}>
                        <Text style={[styles.boldText, {}]}>Photos</Text></View>
                </View>
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <ScrollView style={{ flex: 1 }}>
                    <View style={[styles.propertyTypeView, { borderBottomWidth: 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.boldText}>Property Type</Text>
                            {/* <Text style={styles.selectedText}>{this.state.totalAmenitiesSelected} Selected</Text> */}
                        </View>

                        {this.makeSquareView('propertyType', this.state.propertyArr)}

                    </View>

                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Rent pcm'}
                        error={this.state.rentErr}
                        value={this.state.rent}
                        editable={true}
                        maxlength={5}
                        downArrow={false}
                        keyboard="numeric"
                        onButtonPress={() => console.log()}
                        icon={require('../assets/step2/rent-icn.png')}
                        onChangeText={(text) => this.setState({ rent: text, rentErr: false })}
                    />
                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Bedrooms'}
                        error={this.state.bedroomsErr}
                        value={this.state.bedrooms}
                        editable={false}
                        downArrow={true}

                        onButtonPress={() => this.onPressOfBox('Bedroom(s)', bedroomArr)}
                        icon={require('../assets/step2/bed-icn.png')}
                        onChangeText={(text) => this.setState({ bedrooms: text, bedroomsErr: false })}
                    />

                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Bathrooms'}
                        error={this.state.bathroomErr}
                        value={this.state.bathroom}
                        editable={false}
                        downArrow={true}

                        onButtonPress={() => this.onPressOfBox('Bathroom(s)', bathroomArr)}
                        icon={require('../assets/step2/bathroom-icn.png')}
                        onChangeText={(text) => this.setState({ bathroom: text })}
                    />
                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Reception Rooms'}
                        error={this.state.receptionsErr}
                        value={this.state.receptions}
                        editable={false}
                        downArrow={true}

                        onButtonPress={() => this.onPressOfBox('Receptions', receptionArr)}
                        icon={require('../assets/step2/recption-icn.png')}
                        onChangeText={(text) => this.setState({ receptions: text })}
                    />
                    <View style={[styles.propertyTypeView, { borderBottomWidth: 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.boldText}>Amenities</Text>
                            <Text style={styles.selectedText}>{this.state.totalAmenitiesSelected} Selected</Text>
                        </View>

                        {this.makeSquareView('amenities', this.state.amenitiesArr)}

                    </View>
                    <View style={styles.switchView}>

                        <Text style={styles.boldText}>Negotiable</Text>
                        <Switch
                            onValueChange={(value) => this.onSwitchClicked(value)}
                            value={this.state.furnishedSwitch}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1.5 }}>
                            <TextBoxWithTitleAndButton {...this.props}
                                placeHolder={'Size'}
                                error={this.state.sizeErr}
                                value={this.state.size}
                                editable={true}
                                maxlength={9}
                                downArrow={false}
                                keyboard="numeric"
                                onButtonPress={() => console.log('')}
                                icon={require('../assets/step2/size-icn.png')}
                                onChangeText={(text) => this.setState({ size: text, sizeErr: false })}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextBoxWithTitleAndButton {...this.props}
                                placeHolder={'Unit'}
                                error={this.state.sqFtErr}
                                value={this.state.sqFt}
                                editable={false}
                                downArrow={true}
                                leftArrowVacant={true}
                                onButtonPress={() => this.onPressOfBox('Unit', unitArr)}
                                icon={require('../assets/Step1Icons/postcode-icn.png')}
                                onChangeText={(text) => this.setState({ sqFt: text })}
                            />
                        </View>
                    </View>
                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Available from'}
                        error={this.state.availableFromErr}
                        value={this.state.availableFrom == '' ? '' : dateConverterOfMilli(this.state.availableFrom)}
                        editable={false}
                        downArrow={false}

                        onButtonPress={() => this.setState({ datePickerVisible: true })}
                        icon={require('../assets/step2/cal-icn.png')}
                        onChangeText={(text) => this.setState({ availableFrom: text })}
                    />

                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Rent Duration'}
                        error={this.state.rentDurationErr}
                        value={this.state.rentDuration}
                        editable={false}
                        downArrow={true}

                        onButtonPress={() => this.onPressOfBox('Rent Duration', rentDurationArr)}
                        icon={require('../assets/step2/duration-icn.png')}
                        onChangeText={(text) => this.setState({ rentDuration: text })}
                    />

                    <TextBoxWithTitleAndButton {...this.props}
                        placeHolder={'Property Details'}
                        error={this.state.propertyDetailsErr}
                        value={this.state.propertyDetails}
                        editable={true}
                        downArrow={false}
                        multiline={true}
                        onButtonPress={() => console.log('')}
                        icon={require('../assets/step2/prop-detail-icn.png')}
                        onChangeText={(text) => this.setState({ propertyDetails: text, propertyDetailsErr: false })}
                    />
                </ScrollView>

                <View style={[styles.accomodationView, { marginBottom: dynamicSize(5), paddingBottom: 0 }]}>


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
    propertyTypeView: { paddingHorizontal: dynamicSize(10), borderBottomColor: "#A2A8A2", borderBottomWidth: 0.5, padding: dynamicSize(8), },
    selectedText: { color: themeColor, fontFamily: fontFamily('bold') },
    squareView: { width: width - dynamicSize(20), flexDirection: 'row', borderColor: '#A2A8A2', borderWidth: 0.5, marginVertical: dynamicSize(10) },
    switchView: { alignItems: 'center', borderBottomColor: "#A2A8A2", borderBottomWidth: 0.5, padding: dynamicSize(8), flexDirection: 'row', paddingHorizontal: dynamicSize(10), justifyContent: 'space-between' },

    rowView: { paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(10) },
    rowText: { fontSize: getFontSize(14) },
    boldText: { fontSize: getFontSize(14), fontFamily: fontFamily('bold') },
    accomodationView: { alignItems: 'center', borderTopColor: "#A2A8A2", borderTopWidth: 0, padding: dynamicSize(10), flexDirection: 'row', paddingHorizontal: dynamicSize(10) },
});
