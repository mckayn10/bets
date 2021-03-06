import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';


export default function OpenDrawerIcon(props) {

    const openDrawer = () => {
        props.navigation.openDrawer()
    }

    return (
        <TouchableOpacity
            style={styles.menuIconContainer}
            onPress={() => openDrawer()}
        >
            <AntDesign style={styles.menuIcon} name="menuunfold" size={22} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuIconContainer: {
        position: 'absolute',
        left: 5,
        top: 51,
        width: 50,
        height: 40,
    },
    menuIcon: {
        alignSelf: 'center'
    },
});