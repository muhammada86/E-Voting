import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';

const customList = props => {
    let listToDisplay = null;
    if (props.type == "ApproveCandidate") {
        if (props.secPP == null) {
            listToDisplay = (
                <View style={Style.item}>
                    <Text style={Style.title}>Name : {props.name}</Text>
                    <Text style={Style.title}>Gender : {props.gender}</Text>
                    <Text style={Style.title}>Party Name : {props.partyName}</Text>
                    <Text style={Style.title}>Qualification : {props.qualification}</Text>
                    <Text style={Style.title}>HALQA: {props.secNA}</Text>
                    <Text style={Style.title}>School : {props.school}</Text>
                    <Text style={Style.title}>Property : {props.property}</Text>
                    <Text style={Style.title}>Assets : {props.assets}</Text>
                    <Text style={Style.title}>Accounts : {props.accounts}</Text>
                    <View style={Style.btnContainer}>
                        <View>
                            <TouchableOpacity style={[Style.btnStyle, Style.approved]} onPress={props.changeCandidateStatusToApproved}>
                                <Text style={Style.btnText}>Approve</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={[Style.btnStyle, Style.rejected]} onPress={props.changeCandidateStatusToRejected}>
                                <Text style={Style.btnText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        } else {
            listToDisplay = (
                <View style={Style.item}>
                    <Text style={Style.title}>Name : {props.name}</Text>
                    <Text style={Style.title}>Gender : {props.gender}</Text>
                    <Text style={Style.title}>Party Name : {props.partyName}</Text>
                    <Text style={Style.title}>Qualification : {props.qualification}</Text>
                    <Text style={Style.title}>School : {props.school}</Text>
                    <Text style={Style.title}>Property : {props.property}</Text>
                    <Text style={Style.title}>Assets : {props.assets}</Text>
                    <Text style={Style.title}>Accounts : {props.accounts}</Text>
                    <Text style={Style.title}>HALQA : {props.secPP}</Text>
                    <View style={Style.btnContainer}>
                        <View>
                            <TouchableOpacity style={[Style.btnStyle, Style.approved]} onPress={props.changeCandidateStatusToApproved}>
                                <Text style={Style.btnText}>Approve</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={[Style.btnStyle, Style.rejected]} onPress={props.changeCandidateStatusToRejected}>
                                <Text style={Style.btnText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
    } else if (props.type == "candidate") {
        if (props.secPP == null) {
            listToDisplay = (
                <View style={Style.item}>
                    <Text style={Style.title}>Name : {props.name}</Text>
                    <Text style={Style.title}>Gender : {props.gender}</Text>
                    <Text style={Style.title}>Party Name : {props.partyName}</Text>
                    <Text style={Style.title}>Qualification : {props.qualification}</Text>
                    <Text style={Style.title}>School : {props.school}</Text>
                    <Text style={Style.title}>Property : {props.property}</Text>
                    <Text style={Style.title}>Assets : {props.assets}</Text>
                    <Text style={Style.title}>Accounts : {props.accounts}</Text>
                    <Text style={Style.title}>HALQA: NA-{props.secNA}</Text>
                </View>
            )
        } else {
            listToDisplay = (
                <View style={Style.item}>
                    <Text style={Style.title}>Name : {props.name}</Text>
                    <Text style={Style.title}>Gender : {props.gender}</Text>
                    <Text style={Style.title}>Party Name : {props.partyName}</Text>
                    <Text style={Style.title}>Qualification : {props.qualification}</Text>
                    <Text style={Style.title}>School : {props.school}</Text>
                    <Text style={Style.title}>Property : {props.property}</Text>
                    <Text style={Style.title}>Assets : {props.assets}</Text>
                    <Text style={Style.title}>Accounts : {props.accounts}</Text>
                    <Text style={Style.title}>HALQA : {props.secPP}</Text>
                </View>
            )
        }
    } else if (props.type == "party") {
        listToDisplay = (
            <View style={Style.item}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 5, justifyContent: 'flex-start' }}>
                        <Image source={{ uri: 'data:' + props.symbolType + ';base64,' + props.symbol }} style={Style.imageStyle} />
                    </View>
                    <View style={{ flex: 5, justifyContent: 'flex-start' }}>
                        <Text style={Style.title}>{props.name}</Text>
                        <Text style={Style.title}>{props.chairman}</Text>
                        <Text style={Style.title}>{props.secPP}</Text>
                        <Text style={Style.title}>{props.secNA != null ? 'NA-' + props.secNA : null}</Text>
                    </View>
                </View>
            </View>
        )
    } else if (props.type == "halqaList") {
        listToDisplay = (
            <View style={Style.item}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 5, justifyContent: 'flex-start' }}>
                        <Image source={{ uri: 'data:' + props.symbolType + ';base64,' + props.symbol }} style={Style.imageStyle} />
                    </View>
                    <View style={{ flex: 5, justifyContent: 'flex-start' }}>
                        <Text style={Style.title}>{props.cnic}</Text>
                        <Text style={Style.title}>{props.name}</Text>
                        <Text style={Style.title}>{props.gender}</Text>
                        <Text style={Style.title}>{props.secPP}</Text>
                        <Text style={Style.title}>{props.secNA != null ? 'NA-' + props.secNA : null}</Text>
                    </View>
                </View>
            </View>
        )
    }
    else if (props.type == "halqaResult") {
        listToDisplay = (
            <View style={Style.item}>
                <Text style={Style.title}>Name : {props.name}</Text>
                <Text style={Style.title}>Party Name : {props.partyName}</Text>
                <Text style={Style.title}>Halqa : {props.sector}</Text>
                <Text style={Style.title}>Status : {props.status}</Text>
                <Text style={Style.title}>Votes : {props.votes}</Text>
            </View>
        )
    }
    else if (props.type == "voter") {
        listToDisplay = (
            <View style={Style.item}>
                <Text style={Style.title}>Name : {props.name}</Text>
                <Text style={Style.title}>CNIC : {props.cnic}</Text>
                <Text style={Style.title}>Gender : {props.gender}</Text>
                <Text style={Style.title}>HALQA PP : {props.secPP}</Text>
                <Text style={Style.title}>HALQA NA : {props.secNA}</Text>
                <Text style={Style.title}>Address : {props.address}</Text>
            </View>
        )
    }
    return (
        <ScrollView>
            {listToDisplay}
        </ScrollView>
    );
}

const Style = StyleSheet.create({
    item: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: "green",
        borderLeftWidth: 1,
        borderLeftColor: 'green',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 16,
        lineHeight: 30,
    },
    imageStyle: {
        width: wp('30%'),
        height: hp('12%'),
        resizeMode: 'contain',
    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: hp('1.2%'),
    },
    btnStyle: {
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.3%'),
        borderRadius: 10,
    },
    approved: {
        backgroundColor: '#258441'
    },
    rejected: {
        backgroundColor: '#ff0707'
    },
    btnText: {
        color: 'white',
        fontSize: wp('3%'),
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
})
export default customList;
