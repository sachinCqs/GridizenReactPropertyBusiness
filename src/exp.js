/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {

    StyleSheet, Alert, AsyncStorage,
    Text, TouchableWithoutFeedback,
    View, ScrollView, Image, TouchableOpacity
} from 'react-native';
import { DrawerNavigator, DrawerItems, StackNavigator } from 'react-navigation';
import { StackActions, NavigationActions } from 'react-navigation';
import AnalysisExport from './screens/analysis&export';
import Timesheet from './screens/timeSheet';
import Leaves from './screens/leaves';
import Setting from './screens/appSetting';
import ManageLeaveTypes from './screens/manageLeaveTypes';
import ManageProject from './screens/manageProject';
import ActivityList from './screens/activityList';
import TermsCondition from './screens/T&C';
//import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import LeaveDescription from './screens/leaveDescription';
import ProjectBreakdown from './screens/projectBreakdown';
import ProjectDevelopment from './screens/projectDevelopment';
import CreateTimesheet from './screens/createTimesheet';
import Login from './screens/login'
import Signup from './screens/signUp'
import ForgotPassword from './screens/forgotPassword'
import ResetPassword from './screens/resetPassword'
import Splash from './screens/splash'
import EditProfile from './screens/editProfile'
import EmployeeDetail from './screens/employeeDetail'

import CompanyProfile from './screens/companyProfile'

import { height, width, getLog } from './utils/utils'
import webservice from './components/webService'
import ContentComponentOfDrawer from './components/contentComponentOfDrawer'
//const { height, width } = Dimensions.get('window')
//import Dimensions from './utils/utils'




var userType=''
// AsyncStorage.getItem('userType').then((data) => {

//     userType=data
    
// })
function logoutPress(navigation) {
    //navigation.navigate('Timesheet')
    Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
            { text: 'Cancel', onPress: () => getLog('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => logout(navigation) },
        ],
        { cancelable: false }
    )
}
function logout(navigation) {
    AsyncStorage.getItem('userToken').then((token) => {

        return webservice('', "logout", 'GET', token)
            .then(response => {
                //this.setState({spinnerVisible:false})
                if (response != "error") {
                    AsyncStorage.removeItem('userToken').then((token) => {
                        getLog("tokenRemoved")
                    })

                    AsyncStorage.removeItem('LoginresponseData').then((token) => {
                        getLog("LoginresponseDataRemoved")
                    })
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                    navigation.dispatch(resetAction);

                }

            })
    })

}
//export default DrawerNavigator({
const Drawer = DrawerNavigator({

    Timesheet: {
        screen: Timesheet
    },
    Leaves: {
        screen: Leaves
    },
    AnalysisExport: {
        screen: AnalysisExport
    },

    ManageProject: {
        screen: ManageProject,
        
            
       
    },
    ManageLeaveTypes: {
        screen: ManageLeaveTypes
    },
    ActivityList: {
        screen: ActivityList
    },
    // TermsCondition: {
    //     screen: TermsCondition
    // },
    Setting: {
        screen: Setting
    },
    // Logout: {
    //     screen: Logout
    // },
}, {
        contentComponent: (props, { navigation }) => <ContentComponentOfDrawer item={props} />
        // (
        //     <View style={styles.container} >
        //         <ScrollView>
        //             <View style={styles.topView}>
        //                 <View style={styles.userDataView}>
        //                     <Image source={require('./images/userImage.png')}
        //                         style={styles.userImage} />
        //                     <View style={styles.emailView}>
        //                         <Text style={styles.emailText}>
        //                             sachin@greychaindesign.com

        //                         </Text>
        //                         <TouchableOpacity onPress={() => alert("edit")}>
        //                             <Image source={require('./images/drawerIcons/editIcon.png')} />
        //                         </TouchableOpacity>
        //                     </View>
        //                 </View>
        //             </View>
        //             <DrawerItems
        //                 {...props}
        //             />
        //             <TouchableWithoutFeedback onPress={() => logoutPress(props.navigation)}>
        //                 <View style={{ flexDirection: "row", paddingLeft: 20, padding: 8 }}>
        //                     <Image source={require('./images/drawerIcons/logoutIcon.png')} />
        //                     <Text style={{ fontSize: 14, color: '#333333', marginLeft: 38, fontWeight: "bold" }}>
        //                         Logout
        //                 </Text>
        //                 </View>
        //             </TouchableWithoutFeedback>
        //         </ScrollView>
        //     </View>
        // )
        ,
        drawerWidth: width - (width / 5),
        //initialRouteName : userType == 'Admin' ? 'Setting' : 'ManageProject'

    },
    {
       
    }

);


const DrawerOfAdmin = DrawerNavigator({

    ManageProject: {
        screen: ManageProject,
        
            
       
    },
    AnalysisExport: {
        screen: AnalysisExport
    },

    
    
    // TermsCondition: {
    //     screen: TermsCondition
    // },
    Setting: {
        screen: Setting
    },
    CompanyProfile: {
        screen: CompanyProfile
    },
    // Logout: {
    //     screen: Logout
    // },
}, {
        contentComponent: (props, { navigation }) => <ContentComponentOfDrawer item={props} />
        // (
        //     <View style={styles.container} >
        //         <ScrollView>
        //             <View style={styles.topView}>
        //                 <View style={styles.userDataView}>
        //                     <Image source={require('./images/userImage.png')}
        //                         style={styles.userImage} />
        //                     <View style={styles.emailView}>
        //                         <Text style={styles.emailText}>
        //                             sachin@greychaindesign.com

        //                         </Text>
        //                         <TouchableOpacity onPress={() => alert("edit")}>
        //                             <Image source={require('./images/drawerIcons/editIcon.png')} />
        //                         </TouchableOpacity>
        //                     </View>
        //                 </View>
        //             </View>
        //             <DrawerItems
        //                 {...props}
        //             />
        //             <TouchableWithoutFeedback onPress={() => logoutPress(props.navigation)}>
        //                 <View style={{ flexDirection: "row", paddingLeft: 20, padding: 8 }}>
        //                     <Image source={require('./images/drawerIcons/logoutIcon.png')} />
        //                     <Text style={{ fontSize: 14, color: '#333333', marginLeft: 38, fontWeight: "bold" }}>
        //                         Logout
        //                 </Text>
        //                 </View>
        //             </TouchableWithoutFeedback>
        //         </ScrollView>
        //     </View>
        // )
        ,
        drawerWidth: width - (width / 5),
        //initialRouteName : userType == 'Admin' ? 'Setting' : 'ManageProject'

    },
    {
       
    }

);


export default StackNavigator(
    {
        Splash: { screen: Splash },
        Login: { screen: Login },
        Signup: { screen: Signup },
        Drawer: {
            screen: Drawer,
            navigationOptions: () => ({
                header: null
            }),
        },
        DrawerOfAdmin:{
            screen: DrawerOfAdmin,
            navigationOptions: () => ({
                header: null
            }),
        },
        LeaveDescription: { screen: LeaveDescription },
        ProjectBreakdown: { screen: ProjectBreakdown },
        ProjectDevelopment: { screen: ProjectDevelopment },
        CreateTimesheet: { screen: CreateTimesheet },
        ForgotPassword: { screen: ForgotPassword },
        ResetPassword: { screen: ResetPassword },
        EditProfile: { screen: EditProfile },
        TermsCondition: { screen: TermsCondition },
        Setting: { screen: Setting },
        EmployeeDetail: { screen: EmployeeDetail },
        


        //Register: {screen: Register},
    },
    { headerMode: "none" },
    
    {

        // initialRouteName: "Home",
        //    headerMode: Platform.OS == "android" ? "none" : "float",
        // header: (navigation) => ({
        //     left: (
        //         <Button
        //           title="Back"
        //           onPress={ () => navigation.goBack() }  
        //         />
        //       )
        //   })
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topView: {
        height: 150,
        width: width - (width / 5),
        backgroundColor: "#2A56C6",
        alignItems: "center",
        justifyContent: 'center'
    },
    userDataView: {
        width: (width - (width / 5)) - 20
    },
    userImage: { height: 60, width: 60, borderRadius: 30, marginTop: 25, },
    emailText: {
        textAlign: 'left',
        color: '#fff',

    },
    emailView: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, }

});
