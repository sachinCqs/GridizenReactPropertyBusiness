import { createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
import Login from './screens/login';
import React, { Component } from 'react';
import { AsyncStorage, Text, View, Dimensions, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { dynamicSize, getFontSize, fontFamily, themeColor } from './utils/responsive';
const { height, width } = Dimensions.get('window');

import SignUp from './screens/signup';
import UserType from './screens/userType';
import Demo from './screens/demo';
import Verification from './screens/verification';
import Home from './screens/home';
import ForgorPassword from './screens/forgot_password';
import ResetPassword from './screens/reset_password';
import Step3 from './screens/step_3';
import ImagesShow from './screens/ImagesShow';
import Step1 from './screens/step1'
import Step2 from './screens/step2'
import PropertyList from './screens/propertyList'
import GoogleAutoCompleteList from './List_Modal/googleAutoCompleteList';
import PropertyDetails from './screens/propertyDetails'
import PropertyReview from './screens/propertyReview'
import { NavigationActions, StackActions } from 'react-navigation';
import Inventory from './screens/inventory'
import Appointment from './screens/appointment'
import Notification from './screens/notification'
import Message from './screens/message'
import NotificationDetail from './screens/notificationDetail';
import LocalAgents from './screens/localAgents';
import AgentDescription from './screens/agentDescription'
import AgentsServices from './screens/AgentsServices';
import MyServices from './screens/MyServices';
import MyServicesOfDrawer from './screens/MyServices';

import NegotiationLogs from './screens/negotiationLogs'
import ContentComponentOfDrawer from './components/customComponentOfDrawer'

const stack = createStackNavigator({

    Login: {
        screen: Login,
        navigationOptions: () => ({
            header: null
        })
    },
    NotificationDetail: {
        screen: NotificationDetail,
    },
    
    GoogleAutoCompleteList: {
        screen: GoogleAutoCompleteList,
    },
    LocalAgents: {
        screen: LocalAgents,
        navigationOptions: () => ({
            header: null

        })
    },
    
    AgentDescription: {
        screen: AgentDescription,
        navigationOptions: () => ({
            title: "Agent",

        })
    },
    AgentsServices: {
        screen: AgentsServices,
        navigationOptions: () => ({
            title: "Agent Services",

        })
    },
    MyServices: {
        screen: MyServices,
        navigationOptions: () => ({
            header: null

        })
    },
    Step1: {
        screen: Step1,
        navigationOptions: () => ({
            title: "Add Property",

        })
    },
    PropertyList: {
        screen: PropertyList,
        navigationOptions: ({ navigation }) => ({
            title: "Your Properties",
            //headerTintColor: themeColor,
            headerTitleStyle: {
                width: '100%',
                textAlign: 'center',

            },
            tintColor: themeColor,
            headerLeft: (
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        navigation.toggleDrawer()
                        // AsyncStorage.removeItem("headerData"),
                        //     resetAction = StackActions.reset({
                        //         index: 0,
                        //         actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        //     });
                        // navigation.dispatch(resetAction);
                    }}>
                    <Image
                        // style={{ height: dynamicSize(20), tintColor: themeColor, width: dynamicSize(20), marginLeft: dynamicSize(15) }}
                        style={{marginLeft:dynamicSize(15)}}
                        source={require("./assets/bars.png")} />
                </TouchableOpacity>
            ),

            headerBackTitle: null,
            headerRight: (
                <TouchableOpacity
                    style={{ paddingTop: dynamicSize(10), paddingLeft: dynamicSize(5) }}
                    onPress={() => {
                        // AsyncStorage.removeItem("headerData"),
                        //     resetAction = StackActions.reset({
                        //         index: 0,
                        //         actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        //     });
                        // navigation.dispatch(resetAction);
                        navigation.navigate('Notification')
                    }}>
                    <Image
                        style={{ height: dynamicSize(24), tintColor: themeColor, width: dynamicSize(24), marginRight: dynamicSize(10) }}
                        source={require("./assets/notification.png")} />
                    <View style={{
                        position: 'absolute',
                        height: navigation.state.params ? navigation.state.params.notificationCount.length > 1 ? dynamicSize(22) : dynamicSize(16) : dynamicSize(16),
                        width: navigation.state.params ? navigation.state.params.notificationCount.length > 1 ? dynamicSize(22) : dynamicSize(16) : dynamicSize(16),
                        borderRadius: navigation.state.params ? navigation.state.params.notificationCount.length > 1 ? dynamicSize(11) : dynamicSize(8) : dynamicSize(8),
                        backgroundColor: '#f49930', alignItems: 'center', justifyContent: 'center', top: dynamicSize(3)
                    }}>
                        <Text style={{ color: 'white', fontSize: getFontSize(10) }}>{navigation.state.params ? navigation.state.params.notificationCount : 0}</Text>
                    </View>
                </TouchableOpacity>

            ),
        })
    },
    Step2: {
        screen: Step2,
        navigationOptions: () => ({
            title: "Add Property",

        })
    },
    PropertyReview: {
        screen: PropertyReview,
        navigationOptions: () => ({
            title: "Property Review",

        })
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: () => ({
            header: null
        })
    },
    UserType: {
        screen: UserType,
        navigationOptions: () => ({
            title: "",

        })
    },
    Demo: {
        screen: Demo,

    },
    Verification: {
        screen: Verification,
        navigationOptions: () => ({
            header: null
        })
    },
    Home: {
        screen: Home,
        navigationOptions: ({ navigation }) => ({
            title: "HOME",
            headerBackTitle: null,
            headerRight: (
                <TouchableOpacity onPress={() => {
                    AsyncStorage.removeItem("headerData"),
                        resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        });
                    navigation.dispatch(resetAction);
                }}>
                    <Image
                        style={{ height: dynamicSize(20), width: dynamicSize(20), marginRight: dynamicSize(20) }}
                        source={require("./assets/logout.png")} />
                </TouchableOpacity>

            ),
        })
    },
    ForgorPassword: {
        screen: ForgorPassword,
        navigationOptions: () => ({
            title: "",

        })
    },
    ResetPassword: {
        screen: ResetPassword,
        navigationOptions: () => ({
            header: null
        })
    },
    Message: {
        screen: Message,
        navigationOptions: () => ({
            title: "Messages",

        })
    },
    Step3: {
        screen: Step3,
        navigationOptions: () => ({
            title: "Add Property",

        })
    },
    Notification: {
        screen: Notification,
        navigationOptions: () => ({
            title: "Notifications",

        })
    },
    Appointment: {
        screen: Appointment,
        headerBackTitle: null,
        navigationOptions: () => ({
            title: "Appointment",
            headerTintColor: themeColor,
            headerTitleStyle: {
                width: '100%',
                textAlign: 'center'
            },
            headerRight: (<View></View>),
        })
    },
    Inventory: {
        screen: Inventory,
        navigationOptions: () => ({
            title: "Add Inventory",

        })
    },
    PropertyDetails: {
        screen: PropertyDetails,
        navigationOptions: () => ({
            title: "Property Details",

        })

    },
    NegotiationLogs: {
        screen: NegotiationLogs,
        navigationOptions: () => ({
            title: "Negotiation Logs",
        })
    },
    ImagesShow: {
        screen: ImagesShow,
        navigationOptions: () => ({
            header: null
        })
    }

}
    , {
        initialRouteName: "Login",
        navigationOptions: {
            headerTintColor: '#7a7a7a',
            headerStyle: {
                borderTopWidth: 0.5,

                borderTopColor: '#e7e7e7',
                borderBottomColor: 'white',

            },

        },
    }
)


const mainRoute = createStackNavigator({

    Login: {
        screen: Login,
        navigationOptions: () => ({
            header: null
        })
    },
    GoogleAutoCompleteList: {
        screen: GoogleAutoCompleteList,
    },
    LocalAgents: {
        screen: LocalAgents,
        navigationOptions: () => ({
            header: null

        })
    },
    AgentDescription: {
        screen: AgentDescription,
        navigationOptions: () => ({
            title: "Agent",

        })
    },
    AgentsServices: {
        screen: AgentsServices,
        navigationOptions: () => ({
            title: "Agent Services",

        })
    },
    MyServices: {
        screen: MyServices,
        navigationOptions: () => ({
            header: null

        })
    },
    Step1: {
        screen: Step1,
        navigationOptions: () => ({
            title: "Add Property",


            //headerTitleStyle: { width:width-70,textAlign:'center',color:themeColor },
        })
    },
    NotificationDetail: {
        screen: NotificationDetail,
    },
    PropertyList: {
        screen: PropertyList,
        navigationOptions: ({ navigation }) => ({
            title: "Your Properties",
            //headerTintColor: '#7a7a7a',

            // headerStyle: {  },
            headerTitleStyle: {
                width: '100%',
                textAlign: 'center',

            },
            //tintColor: themeColor,
            headerLeft: (
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        navigation.toggleDrawer()
                        // AsyncStorage.removeItem("headerData"),
                        //     resetAction = StackActions.reset({
                        //         index: 0,
                        //         actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        //     });
                        // navigation.dispatch(resetAction);
                    }}>
                     <Image
                        // style={{ height: dynamicSize(20), tintColor: themeColor, width: dynamicSize(20), marginLeft: dynamicSize(15) }}
                        style={{marginLeft:dynamicSize(15)}}
                        source={require("./assets/bars.png")} />
                    {/* <Image
                        style={{ height: dynamicSize(20), tintColor: themeColor, width: dynamicSize(20), marginLeft: dynamicSize(15) }}
                        source={require("./assets/logout.png")} /> */}
                </TouchableOpacity>
            ),

            headerBackTitle: null,
            headerRight: (
                <TouchableOpacity
                    style={{ paddingTop: dynamicSize(10), paddingLeft: dynamicSize(5) }}
                    onPress={() => {
                        // AsyncStorage.removeItem("headerData"),
                        //     resetAction = StackActions.reset({
                        //         index: 0,
                        //         actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        //     });
                        // navigation.dispatch(resetAction);
                        navigation.navigate('Notification')
                    }}>
                    <Image
                        style={{ height: dynamicSize(24), tintColor: themeColor, width: dynamicSize(24), marginRight: dynamicSize(10) }}
                        source={require("./assets/notification.png")} />
                    <View style={{
                        position: 'absolute',
                        height: navigation.state.params ? navigation.state.params.notificationCount.length > 1 ? dynamicSize(22) : dynamicSize(16) : dynamicSize(16),
                        width: navigation.state.params ? navigation.state.params.notificationCount.length > 1 ? dynamicSize(22) : dynamicSize(16) : dynamicSize(16),
                        borderRadius: navigation.state.params ? navigation.state.params.notificationCount.length > 1 ? dynamicSize(11) : dynamicSize(8) : dynamicSize(8),
                        backgroundColor: '#f49930', alignItems: 'center', justifyContent: 'center', top: dynamicSize(3)
                    }}>
                        <Text style={{ color: 'white', fontSize: getFontSize(10) }}>{navigation.state.params ? navigation.state.params.notificationCount : 0}</Text>
                    </View>
                </TouchableOpacity>

            ),
        })
    },
    PropertyReview: {
        screen: PropertyReview,
        navigationOptions: () => ({
            title: "Property Review",

        })
    },
    Message: {
        screen: Message,
        navigationOptions: () => ({
            title: "Messages",

        })
    },
    Step2: {
        screen: Step2,
        navigationOptions: () => ({
            title: "Add Property",

        })
    },
    Notification: {
        screen: Notification,
        navigationOptions: () => ({
            title: "Notifications",

        })
    },
    Appointment: {
        screen: Appointment,
        //headerBackTitle:null,
        navigationOptions: () => ({
            title: "Appointment",
            //headerTintColor: themeColor,
            headerTitleStyle: {
                width: '100%',
                textAlign: 'center'
            },
            headerRight: (<View></View>),
            headerLeft: (<View></View>),
        })
    },
    Inventory: {
        screen: Inventory,
        navigationOptions: () => ({
            title: "Add Inventory",

        })
    },
    PropertyDetails: {
        screen: PropertyDetails,
        navigationOptions: () => ({
            title: "Property Details",
            //headerTintColor: themeColor,

        })

    },
    SignUp: {
        screen: SignUp,
        navigationOptions: () => ({
            header: null
        })
    },
    UserType: {
        screen: UserType,
        navigationOptions: () => ({
            title: "",

        })
    },
    Demo: {
        screen: Demo,

    },
    Verification: {
        screen: Verification,
        navigationOptions: () => ({
            header: null
        })
    },
    Home: {
        screen: Home,
        navigationOptions: ({ navigation }) => ({
            title: "HOME",
            headerBackTitle: null,
            headerRight: (
                <TouchableOpacity onPress={() => {
                    AsyncStorage.removeItem("headerData"),
                        resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        });
                    navigation.dispatch(resetAction);
                }}>
                    <Image
                        style={{ height: dynamicSize(20), width: dynamicSize(20), marginRight: dynamicSize(20) }}
                        source={require("./assets/logout.png")} />
                </TouchableOpacity>

            ),
        })
    },
    ForgorPassword: {
        screen: ForgorPassword,
        navigationOptions: () => ({
            title: "",

        })
    },
    ResetPassword: {
        screen: ResetPassword,
        navigationOptions: () => ({
            header: null
        })
    },
    NegotiationLogs: {
        screen: NegotiationLogs,
        navigationOptions: () => ({
            title: "Negotiation Logs",
        })
    },
    Step3: {
        screen: Step3,
        navigationOptions: () => ({
            title: "Add Property",
            //headerTintColor: themeColor,
            headerTitleStyle: {
                width: '100%',
                textAlign: 'center'
            },
            headerRight: (<View></View>),
        })

    },
    ImagesShow: {
        screen: ImagesShow,
        navigationOptions: () => ({
            header: null
        })
    }

}
    , {
        initialRouteName: "PropertyList",
        headerMode: 'float',
        navigationOptions: {
            headerTintColor: '#7a7a7a',
            headerStyle: {
                borderTopWidth: 0.5,

                borderTopColor: '#e7e7e7',
                borderBottomColor: 'white',

            },

        },
    },

)

const Drawer = createDrawerNavigator({
    PropertyList: {
        screen: mainRoute,
        navigationOptions: () => ({
            drawerLabel: 'My Properties',
            drawerIcon: ({ tintColor }) => (
                <Image
                  source={require('./assets/user.png')}
                  style={[{tintColor: tintColor,marginLeft:dynamicSize(25)}]}
                />
              ),
        })
    },
    MyServicesOfDrawer: {
        screen: MyServicesOfDrawer,
        navigationOptions: () => ({
            drawerLabel: 'My Services',
            drawerIcon: ({ tintColor }) => (
                <Image
                  source={require('./assets/user.png')}
                  style={[{tintColor: tintColor,marginLeft:dynamicSize(25)}]}
                />
              ),
        })

    }
},
    {
        contentComponent: (props, { navigation }) => <ContentComponentOfDrawer item={props}  />,
        drawerWidth: width - (width / 4),
        contentOptions: {
            activeTintColor:themeColor,
            activeBackgroundColor: 'transparent',
            
            
        }
    }
);


class HandleNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.checkAuth()
    }

    checkAuth = () => {

        AsyncStorage.getItem('headerData').then(data => {
            if (data != null) {
                this.props.navigation.navigate('Drawer')
            }
            else this.props.navigation.navigate('stack')
        })
    }

    render() {
        return (
            <View></View>
        )
    }
}

export const Navigation = createSwitchNavigator({
    HandleNavigation: HandleNavigation,
    stack: { screen: stack },
    Drawer: { screen: Drawer }
});
export default Navigation;
//export default token == '' ? stack : mainRoute;