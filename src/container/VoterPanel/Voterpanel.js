import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../component/Header/Header';
import AsyncStorage from '@react-native-community/async-storage';
import PureChart from "react-native-pure-chart";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import NetInfo from "@react-native-community/netinfo";
import AndroidOpenSettings from 'react-native-android-open-settings'
import IP from '../../component/CONSTANTS/CONSTANTS';

class VoterPanel extends Component {
    constructor(props) {
        super(props);
        this.getUserDataHandler();
        this.state = {
            voterInfo: {},
            networkStatus: false,
            dataHeader: false,
            underProcess: true,
            loading: true,
            totalSectorVotes: null,
            dataNA: [
                {
                    value: 0,
                    label: '',
                    color: '#3ea55a',
                }, {
                    value: 0,
                    label: '',
                    color: '#559667'
                }, {
                    value: 0,
                    label: '',
                    color: '#40754e'
                }, {
                    value: 0,
                    label: '',
                    color: '#136129'
                }, {
                    value: 0,
                    label: '',
                    color: '#136129'
                },
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
            }
        });
        lor(this);
    }

    getSectorVotesHandler = (sector = "", type) => {
        fetch(IP + "/result/GetSectorResults?sector=" + sector)
            .then(responseJson => responseJson.json())
            .then(res => {
                if (type == "NA") {
                    this.setState({ totalSectorVotes: res });
                } else if (type == "PA") {
                    this.setState({ totalSectorVotesPA: res })
                }
            }).catch(err => {
                console.log(err);
            }).done();
    }
    getVoterSectorNAWinnerCandidateHandler = (sector = "") => {
        fetch(IP + '/result/getVoterSectorWinnerCandidate?sector=' + sector)
            .then(responseJson => responseJson.json())
            .then(res => {
                if (res.length == 0) {
                } else {
                    const resultData = { ...this.state.dataNA };
                    for (let i = 0; i < res.length; i++) {
                        let name = res[i].name.split(" ");
                        resultData[i].label = name[0];
                        resultData[i].value = res[i].votes;
                    }
                    const results = this.state.dataNA;
                    results.data = resultData;
                    this.setState({ dataNA: results, underProcess: false, loading: false });
                }
            }).catch(err => {
                console.log(err);
            }).done();
    }

    componentWillUnmount() {
        rol(this);
    }
    getUserDataHandler = async () => {
        const userCNIC = await AsyncStorage.getItem("userCNIC");
        fetch(IP + "/admin/chklogin?cnic=" + userCNIC)
            .then(responseJson => responseJson.json())
            .then(res => {
                const voterInfo = { ...res[0] };
                this.setState({ voterInfo: voterInfo, dataHeader: true });
                this.getVoterSectorNAWinnerCandidateHandler("NA-" + this.state.voterInfo["Sector_NA"]);
                this.getSectorVotesHandler("NA-" + this.state.voterInfo["Sector_NA"], "NA");
            }).catch(err => {
                alert(err);
            }).done();
    }


    static navigationOptions = ({ navigation }) => ({
        title: 'Dashboard',
        // headerStyle: {
        //     backgroundColor: 'white',
        // },
        // headerTitleStyle: { color: 'white' },
        headerLeft: (

            <Icon
                name="view-dashboard-outline"
                size={wp('6%')}
                color="black"
                style={{
                    paddingVertical: 4,
                    paddingHorizontal: wp('2%')
                }} />
        ),
        headerRight: (
            <View>
                <Text>Voter</Text>
                <TouchableOpacity onPress={async () => {
                    AsyncStorage.multiRemove(['userAuthToken', 'userCNIC']);
                    navigation.navigate('Login');
                }} >
                    <Icon
                        name="logout"
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
    });


    goToPartiesHandler = () => {
        const sectorData = {
            sectorPP: this.state.voterInfo["Sector_PP"],
            sectorNA: this.state.voterInfo["Sector_NA"]
        }
        this.props.navigation.navigate('Parties', sectorData);
    }
    goToCandidatesHandler = () => {
        const sectorData = {
            sectorPP: this.state.voterInfo["Sector_PP"],
            sectorNA: this.state.voterInfo["Sector_NA"]
        }
        this.props.navigation.navigate('Candidates', sectorData);
    }
    goToNationalResultsHandler = () => {
        const sectorData = {
            sectorNA: this.state.voterInfo["Sector_NA"]
        }
        this.props.navigation.navigate('NationalResults', sectorData);
    }
    goToProvisonalResultsHandler = () => {
        const sectorData = {
            sectorPA: this.state.voterInfo["Sector_PP"]
        }
        this.props.navigation.navigate('ProvisonalResults', sectorData);
    }

    render() {
        let headerContent = null;
        let pieChart = null;

        if (this.state.loading === false) {
            pieChart =
                (
                    <View>
                        <View style={[Style.pieStyle, Style.Row]}>
                            <Text style={Style.PieLabel}>{((this.state.totalSectorVotes[1] / this.state.totalSectorVotes[0]) * 100).ToFixed(2)}%</Text>
                            <PureChart data={this.state.dataNA} type="pie" />
                        </View>
                    </View>
                )
        }

        if (this.state.dataHeader === false) {
            headerContent = <ActivityIndicator
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
        if (this.state.networkStatus === false) {
            headerContent = (
                <View>
                    <Text style={Style.networkState}>Not Connected To Network</Text>
                </View>
            )
        } else if (this.state.dataHeader === true) {
            headerContent = (
                <Header
                    name={this.state.voterInfo["Name"]}
                    cnic={this.state.voterInfo["Cnic"]}
                    sectorPP={this.state.voterInfo["Sector_PP"]}
                    sectorNA={this.state.voterInfo["Sector_NA"]}
                    address={this.state.voterInfo["Address"]}
                    type={this.state.voterInfo["type"]}
                    gender={this.state.voterInfo["Gender"]}
                    pNo={this.state.voterInfo["pNo"]}
                />
            )
        }
        return (
            <ScrollView style={Style.parentContainer}>
                <View>
                    <View style={Style.headerContainer}>
                        {headerContent}
                    </View>
                    <View style={Style.bodyContainer}>
                        {pieChart}
                        <View style={Style.Row}>
                            <TouchableOpacity style={Style.Box1} onPress={this.goToPartiesHandler}>
                                <Icon
                                    name="home-group"
                                    size={wp('9%')}
                                    color="white"
                                    style={{
                                        marginBottom: 10,
                                        textAlign: 'center',
                                    }} />
                                <Text style={Style.textStyle}>Parties</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={Style.Box2} onPress={this.goToCandidatesHandler}>
                                <Icon
                                    name="account-group-outline"
                                    size={wp('9%')}
                                    color="white"
                                    style={{
                                        marginBottom: 10,
                                        textAlign: 'center',
                                    }}
                                />
                                <Text style={Style.textStyle}>Candidates</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={Style.Row}>
                            <TouchableOpacity style={Style.Box3} onPress={this.goToNationalResultsHandler}>
                                <Icon
                                    name="format-list-bulleted"
                                    size={wp('7%')}
                                    color="white"
                                    style={{
                                        marginBottom: 10,
                                        textAlign: 'center'
                                    }} />
                                <Text style={Style.textStyle}>National  Results</Text>
                            </TouchableOpacity>
                            {this.state.voterInfo["Sector_PP"] != null ?
                                <TouchableOpacity style={Style.Box4} onPress={this.goToProvisonalResultsHandler}>
                                    <Icon
                                        name="format-list-bulleted-type"
                                        size={wp('7%')}
                                        color="white"
                                        style={{
                                            marginBottom: 10,
                                            textAlign: 'center'
                                        }} />
                                    <Text style={Style.textStyle}>Provisional Results</Text>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                    </View>
                </View >
            </ScrollView>
        );
    }
}
export default VoterPanel;


const Style = StyleSheet.create({
    parentContainer: {
        flex: 1,
        backgroundColor: '#0b6b31',

    },
    headerContainer: {
        flex: 2,
        backgroundColor: '#2E944A',
        borderBottomEndRadius: 6,
        borderBottomStartRadius: 6,
    },
    bodyContainer: {
        flex: 10,
        justifyContent: 'flex-start',
        backgroundColor: '#0b6b31',
    },
    Row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    pieStyle: {
        marginTop: 20
    },
    textStyle: {
        fontSize: wp('3.5%'),
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    Box1: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 2,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#61a3cc',
    },
    Box2: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 2,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#04932a',
    },
    Box3: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 2,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#71b784'


    },
    Box4: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 2,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#579fcc'

    },
    Box5: {
        width: wp('30%'),
        height: hp('5%'),
        borderWidth: 1,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#579fcc'
    },
    networkState: {
        marginTop: wp('5%'),
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        fontSize: wp('6.2%'),
        color: 'white'
    },
    PieLabel: {
        position: 'absolute',
        zIndex: 9,
        marginTop: hp('12%'),
        color: 'white',
        fontSize: wp('4%'),
        fontWeight: 'bold'
    }
})
