import React from 'react'
import { View, Text, Button } from 'react-native'
import db from '../firebase/firestore'

const TestComponent = () => {

    const testAdd = () => {
        console.log('test button')
        var citiesRef = db.collection("cities");

        citiesRef.doc("SF").set({
            name: "San Francisco", state: "CA", country: "USA",
            capital: false, population: 860000,
            regions: ["west_coast", "norcal"]
        });
        citiesRef.doc("LA").set({
            name: "Los Angeles", state: "CA", country: "USA",
            capital: false, population: 3900000,
            regions: ["west_coast", "socal"]
        });
        citiesRef.doc("DC").set({
            name: "Washington, D.C.", state: null, country: "USA",
            capital: true, population: 680000,
            regions: ["east_coast"]
        });
        citiesRef.doc("TOK").set({
            name: "Tokyo", state: null, country: "Japan",
            capital: true, population: 9000000,
            regions: ["kanto", "honshu"]
        });
        citiesRef.doc("BJ").set({
            name: "Beijing", state: null, country: "China",
            capital: true, population: 21500000,
            regions: ["jingjinji", "hebei"]
        });
    }



    const testGet = () => {
        var docRef = db.collection("cities").doc("SF");

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="add button" onPress={() => testAdd()} />
            <Button title='get button' onPress={() => testGet()} />
        </View>
    )
}
export default TestComponent