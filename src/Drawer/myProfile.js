import React, { Component } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import Header from '../components/header';

export default class Profile extends Component {
    render() {
        return (

            <ImageBackground source={require('../assets/wallpaper.png')} style={styles.fullview}>
                <Header title="Profile" />



            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    fullview: {
        flex: 1,
    }
});

