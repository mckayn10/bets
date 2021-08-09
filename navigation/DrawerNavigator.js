import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Home_Screen from '../screens/Home_Screen';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import Colors from '../constants/colors'
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { navigationRef } from './NavActions';




const Drawer = createDrawerNavigator();
// export function openDrawer(routeName, params) {
//     navigationRef.current.dispatch(DrawerActions.openDrawer());
// }


export default DrawerNavigator = () => {

    return (
        <NavigationContainer ref={navigationRef}>
            <Drawer.Navigator
                initialRouteName="Home"
                screenOptions={{
                    drawerPosition: 'right',
                    swipeEdgeWidth: 300,
                    headerShown: false,
                    drawerStyle: {
                        width: 230,
                    },
                    drawerType: 'slide',
                    drawerActiveBackgroundColor: Colors.backgroundColor,
                    drawerActiveTintColor: Colors.primaryColor,
                }}
            >
                <Drawer.Screen
                    name="Profile"
                    component={Home_Screen}
                    options={{
                        drawerIcon: () => (
                            <View style={{ width: 25 }}>
                                <Ionicons name="person" size={18} color={Colors.primaryColor} />
                            </View>
                        )
                    }}

                />
                <Drawer.Screen
                    name="Home"
                    component={Home_Screen}
                    options={{
                        drawerIcon: () => (
                            <View style={{ width: 25 }}>
                                <Foundation name="home" size={20} color={Colors.primaryColor} />
                            </View>
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Friends"
                    component={Home_Screen}
                    options={{
                        drawerIcon: () => (
                            <View style={{ width: 25 }}>
                                <FontAwesome5 name="user-friends" size={18} color={Colors.primaryColor} />
                            </View>
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Log out"
                    component={Home_Screen}
                    options={{
                        drawerIcon: () => (
                            <View style={{ width: 25 }}>
                                <MaterialIcons name="logout" size={24} color={Colors.red} />
                            </View>
                        ),
                    }}
                    
                />



            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 30,
        color: 'white'
    },
    registerText: {
        color: 'white'
    },
    createText: {
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: 'white'
    },
    logout: {
        marginTop: 100,
        backgroundColor: 'red'
    }
});
