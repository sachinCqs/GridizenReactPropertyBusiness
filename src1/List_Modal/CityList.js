import React, { Component } from 'react';
import { Platform, Image, Alert, AsyncStorage, TouchableOpacity, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput, FlatList } from 'react-native';
const { height, width } = Dimensions.get('window');
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { NodeAPI } from '../services/webservice';
import { Toast, Spinner } from '../components/toast'
import { dynamicSize, getFontSize, themeColor } from '../utils/responsive'
export default class CityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInputValue: '',
            showToast: false,
            alertMessage: '',
            headerData: '',
            spinnerVisible: false,
            data: this.props.navigation.state.params.data,
            listData: []
            // ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '40+']
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
            title: navigation.state.params.title,
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

        AsyncStorage.getItem("headerData").then(data => {
            let paramData = JSON.parse(data)
            this.setState({ spinnerVisible: true })
            this.setState({ headerData: paramData })
            this.getAllProjects(paramData, '')

        })
    }
    getAllProjects(paramData, searchText) {
        var variables = { lattitude: this.state.data.latitude, longitude: this.state.data.longitude }
        return NodeAPI(variables, "getAllProjects.json" + searchText, 'POST', paramData.token, paramData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                //alert('getAllProjects===' + JSON.stringify(responseJson))

                if (responseJson.response_code === 'success') {
                    // if (responseJson.projects.length == 0) {
                    //     this.setState({ showToast: true, alertMessage: "No Projects Found. Add New Project" })
                    //     setTimeout(() => {
                    //         this.setState({ showToast: false })

                    //     }, 4000);
                    // }
                    this.setState({ listData: responseJson.projects })
                    // var arr = []
                    // this.setState({ propertyTypeArray: responseJson.propertytypes })



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
    onChange(searchText) {
        this.setState({ textInputValue: searchText })
        this.getAllProjects(this.state.headerData, '/' + searchText)
    }
    renderList(item, index) {
        return (
            <TouchableOpacity onPress={() => this.onPress(item)}
                style={styles.rowView}>
                <Text style={{ fontSize: getFontSize(14) }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    onPress(item) {
        this.props.navigation.state.params.onGoBack(item, this.state.data.type);
        this.props.navigation.goBack()
    }
    openAlertPopup() {
        if (this.state.textInputValue != '') {
            Alert.alert(
                this.state.textInputValue,
                'Are you sure you want to add this as a project or society?',
                [

                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: () => this.addProject() },
                ],
                { cancelable: false }
            )
        } else {
            this.setState({ showToast: true, alertMessage: 'Please Enter Society or Project Name.' })
            setTimeout(() => {
                this.setState({ showToast: false })

            }, 3000);
        }

    }
    addProject() {
        this.setState({ spinnerVisible: true })
        var variables = { lattitude: this.state.data.latitude, longitude: this.state.data.longitude, name: this.state.textInputValue, address: this.state.data.address, status: 1 }
        return NodeAPI(variables, "addProject.json", 'POST', this.state.headerData.token, this.state.headerData.userid)
            .then(responseJson => {
                this.setState({ spinnerVisible: false })
                //alert('addProject===' + JSON.stringify(responseJson))

                if (responseJson.response_code === 'success') {

                    this.setState({ showToast: true, alertMessage: responseJson.msg })
                    setTimeout(() => {
                        this.setState({ showToast: false })
                        this.onPress(responseJson.project)
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
                //alert(JSON.stringify(response));
            })
    }
    render() {
        let { headerSubTitle, headerTitle } = this.props;
        return (
            <View style={styles.mainView}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <View style={styles.textInputContainer}>
                    <Text>{this.state.data.textInputTitle}</Text>
                    <View style={styles.textInputView}>
                        <TextInput
                            placeholder={this.state.data.textInputPlaceHolder}
                            //placeholder={'this.props.textInputPlaceHolder'}
                            placeholderTextColor="#C0C0C0"
                            value={this.state.textInputValue}
                            onChangeText={(text) => this.onChange(text)}
                            style={styles.textInput}>

                        </TextInput>
                        {this.state.listData.length == 0 ?
                            <TouchableOpacity onPress={() => this.openAlertPopup()}
                                style={{ alignSelf: 'center' }}>
                                <Text style={{ color: themeColor, }}>+ Add</Text>
                            </TouchableOpacity> : null}
                    </View>

                    {/* <Text style={{ color: 'red', }}>This locality does not exist in our record.</Text>
                    <Text style={{ color: 'red', }}>Please add it.</Text> */}
                </View>
                <View style={styles.listContainer}>

                    {
                        this.state.listData.length == 0 ?

                            < Text style={{ color: themeColor, fontSize: dynamicSize(14), alignSelf: 'center', marginTop: dynamicSize(10) }}>No Projects Found. Add a new project.</Text>
                            : <FlatList
                                data={this.state.listData}
                                renderItem={({ item, index }) => this.renderList(item, index)}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={key => key.index}
                                keyboardShouldPersistTaps="always"
                                extraData={this.state}
                            />}
                </View>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    mainView: {
        backgroundColor: '#fff',
        flex: 1

    },
    textInputContainer: {
        paddingHorizontal: dynamicSize(15),
        minHeight: dynamicSize(80),
        paddingTop: dynamicSize(15),
        paddingBottom: dynamicSize(10)
    },
    textInputView: {
        borderBottomWidth: 1,
        borderBottomColor: '#C0C0C0',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    textInput: {
        color: themeColor,
        fontSize: getFontSize(16),
        flex: 1
    },
    listContainer: { flex: 1, backgroundColor: '#DCDCDC', marginHorizontal: dynamicSize(15), paddingBottom: dynamicSize(15) },
    rowView: { paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(10) },
    rowText: { fontSize: getFontSize(14) }
});
