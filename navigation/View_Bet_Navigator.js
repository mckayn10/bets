import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../constants/colors'
import View_Bet_Screen from '../screens/View_Bet_Screen';
import Home_Screen from "../screens/Home_Screen";
import Friends_Navigator from "./Friends_Navigator";
import Person_Profile_Navigator from "./Person_Profile_Navigator";
import User_Profile_Navigator from "./User_Profile_Navigator";
import Person_Profile_Screen from "../screens/Person_Profile_Screen";

const Stack = createNativeStackNavigator()

const View_Bet_Navigator = ({route}) => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: Colors.primaryColor
                },

            }}
        >
            <Stack.Group>
                <Stack.Screen
                    name="Bet Details"
                    component={View_Bet_Screen}
                    initialParams={{ 
                        bet: route.params.bet, 
                        infoToDisplayBasedOnUser: route.params.infoToDisplayBasedOnUser ,
                        permissions: route.params.permissions
                    }}
                    // options={{
                    //     headerShown: false
                    // }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home_Screen}
                />
                <Stack.Screen
                    name="User"
                    component={Friends_Navigator}
                />
                <Stack.Screen
                    name="Person"
                    component={Person_Profile_Navigator}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Person Profile"
                    component={Person_Profile_Navigator}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="User Profile"
                    component={User_Profile_Navigator}
                />
            </Stack.Group>
            
        </Stack.Navigator>
    )
}

export default View_Bet_Navigator