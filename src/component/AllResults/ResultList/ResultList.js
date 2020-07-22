import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';

const resultList = props => {
    let listToCompile = null;

    if (props.type == "overallResult") {
        listToCompile = (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={[Style.textStyle, Style.first]}><Text>{props.id}</Text></View>
                <View style={[Style.textStyle, Style.second]}><Text>{props.partyName}</Text></View>
                <View style={[Style.textStyle, Style.second]}><Text>{props.seats}</Text></View>
                <View style={[Style.textStyle, Style.third]}><Text style={{ color: 'white' }}>{props.votes}</Text></View>
                <View style={[Style.textStyle, Style.second]}><Text>{props.status != "Winner" ? "Loser" : props.status}</Text></View>
            </View>
        )
    } else {
        listToCompile = (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={[Style.textStyle, Style.first]}><Text>{props.id}</Text></View>
                <View style={[Style.textStyle, Style.second]}><Text>{props.name}</Text></View>
                <View style={[Style.textStyle, Style.second]}><Text>{props.partyName}</Text></View>
                <View style={[Style.textStyle, Style.third]}><Text style={{ color: 'white' }}>{props.votes}</Text></View>
            </View>
        )
    }
    return (
        <View>
            {listToCompile}
        </View>
    )
}

const Style = StyleSheet.create({
    textStyle: {
        marginTop: 20,
        flex: 5,
        borderWidth: 1,
        fontSize: wp('4%'),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-around',
    },
    first: {
        flex: 0.5,
        color: 'green',
        backgroundColor: 'green'
    },
    second: {
        flex: 3,
        color: 'green',
    },
    third: {
        flex: 1,
        backgroundColor: 'grey'

    },

})

export default resultList;
