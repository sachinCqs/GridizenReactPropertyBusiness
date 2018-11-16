import React, { Component } from 'react';
import { Platform, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
const { height, width } = Dimensions.get('window');
import NodeAPI from '../services/webservice';
import { dynamicSize, getFontSize, fontFamily } from '../utils/responsive';
import { ErrModal } from '../components/toast';
export default class UserType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            switchImage: true,
            landlordSelected: false,
            blockSelected: false,
            agentSelected: false,
            developerSelected: false,
            ErrModalVisible: false,
            errModalMessage: '',
        };
    }

    _saveUserType(check) {
        if (check == "1") {
            this.setState({
                landlordSelected: !this.state.landlordSelected,
            })
        }
        else if (check == "2") {
            this.setState({
                blockSelected: !this.state.blockSelected,
            })
        }
        else if (check == "3") {
            this.setState({
                agentSelected: !this.state.agentSelected,
            })
        }
        else if (check == "4") {
            this.setState({
                developerSelected: !this.state.developerSelected
            })
        }
    }

    _goToSignup() {
        if (!this.state.landlordSelected && !this.state.blockSelected && !this.state.agentSelected && !this.state.developerSelected) {
            this.setState({ errModalMessage: "Please select one of the user type.", ErrModalVisible: true })
        }
        else {
            this.props.navigation.navigate("SignUp", {
                type:
                {
                    landlordSelected: this.state.landlordSelected,
                    blockSelected: this.state.blockSelected,
                    agentSelected: this.state.agentSelected,
                    developerSelected: this.state.developerSelected
                }
            })
        }

    }

    render() {
        return (
            <View style={styles.fullview}>
                <ErrModal visible={this.state.ErrModalVisible} message={this.state.errModalMessage} modalClose={() => this.setState({ ErrModalVisible: false })} />
                <Image 
                //style={{ tintColor: "#56B24D", height: dynamicSize(54), width: dynamicSize(200) }} 
                source={require("../assets/logo-business.png")} />
                <Text style={{ color: "#A5A5A5", fontSize: getFontSize(15), fontFamily: fontFamily("bold"), marginTop: dynamicSize(10) }}>Which user are you?</Text>
                <TouchableOpacity onPress={() => this._saveUserType("1")} style={{ height: dynamicSize(45), flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "85%", borderTopColor: "#E9E9E9", borderTopWidth: dynamicSize(1), marginTop: dynamicSize(20), paddingHorizontal: dynamicSize(10) }}>
                    <Text style={{ color: this.state.landlordSelected ? "#56B24D" : "#9FA3A4", fontFamily: fontFamily("bold"), fontSize: getFontSize(13) }}>Landlord</Text>
                    <Image source={this.state.landlordSelected ? require('../assets/icons/check.png') : require('../assets/icons/unCheck.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._saveUserType("2")} style={{ height: dynamicSize(45), flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "85%", borderTopColor: "#E9E9E9", borderTopWidth: dynamicSize(1), marginTop: dynamicSize(5), paddingHorizontal: dynamicSize(10) }}>
                    <Text style={{ color: this.state.blockSelected ? "#56B24D" : "#9FA3A4", fontFamily: fontFamily("bold"), fontSize: getFontSize(13) }}>Block Manager</Text>
                    <Image source={this.state.blockSelected ? require('../assets/icons/check.png') : require('../assets/icons/unCheck.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._saveUserType("3")} style={{ height: dynamicSize(45), flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "85%", borderTopColor: "#E9E9E9", borderTopWidth: dynamicSize(1), marginTop: dynamicSize(5), paddingHorizontal: dynamicSize(10) }}>
                    <Text style={{ color: this.state.agentSelected ? "#56B24D" : "#9FA3A4", fontFamily: fontFamily("bold"), fontSize: getFontSize(13) }}>Agent</Text>
                    <Image source={this.state.agentSelected ? require('../assets/icons/check.png') : require('../assets/icons/unCheck.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._saveUserType("4")} style={{ height: dynamicSize(45), flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "85%", borderTopColor: "#E9E9E9", borderTopWidth: dynamicSize(1), marginTop: dynamicSize(5), paddingHorizontal: dynamicSize(10) }}>
                    <Text style={{ color: this.state.developerSelected ? "#56B24D" : "#9FA3A4", fontFamily: fontFamily("bold"), fontSize: getFontSize(13) }}>Developer</Text>
                    <Image source={this.state.developerSelected ? require('../assets/icons/check.png') : require('../assets/icons/unCheck.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._goToSignup()} style={{ backgroundColor: "#F49930", height: dynamicSize(50), flexDirection: "row", alignItems: "center", width: "85%", borderColor: "#E9E9E9", borderWidth: dynamicSize(1), marginTop: dynamicSize(5), justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: getFontSize(16), fontFamily: fontFamily("bold") }}>Next</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    fullview: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    }
});