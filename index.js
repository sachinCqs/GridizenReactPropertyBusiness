/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
global.mobileNo = '';
global.userId = '';
global.fromWhere = '';
AppRegistry.registerComponent(appName, () => App);
