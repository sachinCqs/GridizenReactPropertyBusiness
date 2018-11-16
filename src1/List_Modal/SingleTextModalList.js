import React, { Component } from 'react';
import { Platform, Modal, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView, StyleSheet, Text, View, ImageBackground, TextInput, FlatList } from 'react-native';
const { height, width } = Dimensions.get('window');
import { dynamicSize, getFontSize, themeColor } from '../utils/responsive'

//Here the list of item to be passed which is used in state

//this is the component that are to be used on that page where this modal is imported
/* <SingleTextModal {...this.props} 
    visible={this.state.singleTextModalVisible} 
    titleText="Select Tag"
    selectItemFromFlatlist={(item) => this.singleTextModalRowClicked(item)}
    close={() => this.singleTextModalClose()} />
                 */

//these are the function that are used for close modal and select the row of modal
//  singleTextModalClose() {
//     this.setState({ singleTextModalVisible: false })
// }
// singleTextModalRowClicked(item){
//     alert(item)
//this.setState({ singleTextModalVisible: false })
// }


//this is the state that is to defined in the constructor
// singleTextModalVisible:false


export default class SingleTextModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [1, 2, 3, 1, 2, 3, 1,]
        }
    }

    renderList(item, index) {
        return (
            <TouchableOpacity key={index} onPress={() => this.props.selectItemFromFlatlist(item, index)}
                style={styles.rowView}>
                <Text style={{ fontSize: getFontSize(14) }}>{this.props.typeKey != '' ? item[this.props.typeKey] : item}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        let { headerSubTitle, headerTitle, community } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.close()}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={() => this.props.close()}>
                        <View style={styles.horizontalView} />
                    </TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableWithoutFeedback onPress={() => this.props.close()}>
                            <View style={styles.verticalView} />
                        </TouchableWithoutFeedback>
                        <View style={{ width: width - dynamicSize(80), maxHeight: height - dynamicSize(100), 
                            // backgroundColor: '#DCDCDC' 
                            backgroundColor: 'white'
                            }}>
                            <View style={styles.titleView}>
                                <Text style={{ fontSize: getFontSize(16), fontWeight: '500',color:themeColor }}>{this.props.titleText}</Text>
                            </View>
                            <FlatList
                                data={this.props.data}
                                renderItem={({ item, index }) => this.renderList(item, index)}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={key => key.index}
                                keyboardShouldPersistTaps="always"
                                extraData={this.state}
                            />
                        </View>
                        <TouchableWithoutFeedback onPress={() => this.props.close()}>
                            <View style={styles.verticalView} />
                        </TouchableWithoutFeedback>
                    </View>

                    <TouchableWithoutFeedback onPress={() => this.props.close()}>
                        <View style={styles.horizontalView} />
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        )
    }
}

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
        backgroundColor: '#fff', padding: dynamicSize(15),borderBottomWidth:1,borderBottomColor:'#A2A8A2'
    },
    rowView: { paddingHorizontal: dynamicSize(15), paddingVertical: dynamicSize(10),borderBottomWidth:0.5,borderBottomColor:'#A2A8A2' },
    rowText: { fontSize: getFontSize(14) }

})