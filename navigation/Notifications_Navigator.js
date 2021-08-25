import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../constants/colors'
import Notifications_Screen from '../screens/Notifications_Screen';
import BetReview from '../components/BetReview';

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
            <Stack.Group>
                <Stack.Screen
                    name="My Notifications"
                    component={Notifications_Screen}
                />
            </Stack.Group>
            <Stack.Group 
                screenOptions={{
                    presentation: 'modal'
                }}
            >
                <Stack.Screen
                    name="Bet Review"
                    component={BetReview}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default Notifications_Navigator