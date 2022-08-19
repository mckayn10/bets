import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile_Screen from '../screens/Profile_Screen';
import Colors from '../constants/colors'
import { useSelector } from 'react-redux';
import Person_Profile_Screen from '../screens/Person_Profile_Screen';
import Stats_Screen from '../screens/Stats_Screen';
import Settings_Screen from '../screens/Settings_Screen';
import User_Profile_Navigator from '../navigation/User_Profile_Navigator'
import Create_Bet_Screen from "../screens/Create_Bet_Screen";
import Friends_Navigator from "./Friends_Navigator";

const Stack = createNativeStackNavigator()

const Settings_Navigator = (props) => {
    const user = useSelector(state => state.auth.userInfo)

    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: Colors.primaryColor
                }
            }}
        >
            <Stack.Screen
                name="Settings"
                component={Settings_Screen}
            />
            <Stack.Screen
                name="User Profile"
                component={User_Profile_Navigator}
            />
            <Stack.Screen
                name="Friends List"
                component={Friends_Navigator}
            />
            <Stack.Group
                screenOptions={{
                    presentation: 'modal',
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primaryColor },
                    headerTitleStyle: { color: 'white' },

                }}>
                <Stack.Screen
                    name="Create Bet"
                    component={Create_Bet_Screen}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default Settings_Navigator