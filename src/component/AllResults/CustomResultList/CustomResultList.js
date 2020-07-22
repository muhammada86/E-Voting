import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
const customResultList = props => {
    let list = null;
    if (props.type == "partyList") {
        list = (
            <TouchableOpacity onPress={props.goToPartyCandidatesResults}>
                <Text style={Style.textStyle}>{props.id}- {props.partyName}</Text>
            </TouchableOpacity>
        )
    } else if (props.type == "candidateList") {
        list = (
            <TouchableOpacity onPress={props.goToPartyCandidate}>
                <Text style={Style.textStyle}>{props.id}- {props.candidateName}</Text>
            </TouchableOpacity>
        )
    } else if (props.type == "singleCandidateList") {
        list = (
            <View>
                <Text style={Style.textStyle}>NAME: {props.name}</Text>
                <Text style={Style.textStyle}>VOTES: {props.votes}</Text>
                <Text style={Style.textStyle}>SECTOR: {props.sector}</Text>
                <Text style={Style.textStyle}>STATUS: {props.status}</Text>
            </View>
        )
    }
    return (
        <View style={Style.container}>
            {list}
        </View>

    )
}

const Style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    textStyle: {
        margin: 5,
        marginTop: 20,
        paddingHorizontal: 2,
        fontSize: wp('4%'),
    },
})

export default customResultList;
