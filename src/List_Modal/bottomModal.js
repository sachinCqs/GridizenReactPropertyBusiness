
import React, { Component } from 'react';
import {
    StyleSheet, SafeAreaView,Dimensions,
    Text, Modal, Picker, TouchableWithoutFeedback, FlatList,
    View, Image, TouchableOpacity, TextInput, ScrollView, Platform
} from 'react-native';
import {themeColor} from '../utils/responsive'
const { height, width } = Dimensions.get('window');
const data = [
    "Project X", "Project Y", "Project Z", "Project A", "Project B", "Project C", "Project D",
]
const bottoModal = ({ pickerDropdownModalVisible, pickerDropdownModalClose, titleText, pickerDropdownModalListData, pickerDropdownModalRow }) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={pickerDropdownModalVisible}
            onRequestClose={pickerDropdownModalClose}>

            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={pickerDropdownModalClose} style={{ flex: 1, width: width }} >

                </TouchableOpacity>
                <View style={styles.bottomContainer}>
                    <Text style={{ fontSize: 22, color: themeColor, alignSelf: "center", marginTop: 10, fontWeight: "bold" }}>
                        {titleText}

                    </Text>
                    <ScrollView>
                        <FlatList
                            data={pickerDropdownModalListData}
                            keyboardShouldPersistTaps="always"
                            renderItem={pickerDropdownModalRow
                            }
                            keyExtractor={key => key.index}
                        //extraData={this.state}
                        />


                    </ScrollView>
                </View>
            </View>

        </Modal>
    )
}
const styles = StyleSheet.create({
    modalContainer: { height: height, width: width, backgroundColor: "#00000098", alignItems: "center", justifyContent: "center" },
    bottomContainer: { width: width, maxHeight: height / 2, minHeight: height / 4, backgroundColor: "white", paddingBottom: 30, borderTopLeftRadius: 20, borderTopRightRadius: 20 },

});






export default bottoModal;