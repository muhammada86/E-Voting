import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
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
import NetInfo from "@react-native-community/netinfo";
import AndroidOpenSettings from 'react-native-android-open-settings'
import PieChart from 'react-native-pure-chart/examples/pure-chart/components/pie-chart';
// import Geolocation from 'react-native-geolocation-service';


class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.getAdminDataHandler();
        this.getCountsOfDatahandler();
        this.state = {
            adminInfo: {},
            cnic: "",
            networkStatus: false,
            allCounts: null,
            dataHeader: false,
            underProcess: true,
            loading: true,
            totalSectorVotes: 0,
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
                    this.setState({ dataNA: results, underProcess: false, loading: false });
                }
            }).catch(err => {
                console.log(err);
            }).done();
    }


    componentWillUnmount() {
        rol(this);
    }

    getAdminDataHandler = async () => {
        const userCNIC = await AsyncStorage.getItem("userCNIC");
        fetch(IP + "/admin/chklogin?cnic=" + userCNIC)
            .then(responseJson => responseJson.json())
            .then(res => {
                const adminInfo = { ...res[0] };
                this.setState({ adminInfo: adminInfo, dataHeader: true });
                this.getVoterSectorNAWinnerCandidateHandler("NA-" + this.state.adminInfo["Sector_NA"]);
                this.getSectorVotesHandler("NA-" + this.state.adminInfo["Sector_NA"], "NA");
            })
            .then(err => {
                console.log(err);
            }).done();
    }

    getCountsOfDatahandler = () => {
        fetch(IP + "/admin/getCountStatus")
            .then(responseJson => responseJson.json())
            .then(res => {
                const totalRecord = { ...res[0] };
                this.setState({ allCounts: totalRecord });
            });
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Dashboard',
        headerStyle: {
            height: wp('13%')
        },
        drawerType: 'slide',
        drawerWidth: 500,
        headerLeft: (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon name="menu" size={wp('5%')} color="black"
                    style={{
                        paddingVertical: 4,
                        paddingLeft: 10
                    }} />
            </TouchableOpacity>
        ),
        headerRight: (
            <View>
                <Text>Admin</Text>
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
    });
    render() {
        const statObj = this.state.allCounts;
        let headerContent = null;
        let pieChart = null;
        if (this.state.loading === false) {
            pieChart = (
                <View>
                    <View style={[Style.pieStyle, Style.Row]}>
                        <Text style={Style.PieLabel}>{((this.state.totalSectorVotes[1] / this.state.totalSectorVotes[0]) * 100).toFixed(2)}%</Text>
                        <PureChart data={this.state.dataNA} type="pie" />
                    </View>
                </View>
            )
        }
        if (this.state.dataHeader === false) {
            headerContent = <ActivityIndicator
                style={{ justifyContent: 'center', alignContent: 'center' }}
                size="small"
                color="white"
                style={Style.textStyle}
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
                    name={this.state.adminInfo["Name"]}
                    cnic={this.state.adminInfo["Cnic"]}
                    sectorPP={this.state.adminInfo["Sector_PP"]}
                    sectorNA={this.state.adminInfo["Sector_NA"]}
                    type={this.state.adminInfo["type"]}
                    gender={this.state.adminInfo["Gender"]}
                    pNo={this.state.adminInfo["pNo"]}
                />
            )
        }
        return (
            <ScrollView style={Style.parentContainer}>
                <View style={Style.headerContainer}>
                    {headerContent}
                </View>
                <View style={Style.bodyContainer}>
                    {pieChart}
                    <View style={Style.Row}>
                        <View style={Style.Box1}>
                            <Icon
                                name="account-badge-outline"
                                size={wp('8%')}
                                color="white"
                                style={{
                                    marginBottom: 10,
                                    textAlign: 'center',
                                }} />
                            <Text style={Style.textStyle}>Total Voters</Text>
                            {
                                this.state.allCounts ? <Text style={Style.textStyle}> {this.state.allCounts.totalVoter}</Text>
                                    : <ActivityIndicator style={{ width: 10, height: 10, alignSelf: 'center' }} size="small" color="white" />
                            }
                        </View>
                        <View style={Style.Box2}>
                            <Icon
                                name="account-tie"
                                size={wp('8%')}
                                color="white"
                                style={{
                                    marginBottom: 10,
                                    textAlign: 'center',
                                }}
                            />
                            <Text style={Style.textStyle}>Total Parties</Text>
                            {
                                this.state.allCounts ? <Text style={Style.textStyle}> {this.state.allCounts.totalParties}</Text>
                                    : <ActivityIndicator style={{ width: 10, height: 10, alignSelf: 'center' }} size="small" color="white" />
                            }
                        </View>
                    </View>
                    <View style={Style.Row}>
                        <View style={Style.Box3}>
                            <Icon
                                name="account-group-outline"
                                size={wp('8%')}
                                color="white"
                                style={{
                                    textAlign: 'center'
                                }} />
                            <Text style={Style.textStyle}>Total Candidates</Text>
                            {
                                this.state.allCounts ? <Text style={Style.textStyle}> {this.state.allCounts.totalCandidates}</Text>
                                    : <ActivityIndicator style={{ width: 10, height: 10, alignSelf: 'center' }} size="small" color="white" />
                            }
                        </View>
                        <TouchableOpacity style={Style.Box4} onPress={() => this.props.navigation.navigate("MoreStats", statObj)}>
                            <Icon
                                name="chart-line"
                                size={wp('8%')}
                                color="white"
                                style={{
                                    marginBottom: 10,
                                    textAlign: 'center'
                                }} />
                            <Text style={Style.textStyle}>More Stats</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView >
        );
    }
}
export default AdminPanel;


const Style = StyleSheet.create({
    parentContainer: {
        flex: 1,
        backgroundColor: '#0b6b31',
    },
    headerContainer: {
        flex: 5,
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
        justifyContent: 'center'
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
        borderWidth: 1,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#61a3cc',
    },
    Box2: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 1,
        padding: 20,
        margin: 20,
        borderRadius: 100,
        borderColor: '#04932a',
    },
    Box3: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 1,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#71b784'

    },
    Box4: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 1,
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
