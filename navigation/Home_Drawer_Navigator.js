// import React from 'react'
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import Home_Screen from "../screens/Home_Screen";
// import { Ionicons } from '@expo/vector-icons';
// import Colors from '../constants/colors';
// import Notifications_Navigator from './Notifications_Navigator';
// import Friends_Navigator from './Friends_Navigator';
// import Profile_Navigator from './Profile_Navigator';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Notifications_Screen from '../screens/Notifications_Screen';
// import Tab_Navigator from './Tab_Navigator';


// const Drawer = createDrawerNavigator()
// const Stack = createNativeStackNavigator()


// const Home_Drawer_Navigator = () => {

//     return (
//         <Drawer.Navigator
//             drawerContent={(props) => <CustomDrawerContent {...props} />}
//             screenOptions={{
//                 drawerType: 'front',
//                 drawerActiveTintColor: Colors.primaryColor,
//                 swipeEdgeWidth: 200,
//                 drawerStyle: {
//                     width: 230
//                 },
//                 headerTintColor: 'white',
//                 headerStyle: {
//                     backgroundColor: Colors.primaryColor
//                 }
//             }}
//         >
//             <Drawer.Screen
//                 name="Home"
//                 component={Tab_Navigator}
//                 options={{
//                     headerShown: false,
//                     drawerIcon: props => (
//                         <Ionicons name="home" size={20} color={Colors.primaryColor} />
//                     )
//                 }}
//             />
//             <Drawer.Screen
//                 name="Notifications"
//                 component={Notifications_Navigator}
//                 options={{
//                     headerShown: false,
//                     drawerIcon: props => (
//                         <Ionicons name="notifications" size={20} color={Colors.primaryColor} />
//                     )
//                 }}
//             />
//             <Drawer.Screen
//                 name="Friends"
//                 component={Friends_Navigator}
//                 options={{
//                     headerShown: false,
//                     drawerIcon: props => (
//                         <Ionicons name="people" size={20} color={Colors.primaryColor} />
//                     ),
//                 }}
//             />
//             <Drawer.Screen
//                 name="Profile Settings"
//                 component={Profile_Navigator}
//                 options={{
//                     headerShown: false,
//                     drawerIcon: props => (
//                         <Ionicons name="md-settings" size={20} color={Colors.primaryColor} />
//                     )
//                 }}
//             />
//         </Drawer.Navigator>
//     )
// }

// const Home_Stack_Navigator = () => {
//     return (
//         <Stack.Navigator
//             screenOptions={{
//                 headerTintColor: 'white',
//                 headerStyle: {
//                     backgroundColor: Colors.primaryColor
//                 }
//             }}
//         >
//             <Stack.Screen
//                 name="Home Screen"
//                 component={Home_Screen}
//                 options={{
//                     headerShown: false
//                 }}
//             />
//             <Stack.Screen
//                 name="Notifications"
//                 component={Notifications_Navigator}
//             />
//         </Stack.Navigator>
//     )
// }

// export default Home_Drawer_Navigator