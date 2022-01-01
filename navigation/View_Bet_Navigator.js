import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../constants/colors'
import View_Bet_Screen from '../screens/View_Bet_Screen';

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