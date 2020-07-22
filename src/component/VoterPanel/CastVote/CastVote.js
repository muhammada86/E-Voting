import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../Header/Header';
import AsyncStorage from '@react-native-community/async-storage';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';
import NetInfo from "@react-native-community/netinfo";
import AndroidOpenSettings from 'react-native-android-open-settings';
import IP from '../../CONSTANTS/CONSTANTS';
class CastVote extends Component {
    constructor(props) {
        super(props);
        this.getUserDataHandler();
        this.state = {
            userInfo: {},
            partyInfo: {},
            getPartyTable: false,
            dataHeader: false,
            year: null,
            date: null,
            month: null,
            electionFlags: null,
            monthName: [
                "January",
                "Februry",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ]
        };
    }

    componentDidMount() {
        NetInfo.fetch().then(state => {
            this.setState({ networkStatus: state.isConnected });
            if (this.state.networkStatus === false) {
                Alert.alert(
                    'Ooops! Connection Error.',
                    'Data is not reachable',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Open Wireless Settings',
                            onPress: () => AndroidOpenSettings.wirelessSettings()
                        },
                    ],
                    { cancelable: true },
                );
            } else {
                let dateTime = new Date();
                let year = dateTime.getFullYear();
                let month = dateTime.getMonth() + 1;
                let date = dateTime.getDate();
                let time = dateTime.getHours();
                this.setState({ year: year, month: month, date: date });
                this.getElectionFlagsHandler();
            }
        });
    }

    getElectionFlagsHandler = () => {
        fetch(IP + "/admin/getElectionFlags")
            .then(responseJson => responseJson.json())
            .then(res => {
                const flags = { ...res[0] };
                this.setState({ electionFlags: flags });
            });
    }

    getUserDataHandler = async () => {
        const userCNIC = await AsyncStorage.getItem("userCNIC");
        fetch(IP + "/admin/chklogin?cnic=" + userCNIC)
            .then(responseJson => responseJson.json())
            .then(res => {
                const voterInfo = { ...res[0] };
                this.setState({ userInfo: voterInfo, dataHeader: true });
                if (this.state.getPartyTable === false && this.state.userInfo.type == 'party') {
                    this.getPartyTableHandler();
                }
            });
    }
    getPartyTableHandler = () => {
        fetch(IP + "/party/getRelatedParty?cnic=" + this.state.userInfo["Cnic"])
            .then(responseJson => responseJson.json())
            .then(res => {
                const partyInfo = { ...res[0] }
                this.setState({ partyInfo: partyInfo, getPartyTable: true });
            })
            .catch(err => {
                alert(err);
            })
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Cast Vote',
        headerLeft: (
            <Icon name="key-outline" size={30} color="black"
                style={{
                    paddingVertical: 4,
                    paddingHorizontal: 5,
                    paddingRight: -10,
                }} />
        ),
        headerRight: (
            <View>
                <TouchableOpacity onPress={async () => {
                    AsyncStorage.multiRemove(['userAuthToken', 'userCNIC']);
                    navigation.navigate('Login');
                }} >
                    <Icon name="logout"
                        size={wp('6%')}
                        color="black"
                        style={{
                            paddingVertical: 4,
                            paddingHorizontal: wp('2%'),
                            paddingRight: -2,
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    })
    goToProvisionalVote = () => {
        this.props.navigation.navigate('ProvisionalVote');
    }

    goToNationalVote = () => {
        this.props.navigation.navigate('NationalVote');
    }

    render() {
        let PAVoteStatus = null;
        if (this.state.userInfo != null) {
            if (this.state.userInfo.Sector_PP != null) {
                PAVoteStatus = (
                    <TouchableOpacity style={Style.Box4} onPress={this.goToProvisionalVote}>
                        <Icon
                            name="vote"
                            size={wp('8%')}
                            color="white"
                            style={{
                                marginBottom: 10,
                                textAlign: 'center'
                            }} />
                        <Text style={{
                            fontSize: wp('4%'),
                            color: 'white',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>Provisional Assembly</Text>
                    </TouchableOpacity>
                )
            }
        }
        let header = null;
        if (this.state.dataHeader === false) {
            header = <ActivityIndicator
                size="large"
                color="white"
                style={{
                    fontSize: wp('6%'),
                    marginTop: wp('17%'),
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center'
                }}
            />
        }
        if (this.state.userInfo.type == 'party') {
            header = (
                <Header
                    partyName={this.state.userInfo.Name}
                    chairman={this.state.partyInfo.Chairman}
                    viceChairman={this.state.partyInfo.Vice_Chairman}
                    generalSecretery={this.state.partyInfo.Secretary_General}
                    symbol={this.state.partyInfo.Election_Symbol}
                    symbolType={this.state.partyInfo.symbolType}
                    imageData={this.state.partyInfo.imageData}
                    imageType={this.state.partyInfo.imageType}
                    type={this.state.userInfo.type}
                    sectorPP={this.state.userInfo.Sector_PP}
                    pNo={this.state.userInfo.pNo}
                    sectorNA={this.state.userInfo.Sector_NA}
                    gender={this.state.userInfo.Gender}
                />
            )
        } else if (this.state.userInfo.type == 'voter' || this.state.userInfo.type == 'candidate') {
            header = (
                <Header
                    name={this.state.userInfo.Name}
                    cnic={this.state.userInfo.Cnic}
                    sectorPP={this.state.userInfo.Sector_PP}
                    sectorNA={this.state.userInfo.Sector_NA}
                    address={this.state.userInfo.Address}
                    type={this.state.userInfo.type}
                    pNo={this.state.userInfo.pNo}
                    gender={this.state.userInfo.Gender}
                />
            )
        } else if (this.state.userInfo.type == 'admin') {
            header = (
                <Header
                    name={this.state.userInfo.Name}
                    cnic={this.state.userInfo.Cnic}
                    sectorPP={this.state.userInfo.Sector_PP}
                    sectorNA={this.state.userInfo.Sector_NA}
                    type={this.state.userInfo.type}
                    pNo={this.state.userInfo.pNo}
                    gender={this.state.userInfo.Gender}
                />
            )
        }

        let currentView = null;
        if (this.state.electionFlags != null && (this.state.year != this.state.electionFlags.year
            || this.state.month != this.state.electionFlags.month || this.state.date != this.state.electionFlags.date)) {
            if (this.state.electionFlags.month >= this.state.month) {
                if (this.state.electionFlags.date > this.state.date) {
                    currentView = (
                        <View>
                            <Text style={Style.note}>Dear Citizen! The {this.state.electionFlags.electionType == "BP" ? "By Election"
                                : "General Election"} in your HALQA are expected to be in {this.state.electionFlags.date} {this.state.monthName[this.state.electionFlags.month - 1]} {this.state.electionFlags.year}.</Text>
                        </View>
                    )
                }
            } else {
                currentView = (
                    <View>
                        <Text style={Style.note}>Dear Citizen! The {this.state.electionFlags.electionType == "BP" ? "By Election"
                            : "General Election"} in your HALQA was Held on {this.state.electionFlags.date} {this.state.monthName[this.state.electionFlags.month - 1]} {this.state.electionFlags.year}.</Text>
                    </View>
                )
            }
        } else {
            currentView = (
                <View style={Style.Row}>
                    <TouchableOpacity style={Style.Box3} onPress={this.goToNationalVote}>
                        <Icon
                            name="vote-outline"
                            size={wp('8%')}
                            color="white"
                            style={{
                                marginBottom: 10,
                                textAlign: 'center'
                            }} />
                        <Text style={{
                            fontSize: wp('4%'),
                            color: 'white',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>National  Assembly</Text>
                    </TouchableOpacity>
                    {PAVoteStatus}
                </View>
            )
        }
        return (
            <ScrollView style={Style.parentContainer}>
                <View style={Style.headerContainer}>
                    {header}
                </View>

                <View style={Style.bodyContainer}>
                    {currentView}
                </View>
            </ScrollView>
        )
    }
};

const Style = StyleSheet.create({
    parentContainer: {
        flex: 1,
        backgroundColor: '#0b6b31',
    },
    headerContainer: {
        backgroundColor: '#2E944A',
        flex: 5,
        borderBottomEndRadius: 6,
        borderBottomStartRadius: 6,

    },
    note: {
        color: 'white',
        marginTop: wp('35%'),
        fontSize: wp('4%'),
        fontWeight: 'bold',
        textAlign: 'center',
        width: wp('80%'),
        justifyContent: 'center',
        alignSelf: 'center'
    },
    bodyContainer: {
        flex: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#0b6b31',
    },
    Box3: {
        width: wp('40%'),
        height: hp('21.5%'),
        borderWidth: 2,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#61a3cc',
    },
    Box4: {
        width: wp('40%'),
        height: hp('21.5%'),
        borderWidth: 2,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#eddb8e',
    },
})
export default CastVote;