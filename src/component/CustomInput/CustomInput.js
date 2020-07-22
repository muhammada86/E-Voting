import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';


const customInput = props => {
    return (
        <View>
            <Text style={Style.Label}>{props.label}:</Text>
            <TextInput
                style={Style.input}
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={props.changeTextInputValueHandler}
            />
            <Text style={Style.error}>{!props.required ? "" : props.error}</Text>
        </View>
    )
}
const Style = StyleSheet.create({
    input: {
        paddingHorizontal: wp('0.5%'),
        paddingVertical: hp('0.5%'),
        borderBottomWidth: 1,
        borderBottomColor: 'green',
        borderTopColor: 'green',
        fontSize: wp('4.1%'),
    },
    Label: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        marginHorizontal: wp('1%'),
        paddingVertical: hp('1%')
    },
    error: {
        color: 'red',
        fontSize: 14,
        paddingHorizontal: wp('2%'),
    }
})
export default customInput;