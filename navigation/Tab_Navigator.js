import * as React from 'react';
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

const Tab = createBottomTabNavigator();

export default function Tab_Navigator() {
    let notifications = useSelector(state => state.notifications.notifications)

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors.primaryColor,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: Colors.backgroundColor
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let myStyles = {
                        borderTopColor: 'transparent',
                        borderTopWidth: 3,
                        flex: 1,
                        justifyContent: 'center',
                        width: '70%',
                        height: '100%',
                        alignItems: 'center',
                        paddingTop: 10,
                    }


                    if (route.name === 'Home Tab') {
                        myStyles.borderTopColor = focused ? Colors.primaryColor : 'transparent'
                        iconName = focused
                            ? 'home'
                            : 'ios-home-outline';
                    } else if (route.name === 'Friends Tab') {
                        myStyles.borderTopColor = focused ? Colors.primaryColor : 'transparent'
                        iconName = focused ? 'md-people' : 'people-outline';
                        size = 28
                    }
                    else if (route.name === 'Notifications Tab') {
                        myStyles.borderTopColor = focused ? Colors.primaryColor : 'transparent'
                        iconName = focused ? 'notifications-sharp' : 'notifications-outline';
                    }
                    else if (route.name === 'Profile Tab') {
                        size = 28
                        myStyles.borderTopColor = focused ? Colors.primaryColor : 'transparent'
                        iconName = focused ? 'person-circle-sharp' : 'person-circle-outline';
                    }
                    else if (route.name === 'Settings Tab') {
                        myStyles.borderTopColor = focused ? Colors.primaryColor : 'transparent'
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    else if (route.name === 'Stats Tab') {
                        myStyles.borderTopColor = focused ? Colors.primaryColor : 'transparent'
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
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
                    tabBarBadge: notifications.length > 0 ? notifications.length : null,
                    tabBarBadgeStyle: {
                        fontSize: 12,
                        marginTop: 10
                    }
                }}
            />
            <Tab.Screen
                name="Friends Tab"
                component={Friends_Navigator}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false
                }}
            />
            <Tab.Screen
                name="Profile Tab"
                component={Profile_Navigator}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false
                }}
            />
            <Tab.Screen
                name="Stats Tab"
                component={Stats_Navigator}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false
                }}
            />
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
