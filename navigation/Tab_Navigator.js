import React, { useEffect, useState, useLayoutEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home_Screen from '../screens/Home_Screen';
import Friends_Navigator from './Friends_Navigator';
import Notifications_Navigator from './Notifications_Navigator';
import { Ionicons } from '@expo/vector-icons';
import Profile_Navigator from './Profile_Navigator';
import Colors from '../constants/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'react-native'
import Stats_Screen from '../screens/Stats_Screen';
import Stats_Navigator from './Stats_Navigator';
import Settings_Screen from '../screens/Settings_Screen';
import Settings_Navigator from './Settings_Navigator';
import { useSelector } from 'react-redux';
import Home_Navigator from './Home_Navigator';
import User_Profile_Screen from '../screens/User_Profile_Screen';
import User_Profile_Navigator from './User_Profile_Navigator';
import Create_Bet_Screen from "../screens/Create_Bet_Screen";

const Tab = createBottomTabNavigator();

export default function Tab_Navigator() {
    let notifications = useSelector(state => state.notifications.notifications)
    const [unseenNotis, setUnseenNotis] = useState([])

    useEffect(() => {

        let unseenArr = []
        notifications.forEach(noti => {
            if(!noti.seen){
                unseenArr.push(noti)
            }
        })
        setUnseenNotis(unseenArr.length)
        
    }, [notifications])

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors.backgroundColor,
                tabBarInactiveTintColor: Colors.backgroundColor,
                tabBarStyle: {
                    backgroundColor: Colors.primaryColor,
                    height: 100,
                    paddingLeft: 10,
                    paddingRight: 10
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let myStyles = {
                        borderTopColor: 'transparent',
                        borderTopWidth: 3,
                        flex: 1,
                        justifyContent: 'center',
                        width: 60,
                        height: '100%',
                        alignItems: 'center',
                        paddingTop: 5,
                        marginTop: 1,
                        // backgroundColor: 'red'
                    }

                    if (route.name === 'Home Tab') {
                        myStyles.borderTopColor = focused ? Colors.backgroundColor : 'transparent'
                        iconName = focused
                            ? 'home'
                            : 'ios-home-outline';
                        color = Colors.backgroundColor
                        size = 28

                    } else if (route.name === 'Friends Tab') {
                        myStyles.borderTopColor = focused ? Colors.backgroundColor : 'transparent'
                        iconName = focused ? 'md-people' : 'people-outline';
                        size = 30
                        color = Colors.backgroundColor

                    }
                    else if (route.name === 'Notifications Tab') {
                        myStyles.borderTopColor = focused ? Colors.backgroundColor : 'transparent'
                        iconName = focused ? 'notifications-sharp' : 'notifications-outline';
                        color = Colors.backgroundColor
                        size = 28

                    }
                    else if (route.name === 'Add Tab') {
                        myStyles.borderTopColor = focused ? Colors.backgroundColor : 'transparent'
                        iconName = 'add-circle';
                        size = 60
                        color = Colors.backgroundColor

                    }
                    else if (route.name === 'Profile Tab') {
                        size = 28
                        myStyles.borderTopColor = focused ? Colors.backgroundColor : 'transparent'
                        iconName = focused ? 'person-circle-sharp' : 'person-circle-outline';
                        color = Colors.backgroundColor
                    }
                    else if (route.name === 'Settings Tab') {
                        myStyles.borderTopColor = focused ? Colors.backgroundColor : 'transparent'
                        iconName = focused ? 'settings' : 'settings-outline';
                        color = Colors.backgroundColor
                        size = 28

                    }
                    else if (route.name === 'Stats Tab') {
                        myStyles.borderTopColor = focused ? Colors.backgroundColor : 'transparent'
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                        color = Colors.backgroundColor
                        size = 28

                    }

                    return (
                        <View style={myStyles}>
                            <Ionicons name={iconName} size={size} color={color} />
                        </View>
                    )
                },
            })}
        >
            <Tab.Screen
                name="Home Tab"
                component={Home_Navigator}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false,
                }}
            />
            <Tab.Screen
                name="Notifications Tab"
                component={Notifications_Navigator}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarBadge: unseenNotis > 0 ? unseenNotis : null,
                    tabBarBadgeStyle: {
                        fontSize: 12,
                        marginTop: 10
                    }
                }}
            />
            <Tab.Screen
                name="Add Tab"
                component={Create_Bet_Screen}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false
                }}
                listeners={({navigation}) => ({
                    tabPress: event => {
                        event.preventDefault()
                        console.log("HELLO HELLO")
                        navigation.navigate('Create Bet')
                    }
                })}
            />
            {/*<Tab.Screen*/}
            {/*    name="Profile Tab"*/}
            {/*    component={User_Profile_Navigator}*/}
            {/*    options={{*/}
            {/*        headerShown: false,*/}
            {/*        tabBarShowLabel: false*/}
            {/*    }}*/}
            {/*/>*/}
            <Tab.Screen
                name="Friends Tab"
                component={Friends_Navigator}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false
                }}
            />
            {/*<Tab.Screen*/}
            {/*    name="Stats Tab"*/}
            {/*    component={Stats_Navigator}*/}
            {/*    options={{*/}
            {/*        headerShown: false,*/}
            {/*        tabBarShowLabel: false*/}
            {/*    }}*/}
            {/*/>*/}
            <Tab.Screen
                name="Settings Tab"
                component={Settings_Navigator}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false
                }}
            />

        </Tab.Navigator>
    );
}
