import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Text } from 'react-native';
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
import Profile_Screen from '../screens/Profile_Screen';
import Friends_Screen from '../screens/Friends_Screen';
import Add_Friends_Screen from '../screens/Add_Friends_Screen'
import Person_Profile_Screen from '../screens/Person_Profile_Screen';

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

const HomeDrawerNavigator = () => {

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
                component={FriendsNavigator}
                options={{
                    headerShown: false,
                    drawerIcon: props => (
                        <Ionicons name="people" size={24} color={Colors.primaryColor} />
                    )
                }}
            />
            <Drawer.Screen
                name="Profile Settings"
                component={ProfileNavigator}
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

const ProfileNavigator = (props) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Profile"
                component={Profile_Screen}
                options={{
                    headerStyle: {
                        backgroundColor: Colors.primaryColor,
                    },
                    headerTitleStyle: {
                        color: 'white'
                    },
                }}
            />
        </Stack.Navigator>
    )
}

const FriendsNavigator = (props) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: '#fff',
            }}
        >
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
                name="Person"
                component={Person_Profile_Screen}
                options={{
                    headerStyle: {
                        backgroundColor: Colors.primaryColor,
                    },
                    headerTitleStyle: {
                        color: 'white'
                    },
                }}
            />
        </Stack.Navigator>
    )
}

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true)

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
            const { token, userId, expiryDate, person } = transformedData
            const expirationDate = new Date(expiryDate)

            if (expirationDate <= new Date() || !token || !userId) {
                setIsLoading(false)
                return;
            }

            dispatch(authenticate(userId, token, person))
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
                        component={HomeDrawerNavigator}
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