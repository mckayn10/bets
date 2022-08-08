import * as Notifications from "expo-notifications";
import {Alert} from "react-native";

export const sendPushNotificationHandler = (data) => {
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
    })
}

export const configurePushNotifications = async () =>{
    const {status} = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if(finalStatus !== 'granted'){
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
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