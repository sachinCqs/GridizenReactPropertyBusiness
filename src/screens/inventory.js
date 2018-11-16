import React, { Component } from 'react';
import { Platform, AsyncStorage, FlatList, Image, Dimensions, Switch, TouchableOpacity, StyleSheet, Text, View, ImageBackground, TextInput } from 'react-native';
const { height, width } = Dimensions.get('window');
import { dynamicSize, getFontSize } from '../utils/responsive';
import { PlusMinus } from '../components/button';
import { NodeAPI } from '../services/webservice';
import { Toast, Spinner } from '../components/toast'


export default class Furnished extends Component {


    constructor(props) {
        super(props)
        this.state = {
            completeFurnishingList: this.props.navigation.state.params.selectedInventoryPassed,
            spinnerVisible: false,
            showToast: false,
            alertMessage: "",
        }
        // console.log(JSON.stringify(this.props))
    }

    // componentWillMount() {
    //     AsyncStorage.getItem("headerData").then(data => {
    //         let paramData = JSON.parse(data)
    //         this.setState({ headerData: paramData, spinnerVisible: true })
    //         return NodeAPI({}, "getAllFurnishTypes.json", 'GET', paramData.token, paramData.userid)
    //             .then(responseJson => {
    //                 this.setState({ spinnerVisible: false })
    //                 if (responseJson.response_code === 'success') {
    //                     this.setState({
    //                         completeFurnishingList: responseJson.furnishtypes
    //                     })

    //                 } else {
    //                     // setTimeout(() => {
    //                     //     alert(responseJson.msg)
    //                     // }, 300)
    //                     this.setState({ showToast: true, alertMessage: responseJson.msg })
    //                     setTimeout(() => {
    //                         this.setState({ showToast: false })

    //                     }, 3000);
    //                 }
    //                 //alert(JSON.stringify(response));
    //             })

    //     })
    // }

    _toggle(item, index) {
        var data = this.state.completeFurnishingList
        data[index].switchValue = data[index].switchValue ? !data[index].switchValue : true
        this.setState({
            completeFurnishingList: data
        })
    }

    _updateValue(item, index, check) {
        var data = this.state.completeFurnishingList
        if (check == "plus") {
            data[index].quantity = data[index].quantity ? data[index].quantity < 9 ? data[index].quantity + 1 : data[index].quantity : 1
            this.setState({
                completeFurnishingList: data
            })
        }
        else {
            data[index].quantity = data[index].quantity > 0 ? data[index].quantity - 1 : null
            this.setState({
                completeFurnishingList: data
            })
        }

    }

    showList(item, index) {
        return (
            <View style={{ paddingVertical: dynamicSize(15), flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomColor: "grey", borderBottomWidth: dynamicSize(0.3), backgroundColor: "white" }}>
                <View style={{ marginLeft: dynamicSize(20), flexDirection: "row", alignItems: "center" }}>
                    <Image style={{ height: dynamicSize(30), width: dynamicSize(30) }} source={{ uri: item.icon }}></Image>
                    <Text style={{ marginLeft: dynamicSize(20) }}>{item.name}</Text>
                </View>

                <View style={{ marginRight: dynamicSize(20) }}>
                    {item.is_numeric ?
                        <PlusMinus {...this.props}
                            quantity={item.quantity ? item.quantity : 0}
                            plusClicked={() => this._updateValue(item, index, "plus")}
                            minusClicked={() => this._updateValue(item, index, "minus")}
                        />
                        :
                        <Switch onValueChange={() => this._toggle(item, index)} value={item.switchValue ? item.switchValue : false} />
                    }
                </View>

            </View >
        )
    }

    doneClick() {
        this.props.navigation.state.params.updateInventory(this.state.completeFurnishingList);
        this.props.navigation.goBack()
    }
    render() {
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.spinnerVisible} />
                <Toast visible={this.state.showToast} message={this.state.alertMessage} />
                <FlatList
                    data={this.state.completeFurnishingList}
                    renderItem={({ item, index }) => this.showList(item, index)}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    marginBottom={dynamicSize(50)}
                    extraData={this.state}
                />
                <TouchableOpacity onPress={() => this.doneClick()}
                    style={{ height: dynamicSize(50), width: "100%", backgroundColor: "#56B24D", justifyContent: "center", alignItems: "center", position: "absolute", bottom: 0 }}>
                    <Text style={{ fontSize: getFontSize(17), color: "white", fontWeight: "500" }}>DONE</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal:dynamicSize(20)

    }
});