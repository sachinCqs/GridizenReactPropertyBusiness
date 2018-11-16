import React, { Component } from 'react';
import { Platform, Modal, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput, FlatList } from 'react-native';
const { height, width } = Dimensions.get('window');
import { dynamicSize, getFontSize, themeColor, fontFamily } from '../utils/responsive'



class CheckBox extends Component {
    constructor(props) {
        super(props);

    }
    //this is the component used for calling checkbox on any js page
    // <CheckBox {...this.props}
    // selected={this.state.check}
    // checkClicked={() => this.setState({ check: !this.state.check })}
    // text='Family' fontSize={14} />
    render() {

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={() => this.props.checkClicked()}>
                    <Image style={{}} source={this.props.selected ? require('../assets/icons/check.png') : require('../assets/icons/unCheck.png')} />
                </TouchableWithoutFeedback>
                <Text style={{ marginLeft: dynamicSize(10), fontSize: getFontSize(this.props.fontSize), color: this.props.textColor }}>{this.props.text}</Text>
            </View>
        )
    }
}

class RadioButton extends Component {
    constructor(props) {
        super(props);

    }
    //this is the component used for calling checkbox on any js page
    // <RadioButton {...this.props}
    // selected={this.state.check}
    // checkClicked={() => this.setState({ check: !this.state.check })}
    // text='Family' fontSize={14} />
    render() {

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={() => this.props.checkClicked()}>
                    <Image style={{ tintColor: '#000' }} source={this.props.selected ? require('../assets/icons/r-check-active.png') : require('../assets/icons/r-check.png')} />
                </TouchableWithoutFeedback>
                <Text style={{ marginLeft: dynamicSize(10), fontSize: getFontSize(this.props.fontSize) }}>{this.props.text}</Text>
            </View>
        )
    }
}
class TextBoxWithTitleAndButton extends Component {
    constructor(props) {
        super(props);

    }
    //this is the component used for calling textBoxWithTitleAndButton on any js page
    //this compnnent contain
    //title
    //then image , textbox(editable or not), down arrow
    //     <TextBoxWithTitleAndButton {...this.props}
    //      title={this.state.title}
    //      placeHolder={this.state.placeHolder}
    //      error={true}
    //      value={this.state.value}
    //      editable={true}
    //      downArrow={false}
    //      icon={require('icon path')}
    //      onChangeText={(text)=>this.setState({text:text})}
    //     plusClicked={() => this.state.openParkingquantity >= 9 ? null : this.setState({ openParkingquantity: this.state.openParkingquantity + 1 })}
    //     minusClicked={() => this.state.openParkingquantity > 0 ? this.setState({ openParkingquantity: this.state.openParkingquantity - 1 }) : null}
    // />
    render() {

        return (
            <TouchableWithoutFeedback onPress={() => this.props.onButtonPress()}>
                <View style={{
                    padding: dynamicSize(15),

                    paddingVertical: dynamicSize(10)
                }}>
                    {/* <Text style={{ fontFamily: fontFamily('bold'), fontSize: getFontSize(14), }}>Property Type</Text> */}

                    <View style={{
                        flexDirection: 'row',
                        height: this.props.multiline ? dynamicSize(100) : null,
                        alignItems: this.props.multiline ? 'flex-start' : 'center', borderColor: this.props.error ? 'red' : '#c3c3c3', borderWidth: 1, paddingHorizontal: dynamicSize(5)
                    }}>
                        {this.props.leftArrowVacant && this.props.leftArrowVacant ? null :
                            <Image style={{ marginTop: this.props.multiline ? dynamicSize(10) : null }}
                                source={this.props.icon} />
                        }

                        <View style={{ flex: 1, marginHorizontal: dynamicSize(5) }}>
                            <TextInput
                                placeholder={this.props.placeHolder}
                                value={this.props.value}
                                maxLength={this.props.maxlength || null}
                                editable={this.props.editable}
                                keyboardType={this.props.keyboard ? this.props.keyboard : 'default'}
                                multiline={this.props.multiline ? true : false}
                                onChangeText={(text) => this.props.onChangeText(text)}
                                style={{
                                    fontFamily: fontFamily(),
                                    color: '#3c3c3c',

                                    fontSize: getFontSize(16)
                                }}
                            />
                            {/* <TextField
                                label='Address'
                                value={this.props.value}
                                textColor="#000"
                                inputContainerPadding={0}
                                labelHeight={ dynamicSize(10) }
                                inputContainerStyle={{ borderBottomWidth: 0, borderBottomColor: '#DCDCDC' }}
                                tintColor="#000"
                                containerStyle={{ paddingBottom: 5 }}
                                editable={true}
                                error={''}
                                onChangeText={(text) => this.props.onChangeText(text)}
                            /> */}
                        </View>
                        {this.props.downArrow ?
                            <Image source={require('../assets/downArrow.png')} /> :
                            null
                        }

                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const FloatButton = (props) => {
    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <Image style={styles.floatButton} source={require('../assets/add_deal_icon.png')} resizeMode="contain" />
        </TouchableWithoutFeedback>
    )
}


class PlusMinus extends Component {
    constructor(props) {
        super(props);

    }
    //this is the component used for calling plusMinus on any js page
    //     <PlusMinus {...this.props}
    //     quantity={this.state.openParkingquantity}
    //     plusClicked={() => this.state.openParkingquantity >= 9 ? null : this.setState({ openParkingquantity: this.state.openParkingquantity + 1 })}
    //     minusClicked={() => this.state.openParkingquantity > 0 ? this.setState({ openParkingquantity: this.state.openParkingquantity - 1 }) : null}
    // />
    render() {

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={() => this.props.minusClicked()}>
                    <View style={{ height: dynamicSize(30), width: dynamicSize(30), alignItems: 'center', justifyContent: 'center', borderRadius: dynamicSize(15), borderWidth: 1 }}>
                        <Text style={{ fontWeight: '500' }}>-</Text>
                    </View>
                </TouchableWithoutFeedback>
                <Text style={{ marginHorizontal: dynamicSize(25) }}>{this.props.quantity}</Text>
                <TouchableWithoutFeedback onPress={() => this.props.plusClicked()}>
                    <View style={{ height: dynamicSize(30), width: dynamicSize(30), alignItems: 'center', justifyContent: 'center', borderRadius: dynamicSize(15), borderWidth: 1 }}>
                        <Text style={{ fontWeight: '500' }}>+</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}


export { CheckBox, RadioButton, PlusMinus, TextBoxWithTitleAndButton,FloatButton };

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#00000090',
        flex: 1,
        // justifyContent:'center',
        // alignItems:'center'

    },
    horizontalView: {
        minHeight: dynamicSize(40), flex: 1
    },
    verticalView: {
        width: dynamicSize(40), height: '100%'
    },
    titleView: {
        backgroundColor: '#fff', padding: dynamicSize(10)
    },
    rowView: { paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(10) },
    rowText: { fontSize: getFontSize(14) },
    floatButton: {
        height: dynamicSize(60),
        width: dynamicSize(60),
        position: 'absolute',
        zIndex: 15,
        bottom: dynamicSize(20),
        right: dynamicSize(30)
    }

})