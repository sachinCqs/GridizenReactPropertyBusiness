import React, { component } from 'react';
import { View, StyleSheet, StatusBar, Text, Button, Image, TouchableOpacity } from 'react-native';

// export default class Header extends component {
//     render() {
//         return (
//             <View style={styles.container}>
//                 <StatusBar barStyle='light-content' />
//                 <View style={styles.status} />
//                 <View style={styles.header}>
//                     <Text style={styles.label}> Demo </Text>
//                     <Button
//                         title='Search'
//                         color='#f5fcff'
//                     // onPress={}
//                     />
//                 </View>
//             </View>

//         )
//     }
// }

const Header = ({ title }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' />
            {/* <View style={styles.status} /> */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => alert("success")} style={styles.button1}>
                    <Image style={styles.menus} source={require('../assets/menu.png')}></Image>
                </TouchableOpacity>
                <Text style={styles.label}> <Image style={styles.labelimg} source={require('../assets/logo.png')} ></Image> {title} </Text>
                <TouchableOpacity style={styles.button2}>
                    <Image style={styles.profileimg} source={require('../assets/profileIcon.png')} ></Image>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    // status: {
    //     zIndex: 10,
    //     elevation: 2,
    //     width: '100%',
    //     height: 21,
    //     backgroundColor: '#0097a7'
    // },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 56,
        marginBottom: 6,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: '#000'
    },
    label: {
        flex: 1,
        fontSize: 20,
        fontWeight: `600`,
        textAlign: `center`,
        // marginVertical: 8,
        // paddingVertical: 3,
        color: `#000`,
        backgroundColor: `transparent`
    },
    button1: {
        marginLeft:10
    },
    button2: {
        marginRight:10

    },
    profileimg: {
        width: 50,
        height: 50,
    },
    menus: {
        width: 30,
        height: 30,
    },
    labelimg: {
        height:30,
        width:30
    }

});

export default Header;