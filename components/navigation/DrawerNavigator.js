import { createDrawerNavigator } from 'react-navigation-drawer';
import SideBar from '../SideBar/index.js';
import MultiBarNavigator from './MultiBarNavigator';
import Header from '../Header.js';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get("window")

export default createDrawerNavigator({
    MultiBar: MultiBarNavigator
}, {
    contentComponent: SideBar,
    drawerWidth: width
})
