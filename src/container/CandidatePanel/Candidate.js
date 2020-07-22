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
import IP from '../../component/CONSTANTS/CONSTANTS';

class VoterPanel extends Component {
    constructor(props) {
        super(props);
        this.getUserDataHandler();
        this.state = {
            candidateInfo: {},
            dataHeader: false,
            underProcess: true,
            count: null,
            loading: true,
            totalSectorVotes: null,
            approved: false,
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
        lor(this);
    }

    getSectorVotesHandler = (sector = "", type) => {
        fetch(IP + "/result/GetSectorResults?sector=" + sector)
            .then(responseJson => responseJson.json())
            .then(res => {
                if (type == "NA") {
                    this.setState({ totalSectorVotes: res });
                    console.log('====================================');
                    console.log(res);
                    console.log('====================================');
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
                    console.log(res);
                } else {
                    const resultData = { ...this.state.dataNA };
                    for (let i = 0; i < res.length; i++) {
                        let name = res[i].name.split(" ");
                        resultData[i].label = name[0];
                        resultData[i].value = res[i].votes;
                    }
                    const results = this.state.dataNA;
                    results.data = resultData;
                    if (res != [] || res != "") {
                        this.setState({ dataNA: results, underProcess: false, loading: false });
                    }
                }
            }).catch(err => {
                console.log(err, "ERR");
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
                const candidateInfo = { ...res[0] };
                this.setState({ candidateInfo: candidateInfo, dataHeader: true });
                if (this.state.dataHeader === true) {
                    this.checkCandidateApprovedState();
                    this.getVoterSectorNAWinnerCandidateHandler("NA-" + this.state.candidateInfo["Sector_NA"]);
                    this.getSectorVotesHandler("NA-" + this.state.candidateInfo["Sector_NA"], "NA");
                }
            }).catch(err => {
                alert(err);
            }).done();
    }

    checkCandidateApprovedState = () => {
        fetch(IP + '/candidate/checkCandidateAuthority?cnic=' + this.state.candidateInfo["Cnic"])
            .then(responseJson => responseJson.json())
            .then(res => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i] == "A") {
                        this.setState({ approved: true });
                    }
                }
            }).catch(err => {
                console.log(err, "ERR");
            }).done();
    }
    static navigationOptions = ({ navigation }) => ({
        title: 'Dashboard',
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
                <Text>Candidate</Text>
                <TouchableOpacity onPress={async () => {
                    AsyncStorage.multiRemove(['userAuthToken', 'userCNIC']);
                    navigation.navigate('Login');
                }} >
                    <Icon
                        name="logout"
                        size={wp('6%')}
                        color="black"

                    />
                </TouchableOpacity>
            </View>
        )
    });

    CandidateAuthorityCheckHandler = () => {

    }

    goToPartiesHandler = () => {
        const sectorData = {
            sectorPP: this.state.candidateInfo["Sector_PP"],
            sectorNA: this.state.candidateInfo["Sector_NA"]
        }
        this.props.navigation.navigate('Parties', sectorData);
    }
    goToHalqaListHandler = () => {
        const sectorData = {
            CNIC: this.state.candidateInfo["Cnic"],
        }
        this.props.navigation.navigate('HalqaList', sectorData);
    }

    goToHalqaResultHandler = () => {
        const sectorData = {
            CNIC: this.state.candidateInfo["Cnic"]
        }
        this.props.navigation.navigate('HalqaResult', sectorData);
    }

    goToCandidatesHandler = () => {
        const sectorData = {
            sectorPP: this.state.candidateInfo["Sector_PP"],
            sectorNA: this.state.candidateInfo["Sector_NA"]
        }
        this.props.navigation.navigate('Candidates', sectorData);
    }

    goToVoterPanelHandler = () => {
        this.props.navigation.navigate('VoterPanel')
    }

    goToNationalResultsHandler = () => {
        const sectorData = {
            sectorNA: this.state.candidateInfo["Sector_NA"]
        }
        this.props.navigation.navigate('NationalResults', sectorData);
    }
    goToProvisonalResultsHandler = () => {
        const sectorData = {
            sectorPA: this.state.candidateInfo["Sector_PP"]
        }
        this.props.navigation.navigate('ProvisonalResults', sectorData);
    }

    render() {
        let headerContent = null;
        let pieChart = null;

        if (this.state.loading === false) {
            pieChart = (<View>
                <View style={[Style.pieStyle, Style.Row]}>
                    <Text style={Style.PieLabel}>{this.state.totalSectorVotes[1]}</Text>
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
        } else {
            headerContent = (
                <Header
                    name={this.state.candidateInfo["Name"]}
                    cnic={this.state.candidateInfo["Cnic"]}
                    sectorPP={this.state.candidateInfo["Sector_PP"]}
                    sectorNA={this.state.candidateInfo["Sector_NA"]}
                    address={this.state.candidateInfo["Address"]}
                    type={this.state.candidateInfo["type"]}
                    gender={this.state.candidateInfo["Gender"]}
                    pNo={this.state.candidateInfo["pNo"]}
                />
            )
        }
        return (
            <ScrollView style={Style.parentContainer}>
                <View>
                    <View style={Style.headerContainer}>
                        {headerContent}
                    </View>
                    {this.state.approved ?
                        <View style={Style.bodyContainer}>
                            {pieChart}
                            <View style={Style.Row}>
                                <TouchableOpacity style={Style.Box1} onPress={this.goToHalqaListHandler}>
                                    <Icon
                                        name="home-group"
                                        size={wp('9%')}
                                        color="white"
                                        style={{
                                            marginBottom: 10,
                                            textAlign: 'center',
                                        }} />
                                    <Text style={Style.textStyle}>Halqa List</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={Style.Box2} onPress={this.goToHalqaResultHandler}>
                                    <Icon
                                        name="account-group-outline"
                                        size={wp('9%')}
                                        color="white"
                                        style={{
                                            marginBottom: 10,
                                            textAlign: 'center',
                                        }}
                                    />
                                    <Text style={Style.textStyle}>Halqa Result</Text>
                                </TouchableOpacity>
                            </View>
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
                                    <Text style={Style.textStyle}>Parties {'\n'} {this.state.count != null ? this.state.count.totalParties : null}</Text>
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
                                    <Text style={Style.textStyle}>Candidates {'\n'} {this.state.count != null ? this.state.count.totalCandidates : null}</Text>
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
                                {this.state.candidateInfo["Sector_PP"] != null ?
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
                        :
                        <View>
                            <View>
                                <Text style={Style.note}>You are not yet Approved By ECP... Please Be Humble.!</Text>
                            </View>
                            <View style={Style.Row}>
                                {this.state.candidateInfo["Sector_PP"] != null ?
                                    <TouchableOpacity style={Style.Box4} onPress={this.goToVoterPanelHandler}>
                                        <Icon
                                            name="briefcase-account"
                                            size={wp('7%')}
                                            color="white"
                                            style={{
                                                marginBottom: 10,
                                                textAlign: 'center'
                                            }} />
                                        <Text style={Style.textStyle}>Go To Voter Panek</Text>
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>
                        </View>
                    }
                </View>
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
        marginTop: hp('11.5%'),
        color: 'white',
        fontSize: wp('5%'),
        fontWeight: 'bold'
    },
    note: {
        color: 'white',
        marginTop: wp('15%'),
        fontSize: wp('4%'),
        fontWeight: 'bold',
        textAlign: 'center',
        width: wp('80%'),
        justifyContent: 'center',
        alignSelf: 'center'
    },
})
