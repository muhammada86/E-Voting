import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';
import CountDown from 'react-native-countdown-component';
const header = props => {
    let headerContent = null;
    if (props.type == 'party') {
        // let headerName = props.partyName;
        // let updatedName = headerName.split(" ");
        headerContent = (
            <View style={Style.headerWrapper}>
                <Image source={{ uri: 'data:' + props.imageType + ';base64,' + props.imageData }} style={Style.imageStyle} />
                <View>
                    <Text style={Style.heroName}>HI, {props.partyName}!</Text>
                    <Text style={Style.textStyle}>Your Number registered with us is </Text>
                    <Text style={[Style.pNumber, Style.textStyle]}>+{props.pNo}</Text>
                </View>
            </View>
        )
    } else if (props.type == 'voter' || props.type == 'admin' || props.type == 'candidate') {
        let headerName = props.name;
        let updatedName = headerName.split(" ");
        if (updatedName[1] == undefined) {
            updatedName[1] = "";
        }
        headerContent = (
            <View style={Style.headerWrapper}>
                <View>
                    {props.gender == "Male"
                        ?
                        <Image source={require("../../../assets/images/male-avatar.jpg")} style={Style.imageStyle} />
                        :
                        <Image source={require("../../../assets/images/female-avatar.png")} style={Style.imageStyle} />
                    }
                </View>
                <View>
                    <Text style={Style.heroName}>HI, {updatedName[0] + " " + updatedName[1]}!</Text>
                    <Text style={Style.textStyle}>Your Number registered with us is </Text>
                    <Text style={[Style.pNumber, Style.textStyle]}>+{props.pNo}</Text>
                </View>
            </View>
        )
    }
    return (
        <View>
            {headerContent}
            <View style={Style.sectorStyle}>
                <View>
                    <TouchableOpacity>
                        <Text style={Style.sectorText}>HALQA: NA-{props.sectorNA}</Text>
                    </TouchableOpacity>
                </View>
                {props.sectorPP != null ?
                    <View>
                        <TouchableOpacity>
                            <Text style={Style.sectorText}>HALQA: {props.sectorPP}</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    null
                }
            </View>
        </View>
    );
}

// <CountDown
// size={15}
// until={28800}
// onFinish={() => alert('Finished')}
// digitStyle={{ backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625' }}
// digitTxtStyle={{ color: '#1CC625' }}
// timeLabelStyle={{ color: 'white', fontWeight: 'bold' }}
// separatorStyle={{ color: '#1CC625' }}
// timeToShow={['H', 'M', 'S']}
// timeLabels={{h: "HH",  m: 'MM', s: 'SS' }}
// showSeparator
// />

const Style = StyleSheet.create({
    headerWrapper: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    heroText: {
        color: 'white'
    },
    heroName: {
        paddingTop: hp('3.5%'),
        paddingBottom: hp('1%'),
        fontSize: wp('4%'),
        color: 'white',
        textTransform: 'uppercase'
    },
    textStyle: {
        color: 'white'
    },
    pNumber: {
        fontSize: wp('5%'),
    },
    PartySection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    imageStyle: {
        width: wp('27%'),
        height: hp('20%'),
        resizeMode: 'contain',
    },
    sectorStyle: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    sectorText: {
        justifyContent: 'space-around',
        fontSize: wp('3.8%'),
        color: 'white',
        borderWidth: 1,
        borderColor: '#61a3cc',
        paddingHorizontal: wp('6%'),
        paddingVertical: wp('3%'),
        marginLeft: wp('5%'),
        borderRadius: 30
    },
    note: {
        color: 'white',
        fontSize: wp('5%'),
        backgroundColor: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
        width: wp('80%'),
        justifyContent: 'center',
        alignSelf: 'center'
    },
})

export default header;

