import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default OpenDrawerIcon = ({props}) => {

    const openDrawer = () => {
        props.props.navigation.openDrawer()
    }

    return (
        <TouchableOpacity
            style={styles.menuIconContainer}
            onPress={() => openDrawer()}
        >
            <AntDesign style={styles.menuIcon} name="menu-unfold" size={25} color="white" />
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