import {sendPushNotificationHandler} from "../push_notifications/push_notifications";
import { db } from "../firebase/firestore";
import {Alert} from "react-native";

const reportsRef = db.collection('reports')

export const reportItemDialog = (data) => {
    return Alert.alert(
        `Report ${data.type}`,
        "",
        [
            {
                text: `Report ${data.type}`,
                onPress: () => {
                    reportItem(data)
                },
            },
            {
                text: "Cancel",
            },
        ]
    );
};

export const reportItem = (data) => {
    reportsRef.add(data)
        .then((docRef) => {
            console.log('Report successfully sent!')
            let pushNotiData = {
                pushId: 'ExponentPushToken[VuTCyCGBoGEIuJPtt-orjY]',
                title: `${data.type} Reported`,
                body: `A new ${data.type} has been reported.`
            }
            sendPushNotificationHandler(pushNotiData)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}