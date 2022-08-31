import React from 'react'
import { View, Text, Button } from 'react-native'
import * as Linking from 'expo-linking'
import { db } from '../firebase/firestore'

const TestComponent = () => {

    const testRequest = () => {
        const options = {
            method: 'GET',
            headers: {
                'x-api-key': '17694fa2-25af-11ed-89ba-0ae9bc51dafd',
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