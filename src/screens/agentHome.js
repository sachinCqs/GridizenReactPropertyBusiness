import React, { Component } from 'react';
import { Platform, Image, AsyncStorage, ScrollView, RefreshControl, TouchableWithoutFeedback, Dimensions, FlatList, TouchableOpacity, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
import { dynamicSize, getFontSize, dateConverterMMDDYYYY, themeColor, fontFamily } from '../utils/responsive';
const { height, width } = Dimensions.get('window');
import { ErrModal, Toast, Spinner } from '../components/toast'
import { FloatButton } from '../components/button'
import { NodeAPI } from '../services/webservice'

export default class Dashboard extends Component {



    constructor(props) {
        super(props)
        this.state = {
          
            dataCount: 15,
            propertyList: [],
            headerData: '',
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
            refreshing: false,
            loaderPosition: dynamicSize(5),
            propertyListCount: 0
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

   
   

    render() {
        return (
            <View style={styles.fullView}>
              

            </View>
            // <Image resizeMode="stretch" source={require('../assets/icons/businessDashboard.jpg')} style={{flex:1}}/>
        )
    }
}

const styles = StyleSheet.create({
    fullView: {
        flex: 1,
        backgroundColor: '#fff'

    },
    propertyListRow: {
        width: width,
        backgroundColor: '#fff',
        flexDirection: 'row',


        borderBottomWidth: dynamicSize(8),
        borderBottomColor: '#e7e7e7'
    },
    imageView: {
        width: (width / 2) - dynamicSize(40),
        height: (width / 2) - dynamicSize(80),
        padding: dynamicSize(10),


    },
    detailView: {
        width: (width / 2) + dynamicSize(40), paddingVertical: dynamicSize(8),


    },
    propertyImage: {
        width: (width / 2) - dynamicSize(60),
        height: (width / 2) - dynamicSize(100),


    },
    propertyImageOpacity: {
        width: (width / 2) - dynamicSize(60),
        height: (width / 2) - dynamicSize(100),
        opacity: 0.4,
        backgroundColor: '#000000', position: 'absolute',
        left: dynamicSize(10), top: dynamicSize(10),

    },
    dateView: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'red', justifyContent: 'flex-end' },
    //dateText: { fontSize: getFontSize(10), color: '#fff', marginHorizontal: dynamicSize(5) },
    likeView: { position: 'absolute', top: dynamicSize(15), left: dynamicSize(15) },
    seenView: { backgroundColor: '#00000098', padding: dynamicSize(2), paddingHorizontal: dynamicSize(5), position: 'absolute', right: 0, top: 0 },

    rentText: { color: '#7a7a7a', fontSize: getFontSize(16), fontFamily: fontFamily('bold') },
    address1Text: { fontSize: getFontSize(11), color: themeColor, fontFamily: fontFamily('bold') },
    address2Text: { fontSize: getFontSize(11), fontFamily: fontFamily(), color: '#7a7a7a' },
    dateText: { fontSize: getFontSize(9), color: '#999999', fontFamily: fontFamily(), marginTop: dynamicSize(3) },
    BHKText: { fontSize: getFontSize(13), color: '#3c3c3c', marginTop: dynamicSize(8) }
});