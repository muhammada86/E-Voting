import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';

const statsCell = props => (
    <View>
        <View style={styles.cell}>
            <View style={styles.Row}>
                <View>
                    <Text>Male Voters </Text>
                </View>
                <View>
                    <Text style={styles.countStyle}>{props.totalMaleVoters}</Text>
                </View>
            </View>
        </View>

        <View style={styles.cell}>
            <View style={styles.Row}>
                <View>
                    <Text>Female Voters </Text>
                </View>
                <View>
                    <Text style={styles.countStyle}>{props.totalFemaleVoters}</Text>
                </View>
            </View>
        </View>

        <View style={styles.cell}>
            <View style={styles.Row}>
                <View>
                    <Text>Casted Votes </Text>
                </View>
                <View>
                    <Text style={styles.countStyle}>{props.totalCastedVotes}</Text>
                </View>
            </View>
        </View>
        <View style={styles.cell}>
            <View style={styles.Row}>
                <View>
                    <Text>Male Candidates </Text>
                </View>
                <View>
                    <Text style={styles.countStyle}>{props.totalMaleCandidates}</Text>
                </View>
            </View>
        </View>

        <View style={styles.cell}>
            <View style={styles.Row}>
                <View>
                    <Text>Female Candidates </Text>
                </View>
                <View>
                    <Text style={styles.countStyle}>{props.totalFemaleCandidates}</Text>
                </View>
            </View>
        </View>

        <View style={styles.cell}>
            <View style={styles.Row}>
                <View>
                    <Text>PA Casted Votes </Text>
                </View>
                <View>
                    <Text style={styles.countStyle}>{props.totalPACastedVotes}</Text>
                </View>
            </View>
        </View>

        <View style={styles.cell}>
            <View style={styles.Row}>
                <View>
                    <Text>NA Casted Votes </Text>
                </View>
                <View>
                    <Text style={styles.countStyle}>{props.totalNACastedVotes}</Text>
                </View>
            </View>
        </View>
    </View>
)

const styles = StyleSheet.create({
    Row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    cell: {
        backgroundColor: '#22c15e',
        width: wp('90%'),
        height: hp('8%'),
        margin: hp('3%'),
        padding: wp('4%')
    },
    countStyle: {
        fontWeight: 'bold',
        fontSize: wp('4%')
    }
})

export default statsCell;