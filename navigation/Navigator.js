import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Auth_Screen from "../screens/Auth_Screen";
import Home_Screen from "../screens/Home_Screen";
import Startup_Screen from '../screens/Startup_Screen'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate } from '../store/actions/auth';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors'


const HomeStackNavigator = () => {
    const Drawer = createDrawerNavigator()

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerPosition: "right",
                drawerType: 'front',
                drawerActiveTintColor: Colors.primaryColor,
                swipeEdgeWidth: 200,
                drawerStyle: {
                    width: 230
                }
            }}
        >
            <Drawer.Screen
                name="Home"
                component={Home_Screen}
                options={{
                    headerShown: false,
                    drawerIcon: props => (
                        <Ionicons name="home" size={24} color={Colors.primaryColor} />
                    )
                }}
            />
            <Drawer.Screen
                name="Friends"
                component={Home_Screen}
                options={{
                    headerShown: false,
                    drawerIcon: props => (
                        <Ionicons name="people" size={24} color={Colors.primaryColor} />
                    )
                }}
            />
            <Drawer.Screen
                name="Profile Settings"
                component={Home_Screen}
                options={{
                    headerShown: false,
                    drawerIcon: props => (
                        <Ionicons name="md-settings" size={24} color={Colors.primaryColor} />
                    )
                }}
            />
        </Drawer.Navigator>
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