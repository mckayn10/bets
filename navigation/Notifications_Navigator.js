import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../constants/colors'
import Notifications_Screen from '../screens/Notifications_Screen';
import Bet_Review_Screen from '../screens/Bet_Review_Screen';
import Person_Profile_Screen from '../screens/Person_Profile_Screen';
import Profile_Screen from '../screens/Profile_Screen';
import Friends_Screen from '../screens/Friends_Screen';
import Stats_Screen from '../screens/Stats_Screen';
import Add_Friends_Screen from '../screens/Add_Friends_Screen'
import Home_Screen from '../screens/Home_Screen';
import Create_Bet_Screen from "../screens/Create_Bet_Screen";

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
                    name="Notifications"
                    component={Notifications_Screen}
                />
            </Stack.Group>
            <Stack.Group
                screenOptions={{
                    presentation: 'card'
                }}
            >
                <Stack.Screen
                    name="Bet Review"
                    component={Bet_Review_Screen}
                />
                <Stack.Screen
                    name="Person"
                    component={Person_Profile_Screen}
                />
                <Stack.Screen
                    name="Edit Profile"
                    component={Profile_Screen}
                />
                <Stack.Screen
                    name="Persons Friends"
                    component={Friends_Screen}
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

export default Notifications_Navigator