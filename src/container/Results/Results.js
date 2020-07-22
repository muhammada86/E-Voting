import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../component/Header/Header';
import AsyncStorage from '@react-native-community/async-storage';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';
import IP from '../../component/CONSTANTS/CONSTANTS';

class CastVote extends Component {
    constructor(props) {
        super(props);
        this.getUserDataHandler();
        this.state = {
            userInfo: {},
            partyInfo: {},
            getPartyTable: false,
            dataHeader: false,
            year: "Select Year"
        };
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

    getYearForResultsHandler = (value, index) => {
        this.setState({ year: value });
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Results',
        headerLeft: (
            <Icon name="chart-line" size={30} color="black"
                style={{
                    paddingVertical: 4,
                    paddingHorizontal: 5,
                    paddingRight: -10,
                }} />
        ),
        headerRight: (
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

        )
    })

    goToNationalResult = () => {
        const resultType = {
            type: 'NA',
            year: this.state.year
        }
        this.props.navigation.navigate('PartiesList', resultType);
    }
    goToProvisonalResult = () => {
        const resultType = {
            type: 'PA',
            year: this.state.year
        }
        this.props.navigation.navigate('PartiesList', resultType);
    }
    goToOverallResultForNAHandler = () => {
        const data = {
            year: this.state.year,
            type: "NA"
        }
        this.props.navigation.navigate("OverallStatistics", data);
    }

    goToOverallResultForPAHandler = () => {
        const data = {
            year: this.state.year,
            type: "PA"
        }
        this.props.navigation.navigate("OverallStatistics", data);
    }
    render() {
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
                    gender={this.state.userInfo.Gender}
                />
            )
        }
        return (
            <ScrollView style={Style.parentContainer}>
                <View style={Style.headerContainer}>
                    {header}
                </View>
                <View style={Style.bodyContainer}>
                    <Picker
                        selectedValue={this.state.year}
                        style={{ height: 50, width: '50%', borderColor: "white", alignSelf: 'center', color: "white" }}
                        onValueChange={(itemValue, itemIndex) => this.getYearForResultsHandler(itemValue, itemIndex)}>
                        <Picker.Item label="Select Year" value="Select Year" />
                        <Picker.Item label="2005" value="2005" />
                        <Picker.Item label="2010" value="2010" />
                        <Picker.Item label="2015" value="2015" />
                        <Picker.Item label="2020" value="2020" />
                        <Picker.Item label="2025" value="2025" />
                        <Picker.Item label="2030" value="2030" />
                        <Picker.Item label="2035" value="2035" />
                    </Picker>
                    <View style={Style.Row}>
                        <TouchableOpacity style={Style.Box3} onPress={this.goToNationalResult}>
                            <Icon
                                name="chart-areaspline"
                                size={wp('8%')}
                                color="white"
                                style={{
                                    marginBottom: 10,
                                    textAlign: 'center'
                                }} />
                            <Text style={{
                                fontSize: wp('3.33%'),
                                color: 'white',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>National  Results</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Style.Box4} onPress={this.goToProvisonalResult}>
                            <Icon
                                name="chart-bar-stacked"
                                size={wp('8%')}
                                color="white"
                                style={{
                                    marginBottom: 10,
                                    textAlign: 'center'
                                }}
                            />
                            <Text style={{
                                fontSize: wp('3.33%'),
                                color: 'white',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>Provisional Results</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Style.Row}>
                        <TouchableOpacity style={Style.Box5} onPress={this.goToOverallResultForNAHandler}>
                            <Icon
                                name="chart-bar-stacked"
                                size={wp('8%')}
                                color="white"
                                style={{
                                    marginBottom: 10,
                                    textAlign: 'center'
                                }}
                            />
                            <Text style={{
                                fontSize: wp('3.33%'),
                                color: 'white',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>OVERALL NA Results</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={Style.Box3} onPress={this.goToOverallResultForPAHandler}>
                            <Icon
                                name="chart-bar-stacked"
                                size={wp('8%')}
                                color="white"
                                style={{
                                    marginBottom: 10,
                                    textAlign: 'center'
                                }}
                            />
                            <Text style={{
                                fontSize: wp('3.33%'),
                                color: 'white',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>OVERALL PA Results</Text>
                        </TouchableOpacity>
                    </View>
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
        borderBottomStartRadius: 6

    },
    bodyContainer: {
        flex: 10,
        justifyContent: 'center',
        backgroundColor: '#0b6b31',
    },
    Row: {
        flexDirection: 'row',
        justifyContent: 'center'

    },
    Box3: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 2,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#eddb8e',
    },
    Box4: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 2,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#61a3cc',
    },
    Box5: {
        width: wp('35%'),
        height: hp('18.5%'),
        borderWidth: 2,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#61a3cc',
    },
})
export default CastVote;