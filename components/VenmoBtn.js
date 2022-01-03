import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';
import { db } from '../firebase/firestore'
import { Input, Button, Switch } from 'react-native-elements';
import Colors from '../constants/colors';


const VenmoBtn = (props) => {
    const {amount, description, otherPerson} = props
    const venmoId = otherPerson.venmo_id ? otherPerson.venmo_id : ''

    const URLifyDescription = (string) => {
        let urlString = string.replace(/\s+/g, '%20');
        return urlString
    }

    const formattedDescription = URLifyDescription(description)

    const openWithVenmo = () => {
        Linking.openURL(`venmo://paycharge?txn=paycharge&recipients=${venmoId}&amount=${amount}&note=${formattedDescription}`)
    }

    const testPay = () => {
        WebBrowser.openBrowserAsync('venmo://paycharge?txn=paycharge&recipients=Weston-Farnsworth&amount=1.00&note=testing%20a%20lot%20of%20things')
    }


    return (
        <View >
            <Button
                title="Open in Venmo    "
                type="solid"
                buttonStyle={styles.deleteButton}
                onPress={() => openWithVenmo()}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: '#3D95CE',
        width: '90%',
        alignSelf: 'center'

    },
})
export default VenmoBtn