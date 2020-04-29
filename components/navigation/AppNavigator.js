import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import SplashScreen from '../../screens/SplashScreen';
import DrawerNavigator from './DrawerNavigator';

const MainAppNavigator = createSwitchNavigator({
    Splash: SplashScreen,
    App: DrawerNavigator
}, {
    initialRouteName: 'Splash',
});

const AppNavigator = createAppContainer(MainAppNavigator)
export default AppNavigator
