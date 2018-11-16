import React from 'react';
import { Text, StyleSheet, TouchableWithoutFeedback, ActivityIndicator, SafeAreaView, Modal, Dimensions, View } from 'react-native';
import { dynamicSize, getFontSize, themeColor, fontFamily } from '../utils/responsive';
const { height, width } = Dimensions.get('window');


export const Toast = ({ visible, message }) => {
    return (

        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                console.log('Modal has been closed.');
            }}>
            {/* <View style={{ height: height, width: width,justifyContent: "flex-end", alignItems: "center" }}>
                
                <View style={{ height: dynamicSize(50), backgroundColor: "#323232", width: width, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "white", fontSize: getFontSize(14) }}>{message}</Text>
                </View>
            </View> */}
            <View style={{ height: height, width: width }} />
            <View style={{ position: "absolute", zIndex: 1, bottom: 0, height: dynamicSize(50), backgroundColor: "#323232", width: width, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: getFontSize(14), textAlign: 'center' }}>{message}</Text>
            </View>
        </Modal>

    )
}

export const Spinner = ({ visible }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                console.log('Modal has been closed.');
            }}>
            <View style={{ height: height, width: width, alignItems: "center", justifyContent: "center", backgroundColor: "#00000092" }}>
                <ActivityIndicator size="large" color="#00b32d" />
            </View>

        </Modal>
    )
}


export const ErrModal = ({ visible, message, modalClose }) => {
    return (

        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={modalClose}>
            <TouchableWithoutFeedback onPress={modalClose}>
                <View style={{ height: height, width: width, alignItems: "center", justifyContent: "center", backgroundColor: "#00000092" }}>
                    <TouchableWithoutFeedback onPress={() => console.log("")}>
                        <View style={{ padding: dynamicSize(15),marginHorizontal:dynamicSize(20), backgroundColor: "black", zIndex: 20, borderRadius: dynamicSize(5) }}>
                            <Text style={{ color: "white", fontFamily: fontFamily() }}>{message}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>


        </Modal>

    )
}

const Style = StyleSheet.create({
    errMessage: {
        color: 'red',
        marginLeft: dynamicSize(10)
    }
})

