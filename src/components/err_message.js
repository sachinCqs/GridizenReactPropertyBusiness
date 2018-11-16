import React from 'react';
import { Text, StyleSheet, Dimensions, View } from 'react-native';
import { dynamicSize, getFontSize } from '../utils/responsive';
const { width } = Dimensions.get('window');
const ErrText = (props) => {
    return (
        
        <Text numberOfLines={3}
        style={[Style.errMessage, {height: props.text ? dynamicSize(17) : 0  }]}>{props.text}</Text>
        
    )
}

const Style = StyleSheet.create({
    errMessage: {
        color: 'red',
        marginLeft: dynamicSize(10),
        marginRight: dynamicSize(10),
        //width:width-20
    }
})

export default ErrText;