import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile_Screen from '../screens/Profile_Screen';
import Colors from '../constants/colors'
import { useSelector } from 'react-redux';
import Create_Bet_Screen from '../screens/Create_Bet_Screen';
import Home_Screen from '../screens/Home_Screen';
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
            <Stack.Group>
            <Stack.Screen
                    name="Person Profile"
                    component={Person_Profile_Screen}
                    initialParams={{person: props.route.params.person}}
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