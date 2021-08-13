import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth_Screen from "../screens/Auth_Screen";
import Home_Screen from "../screens/Home_Screen";
import Startup_Screen from '../screens/Startup_Screen'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate } from '../store/actions/auth';


const HomeStackNavigator = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home_Screen}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true)

    const Stack = createNativeStackNavigator()
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth);

    useEffect(() => {

        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData')
            if (!userData) {
                setIsLoading(false)
                return;
            }

            const transformedData = JSON.parse(userData)
            const { token, userId, expiryDate } = transformedData
            const expirationDate = new Date(expiryDate)

            if (expirationDate <= new Date() || !token || !userId) {
                setIsLoading(false)
                return;
            }

            dispatch(authenticate(userId, token))
            setIsLoading(false)

        }

        tryLogin()
    }, [dispatch])

    if (isLoading) {
        return (<Startup_Screen />)
    }


    return (
        <NavigationContainer>
            <Stack.Navigator>
                {(user.token == null)
                    ? <Stack.Screen
                        name="Auth"
                        component={Auth_Screen}
                        options={{
                            headerShown: false
                        }}
                    />
                    : <Stack.Screen
                        name="HomeStack"
                        component={HomeStackNavigator}
                        options={{
                            headerShown: false
                        }}
                    />
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
};

export default AppNavigator