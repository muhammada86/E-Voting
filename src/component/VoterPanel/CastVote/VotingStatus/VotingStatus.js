import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';
import Vote from '../Vote';
const votingStatus = props => {
    console.log(props.electionType);
    let result = null;
    let showStartButton = null;
    if (props.candidates !== null) {
        result = props.candidates.map(
            (rowData, index) => {
                if (props.secType == "NA" ? props.sectorNA == rowData.Sector_NA : props.sectorPP == rowData.Sector_PP) {
                    return (
                        <Vote
                            key={index}
                            type={props.secType}
                            data={rowData}
                            pressHandler={() => props.confirmVote(rowData.Cnic)}
                        />
                    )
                }
            }
        );
        showStartButton = null;
    }
    return (
        <View>
            <View>
                <Text style={[Style.note, Style.InfoText]}>
                    {props.electionType == "BP" ? "By Elections " : "General Elections "}
                    for Year {props.electionYear}
                </Text>
            </View>
            {showStartButton}
            {result}
        </View>
    )
}
const Style = StyleSheet.create({
    note: {
        color: 'red',
        marginTop: 20,
        fontSize: wp('4%'),
        fontWeight: 'bold',
        textAlign: 'center',
        width: wp('80%'),
        justifyContent: 'center',
        alignSelf: 'center'
    },
    InfoText: {
        textDecorationLine: 'underline',
        fontSize: 20,
        textDecorationColor: 'orange'
    },
    showCandidate: {
        width: wp('32%'),
        height: hp('5%'),
        borderWidth: 1,
        fontSize: wp('3.5%'),
        padding: wp('2%'),
        textAlign: 'center',
        margin: 20,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#258441',
        justifyContent: 'center',
        borderRadius: 10,
        color: 'white',
    }
})
export default votingStatus;