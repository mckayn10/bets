import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors'
import { AntDesign } from '@expo/vector-icons';
import { openDrawer } from '../navigation/NavActions';

export default OpenDrawerIcon = () => {

    return (
        <TouchableOpacity
            style={styles.menuIconContainer}
            onPress={() => openDrawer()}
        >
            <AntDesign style={styles.menuIcon} name="menu-unfold" size={30} color="white" />
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