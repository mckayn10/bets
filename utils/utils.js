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

export const unJuiceLines = (match) => {
    let moneyLineHome = parseFloat(match.Odds[0].MoneyLineHome)
    let moneyLineAway = parseFloat(match.Odds[0].MoneyLineAway)

    let moneyLineFavorite = moneyLineHome < moneyLineAway ? moneyLineHome : moneyLineAway
    let moneyLineUnderdog = moneyLineHome > moneyLineAway ? moneyLineHome : moneyLineAway
    let favoredTeam = moneyLineHome == moneyLineFavorite ? 'home' : 'away'

    if(moneyLineAway == moneyLineHome && moneyLineHome != 0){
        match.Odds[0].MoneyLineAway = -100
        match.Odds[0].MoneyLineHome = -100
    } else {
        let favoredProbability = Math.round(Math.abs(moneyLineFavorite) / (Math.abs(moneyLineFavorite) + 100) * 100)
        let underdogProbability = Math.round(100 / (Math.abs(moneyLineUnderdog) + 100) * 100)

        let unJuicedFavoritePercent = favoredProbability / (favoredProbability + underdogProbability)
        let unJuicedUnderdogPercent = underdogProbability / (favoredProbability + underdogProbability)

        let unJuicedFavoriteLine = Math.round(unJuicedFavoritePercent / (1 - unJuicedFavoritePercent) * (-100))
        let unJuicedUnderdogLine = Math.round((1 - unJuicedUnderdogPercent) / unJuicedUnderdogPercent * 100)

        match.Odds[0].MoneyLineAway = favoredTeam == 'away' ? unJuicedFavoriteLine : unJuicedUnderdogLine
        match.Odds[0].MoneyLineHome = favoredTeam == 'home' ? unJuicedFavoriteLine : unJuicedUnderdogLine

    }
    match.Odds[0].OverLine = -100
    match.Odds[0].UnderLine = -100
    match.Odds[0].PointSpreadHomeLine = -100
    match.Odds[0].PointSpreadAwayLine = -100

    return match
}