import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';
import { db } from '../firebase/firestore'
import { Input, Button, Switch } from 'react-native-elements';
import Colors from '../constants/colors';
var peopleRef = db.collection("people")


const VenmoBtn = (props) => {
    const {amount, description, otherPerson} = props
    let venmoId = otherPerson.venmo_id ? otherPerson.venmo_id : ''

    if(otherPerson.id != 0 && !venmoId){
        peopleRef.doc(otherPerson.id)
            .onSnapshot(async (doc) => {
                if (doc.exists) {
                    let user = doc.data()
                    venmoId = user.venmo_id
                } else {
                    console.log("Person document does not exist");
                }
            })
    }

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
                title="Venmo"
                type="solid"
                buttonStyle={styles.venmoButton}
                titleStyle={{fontSize: 12, fontWeight: 'bold'}}
                onPress={() => openWithVenmo()}
                containerStyle={{borderRadius: 0}}

            />

        </View>
    )
}

const styles = StyleSheet.create({
    venmoButton: {
        backgroundColor: Colors.venmoBlue,
        borderRadius: 0,
        marginLeft: 10
    },
})
export default VenmoBtn