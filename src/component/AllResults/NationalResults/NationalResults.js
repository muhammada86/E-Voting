import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ResultList from '../ResultList/ResultList';
import PureChart from 'react-native-pure-chart';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
}
    from 'react-native-responsive-screen';
import IP from '../../CONSTANTS/CONSTANTS';
class NationalResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Results: [
                {
                    seriesName: 'Results',
                    data: [
                        { x: ' ', y: 0 },
                        { x: ' ', y: 0 },
                        { x: ' ', y: 0 },
                        { x: ' ', y: 0 }
                    ],
                    color: 'blue'
                }
            ],
            candidateResults: null,
            loading: true,
            underProcess: true
        }
    }
    static navigationOptions = {
        title: 'National Results'
    }
    componentDidMount() {
        lor();
        const sectorObj = this.props.navigation.state.params;
        fetch(IP + '/result/getVoterSectorWinnerCandidate?sector=NA-' + sectorObj.sectorNA)
            .then(responseJson => responseJson.json())
            .then(res => {
                if (res == "") {
                    this.setState({ loading: false })
                } else {
                    const resultData = { ...this.state.Results[0].data };
                    for (let i = 0; i < res.length; i++) {
                        resultData[i].x = res[i].name;
                        resultData[i].y = res[i].votes;
                    }
                    const results = this.state.Results;
                    results.data = resultData;
                    this.setState({ Results: results, underProcess: false, loading: false, candidateResults: res });
                }
            }).catch(err => {
                console.log(err);
            }).done();
    }
    componentWillUnmount() {
        rol();
    }
    render() {
        let result = null;
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
        } else if (!this.state.loading) {
            result = (this.state.candidateResults.map((data, i) => (
                <ResultList
                    key={i}
                    id={i + 1}
                    name={data.name}
                    votes={data.votes}
                    partyName={data.partyName}
                />
            ))
            )
            chartResult = (
                <PureChart data={this.state.Results} height={380} width={wp('100%')} type='bar' />
            )
        }
        return (
            <ScrollView>
                <View style={Style.parentContainer}>
                    <View style={Style.bodyContainer}>
                        {chartResult}
                    </View >
                    {!this.state.underProcess ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={[Style.textStyle, Style.first]}><Text style={{ color: 'green' }}>ID</Text></View>
                            <View style={[Style.textStyle, Style.second]}><Text style={{ color: 'green' }}>Candidate Name</Text></View>
                            <View style={[Style.textStyle, Style.second]}><Text style={{ color: 'green' }}>Party Name</Text></View>
                            <View style={[Style.textStyle, Style.third]}><Text style={{ color: 'green' }}>Votes</Text></View>
                        </View> :
                        null
                    }
                    {result}
                </View >
            </ScrollView>
        )
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
        fontSize: wp('4%'),
        marginLeft: 10,
        padding: 20
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
        flex: 3.5,
    },
    third: {
        flex: 1,

    },
})
export default NationalResults;