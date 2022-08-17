import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';

export default function HeaderText (props)  {
    return <Text {...props} style={[styles.defaultText, props.style]}>{props.children}</Text>
}

const styles = StyleSheet.create({
    defaultText: {
        fontFamily: 'russo',

    }
});