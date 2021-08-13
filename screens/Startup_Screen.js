import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'
import Colors from '../constants/colors'

export default Startup_Screen = () => {
    return (
        <View style={styles.screen}>
            <Text>Loading account...</Text>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})