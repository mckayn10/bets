import React from 'react'
import { View, Text, Button } from 'react-native'
import * as Linking from 'expo-linking'
import { db } from '../firebase/firestore'

const TestComponent = () => {

    const testRequest = () => {
        const options = {
            method: 'GET',
            headers: {
                'x-api-key': 'd8d2dc3b-1450-4337-9fde-c47c96e9b98e',
            }
        };

        fetch('https://jsonodds.com/api/odds/nfl', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }


    return (
        <View>
            <Button title="Test Request" onPress={() => testRequest()} />

        </View>
    )
}
export default TestComponent