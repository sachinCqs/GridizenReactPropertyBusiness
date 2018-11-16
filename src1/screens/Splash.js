/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, ScrollView, Switch, sAsyncStorage, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Easing, Text, View, Image } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { dynamicSize, getFontSize, themeColor, fontFamily } from '../utils/responsive';
const { width, height } = Dimensions.get('window');
import { NodeAPI } from '../services/webservice'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
const propertyArr = [{ name: 'Flats', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' }, { name: 'Houses', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' }, { name: 'Rooms', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' }, { name: 'All', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' }]
var paramData = { userid: "38054934aba68936a2a57ddcd584265e", token: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NywiZ3VpZCI6InFWNnZSVTFweFpGdmh2NzZUT25kIiwidXNlcm5hbWUiOiJiYmJiYmIiLCJuYW1lIjoibm5ubiBwcHAgcXEiLCJlbWFpbCI6ImJAY3FzLmluIiwibW9iaWxlX251bSI6Iis0NCA4OTg1MjQ3ODUyIiwicGFzc3dvcmQiOiJkNWNlNmYwNzQzMmI5ZjQ5MWY2YjY4Y2ZjMTNlZWJhZiIsInN0YXR1cyI6MSwidmVyaWZ5X2NvZGUiOiI1MTExNTgiLCJ2ZXJpZnlfZXhwaXJlIjoiMjAxOC0wOC0xOFQxMDoxMDoxMi4wMDBaIiwiZmFpbGVkX2NvdW50IjoiMCIsInRhbmRjX2RvbmUiOnRydWUsImRlbGV0ZWQiOm51bGwsInRtcF9wYXNzd29yZCI6bnVsbCwiaXNfdG1wcGFzc3dvcmQiOmZhbHNlLCJpc19kZWxldGVkIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAxOC0wOC0xOFQxMDowNToxMi4wMDBaIiwidXBkYXRlZEF0IjoiMjAxOC0xMC0wNVQxNDozMzoxNC4wMDBaIiwiVmVuZG9yRGV0YWlsIjp7ImlkIjo3LCJhZGRyZXNzIjoiQ2VudHJhbCBUZXJtaW5hbCBEciwgRWFzdCBFbG1odXJzdCwgTlkgMTEzNzEsIFVTQSIsImFkZHJlc3MxIjoicm9vbSBubyAxMDEgY29ycG9yYXRlIHBhcmsiLCJkb2kiOiIxNDA1MzMyMTgwMDAwIiwiY291bnRyeSI6IlVuaXRlZCBTdGF0ZXMiLCJuYXRpb25hbGl0eSI6bnVsbCwiemlwIjoiRUQ1IDZFVCIsImFib3V0X3VzIjoic2Rmc2RmZGFzZGFzZGFzZGFzZGFzZGFzZGFzZHNhZGFzZGFzZGFzZGFzZCBhc2R1eWFzZGFzIHVkdXlhcyBkdWFzZ2RnYXNkZ2hhc2dkaGFzdmhkYXN2ZGhhc2hkc2FzZ2FzdmRnZ2RkdmdzdmF2aHNndmFnZGFzaGFnYXZnaHNoYWdhdmRhdnZnYWFzdmdnZGd2ZGdoamp2amF2ZGRoc2Rhc3ZhYWhodmFkaGR2aGFoc2Rqc2RhZHNkZ2hhc2dkYWhzZGdrYXNnZGtoYXNoa2RoYXNrZ2Rna2FzaGRnYWtoc2dkaGthc2dkYWdzZGthc2Q2NTY0NjU0NiIsImljb25fdXJsIjoiUHJvZmlsZS0zODA1NDkzNGFiYTY4OTM2YTJhNTdkZGNkNTg0MjY1ZS5qcGciLCJtYW5nb3BheV91c2VyX2lkIjo1MzY3MTY1MiwibWFuZ29wYXlfd2FsbGV0X2lkIjo1MzY3MTY1NCwibWFuZ29wYXlfYmFua19hY2NvdW50X2lkIjpudWxsLCJsYXR0aXR1ZGUiOiI0MC43NzM0MDczMzQ5NDM2NSIsImxvbmdpdHVkZSI6Ii03My44NzIyNDAxNTIyMDI4NiIsInZlbmRvcl9pZCI6NywiY2F0ZWdvcnlfaWQiOjEyLCJjcmVhdGVkQXQiOiIyMDE4LTA4LTE4VDEwOjA1OjEyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDE4LTA5LTExVDE3OjE3OjQ5LjAwMFoifX0.1fEBYkIxQz8tCDVTk6imWpYtwVjXMR845EP18UPJcXA" }
const amenitiesArr = [{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' },
{ name: 'garden', selected: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ojg-4dRzxwgri5Ri5Sm1nZotD5gkdS5W9PCjuNStsbYS26maCg' }]
const CustomMarkerOfSlider = () => {
  return (
    <View style={{ height: dynamicSize(20), marginTop: dynamicSize(3), alignSelf: 'center', width: dynamicSize(20), backgroundColor: '#fff', borderRadius: dynamicSize(10), borderWidth: 1, borderColor: '#A2A8A2' }} />

  )
}
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accomodationSwitch: false,
      serviceSwitch: false,
      fullFurnished: false,
      semiFurnished: false,
      unFurnished: false,
      propertyArr: propertyArr,
      amenitiesArr: amenitiesArr,
      totalBedRoomSelected: 0,
      totalPropertyTypeSelected: 0,
      totalAmenitiesSelected: 0,
      address: 'Search Address',
      latitude: '',
      longitude: '',

      multiSliderValue: [3, 7],
      sliderPriceValue: [{ name: '0k', value: 0 }, { name: '5k', value: 5000 }, { name: '10k', value: 10000 }, { name: '15k', value: 15000 }, { name: '20k', value: 20000 }, { name: '25k', value: 55000 }, { name: '30k', value: 30000 }, { name: '35k', value: 35000 }, { name: '40k', value: 40000 }, { name: '45k', value: 45000 }, { name: '50k', value: 50000 }],
      bedRoomArr: [{ name: 'Studios', selected: false }, { name: '1', selected: false }, { name: '2', selected: false }, { name: '3', selected: false }, { name: '4', selected: false }, { name: '4+', selected: false }]
    }

  }
  componentDidMount() {
    this.hitGetAllAmenitiesAPI()
  }
  hitGetAllAmenitiesAPI() {
    return NodeAPI({}, "getAllAmnities.json", 'GET', paramData.token, paramData.userid)
      .then(responseJson => {
        this.setState({ spinnerVisible: false })
        console.log("__==>", JSON.stringify(responseJson))
        if (responseJson.response_code === 'success') {


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
  getCurrentLocation() {
    console.log('pppp')
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(JSON.stringify(position))
      this.setState({ longitude: position.coords.longitude, latitude: position.coords.latitude })
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=AIzaSyBWfFx_15TqC1t6cCMpiIk7f4gJWhhLcLc')
        // fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true&key=AIzaSyBWfFx_15TqC1t6cCMpiIk7f4gJWhhLcLc')



        .then((response) => response.json())
        .then((responseJson) => {

          console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
          this.setState({
            address: responseJson.results[0].formatted_address,
            // addressText: responseJson.results[1].formatted_address,
          })


          console.log("=====" + responseJson.results[0].formatted_address)
          //alert('===== => ' + responseJson.results[2].formatted_address);

        }).catch(err => {
          console.log('err' + err)
        });
    },

      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 1000, maximumAge: 60000 });

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
    var arr = type == 'property' ? this.state.propertyArr : this.state.amenitiesArr;
    arr[index].selected = !arr[index].selected
    type == 'property' ?
      this.setState({ propertyArr: arr, totalPropertyTypeSelected: arr[index].selected ? this.state.totalPropertyTypeSelected + 1 : this.state.totalPropertyTypeSelected - 1 }) :
      this.setState({ amenitiesArr: arr, totalAmenitiesSelected: arr[index].selected ? this.state.totalAmenitiesSelected + 1 : this.state.totalAmenitiesSelected - 1 })
  }
  makeSquare(item, index, type) {
    return (
      <TouchableOpacity onPress={() => this.squareClick(index, type)}
        style={{ height: (width - dynamicSize(20)) / 4, width: (width - dynamicSize(20)) / 4, borderLeftColor: '#A2A8A2', borderRightColor: '#A2A8A2', borderLeftWidth: index == 0 ? 0.5 : 0, borderRightWidth: 0.5, alignItems: 'center', justifyContent: 'center' }}>

        <Image style={{ alignSelf: 'flex-end', marginRight: dynamicSize(2), tintColor: item.selected ? themeColor : 'transparent' }} source={require('../assets/tick.png')} />


        <View style={{}}>

          <Image source={{ uri: item.image }} resizeMode="cover"
            style={{ tintColor: item.selected ? themeColor : null, height: ((width - dynamicSize(20)) / 4) / 2, width: ((width - dynamicSize(20)) / 4) / 2 }} />
          <Text style={{ fontSize: getFontSize(10), alignSelf: 'center', fontFamily: fontFamily(), color: item.selected ? themeColor : '#3c3c3c' }}>{item.name}</Text>
        </View>


      </TouchableOpacity>
    )
  }
  makeBedroomView() {
    var arr = []

    for (var i = 0; i < this.state.bedRoomArr.length; i++) {

      arr.push(
        this.makeBedRoomSquare(this.state.bedRoomArr[i], i)
      )
    }
    return (
      <View horizontal showsHorizontalScrollIndicator={false} style={styles.squareView}>
        {arr}
      </View>
    )
  }
  makeBedRoomSquare(item, index) {
    return (
      <TouchableOpacity onPress={() => this.bedRoomClick(index)}
        style={{ flexDirection: 'row', flex: 1, width: ((width - dynamicSize(20)) / 5), height: dynamicSize(35), justifyContent: 'space-between', borderLeftColor: '#A2A8A2', borderRightColor: '#A2A8A2', borderLeftWidth: index == 0 ? 0.5 : 0, borderRightWidth: 0.5, }}>
        {item.name == 'Studios' ?
          <View style={{ alignItems: 'flex-end',  justifyContent: 'center' }}>
            <Text style={{ fontSize: getFontSize(10),marginLeft:dynamicSize(5), fontFamily: fontFamily(), color: item.selected ? themeColor : '#3c3c3c' }}>{item.name}</Text>
          </View>
          :
          <View style={{ alignItems: 'flex-end', flex: 2, justifyContent: 'center' }}>
            <Text style={{ fontSize: getFontSize(14), fontFamily: fontFamily(), marginRight: dynamicSize(5), color: item.selected ? themeColor : '#3c3c3c' }}>{item.name}</Text>
          </View>

        }
        {item.name == 'Studios' ?
        <View style={{  }}>
          <Image style={{ alignSelf: 'flex-start', marginRight: dynamicSize(2), tintColor: item.selected ? themeColor : 'transparent' }} source={require('../assets/tick.png')} />
        </View>
        :
        <View style={{ flex: 1.5 }}>
          <Image style={{ alignSelf: 'flex-start', marginRight: dynamicSize(2), tintColor: item.selected ? themeColor : 'transparent' }} source={require('../assets/tick.png')} />
        </View>
        }
        
      </TouchableOpacity>


    )
  }
  bedRoomClick(index) {
    // alert(JSON.stringify(index))
    var arr = this.state.bedRoomArr
    arr[index].selected = !arr[index].selected
    this.setState({ totalBedRoomSelected: arr[index].selected ? this.state.totalBedRoomSelected + 1 : this.state.totalBedRoomSelected - 1 })
    this.setState({ bedRoomArr: arr })
  }
  makeFurnishingTypeView() {
    return (
      <View style={styles.squareView}>
        <TouchableOpacity onPress={() => this.setState({ fullFurnished: !this.state.fullFurnished })}
          style={{ flexDirection: 'row', paddingLeft: dynamicSize(10), flex: 1, width: ((width - dynamicSize(20)) / 5), height: dynamicSize(35), justifyContent: 'space-between', borderLeftColor: '#A2A8A2', borderRightColor: '#A2A8A2', borderRightWidth: 0.5, }}>

          <View style={{ alignItems: 'flex-end', flex: 2, justifyContent: 'center' }}>
            <Text
              style={{ fontSize: getFontSize(12), fontFamily: fontFamily(), marginRight: dynamicSize(5), color: this.state.fullFurnished ? themeColor : '#3c3c3c' }}>Full Furnished</Text>
          </View>

          <Image style={{ alignSelf: 'flex-start', marginRight: dynamicSize(2), tintColor: this.state.fullFurnished ? themeColor : 'transparent' }} source={require('../assets/tick.png')} />

        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({ semiFurnished: !this.state.semiFurnished })}
          style={{ flexDirection: 'row', paddingLeft: dynamicSize(10), flex: 1, width: ((width - dynamicSize(20)) / 5), height: dynamicSize(35), justifyContent: 'space-between', borderLeftColor: '#A2A8A2', borderRightColor: '#A2A8A2', borderRightWidth: 0.5, }}>

          <View style={{ alignItems: 'flex-end', flex: 2, justifyContent: 'center' }}>
            <Text
              style={{ fontSize: getFontSize(12), fontFamily: fontFamily(), textAlign: 'center', marginRight: dynamicSize(5), color: this.state.semiFurnished ? themeColor : '#3c3c3c' }}>Semi Furnished</Text>
          </View>

          <Image style={{ alignSelf: 'flex-start', marginRight: dynamicSize(2), tintColor: this.state.semiFurnished ? themeColor : 'transparent' }} source={require('../assets/tick.png')} />

        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({ unFurnished: !this.state.unFurnished })}
          style={{ flexDirection: 'row', paddingLeft: dynamicSize(10), flex: 1, width: ((width - dynamicSize(20)) / 5), height: dynamicSize(35), justifyContent: 'space-between', borderLeftColor: '#A2A8A2', borderRightColor: '#A2A8A2', borderRightWidth: 0.5, }}>

          <View style={{ alignItems: 'flex-end', flex: 2, justifyContent: 'center' }}>
            <Text
              style={{ fontSize: getFontSize(12), fontFamily: fontFamily(), textAlign: 'center', marginRight: dynamicSize(5), color: this.state.unFurnished ? themeColor : '#3c3c3c' }}>Unfurnished</Text>
          </View>

          <Image style={{ alignSelf: 'flex-start', marginRight: dynamicSize(2), tintColor: this.state.unFurnished ? themeColor : 'transparent' }} source={require('../assets/tick.png')} />

        </TouchableOpacity>
      </View>)
  }
  multiSliderValuesChange = (values) => {
    this.setState({
      multiSliderValue: values,
    });
  }
  updateAddressData = (details) => {
    this.setState({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      address: details.name + "," + details.formatted_address
    })
    //alert(JSON.stringify(data))

  }
  render() {

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.addressView}>
            <Image source={require('../assets/searchIcon.png')} />
            <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }} onPress={() => this.props.navigation.navigate("GoogleAutoCompleteList", { title: 'Search Address', onGoBack: (data, type) => this.updateAddressData(data), })}>
              <Text numberOfLines={1}
                style={{ flex: 1, marginHorizontal: dynamicSize(6), fontFamily: fontFamily(), marginTop: dynamicSize(3) }}>{this.state.address}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.getCurrentLocation()}>
              <Image source={require('../assets/location.png')} />
            </TouchableOpacity>
          </View>



          <View style={styles.propertyTypeView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.boldText}>Property Type</Text>
              <Text style={styles.selectedText}>{this.state.totalPropertyTypeSelected} Selected</Text>
            </View>

            {this.makeSquareView('property', this.state.propertyArr)}

          </View>

          <View style={styles.propertyTypeView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text style={styles.boldText}>Price</Text>
              <Text style={styles.selectedText}>£{this.state.sliderPriceValue[this.state.multiSliderValue[0]].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <Text style={{ fontFamily: fontFamily() }}>pcm</Text> - £{this.state.sliderPriceValue[this.state.multiSliderValue[1]].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <Text style={{ fontFamily: fontFamily() }}>pcm</Text></Text>
            </View>
            <View style={{ alignSelf: 'center' }}>
              <MultiSlider
                values={[this.state.multiSliderValue[0], this.state.multiSliderValue[1]]}
                sliderLength={width - dynamicSize(50)}
                onValuesChange={this.multiSliderValuesChange}
                min={0}
                max={10}
                step={1}
                allowOverlap
                customMarker={CustomMarkerOfSlider}
                containerStyle={{
                  height: 40,
                }}
                // touchDimensions={{
                //   height: 40,
                //   width: 40,
                //   borderRadius: 20,
                //   slipDisplacement: 40,
                // }}
                selectedStyle={{
                  backgroundColor: themeColor,
                }}
                unselectedStyle={{
                  backgroundColor: 'silver',
                }}


                trackStyle={{
                  height: 7,
                  backgroundColor: 'red',
                }}
                snapped
              />
            </View>
            <View style={{ flexDirection: 'row', }}>
              {this.state.sliderPriceValue.map(function (item, index) {
                return (
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: dynamicSize(12), fontFamily: fontFamily(), marginLeft: index == 0 ? 0 : -5 }}>{item.name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
          <View style={styles.accomodationView}>

            <Text style={styles.boldText}>Shared Accomodation</Text>
            <Switch
              onValueChange={(value) => this.setState({ accomodationSwitch: !this.state.accomodationSwitch })}
              value={this.state.accomodationSwitch}
            />
          </View>
          <View style={styles.propertyTypeView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.boldText}>Bedrooms</Text>
              <Text style={styles.selectedText}>{this.state.totalBedRoomSelected} Selected</Text>
            </View>

            {this.makeBedroomView()}

          </View>
          <View style={styles.propertyTypeView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.boldText}>Amenities</Text>
              <Text style={styles.selectedText}>{this.state.totalAmenitiesSelected} Selected</Text>
            </View>

            {this.makeSquareView('amenities', this.state.amenitiesArr)}

          </View>
          <View style={styles.propertyTypeView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.boldText}>Furnishing Type</Text>
              <Text style={styles.selectedText}>{Number(this.state.fullFurnished) + Number(this.state.semiFurnished) + Number(this.state.unFurnished)} Selected</Text>
            </View>

            {this.makeFurnishingTypeView()}

          </View>
          {/* <View style={styles.accomodationView}>

            <Text style={styles.boldText}>Serviced</Text>
            <Switch
              onValueChange={(value) => this.setState({ serviceSwitch: !this.state.serviceSwitch })}
              value={this.state.serviceSwitch}
            // trackColor={{false: "grey", true: themeColor}}
            />
          </View> */}

          <View style={[styles.accomodationView, { marginBottom: dynamicSize(10) }]}>


            <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(10), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2' }}
              onPress={() => alert("done")}>
              <Text style={styles.boldText}>Reset Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, paddingVertical: dynamicSize(10), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#A2A8A2', backgroundColor: '#F49930' }}
              onPress={() => alert("done")}>
              <Text style={[styles.boldText, { color: 'white' }]}>Save & Search</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addressView: {
    marginHorizontal: dynamicSize(10), alignItems: 'center', marginVertical: dynamicSize(10), borderWidth: 1, borderColor: "#737773", padding: dynamicSize(8), flexDirection: 'row'
  },
  accomodationView: { alignItems: 'center', borderTopColor: "#A2A8A2", borderTopWidth: 0.5, padding: dynamicSize(8), flexDirection: 'row', paddingHorizontal: dynamicSize(10) },
  propertyTypeView: { paddingHorizontal: dynamicSize(10), borderTopColor: "#A2A8A2", borderTopWidth: 0.5, padding: dynamicSize(8), },
  boldText: { flex: 1, fontSize: getFontSize(14), fontFamily: fontFamily('bold') },
  selectedText: { color: themeColor, fontFamily: fontFamily('bold') },
  squareView: { width: width - dynamicSize(20), flexDirection: 'row', borderColor: '#A2A8A2', borderWidth: 0.5, marginVertical: dynamicSize(10) }
});
