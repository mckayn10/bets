import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile_Screen from '../screens/Profile_Screen';
import Colors from '../constants/colors'
import { useSelector } from 'react-redux';
import Person_Profile_Screen from '../screens/Person_Profile_Screen';
import Create_Bet_Screen from '../screens/Create_Bet_Screen';
import Friends_Screen from '../screens/Friends_Screen';
import Home_Screen from '../screens/Home_Screen';
import Friends_Navigator from '../navigation/Friends_Navigator'

const Stack = createNativeStackNavigator()

const Profile_Navigator = (props) => {
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
            <Stack.Group>
                <Stack.Screen
                    name="Personal Profile"
                    component={Person_Profile_Screen}
                    initialParams={{ person: user, isUser: true }}
                />
                <Stack.Screen
                    name="Edit Profile"
                    component={Profile_Screen}
                />
                <Stack.Screen
                    name="Home"
                    component={Home_Screen}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Group>
            <Stack.Group
                screenOptions={{
                    presentation: 'modal'
                }}>
                <Stack.Screen
                    name="Create Bet"
                    component={Create_Bet_Screen}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default Profile_Navigator