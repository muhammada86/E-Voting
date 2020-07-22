import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import PureChart from 'react-native-pure-chart';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
}
    from 'react-native-responsive-screen';
import ResultList from '../ResultList/ResultList';
import IP from '../../CONSTANTS/CONSTANTS';
export default class OverallStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            naResult: null,
            Results: [
                {
                    seriesName: 'NATIONAL RESULTS',
                    data: [
                        { x: '0', y: 0 },
                        { x: '0', y: 0 },
                        { x: '0', y: 0 },
                        { x: '0', y: 0 },
                        { x: '0', y: 0 }
                    ],
                    color: 'green',
                }
            ],
            loading: true,
            underProcess: true
        };
    }

    componentDidMount() {
        const obj = this.props.navigation.state.params;
        let url = null;
        if (obj.type == "NA") {
            url = IP + '/result/getAllResultsForNA?year=' + obj.year;
        } else {
            url = IP + '/result/getAllResultsForPA?year=' + obj.year;
        }
        fetch(url)
            .then(responseJson => responseJson.json())
            .then(res => {
                if (res == "Under Progress") {
                    this.setState({ loading: false });
                } else if (res.length == 0 || res == "") {
                    this.setState({ loading: false });
                }
                else {
                    const resultData = { ...this.state.Results[0].data };
                    for (let i = 0; i < res.length; i++) {
                        resultData[i].x = res[i].partyName;
                        resultData[i].y = res[i].votes;
                    }
                    const results = this.state.Results;
                    results.data = resultData;
                    this.setState({ Results: results, underProcess: false, loading: false, naResult: res });
                }
            }).catch(err => {
                console.log(err);
            }).done();
    }

    render() {
        let result = null;
        let tableView = null;
        let chartResult = null;
        if (this.state.loading) {
            result = (
                <ActivityIndicator
                    size="small"
                    color="green"
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        marginTop: 240
                    }}
                />
            )
        } else if (this.state.underProcess) {
            result = (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ alignSelf: 'center', fontSize: wp('3.33%'), fontWeight: 'bold' }}>The Result are under Process.</Text>
                </View>
            )
        } else if (!this.state.loading && !this.state.underProcess) {
            chartResult = (
                <PureChart data={this.state.Results} height={380} type='bar' />
            )
        }
        if (!this.state.underProcess) {
            tableView = (
                this.state.naResult.map((data, i) => (
                    <ResultList
                        key={i}
                        id={i + 1}
                        seats={data.seats}
                        type="overallResult"
                        votes={data.votes}
                        status={data.status}
                        partyName={data.partyName}
                    />
                ))
            )
        }

        return (
            <ScrollView>
                <View style={Style.parentContainer}>
                    <View style={Style.bodyContainer}>
                        {result}
                        {chartResult}
                    </View>
                    {!this.state.underProcess ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={[Style.textStyle, Style.first]}><Text style={{ color: 'green' }}>ID</Text></View>
                            <View style={[Style.textStyle, Style.second]}><Text style={{ color: 'green' }}>Party Name</Text></View>
                            <View style={[Style.textStyle, Style.second]}><Text style={{ color: 'green' }}>Seats</Text></View>
                            <View style={[Style.textStyle, Style.third]}><Text style={{ color: 'green' }}>Votes</Text></View>
                            <View style={[Style.textStyle, Style.second]}><Text style={{ color: 'green' }}>Status</Text></View>
                        </View> :
                        null
                    }
                    {tableView}
                </View >
            </ScrollView>
        );
    }
}

const Style = StyleSheet.create({
    parentContainer: {
        flex: 1,
    },
    bodyContainer: {
        width: '100%',
        marginTop: 40
    },
    textStyle: {
        marginTop: 20,
        flex: 5,
        borderWidth: 1,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-around',
    },
    first: {
        flex: 0.5,
        color: 'green',
    },
    second: {
        flex: 3,
    },
    third: {
        flex: 1,
    }
})
