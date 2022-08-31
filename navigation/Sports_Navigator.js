import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile_Screen from '../screens/Profile_Screen';
import Colors from '../constants/colors'
import { useSelector } from 'react-redux';
import Person_Profile_Screen from '../screens/Person_Profile_Screen';
import Stats_Screen from '../screens/Stats_Screen';
import Create_Bet_Screen from "../screens/Create_Bet_Screen";
import View_Bet_Navigator from "./View_Bet_Navigator";
import Add_Venmo_Screen from "../screens/Add_Venmo_Screen";
import Sports_Selection_Screen from "../screens/Sport_Selection_Screen";
import Sport_Odds_Screen from "../screens/Sport_Odds_Screen";

const Stack = createNativeStackNavigator()

const Sports_Navigator = (props) => {
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
                name="Sports"
                component={Sports_Selection_Screen}
            />
            <Stack.Screen
                name="Matches"
                component={Sport_Odds_Screen}
            />
            <Stack.Group
                screenOptions={{
                    presentation: 'modal',
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primaryColor },
                    headerTitleStyle: { color: 'white' },

                }}>
                <Stack.Screen
                    name="Create Sports Bet"
                    component={Create_Bet_Screen}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default Sports_Navigator