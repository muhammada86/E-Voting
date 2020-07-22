import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Search from '../../Search/Search';
import IP from '../../CONSTANTS/CONSTANTS';

export default class HalqaResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidateResult: null,
            loading: true,
            response: false
        };
    }
    componentDidMount() {
        this.getCandidateSectorResultsHandler();
    }
    getCandidateSectorResultsHandler = () => {
        const obj = this.props.navigation.state.params;
        let url = IP + "/result/getCandidateHalqaResults?CNIC=" + obj.CNIC;
        fetch(url)
            .then(responseJson => responseJson.json())
            .then(res => {
                if (res == "No Record Found") {
                    this.setState({ response: true });
                } else {
                    this.setState({ candidateResult: res, loading: false });
                }
            }).catch(err => {
                alert(err);
            }).done();
    }
    static navigationOptions = ({ navigation }) => ({
        title: 'Halqa Results'
    });

    render() {
        let dataToShow = null;
        if (this.state.response === true) {
            dataToShow = <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 30, alignSelf: 'center' }}>No Record Found...</Text>
        } else if (!this.state.loading) {
            dataToShow = <Search data={this.state.candidateResult} type="halqaResult" />;
        } else {
            dataToShow = <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} color="green" size="small" />
        }
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center' }}>
                {dataToShow}
            </View>
        );
    }
}
