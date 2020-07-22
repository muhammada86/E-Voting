import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';

const vote = (props) => {
    let sector = null;
    if (props.type === "NA") {
        sector = <Text style={Style.textStyle}>Halqa : NA-{props.data.Sector_NA}</Text>;
    } else if (props.type === "PA") {
        sector = <Text style={Style.textStyle}>Halqa : {props.data.Sector_PP}</Text>;
    }
    return (
        <View style={Style.Box}>
            <Image source={{ uri: 'data:' + props.data.symbolType + ';base64,' + props.data.Election_Symbol }} style={Style.imageStyle} />
            <Text style={Style.textStyle}>Candidate Name : {props.data.Name}</Text>
            <Text style={Style.textStyle}>Party Name : {props.data.Party_Name}</Text>
            {sector}
            <TouchableOpacity style={Style.voteBtn} onPress={props.pressHandler}>
                <Text style={Style.textStyle}>Cast Vote</Text>
            </TouchableOpacity>
        </View>
    )
}
const Style = StyleSheet.create({
    Box: {
        flex: 1,
        width: wp('70%'),
        height: hp('28.7%'),
        borderWidth: 1,
        padding: 20,
        paddingTop: 90,
        margin: 20,
        backgroundColor: '#2E944A',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    textStyle: {
        padding: 2,
        textAlign: 'center',
        fontWeight: '100',
        color: '#000000',
        fontSize: wp('3.33%'),
    },
    imageStyle: {
        width: wp('30%'),
        height: hp('12%'),
        resizeMode: 'contain',
    },
    voteBtn: {
        width: wp('35%'),
        height: hp('5%'),
        borderWidth: 1,
        padding: 20,
        margin: 20,
        alignSelf: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 10,
    }
})

export default vote;