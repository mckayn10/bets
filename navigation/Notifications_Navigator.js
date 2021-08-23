import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../constants/colors'
import Notifications_Screen from '../screens/Notifications_Screen';

const Stack = createStackNavigator()

const Notifications_Navigator = (props) => {
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
                name="My Notifications"
                component={Notifications_Screen}
            />
        </Stack.Navigator>
    )
}

export default Notifications_Navigator