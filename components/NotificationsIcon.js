import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function NotificationsIcon(props) {

    
    const goToNotifications = () => {
        props.navigation.navigate('Notifications')
    }

    return (
        <TouchableOpacity
            style={styles.menuIconContainer}
            onPress={() => goToNotifications()}
        >
            <Ionicons style={styles.menuIcon} name="notifications" size={22} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuIconContainer: {
        position: 'absolute',
        right: 5,
        top: 50,
        width: 50,
        height: 40,
    },
    menuIcon: {
        alignSelf: 'center'
    },
});