import * as Notifications from "expo-notifications";
import {Alert} from "react-native";

export const sendPushNotificationHandler = async (data) => {
    console.log(data)
    fetch("https://exp.host/--/api/v2/push/send", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: data.pushId,
            title: data.title,
            body: data.body
        })
    }).then(res => {
       res.json().then(response => {
           let data = {
               ids: [
                   response.data.id
               ]
           }
           console.log('data to send', data)
           fetch("https://exp.host/--/api/v2/push/getReceipts", {
               method: 'POST',
               headeers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(data)
           }).then(async res => {
               await res.json().then(receipt => {
                   console.log({receipt})
               })
           })


        })


    })
}

export const configurePushNotifications = async () =>{
    console.log('HAHAHAHAHAH')
    const {status} = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if(finalStatus !== 'granted'){
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    console.log({finalStatus})
    if(finalStatus !== 'granted'){
        Alert.alert(
            'Permission Required',
            'You must enable push notifications for this app'
        );
        return;
    }

    const pushTokenData = await Notifications.getExpoPushTokenAsync({
        experienceId: '@mnilsdev10/mybetz'
    });
    console.log({pushTokenData})
    return pushTokenData.data
}