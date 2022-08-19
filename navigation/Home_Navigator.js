import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile_Screen from '../screens/Profile_Screen';
import Colors from '../constants/colors'
import { useSelector } from 'react-redux';
import Person_Profile_Screen from '../screens/Person_Profile_Screen';
import Create_Bet_Screen from '../screens/Create_Bet_Screen';
import Friends_Screen from '../screens/Friends_Screen';
import Home_Screen from '../screens/Home_Screen';
import colors from '../constants/colors';
import View_Bet_Screen from '../screens/View_Bet_Screen';
import View_Bet_Navigator from './View_Bet_Navigator';
import Profile_Navigator from '../navigation/Profile_Navigator'
import Friends_Navigator from './Friends_Navigator';
import Add_Venmo_Screen from "../screens/Add_Venmo_Screen";
import Person_Profile_Navigator from "./Person_Profile_Navigator";
import User_Profile_Navigator from "./User_Profile_Navigator";

const Stack = createNativeStackNavigator()

const Home_Navigator = (props) => {
    const user = useSelector(state => state.auth.userInfo)

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Group>
                <Stack.Screen
                    name="Home"
                    component={Home_Screen}
                />
                <Stack.Screen
                    name="User"
                    component={Friends_Navigator}
                />
                <Stack.Screen
                    name="Person Profile"
                    component={Person_Profile_Navigator}
                />
                <Stack.Screen
                    name="User Profile"
                    component={User_Profile_Navigator}
                />
            </Stack.Group>
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
                <Stack.Screen
                    name="View Bet"
                    component={View_Bet_Navigator}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Add Venmo"
                    component={Add_Venmo_Screen}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default Home_Navigator