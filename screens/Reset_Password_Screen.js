import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'


function Reset_Password_Screen() {
    const [email, setEmail] = useState('')

    return (
        <View>
            <TextInput
                style={styles.textInput}
                placeholder="email address"
                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                onChangeText={email => setEmail(email)}
                defaultValue={email}
            />
        </View>
    )
}


const styles = StyleSheet.create({

})