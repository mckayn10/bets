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
            </Stack.Group>
            <Stack.Group
                screenOptions={{
                    presentation: 'modal',
                    headerShown: true,
                    headerStyle: {backgroundColor: Colors.primaryColor},
                    headerTitleStyle: {color: 'white'},
                    
                }}>
                <Stack.Screen
                    name="Create Bet"
                    component={Create_Bet_Screen}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default Home_Navigator