import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import Splash from './screens/Splash';
import GoogleAutoCompleteList from './List_Modal/googleAutoCompleteList';
import Step1 from './screens/step1'
import Step2 from './screens/step2'
import Demo from './screens/demo'
const stack = createStackNavigator({

    Splash: {
        screen: Splash,
        navigationOptions: () => ({
            
        }),
    },
    GoogleAutoCompleteList: {
        screen: GoogleAutoCompleteList,
    },
    Demo: {
        screen: Demo,
    },
    Step1: {
        screen: Step1,
    },
    Step2: {
        screen: Step2,
    },


}
    , {
        initialRouteName: "Step2"
    }
)
// const Drawer = createDrawerNavigator({
//     myProfile: {
//         screen: myProfile,
//         drawerLabel: 'My profile',
//     }
// });

export default stack;