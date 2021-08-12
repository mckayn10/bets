import React from 'react'
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from "react-navigation";
import { DrawerItems } from "react-navigation-drawer";
import Colors from '../constants/colors'
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '../store/actions/auth';
import { removeData } from '../store/actions/bets';


export default CustomDrawerContent = props => {
    const dispatch = useDispatch()

    const logoutUser = () => {
        console.log('logout')
        dispatch(logout())
        dispatch(removeData())
        props.navigation.navigate('Auth')
    }

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                <DrawerItems {...props} />
                <TouchableOpacity style={styles.logoutContainer}>
                    <Button
                        icon={
                            <MaterialIcons name="logout" size={18} color={Colors.red} style={{ marginLeft: 15, marginTop: 2 }} />
                        }
                        iconRight
                        title="Logout"
                        titleStyle={styles.logoutBtn}
                        buttonStyle={styles.logoutBtn}
                        containerStyle={{ borderColor: 'red' }}
                        onPress={() => logoutUser()}
                        color={Colors.red}
                        type="clear"
                    />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    logoutContainer: {
        backgroundColor: Colors.backgroundColor,
        marginTop: 50
    },
    logoutBtn: {
        fontSize: 15,
        color: Colors.red,
        fontWeight: 'bold',
        paddingTop: 5,
        paddingBottom: 5
    }
})