import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../constants/colors'
import Friends_Screen from '../screens/Friends_Screen';
import Add_Friends_Screen from '../screens/Add_Friends_Screen'
import Person_Profile_Screen from '../screens/Person_Profile_Screen';
import Stats_Screen from '../screens/Stats_Screen';
import Create_Bet_Screen from '../screens/Create_Bet_Screen';
import Home_Screen from '../screens/Home_Screen';
import View_Bet_Navigator from './View_Bet_Navigator';

const Stack = createNativeStackNavigator()

const Friends_Navigator = (props) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: Colors.primaryColor
                }
            }}
        >
            <Stack.Group>
                <Stack.Screen
                    name="My Friends"
                    component={Friends_Screen}
                    options={{
                        headerStyle: {
                            backgroundColor: Colors.primaryColor,
                        },
                        headerTitleStyle: {
                            color: 'white'
                        },
                    }}
                />
                <Stack.Screen
                    name="Add Friends"
                    component={Add_Friends_Screen}
                    options={{
                        headerStyle: {
                            backgroundColor: Colors.primaryColor,
                        },
                        headerTitleStyle: {
                            color: 'white'
                        },
                    }}
                />
                <Stack.Screen
                    name="Person"
                    component={Person_Profile_Screen}
                    initialParams={{person: props.route.params ? props.route.params.person : null}}
                />
                <Stack.Screen
                    name="Stats Screen"
                    component={Stats_Screen}
                    options={{
                        headerStyle: {
                            backgroundColor: Colors.primaryColor,
                        },
                        headerTitleStyle: {
                            color: 'white'
                        },
                    }}
                />
                <Stack.Screen
                    name="Persons Friends"
                    component={Friends_Screen}
                />
                <Stack.Screen
                    name="Home"
                    component={Home_Screen}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default Friends_Navigator