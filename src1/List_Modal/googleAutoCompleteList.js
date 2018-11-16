import React, { Component } from 'react';
import { Platform, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput, FlatList } from 'react-native';
const { height, width } = Dimensions.get('window');
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { dynamicSize, getFontSize, themeColor } from '../utils/responsive'
export default class CityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInputValue: '',
            predefinedPlace: this.props.navigation.state.params.address,
            listData: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '40+']
        }
    }

    //this function needs to call on the previous screen for callback
    // updateData = (data) => {
    //     alert(data)
    // }

    //Like this the callback needs to be send
    //onPress={() => this.props.navigation.navigate("CityList", { title: 'City List', onGoBack: (data) =>  this.updateData(data),data:{textInputPlaceHolder:'Enter City',textInputTitle:''} })}

    //header title andapi that is to be hit are passed from navigation
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Search',
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: themeColor,
            },
            headerTitleStyle: {
                color: "white"
            },
            headerLeftContainerStyle: {
                color: "white"
            }
        };
    };
    componentWillMount() {
        // var baseUrl=  'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Amoeba&types=cities&&region=UK&key=AIzaSyBWfFx_15TqC1t6cCMpiIk7f4gJWhhLcLc'

        //   var baseUrl=  'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&components=country:uk&key=AIzaSyBWfFx_15TqC1t6cCMpiIk7f4gJWhhLcLc'
        // var baseUrl='https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&components=country:us&key=AIzaSyBWfFx_15TqC1t6cCMpiIk7f4gJWhhLcLc'
        //   return fetch(baseUrl)
        //   .then((response) => response.json())
        //   .then((responseJson) => {
        //      alert(JSON.stringify(responseJson))
        //   })
        //   .catch((error) => {
        //     alert("====="+error);
        //   });
    }

    onPress(item) {
        this.props.navigation.state.params.onGoBack(item);
        this.props.navigation.goBack()
    }
    render() {
        let { headerSubTitle, headerTitle } = this.props;
        return (
            <View style={styles.mainView}>
                <GooglePlacesAutocomplete
                    //ref={(instance) => { this.locationRef = instance }}
                    //editable={this.state.editMode}
                    //predefinedPlaces={[this.state.predefinedPlace]}
                    placeholder={'Enter Address'}
                    minLength={2} // minimum length of text to search
                    autoFocus={false}
                    // getDefaultValue={() => {
                    //     return 'gjgjgjgj'; // text input default value
                    //   }}
                    //onWrite={this.state.onWrite}
                    //text={ "" + this.state.address}
                    // onChangeOfText={() => {
                    //     // if(this.state.onWrite==false){
                    //     //     this.setState({ onWrite: true })
                    //     // }else{
                    //     //if(this.state.onWrite){
                    //     this.setState({ address: '', onWrite: false })
                    //     //}


                    //     //}

                    //     //this is custom prop function that is passed to GooglePlacesAutocomplete.js
                    //     //when we enter any text to text input this function calls
                    //     //console.log("++++"+data)
                    //     // this.setState({ address: '' })

                    // }}
                    //defaultValue={"" + this.state.address}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed={this.state.show}    // true/false/undefined
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                        console.log(JSON.stringify(details), "check==@@@@@@@@@@@@@@@@@>");
                        this.onPress(details)
                        // if (details.address_components) {
                        //     if (details.address_components[5]) {
                        //         this.setState({ postCode: details.address_components[5].long_name, postCodeErr: '' })
                        //     } else {
                        //         this.setState({ postCode: '' })
                        //     }
                        //     if (details.address_components[4]) {
                        //         this.setState({ country: details.address_components[4].long_name, countryErr: '' })
                        //     } else {
                        //         this.setState({ country: '' })
                        //     }
                        // } else {
                        //     this.setState({ postCode: '', country: '' })
                        // }

                        // this.setState({
                        //     latitude: details.geometry.location.lat,
                        //     longitude: details.geometry.location.lng,

                        //     show: false,
                        //     addressText: '',
                        //     address: details.name + "," + details.formatted_address
                        // })
                        // this.setState({
                        //     currentLatLong: { latitude: Number(details.geometry.location.lat), longitude: Number(details.geometry.location.lng) },
                        // })
                        // this.map.animateToRegion({
                        //     latitude: Number(details.geometry.location.lat),
                        //     longitude: Number(details.geometry.location.lng),
                        //     latitudeDelta: 0.0922,
                        //     longitudeDelta: 0.0421,
                        // });
                        //  alert(this.state.latitude + "  "+ this.state.longitude)

                    }}

                    //getDefaultValue={() => ''}

                    query={{
                        // available options: https://developers.google.com/places/web-service/autocomplete
                        key: 'AIzaSyBWfFx_15TqC1t6cCMpiIk7f4gJWhhLcLc',
                        language: 'en', // language of the results
                        types: ['geocode', 'postal_code', "country", "political"] // default: 'geocode'
                    }}

                    styles={{
                        textInputContainer: {
                            backgroundColor: '#fff',
                            marginLeft: dynamicSize(15),
                            marginRight: dynamicSize(15),
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderTopColor: themeColor,
                            borderBottomColor: themeColor,
                            width: width - dynamicSize(30),
                            marginTop: dynamicSize(10),
                            borderWidth: 1,
                            borderColor: themeColor
                        },
                        textInput: {
                            //marginLeft: dynamicSize(5),
                            //marginRight: dynamicSize(15),
                            padding: dynamicSize(10),
                            width: width - dynamicSize(35),
                            color: '#5d5d5d',
                            fontSize: 16
                        },
                        description: {
                            fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb'
                        }
                    }}



                    //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                    // currentLocationLabel="Current location"
                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={{
                        rankby: 'distance',
                        types: ['geocode', 'postal_code', "country", "political", 'street_number', 'food', 'street_address', 'sublocality', 'administrative_area_level_3']
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }}
                    GooglePlacesSearchQuery={{
                        // // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                        rankby: 'distance',
                        types: ['geocode', 'postal_code', "country", "political", 'street_number', 'food', 'street_address', 'sublocality', 'administrative_area_level_3']

                    }}
                    //types={['locality', 'administrative_area_level_5 ', 'postal_code', 'sublocality', 'administrative_area_level_1']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    //filterReverseGeocodingByTypes={['locality','street_address', 'administrative_area_level_5 ', 'postal_code', 'sublocality', 'administrative_area_level_1']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    //  predefinedPlaces={[homePlace, workPlace]}

                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                // renderLeftButton={() => <Image source={require('path/custom/left-icon')} />}
                // renderRightButton={() => <Text>Custom text after the input</Text>}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    mainView: {
        backgroundColor: '#fff',
        flex: 1

    },

    listContainer: { flex: 1, backgroundColor: '#DCDCDC', marginHorizontal: dynamicSize(15), paddingBottom: dynamicSize(15) },
    rowView: { paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(10) },
    rowText: { fontSize: getFontSize(14) }
});
