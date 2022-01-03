import React from 'react'
import { View, Text, Button } from 'react-native'
import * as Linking from 'expo-linking'
import { db } from '../firebase/firestore'

const TestComponent = () => {

    const testRequest = () => {
        Linking.openURL('venmo://paycharge?txn=paycharge&recipients=Weston-Farnsworth&amount=1.00&note=testing%20a%20lot%20of%20things')
    }

    const testPay = () => {
        Linking.openURL('venmo://paycharge?txn=pay&recipients=Weston-Farnsworth&amount=1.00&note=testing')
    }


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Request Payment" onPress={() => testRequest()} />
            <Button title="Pay Bet" onPress={() => testPay()} />

        </View>
    )
}
export default TestComponent