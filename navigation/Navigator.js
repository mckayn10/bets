import React from 'react'
import {
    createAppContainer,
    createSwitchNavigator,
    DrawerItems,
    SafeAreaView
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Auth_Screen from "../screens/Auth_Screen";
import Home_Screen from "../screens/Home_Screen";
import Startup_Screen from "../screens/Startup_Screen";
import { createDrawerNavigator } from "react-navigation-drawer";
import Colors from '../constants/colors'
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const AuthNavigator = createStackNavigator({
    Auth: {
        screen: Auth_Screen,
        navigationOptions: {
            headerShown: false
        },
    }
})

const DrawerNavigator = createDrawerNavigator(
    {
        Home: {
            navigationOptions: {
                drawerIcon: () => (
                    <Ionicons name="md-home" style={{ color: Colors.primaryColor }} size={20}/>
                ),
                drawerLabel: "Home"
            },
            screen: Home_Screen
        },
        Profile: {
            screen: Home_Screen,
            navigationOptions: ({ navigation }) => ({
                title: 'Profile',
            })
        },

    },
    {
        drawerWidth: 250,
        drawerPosition: 'right',
        drawerBackgroundColor: 'white',
        edgeWidth: 200,
        contentOptions: {
            activeBackgroundColor: Colors.backgroundColor,
            activeTintColor: Colors.primaryColor
        }

    }
)

const MainNavigator = createSwitchNavigator({
    Startup: {
        screen: Startup_Screen
    },
    Auth: AuthNavigator,
    Home: DrawerNavigator
})

export default createAppContainer(MainNavigator)