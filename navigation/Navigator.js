import React from 'react'
import { ScrollView, View, Button, TouchableOpacity, Text } from 'react-native';
import {
    createAppContainer,
    createSwitchNavigator,
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
import { MaterialIcons } from '@expo/vector-icons';
import CustomDrawerContent from '../components/CustomDrawerContent';


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
                    <Ionicons name="md-home" color={Colors.primaryColor} size={20} />
                ),
                drawerLabel: "Home"
            },
            screen: Home_Screen
        },
        Profile: {
            navigationOptions: {
                drawerIcon: () => (
                    <Ionicons name="person" size={20} color={Colors.primaryColor} />
                ),
                drawerLabel: "Profile"
            },
            screen: Home_Screen
        },
        Settings: {
            navigationOptions: {
                drawerIcon: () => (
                    <MaterialIcons name="settings" size={20} color={Colors.primaryColor} />
                ),
                drawerLabel: "Settings"
            },
            screen: Home_Screen
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
        },
        contentComponent: props => {
            return <CustomDrawerContent {...props}/>
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