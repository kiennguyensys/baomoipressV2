import React, { Component } from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import { Animated } from 'react-native';
import HomeScreen from '../../screens/HomeScreen/';
import OtherCategoriesScreens from '../../screens/HomeScreen/OtherCategoriesScreens';
import CustomTopTabBar from '../CustomTopTabBar.js';
import {
    StyleSheet,
} from 'react-native';

export default createMaterialTopTabNavigator({
    HomeScreen: {
        screen: HomeScreen,
    },
    Tab0: {
        screen: OtherCategoriesScreens,
    },
    Tab1: {
        screen: OtherCategoriesScreens,
    },
    Tab2: {
        screen: OtherCategoriesScreens,
    },
    Tab3: {
        screen: OtherCategoriesScreens,
    },
    Tab4: {
        screen: OtherCategoriesScreens,
    },
    Tab5: {
        screen: OtherCategoriesScreens,
    },
    Tab6: {
        screen: OtherCategoriesScreens,
    },
    Tab7: {
        screen: OtherCategoriesScreens,
    },
    Tab8: {
        screen: OtherCategoriesScreens,
    },
    Tab9: {
        screen: OtherCategoriesScreens,
    },
    Tab10: {
        screen: OtherCategoriesScreens,
    },
    Tab11: {
        screen: OtherCategoriesScreens,
    },
    Tab12: {
        screen: OtherCategoriesScreens,
    },
    Tab13: {
        screen: OtherCategoriesScreens,
    },
    Tab14: {
        screen: OtherCategoriesScreens,
    },
},{
    order: [
        "HomeScreen",
        "Tab0",
        "Tab1",
        "Tab2",
        "Tab3",
        "Tab4",
        "Tab5",
        "Tab6",
        "Tab7",
        "Tab8",
        "Tab9",
        "Tab10",
        "Tab11",
        "Tab12",
        "Tab13",
        "Tab14",
    ],
    lazy: true,
    tabBarComponent: CustomTopTabBar,
}
)
