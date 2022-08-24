import {sendPushNotificationHandler} from "../push_notifications/push_notifications";
import { db } from "../firebase/firestore";
import {Alert} from "react-native";
import * as BadWords from 'badwords/array'

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

export const check_val = (text) => {
    var bad_words = BadWords['default']
    var error = 0;

    if (text.toLowerCase().split(' ').some(part => bad_words.includes(part))) {
        error = error + 1;
    }

    if (error > 0) {
        return false
    }
    else {
        return true
    }
}

export const getBetComments = (betId, comments) => {
    let commentsArr = []
    comments.forEach(comment => {
        if(comment.bet_id == betId){
            commentsArr.unshift(comment)
        }
    })
    return commentsArr
}