import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile_Screen from '../screens/Profile_Screen';
import Colors from '../constants/colors'
import { useSelector } from 'react-redux';
import Person_Profile_Screen from '../screens/Person_Profile_Screen';

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
            <Stack.Screen
                name="Personal Profile"
                component={Person_Profile_Screen}
                initialParams={{ person: user, isUser: true }}
            />
            <Stack.Screen
                name="Edit Profile"
                component={Profile_Screen}
            />
        </Stack.Navigator>
    )
}

export default Profile_Navigator