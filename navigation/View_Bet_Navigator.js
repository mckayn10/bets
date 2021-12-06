import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile_Screen from '../screens/Profile_Screen';
import Colors from '../constants/colors'
import { useSelector } from 'react-redux';
import Person_Profile_Screen from '../screens/Person_Profile_Screen';
import Stats_Screen from '../screens/Stats_Screen';
import Settings_Screen from '../screens/Settings_Screen';
import User_Profile_Navigator from '../navigation/User_Profile_Navigator'
import View_Bet_Screen from '../screens/View_Bet_Screen';
import Create_Bet_Screen from '../screens/Create_Bet_Screen';

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
            <Stack.Group
                screenOptions={{
                    presentation: 'modal',
                }}>
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
            </Stack.Group>
            
        </Stack.Navigator>
    )
}

export default View_Bet_Navigator