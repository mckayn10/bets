import React from 'react';
import {StyleSheet, Text} from 'react-native';

export default function DefaultText(props)  {
    return <Text {...props} style={[styles.defaultText, props.style]}>{props.children}</Text>

}

const styles = StyleSheet.create({
    defaultText: {
        color: 'white',
        fontFamily: 'permanent-marker',
        fontWeight: 'normal'
    }
});