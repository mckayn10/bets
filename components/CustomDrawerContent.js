// import React from 'react'
// import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { Button } from 'react-native-elements';
// import { SafeAreaView } from "react-navigation";
// import { DrawerItems } from "react-navigation-drawer";
// import { DrawerItemList, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import Colors from '../constants/colors'
// import { MaterialIcons } from '@expo/vector-icons';
// import { useDispatch } from 'react-redux';
// import { logout } from '../store/actions/auth';
// import { removeData } from '../store/actions/bets';


// export default CustomDrawerContent = props => {
//     const dispatch = useDispatch()

//     const logoutUser = () => {
//         dispatch(logout())
//         dispatch(removeData())
//     }

//     return (
//         <View style={{ flex: 1 }}>
//             <DrawerContentScrollView {...props}>
//                 <DrawerItemList {...props} />
//                 <DrawerItem 
//                     onPress={() => logoutUser()}
//                     label="Log out"
//                     icon={() => {
//                         return(
//                             <MaterialIcons  name="logout" size={24} color={Colors.red}/>
//                         )
//                     }}
//                 />
//             </DrawerContentScrollView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     logoutContainer: {
//         backgroundColor: Colors.backgroundColor,
//         marginTop: 50
//     },
//     logoutBtn: {
//         fontSize: 15,
//         color: Colors.red,
//         fontWeight: 'bold',
//         paddingTop: 5,
//         paddingBottom: 5
//     }
// })