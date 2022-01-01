import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile_Screen from '../screens/Profile_Screen';
import Colors from '../constants/colors'
import { useSelector } from 'react-redux';
import Create_Bet_Screen from '../screens/Create_Bet_Screen';
import Home_Screen from '../screens/Home_Screen';
import User_Profile_Screen from '../screens/User_Profile_Screen';
import View_Bet_Navigator from '../navigation/View_Bet_Navigator'

const Stack = createNativeStackNavigator()

const User_Profile_Navigator = (props) => {
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
                    component={User_Profile_Screen}
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
                <Stack.Screen
                    name="View Bet"
                    component={View_Bet_Navigator}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default User_Profile_Navigator