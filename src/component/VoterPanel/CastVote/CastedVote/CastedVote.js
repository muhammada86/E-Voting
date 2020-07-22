import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';
const castedVote = props => {
    return (
        <View>
            <Text style={Style.castedVoteTextHeader}>Your Have Already Casted Your Vote.</Text>
        </View>
    )
}

const Style = StyleSheet.create({
    castedVoteTextHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 60,
        textTransform: 'capitalize',
        fontFamily: 'verdana',
        fontWeight: 'bold',
        fontSize: wp('5.5%')
    }
})
export default castedVote;